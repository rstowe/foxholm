const fs = require('fs').promises;
const path = require('path');
const subdomainRouter = require('./subdomainRouter');

class SEOMiddleware {
  constructor() {
    this.htmlTemplate = null;
    this.templatePath = path.join(__dirname, '../dist/index.html');
  }

  async loadTemplate() {
    if (!this.htmlTemplate) {
      try {
        this.htmlTemplate = await fs.readFile(this.templatePath, 'utf-8');
      } catch (error) {
        console.error('Failed to load HTML template:', error);
        // Fallback template
        this.htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foxholm AI Image Tools</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
      }
    }
    return this.htmlTemplate;
  }

  async getOptimizedHTML(subdomain) {
    const template = await this.loadTemplate();
    const config = subdomainRouter.getSubdomainConfig(subdomain);
    
    if (!config) {
      return template; // Return default template if no config
    }

    // Replace meta tags based on subdomain
    let optimizedHTML = template;

    // Update title
    optimizedHTML = optimizedHTML.replace(
      /<title>.*?<\/title>/,
      `<title>${config.seo.title}</title>`
    );

    // Update meta description
    optimizedHTML = optimizedHTML.replace(
      /<meta name="description" content=".*?">/,
      `<meta name="description" content="${config.seo.description}">`
    );

    // Update Open Graph tags
    optimizedHTML = optimizedHTML.replace(
      /<meta property="og:title" content=".*?">/,
      `<meta property="og:title" content="${config.seo.title}">`
    );

    optimizedHTML = optimizedHTML.replace(
      /<meta property="og:description" content=".*?">/,
      `<meta property="og:description" content="${config.seo.description}">`
    );

    // Update Twitter Card tags
    optimizedHTML = optimizedHTML.replace(
      /<meta name="twitter:title" content=".*?">/,
      `<meta name="twitter:title" content="${config.seo.title}">`
    );

    optimizedHTML = optimizedHTML.replace(
      /<meta name="twitter:description" content=".*?">/,
      `<meta name="twitter:description" content="${config.seo.description}">`
    );

    // Add keywords meta tag if not present
    if (!optimizedHTML.includes('name="keywords"')) {
      const keywordsTag = `  <meta name="keywords" content="${config.seo.keywords.join(', ')}">\n`;
      optimizedHTML = optimizedHTML.replace('</head>', `${keywordsTag}</head>`);
    }
    
    // Add theme color
    if (!optimizedHTML.includes('name="theme-color"')) {
      const themeTag = `  <meta name="theme-color" content="#FF6B35">\n`;
      optimizedHTML = optimizedHTML.replace('</head>', `${themeTag}</head>`);
    }

    // Add canonical URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const domain = process.env.DOMAIN || 'foxholm.com';
    const canonicalURL = `${protocol}://${subdomain}.${domain}`;
    
    if (!optimizedHTML.includes('rel="canonical"')) {
      const canonicalTag = `  <link rel="canonical" href="${canonicalURL}">\n`;
      optimizedHTML = optimizedHTML.replace('</head>', `${canonicalTag}</head>`);
    }

    // Add structured data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": config.title,
      "description": config.description,
      "url": canonicalURL,
      "applicationCategory": "PhotographyApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": config.features,
      "provider": {
        "@type": "Organization",
        "name": "Foxholm",
        "url": `${protocol}://www.${domain}`
      }
    };

    const structuredDataScript = `  <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
  </script>\n`;

    optimizedHTML = optimizedHTML.replace('</head>', `${structuredDataScript}</head>`);

    return optimizedHTML;
  }
}

module.exports = new SEOMiddleware();