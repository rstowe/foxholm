require('dotenv').config();
// Configure Fastify with increased body limit for image uploads (50MB)
const fastify = require('fastify')({ 
  logger: true,
  bodyLimit: 50 * 1024 * 1024, // 50MB
  requestTimeout: 120000, // 2 minutes
  ajv: {
    customOptions: {
      allErrors: true,
      jsonPointers: true
    }
  }
});

// Add hook to handle validation errors
fastify.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const messages = error.validation.map(err => {
      if (err.keyword === 'maxLength' && err.dataPath === '.imageData') {
        return 'Image is too large. Maximum size is 10MB.';
      }
      return `${err.dataPath || 'Field'} ${err.message}`.replace(/"/g, "'");
    });
    
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      validation: messages
    });
  }
  
  // Default error handling
  reply.send(error);
});
const cors = require('@fastify/cors');
const path = require('path');
const fs = require('fs').promises;
const imageProcessor = require('./imageProcessor');
const subdomainRouter = require('./subdomainRouter');
const sitemapGenerator = require('./sitemapGenerator');
const seoMiddleware = require('./seoMiddleware');

// Register plugins
fastify.register(cors, {
  origin: (origin, cb) => {
    // Allow requests with or without origin (like mobile apps or curl requests)
    if (!origin) return cb(null, true);
    
    // Allow localhost and all subdomains of localhost for development
    if (process.env.NODE_ENV !== 'production') {
      const hostname = new URL(origin).hostname;
      if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
        return cb(null, true);
      }
    }
    
    // In production, you might want to validate against your allowed domains
    // For now, we'll allow all origins in production (adjust as needed)
    cb(null, true);
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
});

// Helper function to wrap HTML content with header and footer
async function wrapWithTemplate(htmlContent) {
  try {
    const headerPath = path.join(__dirname, '../client/static/header.hbs');
    const footerPath = path.join(__dirname, '../client/static/footer.hbs');
    
    const [header, footer] = await Promise.all([
      fs.readFile(headerPath, 'utf-8'),
      fs.readFile(footerPath, 'utf-8')
    ]);
    
    // Based on the file structure:
    // - header.hbs ends with opening <main> tag
    // - footer.hbs starts with closing </main> tag
    // So we just need to concatenate: header + content + footer
    
    return header + '\n' + htmlContent + '\n' + footer;
  } catch (error) {
    fastify.log.error('Error wrapping HTML with template:', error);
    return htmlContent;
  }
}

// Helper function to check if request is from root domain (not subdomain)
function isRootDomain(host) {
  if (!host) return true;
  
  const hostname = host.split(':')[0];
  
  // In development, check for subdomain pattern like "headshot.localhost"
  if (hostname.endsWith('.localhost')) {
    return false; // Has subdomain
  }
  
  // Plain localhost or IP is root domain
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }
  
  // In production, check if it's the root domain (no subdomain)
  const parts = hostname.split('.');
  if (process.env.NODE_ENV === 'production' && process.env.DOMAIN) {
    const domainParts = process.env.DOMAIN.split('.');
    return parts.length === domainParts.length;
  }
  
  // Check if subdomain exists
  const subdomain = subdomainRouter.extractSubdomain(host);
  return !subdomain; // If no subdomain extracted, it's root domain
}

// Root route with SEO optimization
fastify.get('/', async (request, reply) => {
  try {
    const host = request.headers.host;
    const isRoot = isRootDomain(host);
    const subdomain = subdomainRouter.extractSubdomain(host);
    
    // Debug logging
    fastify.log.info(`Host: ${host}, Is Root: ${isRoot}, Subdomain: ${subdomain}`);
    
    // Check if this is the root domain or a subdomain
    if (isRoot) {
      // Serve the static index.html wrapped with header/footer
      const indexPath = path.join(__dirname, '../client/static/pages/index.html');
      const htmlContent = await fs.readFile(indexPath, 'utf-8');
      const wrappedHTML = await wrapWithTemplate(htmlContent);
      
      reply.header('Cache-Control', 'public, max-age=300');
      reply.header('Vary', 'Accept-Encoding');
      return reply.type('text/html').send(wrappedHTML);
    } else {
      // Existing subdomain behavior - serve React app
      const optimizedHTML = await seoMiddleware.getOptimizedHTML(subdomain);
      
      reply.header('Cache-Control', 'public, max-age=300');
      reply.header('Vary', 'Accept-Encoding');
      return reply.type('text/html').send(optimizedHTML);
    }
  } catch (error) {
    request.log.error('Error in root route:', error);
    return reply.code(500).send('Internal Server Error');
  }
});

