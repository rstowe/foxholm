# Foxholm Deployment Makefile
# Update these variables after AWS setup
AWS_REGION=us-west-2
CLUSTER_NAME=foxholm-cluster
SERVICE_NAME=foxholm-production
TARGET_GROUP_NAME=foxholm-targets
ALB_URL=http://foxholm-alb.us-west-2.elb.amazonaws.com

# Make deploy script executable
init:
	mkdir -p scripts
	chmod +x deploy.sh
	chmod +x scripts/health-check.js

# Deploy to AWS ECS
deploy: init
	./deploy.sh

# View ECS logs
logs:
	aws logs tail /ecs/foxholm-app --region $(AWS_REGION) --follow

# Check service status
status:
	@echo "ECS Service Status:"
	@aws ecs describe-services --cluster $(CLUSTER_NAME) --services $(SERVICE_NAME) --region $(AWS_REGION) --query 'services[0].[serviceName,status,runningCount,desiredCount,deployments[0].rolloutState]' --output table

# Check health of targets
health:
	@echo "Target Health Status:"
	@TG_ARN=$$(aws elbv2 describe-target-groups --names $(TARGET_GROUP_NAME) --region $(AWS_REGION) --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null); \
	if [ -z "$$TG_ARN" ]; then \
		echo "Target group not found. Make sure AWS infrastructure is set up."; \
	else \
		aws elbv2 describe-target-health --target-group-arn $$TG_ARN --region $(AWS_REGION) --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Description]' --output table; \
	fi

# Open the application in browser
open:
	open $(ALB_URL)

# Build locally
build:
	docker build -t foxholm-app .

# Run locally with docker-compose
local:
	docker-compose up

# Stop local containers
stop:
	docker-compose down

# View recent deployments
deployments:
	@aws ecs describe-services --cluster $(CLUSTER_NAME) --services $(SERVICE_NAME) --region $(AWS_REGION) --query 'services[0].deployments[*].[id,status,taskDefinition,desiredCount,runningCount,createdAt]' --output table

# Update task definition (after changes)
update-task:
	@echo "Registering new task definition..."
	@aws ecs register-task-definition --cli-input-json file://task-definition.json --region $(AWS_REGION)

# Scale service
scale:
	@read -p "Enter desired count: " count; \
	aws ecs update-service --cluster $(CLUSTER_NAME) --service $(SERVICE_NAME) --desired-count $$count --region $(AWS_REGION)

# SSH into running container (for debugging)
exec:
	@TASK_ARN=$$(aws ecs list-tasks --cluster $(CLUSTER_NAME) --service-name $(SERVICE_NAME) --region $(AWS_REGION) --query 'taskArns[0]' --output text); \
	aws ecs execute-command --cluster $(CLUSTER_NAME) --task $$TASK_ARN --container app --interactive --command "/bin/bash" --region $(AWS_REGION)

.PHONY: init deploy logs status health open build local stop deployments update-task scale exec