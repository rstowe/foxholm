// Import subdomain configurations
const subdomainConfigs = require('./config/subdomainConfigs');

// Extract subdomain from host
function extractSubdomain(host) {
  if (!host) return null;
  
  try {
    // Handle cases like 'localhost:3000' or 'headshot.localhost:3000'
    const hostname = host.split(':')[0];
    
    // Handle localhost with subdomains (e.g., headshot.localhost)
    if (hostname.endsWith('.localhost')) {
      const subdomain = hostname.split('.')[0];
      return subdomain === 'localhost' ? null : subdomain;
    }
    
    // Handle plain localhost - no subdomain
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return null;
    }
    
    // Handle IP addresses - no subdomain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return null;
    }
    
    // Extract subdomain from domain (e.g., headshot.example.com)
    const parts = hostname.split('.');
    
    // In production with known domain
    if (process.env.DOMAIN) {
      const domainParts = process.env.DOMAIN.split('.');
      // If hostname has more parts than domain, first part is subdomain
      if (parts.length > domainParts.length) {
        return parts[0];
      }
      return null; // Root domain
    }
    
    // Generic subdomain detection: assume TLD + domain = 2 parts minimum
    // subdomain.example.com = 3 parts (subdomain present)
    // example.com = 2 parts (no subdomain)
    if (parts.length > 2) {
      // Check if it's not www (www is treated as root domain)
      return parts[0] === 'www' ? null : parts[0];
    }
    
    // No subdomain found
    return null;
    
  } catch (error) {
    console.error('Error extracting subdomain:', error);
    return null;
  }
}

// Get configuration for a subdomain
function getSubdomainConfig(subdomain) {
  try {
    // If no subdomain, return null (root domain)
    if (!subdomain) {
      return null;
    }
    
    // Normalize subdomain (remove any port numbers, trim whitespace, and convert to lowercase)
    const normalizedSubdomain = String(subdomain).split(':')[0].trim().toLowerCase();
    
    // Debug log
    console.log(`Looking up config for subdomain: ${normalizedSubdomain}`);
    console.log('Available subdomains:', Object.keys(subdomainConfigs));
    
    // Find a matching subdomain configuration (case-insensitive)
    const matchedSubdomain = Object.keys(subdomainConfigs).find(
      key => key.toLowerCase() === normalizedSubdomain
    );
    
    // If no match found, return null
    if (!matchedSubdomain) {
      console.warn(`No config found for subdomain: ${normalizedSubdomain}`);
      return null;
    }
    
    // Return the matched config
    console.log(`Found config for subdomain: ${matchedSubdomain}`);
    return subdomainConfigs[matchedSubdomain];
    
  } catch (error) {
    console.error('Error in getSubdomainConfig:', error);
    return null;
  }
}

// Get all available subdomains
function getAllSubdomains() {
  try {
    // Ensure we return a fresh array to prevent any reference issues
    return Object.keys(subdomainConfigs || {});
  } catch (error) {
    console.error('Error getting all subdomains:', error);
    return ['headshot', 'restore', 'upscale']; // Default fallback subdomains
  }
}

// Generate prompt based on subdomain and options
function generatePrompt(subdomain, options) {
  const config = subdomainConfigs[subdomain];
  if (config && typeof config.promptGenerator === 'function') {
    return config.promptGenerator(options);
  }
  return 'Generate high quality image';
}

module.exports = {
  extractSubdomain,
  getSubdomainConfig,
  getAllSubdomains,
  generatePrompt
};