// Static page routes for root domain
const staticPages = [
  'headshot-creation-tool',
  'image-restoration-tool',
  'image-upscale-tool'
];

// Register routes for static pages
staticPages.forEach(page => {
  fastify.get(`/${page}`, async (request, reply) => {
    try {
      // Only serve static pages on root domain
      if (!isRootDomain(request.headers.host)) {
        // On subdomains, redirect to React app
        return reply.redirect('/');
      }
      
      const pagePath = path.join(__dirname, '../client/static/pages/', `${page}.html`);
      const htmlContent = await fs.readFile(pagePath, 'utf-8');
      const wrappedHTML = await wrapWithTemplate(htmlContent);
      
      reply.header('Cache-Control', 'public, max-age=300');
      reply.header('Vary', 'Accept-Encoding');
      return reply.type('text/html').send(wrappedHTML);
    } catch (error) {
      request.log.error(`Error serving ${page}:`, error);
      return reply.code(404).send('Page not found');
    }
  });
});

// Serve static assets (images, icons, etc.)
fastify.get('/:filename', async (request, reply) => {
  const filename = request.params.filename;
  
  // Check if it's a file with an extension
  if (!filename.includes('.')) {
    return reply.callNotFound();
  }
  
  const ext = path.extname(filename).toLowerCase();
  
  // Define content types
  const contentTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.webmanifest': 'application/manifest+json',
    '.json': 'application/json'
  };
  
  // Skip if no valid content type
  if (!contentTypes[ext]) {
    return reply.callNotFound();
  }
  
  // Try multiple locations in order
  const locations = [
    path.join(__dirname, '../client/static/images', filename),
    path.join(__dirname, '../dist', filename),
    path.join(__dirname, '../client/static', filename)
  ];
  
  for (const location of locations) {
    try {
      const file = await fs.readFile(location);
      reply.header('Cache-Control', 'public, max-age=31536000'); // 1 year
      return reply.type(contentTypes[ext]).send(file);
    } catch (error) {
      // Continue to next location
    }
  }
  
  // File not found in any location
  return reply.code(404).send('File not found');
});

