#!/bin/bash

# Configuration - Update these values after AWS setup
ECR_URI="YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/foxholm-app"
REGION="us-west-2"
CLUSTER="foxholm-cluster"
SERVICE="foxholm-production"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if required environment variables are set
if [ -z "$ECR_URI" ] || [ "$ECR_URI" == "YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/foxholm-app" ]; then
    print_error "Please update ECR_URI in deploy.sh with your actual AWS account ID"
    exit 1
fi

# Build and push
print_status "Building Docker image for linux/amd64..."
docker build --platform linux/amd64 -t foxholm-app . || {
    print_error "Docker build failed"
    exit 1
}

print_status "Tagging image..."
docker tag foxholm-app:latest $ECR_URI:latest

print_status "Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI || {
    print_error "ECR login failed"
    exit 1
}

print_status "Pushing image to ECR..."
docker push $ECR_URI:latest || {
    print_error "Docker push failed"
    exit 1
}

print_status "Updating ECS service with rolling deployment..."
# Use 0% minimum for single instance deployments during initial setup
# Change to minimumHealthyPercent=50 for production with multiple instances
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE \
  --force-new-deployment \
  --deployment-configuration minimumHealthyPercent=0,maximumPercent=100 \
  --region $REGION \
  --no-cli-pager || {
    print_error "ECS service update failed"
    exit 1
}

print_status "Deployment started successfully!"
print_status "Monitor at: https://$REGION.console.aws.amazon.com/ecs/v2/clusters/$CLUSTER/services/$SERVICE"

# Wait for deployment to complete (optional)
print_status "Waiting for deployment to stabilize..."
aws ecs wait services-stable --cluster $CLUSTER --services $SERVICE --region $REGION

print_status "Deployment completed!"