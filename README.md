# Foxholm AI Image Tools - Complete Technical Documentation

A scalable Node.js application for AI-powered image processing with multi-subdomain support. This document serves as a comprehensive technical reference for the entire system architecture.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Complete Directory Structure](#complete-directory-structure)
4. [Core Components](#core-components)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [API Documentation](#api-documentation)
8. [Configuration System](#configuration-system)
9. [Image Processing Pipeline](#image-processing-pipeline)
10. [SEO & Sitemap System](#seo--sitemap-system)
11. [Development Guide](#development-guide)
12. [Adding New Features](#adding-new-features)
13. [Deployment Guide](#deployment-guide)
14. [Environment Variables](#environment-variables)
15. [Common Patterns & Best Practices](#common-patterns--best-practices)
16. [Troubleshooting](#troubleshooting)

## Overview

Foxholm AI Image Tools is a multi-subdomain web application that provides various AI-powered image processing features. Each subdomain represents a specific image transformation capability:

- **headshot.foxholm.com** - Professional AI Headshots
- **restore.foxholm.com** - Old Photo Restoration & Enhancement  
- **upscale.foxholm.com** - AI Image Upscaling

The system is designed to be extensible, allowing easy addition of new image processing features through subdomain configuration.

### Key Technologies

- **Backend**: Node.js with Fastify framework
- **Frontend**: React 18 with Redux Toolkit
- **Build Tool**: Webpack 5
- **AI Integration**: Together AI API
- **Image Processing**: Canvas API
- **Styling**: Custom CSS with responsive design
- **Code Quality**: ESLint with custom configuration

## Architecture

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Browser   │────▶│  Fastify Server │────▶│  Together AI    │
│  (React App)    │◀────│   (Node.js)     │◀────│     API         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │
        │                        ├── Subdomain Router
        │                        ├── Image Processor
        │                        ├── SEO Middleware
        │                        └── Sitemap Generator
        │
        └── Components
            ├── ImageUploader
            ├── DynamicForm
            ├── ProcessingStatus
            └── ResultDisplay
```

### Request Flow

1. User visits subdomain (e.g., headshot.foxholm.com)
2. Server detects subdomain and loads configuration
3. SEO middleware injects appropriate meta tags
4. React app loads with subdomain-specific UI
5. User uploads image and selects options
6. Frontend sends request to `/api/process-image`
7. Backend generates AI prompt based on subdomain
8. Together AI processes the image
9. Result returned and displayed to user

## Complete Directory Structure

```
foxholm-ai-tools/
│
├── server/                      # Backend Node.js application
│   ├── index.js                # Main Fastify server entry point
│   ├── subdomainRouter.js      # Subdomain configuration and routing logic
│   ├── imageProcessor.js       # Image processing with Together AI integration
│   ├── sitemapGenerator.js     # XML and HTML sitemap generation
│   └── seoMiddleware.js        # Dynamic SEO meta tag injection
│
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── index.js            # React app entry point
│   │   ├── App.jsx             # Main React component
│   │   ├── App.css             # Global application styles
│   │   │
│   │   └── components/         # React components
│   │       ├── ImageUploader.jsx       # Image upload component
│   │       ├── ImageUploader.css       # Image uploader styles
│   │       ├── DynamicForm.jsx         # Dynamic form generation
│   │       ├── DynamicForm.css         # Form styles
│   │       ├── ProcessingStatus.jsx    # Processing indicator
│   │       ├── ProcessingStatus.css    # Processing styles
│   │       ├── ResultDisplay.jsx       # Result visualization
│   │       └── ResultDisplay.css       # Result display styles
│   │
│   └── public/                 # Static assets
│       ├── index.html          # HTML template
│       ├── robots.txt          # Search engine directives
│       └── favicon.png         # Site favicon (to be added)
│
├── dist/                       # Production build output (generated)
│
├── node_modules/               # Dependencies (generated)
│
├── .env                        # Environment variables (create from .env.example)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Dependency lock file
├── webpack.config.js           # Webpack bundler configuration
└── README.md                   # This documentation file
```

## Core Components

### Backend Components

#### 1. **server/index.js** - Main Server

The Fastify server that handles all HTTP requests.

**Key responsibilities:**
- CORS configuration for cross-origin requests
- Static file serving with SEO optimization
- API route registration
- 404 and error handling
- Sitemap route handling

**Important code patterns:**
```javascript
// Subdomain-aware static file serving
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../dist'),
  prefix: '/',
  index: false  // Don't auto-serve index.html
});

// SEO-optimized root route
fastify.get('/', async (request, reply) => {
  const subdomain = subdomainRouter.extractSubdomain(request.headers.host);
  const optimizedHTML = await seoMiddleware.getOptimizedHTML(subdomain);
  reply.type('text/html').send(optimizedHTML);
});
```

#### 2. **server/subdomainRouter.js** - Subdomain Configuration

Central configuration for all subdomains and their features.

**Data structure:**
```javascript
const subdomainConfigs = {
  headshot: {
    title: 'AI Professional Headshot Generator',
    description: 'Transform any photo into a professional headshot',
    features: ['Professional styles', 'Background options'],
    formFields: {
      style: {
        type: 'select',
        label: 'Style Selection',
        options: [...],
        required: true
      }
      // ... more fields
    },
    seo: {
      title: 'AI Professional Headshot Generator | Foxholm',
      description: '...',
      keywords: ['AI headshot', 'professional photo']
    }
  }
  // ... more subdomains
};
```

**Key functions:**
- `extractSubdomain(host)` - Extracts subdomain from request host
- `getSubdomainConfig(subdomain)` - Returns configuration object
- `generatePrompt(subdomain, options)` - Creates AI prompts

#### 3. **server/imageProcessor.js** - Image Processing Engine

Handles all image processing operations with Together AI.

**Class structure:**
```javascript
class ImageProcessor {
  constructor() {
    this.together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
    this.defaultParams = { width: 1024, height: 1024 };
  }
  
  async processImage(subdomain, imageData, options) { }
  async processHeadshot(imageData, prompt, options) { }
  async processRestore(imageData, prompt, options) { }
  async processUpscale(imageData, prompt, options) { }
  async generateWithTogetherAI(prompt, params) { }
}
```

**Processing pipeline:**
1. Validate subdomain
2. Generate prompt based on options
3. Preprocess image if needed
4. Call Together AI API
5. Return processed result

#### 4. **server/sitemapGenerator.js** - Sitemap Generation

Generates both XML and HTML sitemaps dynamically.

**Key methods:**
- `getAllUrls()` - Collects all URLs from subdomain configs
- `generateXML(currentSubdomain)` - Creates XML sitemap
- `generateHTML()` - Creates styled HTML sitemap

#### 5. **server/seoMiddleware.js** - SEO Optimization

Dynamically injects SEO meta tags based on subdomain.

**Features:**
- Title and description optimization
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Canonical URLs
- Keywords meta tag

### Frontend Components

#### 1. **client/src/App.jsx** - Main Application

Root React component that orchestrates the entire frontend.

**State management:**
```javascript
const [subdomainConfig, setSubdomainConfig] = useState(null);
const [uploadedImage, setUploadedImage] = useState(null);
const [formData, setFormData] = useState({});
const [processing, setProcessing] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
```

**Component structure:**
```jsx
<Provider store={store}>
  <div className="app">
    <header className="app-header">
    <main className="app-main">
      <div className="features-list">
      <div className="content-area">
        <ImageUploader />
        <DynamicForm />
        <ProcessingStatus />
        <ResultDisplay />
      <aside className="sidebar">
    <footer className="app-footer">
  </div>
</Provider>
```

#### 2. **client/src/components/ImageUploader.jsx**

Handles image upload with drag-and-drop support.

**Features:**
- Drag and drop interface
- File type validation (JPG, PNG, WebP)
- File size validation (max 10MB)
- Preview display
- Base64 encoding

#### 3. **client/src/components/DynamicForm.jsx**

Renders forms dynamically based on subdomain configuration.

**Supported field types:**
- `select` - Dropdown selection
- `radio` - Radio button group
- `checkbox` - Multiple selection
- `slider` - Range input with labels
- `toggle` - On/off switch

**Field configuration example:**
```javascript
{
  type: 'slider',
  label: 'Enhancement Level',
  min: 1,
  max: 3,
  step: 1,
  labels: ['Light', 'Moderate', 'Heavy'],
  required: true
}
```

#### 4. **client/src/components/ProcessingStatus.jsx**

Shows processing animation and progress.

**Features:**
- Animated spinner
- Progress messages
- Progress bar
- Estimated time display

#### 5. **client/src/components/ResultDisplay.jsx**

Displays processing results with comparison view.

**Features:**
- Before/after comparison
- Single view toggle
- Download functionality
- Social sharing
- Processing details display

## API Documentation

### POST /api/process-image

Main endpoint for image processing.

**Request:**
```json
{
  "subdomain": "headshot",
  "imageData": "data:image/jpeg;base64,/9j/4AAQ...",
  "options": {
    "style": "corporate",
    "background": "office",
    "clothing": ["suit"],
    "outputFormat": "square"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalImage": "data:image/jpeg;base64,...",
    "processedImage": "https://...",
    "processingDetails": {
      "prompt": "Professional headshot portrait...",
      "options": {...},
      "timestamp": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### GET /api/subdomain-config

Returns configuration for current subdomain.

**Response:**
```json
{
  "success": true,
  "subdomain": "headshot",
  "config": {
    "title": "AI Professional Headshot Generator",
    "description": "...",
    "features": [...],
    "formFields": {...},
    "seo": {...}
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### GET /sitemap.xml

Returns XML sitemap for search engines.

### GET /sitemap.html

Returns human-readable HTML sitemap.

## Configuration System

### Subdomain Configuration Structure

Each subdomain in `subdomainRouter.js` follows this structure:

```javascript
{
  title: String,              // Display title
  description: String,        // Feature description
  features: Array<String>,    // List of features
  formFields: {
    [fieldName]: {
      type: String,         // 'select', 'radio', 'checkbox', 'slider', 'toggle'
      label: String,        // Display label
      options: Array,       // For select/radio/checkbox
      required: Boolean,    // Field validation
      default: Any,         // Default value
      // Additional properties based on type
    }
  },
  seo: {
    title: String,          // SEO title
    description: String,    // SEO description
    keywords: Array<String> // SEO keywords
  }
}
```

### Form Field Types

1. **Select Field**
```javascript
{
  type: 'select',
  label: 'Style',
  options: [
    { value: 'corporate', label: 'Corporate' }
  ],
  required: true
}
```

2. **Radio Field**
```javascript
{
  type: 'radio',
  label: 'Background',
  options: [...],
  required: true
}
```

3. **Checkbox Field**
```javascript
{
  type: 'checkbox',
  label: 'Enhancements',
  options: [...]
}
```

4. **Slider Field**
```javascript
{
  type: 'slider',
  label: 'Intensity',
  min: 0,
  max: 100,
  step: 10,
  unit: '%',
  default: 50
}
```

5. **Toggle Field**
```javascript
{
  type: 'toggle',
  label: 'Enable Feature',
  default: false
}
```

## Image Processing Pipeline

### 1. Image Upload Flow
```
User selects image → Validate type/size → Convert to Base64 → Store in state
```

### 2. Processing Request Flow
```
Collect form data → Create API request → Send to /api/process-image
```

### 3. Backend Processing Flow
```
Extract subdomain → Get configuration → Generate prompt → 
Call Together AI → Process response → Return result
```

### 4. Together AI Integration

**Model:** `black-forest-labs/FLUX.1-schnell`

**Default parameters:**
```javascript
{
  model: 'black-forest-labs/FLUX.1-schnell',
  prompt: dynamicPrompt,
  width: 1024,
  height: 1024,
  steps: 4,
  n: 1,
  safety_checker: false
}
```

### 5. Prompt Generation

Prompts are generated dynamically based on:
- Subdomain type
- User-selected options
- Image analysis (for restoration)

Example prompt generation:
```javascript
headshot: (opts) => {
  let prompt = `Professional headshot portrait, ${opts.style} style`;
  if (opts.background) {
    prompt += `, ${opts.background} background`;
  }
  return prompt;
}
```

## SEO & Sitemap System

### SEO Middleware Operation

1. **Template Loading**: Loads base HTML template
2. **Meta Tag Injection**: Replaces meta tags based on subdomain
3. **Structured Data**: Adds JSON-LD for rich snippets
4. **Canonical URLs**: Sets proper canonical URLs

### Dynamic Meta Tags

Each subdomain gets:
- Custom title tag
- Meta description
- Open Graph tags (og:title, og:description, og:image)
- Twitter Card tags
- Keywords meta tag
- Canonical link

### Sitemap Generation

**XML Sitemap includes:**
- All subdomain URLs
- Common pages (privacy, terms, about)
- Priority and change frequency
- Last modification date

**HTML Sitemap features:**
- Styled layout matching app design
- Feature cards for each subdomain
- Organized sections
- Mobile responsive

## Development Guide

### Prerequisites

- Node.js >= 22.0.0
- npm or yarn
- Together AI API key

### Setup Instructions

1. **Clone repository:**
```bash
git clone <repository-url>
cd foxholm-ai-tools
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your Together AI API key
```

4. **Start development servers:**
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run dev:server  # Backend on port 3001
npm run dev        # Frontend on port 9000
```

### Development Workflow

1. **Backend changes**: Nodemon auto-restarts server
2. **Frontend changes**: Webpack HMR updates browser
3. **Adding features**: Update `subdomainRouter.js`
4. **Testing**: Access via localhost with subdomain simulation

### Code Quality

Run ESLint to check code quality:
```bash
npm run eslint
```

## Adding New Features

### Step-by-Step Guide

1. **Add subdomain configuration** to `server/subdomainRouter.js`:

```javascript
const subdomainConfigs = {
  // ... existing configs
  newfeature: {
    title: 'New AI Feature',
    description: 'Description of the feature',
    features: ['Feature 1', 'Feature 2'],
    formFields: {
      // Define your form fields
    },
    seo: {
      title: 'New Feature - AI Tool | Foxholm',
      description: 'SEO description',
      keywords: ['keyword1', 'keyword2']
    }
  }
};
```

2. **Add prompt generation logic**:

```javascript
const prompts = {
  // ... existing prompts
  newfeature: (opts) => {
    return `AI prompt for ${opts.parameter}`;
  }
};
```

3. **Add processing method** (if needed) in `imageProcessor.js`:

```javascript
async processNewFeature(imageData, prompt, options) {
  // Custom processing logic
  const response = await this.generateWithTogetherAI(prompt, {
    width: options.width || 1024,
    height: options.height || 1024
  });
  return {
    originalImage: imageData,
    processedImage: response.imageUrl,
    processingDetails: { /* ... */ }
  };
}
```

4. **Update robots.txt** to include new subdomain sitemap
5. **Test the new feature** thoroughly

### Form Field Best Practices

- Use `required: true` for essential fields
- Provide sensible defaults
- Group related options
- Use appropriate input types
- Add helpful labels and descriptions

## Deployment Guide

### Production Build

1. **Build the application:**
```bash
npm run build
```

2. **Start production server:**
```bash
npm start
```

### Subdomain Configuration

1. **DNS Setup:**
   - Create A records for each subdomain
   - Point to your server IP

2. **Web Server Configuration (Nginx example):**
```nginx
server {
    server_name *.foxholm.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **SSL Certificates:**
   - Use wildcard certificate for *.foxholm.com
   - Or individual certificates per subdomain

### Performance Optimization

1. **Enable compression:**
```javascript
await fastify.register(require('@fastify/compress'));
```

2. **Implement caching:**
   - Cache processed images
   - Use CDN for static assets
   - Set appropriate cache headers

3. **Monitor performance:**
   - Track API response times
   - Monitor Together AI usage
   - Set up error tracking

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=3001
TOGETHER_API_KEY=your_production_key
DOMAIN=foxholm.com
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | development | No |
| `PORT` | Server port | 3001 | No |
| `TOGETHER_API_KEY` | Together AI API key | - | Yes |
| `DOMAIN` | Production domain | foxholm.com | No |
| `AWS_REGION` | AWS region for deployment | us-west-2 | No |
| `AWS_ACCOUNT_ID` | AWS account ID | - | For deployment |
| `ECR_REPOSITORY` | ECR repository name | foxholm-app | For deployment |
| `ECS_CLUSTER` | ECS cluster name | foxholm-cluster | For deployment |
| `ECS_SERVICE` | ECS service name | foxholm-production | For deployment |

## Common Patterns & Best Practices

### React Patterns

1. **State Management:**
   - Use local state for component-specific data
   - Redux for cross-component state
   - Avoid prop drilling

2. **Error Handling:**
   - Always catch async errors
   - Display user-friendly messages
   - Log errors for debugging

3. **Component Structure:**
   - Keep components focused
   - Extract reusable logic
   - Use proper prop validation

### Backend Patterns

1. **API Design:**
   - Consistent response format
   - Proper HTTP status codes
   - Comprehensive error messages

2. **Security:**
   - Validate all inputs
   - Sanitize file uploads
   - Use environment variables for secrets

3. **Performance:**
   - Implement request throttling
   - Cache expensive operations
   - Optimize image processing

### CSS Patterns

1. **Naming Convention:**
   - Component-based class names
   - Consistent naming scheme
   - Avoid global styles

2. **Responsive Design:**
   - Mobile-first approach
   - Flexible grid layouts
   - Touch-friendly interfaces

3. **Animations:**
   - Smooth transitions
   - Loading indicators
   - Subtle hover effects

## Troubleshooting

### Common Issues

1. **"Together AI API key missing"**
   - Ensure `.env` file exists
   - Check `TOGETHER_API_KEY` is set
   - Restart server after changes

2. **"Subdomain not found"**
   - Check subdomain configuration
   - Verify host header parsing
   - Test with default subdomain

3. **"Image upload failed"**
   - Check file size (max 10MB)
   - Verify file type (JPG/PNG/WebP)
   - Inspect browser console

4. **"Processing timeout"**
   - Check Together AI status
   - Verify API key limits
   - Implement retry logic

### Debug Mode

Enable detailed logging:
```javascript
const fastify = require('fastify')({ 
  logger: {
    level: 'debug',
    prettyPrint: true
  }
});
```

### Performance Monitoring

Track key metrics:
- API response times
- Image processing duration
- Memory usage
- Error rates

### Support Channels

- GitHub Issues: Report bugs
- Email: support@foxholm.com
- Documentation: This README

## Deployment Guide

A comprehensive AWS deployment guide is available in `deployment-guide.html`. This guide covers:

- AWS infrastructure setup
- Domain transfer from Bluehost to Route 53
- Docker containerization
- ECS deployment
- SSL certificate configuration
- Monitoring and maintenance

### Quick Deployment Steps

1. **Prepare AWS Environment:**
```bash
# Configure AWS CLI
aws configure

# Create ECR repository
aws ecr create-repository --repository-name foxholm-app --region us-west-2
```

2. **Build and Deploy:**
```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy to AWS
make deploy
```

3. **Monitor Deployment:**
```bash
# Check status
make status

# View logs
make logs

# Check health
make health
```

## Future Enhancements

Planned features and improvements:

1. **Additional Subdomains:**
   - cartoon.foxholm.com
   - aging.foxholm.com
   - avatar.foxholm.com

2. **Technical Improvements:**
   - WebSocket for real-time progress
   - Batch processing API
   - Advanced caching system
   - Rate limiting

3. **UI Enhancements:**
   - Dark mode support
   - Multi-language support
   - Advanced image editor
   - History/gallery feature

4. **Infrastructure:**
   - Kubernetes deployment
   - Auto-scaling
   - Multi-region support
   - Advanced monitoring

---

## License

This project is proprietary software. All rights reserved.

## Contributors

- Initial development by [Your Team]
- AI integration by [AI Team]
- UI/UX design by [Design Team]

---

*This documentation is maintained as the source of truth for the Foxholm AI Image Tools project. Keep it updated with any architectural changes.*