// API routes
fastify.register(async function apiRoutes(fastify) {
  // Get available subdomains
  fastify.get('/api/subdomains', async (request, reply) => {
    try {
      const subdomains = subdomainRouter.getAllSubdomains();
      const subdomainConfigs = subdomains.map(subdomain => ({
        name: subdomain.charAt(0).toUpperCase() + subdomain.slice(1), // Capitalize first letter
        path: subdomain
      }));
      
      return { success: true, data: subdomainConfigs };
    } catch (error) {
      console.error('Error fetching subdomains:', error);
      reply.status(500).send({ success: false, error: 'Failed to fetch subdomains' });
    }
  });

  // Main image processing endpoint with increased body limit
  fastify.post('/api/process-image', {
    config: {
      // Increase payload limit specifically for this route
      bodyLimit: 50 * 1024 * 1024, // 50MB
      requestTimeout: 120000 // 2 minutes
    },
    schema: {
      body: {
        type: 'object',
        required: ['subdomain', 'imageData'],
        properties: {
          subdomain: { 
            type: 'string',
            minLength: 1
          },
          imageData: { 
            type: 'string',
            maxLength: 50 * 1024 * 1024 // 50MB
          },
          options: { 
            type: 'object',
            default: {}
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { subdomain, imageData, options } = request.body;
      
      // Process image based on subdomain
      const result = await imageProcessor.processImage(subdomain, imageData, options);
      
      return reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      request.log.error('Image processing error:', error);
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  });

  // Health check
  fastify.get('/api/health', async (request, reply) => {
    // Check if we can connect to Together AI
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0'
    };
    
    // Optional: Add more health checks here
    try {
      // Check if Together API key is configured
      if (!process.env.TOGETHER_API_KEY) {
        healthStatus.warnings = ['Together AI API key not configured'];
      }
      
      return reply.code(200).send(healthStatus);
    } catch (error) {
      return reply.code(503).send({
        status: 'error',
        message: 'Service unhealthy',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Subdomain configuration endpoint
  fastify.get('/api/subdomain-config', async (request, reply) => {
    try {
      // Get subdomain from query parameter or extract from host header
      let subdomain = request.query.subdomain || null;
      
      // If no subdomain in query, try to extract from host
      if (!subdomain) {
        subdomain = subdomainRouter.extractSubdomain(request.headers.host);
      }
      
      // Get the configuration for the subdomain
      const config = subdomainRouter.getSubdomainConfig(subdomain);
      
      if (!config) {
        return reply.code(404).send({
          success: false,
          error: 'Subdomain not found',
          requestedSubdomain: subdomain,
          availableSubdomains: Object.keys(subdomainRouter.getAllSubdomains())
        });
      }
      
      // Determine the actual subdomain that matched (case-insensitive)
      const matchedSubdomain = Object.keys(subdomainRouter.getAllSubdomains()).find(
        key => key.toLowerCase() === subdomain.toLowerCase()
      ) || subdomain;
      
      return reply.send({
        success: true,
        subdomain: matchedSubdomain,
        config: {
          ...config,
          // Ensure we have all required fields with defaults
          title: config.title || 'Foxholm AI',
          description: config.description || 'AI-powered image processing',
          features: config.features || [],
          formFields: config.formFields || {},
          seo: config.seo || {}
        }
      });
    } catch (error) {
      fastify.log.error('Error in subdomain-config:', error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  });
});

// Sitemap routes
fastify.get('/sitemap.xml', async (request, reply) => {
  const subdomain = subdomainRouter.extractSubdomain(request.headers.host);
  const xml = sitemapGenerator.generateXML(subdomain);
  reply.type('application/xml').send(xml);
});

fastify.get('/sitemap.html', async (request, reply) => {
  const html = sitemapGenerator.generateHTML();
  reply.type('text/html').send(html);
});

// Catch-all route for React app assets
fastify.get('/js/:file', async (request, reply) => {
  try {
    const filePath = path.join(__dirname, '../dist/js', request.params.file);
    const file = await fs.readFile(filePath);
    reply.header('Cache-Control', 'public, max-age=31536000');
    return reply.type('application/javascript').send(file);
  } catch (error) {
    return reply.code(404).send('File not found');
  }
});

fastify.get('/css/:file', async (request, reply) => {
  try {
    const filePath = path.join(__dirname, '../dist/css', request.params.file);
    const file = await fs.readFile(filePath);
    reply.header('Cache-Control', 'public, max-age=31536000');
    return reply.type('text/css').send(file);
  } catch (error) {
    return reply.code(404).send('File not found');
  }
});

// 404 Handler for all unmatched routes
fastify.setNotFoundHandler(async (request, reply) => {
  if (request.url.startsWith('/api/')) {
    reply.code(404).send({
      success: false,
      error: 'API endpoint not found'
    });
  } else {
    // Check if this is root domain or subdomain
    if (isRootDomain(request.headers.host)) {
      // On root domain, serve 404 page
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Page Not Found - Foxholm</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              text-align: center; 
              padding: 50px 20px;
              line-height: 1.6;
              color: #333;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border-radius: 8px;
              background: #fff;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { 
              color: #f26522; 
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 20px;
              color: #666;
            }
            .btn {
              display: inline-block;
              background: #f26522;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              font-weight: 500;
              transition: background-color 0.3s;
            }
            .btn:hover {
              background: #e05a1a;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404 - Page Not Found</h1>
            <p>We couldn't find the page you were looking for. The page may have been moved, deleted, or never existed.</p>
            <a href="/" class="btn">Return to Homepage</a>
          </div>
        </body>
        </html>`;
      
      return reply
        .code(404)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(html);
    } else {
      // On subdomains, serve the React app with SEO-optimized HTML for client-side routing
      const subdomain = subdomainRouter.extractSubdomain(request.headers.host);
      const optimizedHTML = await seoMiddleware.getOptimizedHTML(subdomain);
      reply.type('text/html').send(optimizedHTML);
    }
  }
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.code(500).send({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health check available at: http://localhost:${port}/api/health`);
    console.log('\nTo test different features:');
    console.log(`- Root domain: http://localhost:${port}`);
    console.log(`- Headshot tool: http://headshot.localhost:${port}`);
    console.log(`- Restore tool: http://restore.localhost:${port}`);
    console.log(`- Upscale tool: http://upscale.localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();