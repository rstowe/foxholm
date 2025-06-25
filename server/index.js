require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const fastifyStatic = require('@fastify/static');
const path = require('path');
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

// Serve static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../dist'),
  prefix: '/',
  // Don't serve index.html automatically, we'll handle it with SEO
  index: false
});

// Root route with SEO optimization
fastify.get('/', async (request, reply) => {
  try {
    // Extract subdomain from host or query parameter
    let subdomain = request.query.subdomain || null;
    if (!subdomain) {
      subdomain = subdomainRouter.extractSubdomain(request.headers.host);
    }
    
    // Get the optimized HTML with the correct subdomain context
    const optimizedHTML = await seoMiddleware.getOptimizedHTML(subdomain);
    
    // Set cache headers
    reply.header('Cache-Control', 'public, max-age=300'); // 5 minutes
    reply.header('Vary', 'Accept-Encoding');
    
    return reply.type('text/html').send(optimizedHTML);
  } catch (error) {
    request.log.error('Error in root route:', error);
    return reply.code(500).send('Internal Server Error');
  }
});

// API Routes
fastify.register(async function apiRoutes(fastify) {
  // Main image processing endpoint
  fastify.post('/api/process-image', {
    schema: {
      body: {
        type: 'object',
        required: ['subdomain', 'imageData'],
        properties: {
          subdomain: { type: 'string' },
          imageData: { type: 'string' }, // base64
          options: { type: 'object' }
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

// 404 Handler for API routes
fastify.setNotFoundHandler(async (request, reply) => {
  if (request.url.startsWith('/api/')) {
    reply.code(404).send({
      success: false,
      error: 'API endpoint not found'
    });
  } else {
    // Serve the React app with SEO-optimized HTML for client-side routing
    const subdomain = subdomainRouter.extractSubdomain(request.headers.host);
    const optimizedHTML = await seoMiddleware.getOptimizedHTML(subdomain);
    reply.type('text/html').send(optimizedHTML);
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
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();