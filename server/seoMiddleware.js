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

  async getOptimizedHTML(subdomain, pagePath = null) {
    const template = await this.loadTemplate();
    
    // Handle root domain pages
    if (!subdomain && pagePath) {
      return this.getStaticPageOptimizedHTML(template, pagePath);
    }
    
    // Handle subdomain pages
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

  getStaticPageOptimizedHTML(template, pagePath) {
    // Define SEO data for static pages
    const staticPageSEO = {
      'headshot-creation-tool': {
        title: 'AI Headshot Creation Tool - Professional Photos in Seconds | Foxholm',
        description: 'Create professional headshots instantly with our AI-powered tool. Perfect for LinkedIn, resumes, and business profiles.',
        keywords: ['AI headshot tool', 'professional headshot generator', 'LinkedIn photo maker', 'AI portrait creator']
      },
      'image-restoration-tool': {
        title: 'AI Photo Restoration Tool - Restore Old & Damaged Photos | Foxholm',
        description: 'Restore your old, damaged, or faded photos with advanced AI. Fix tears, scratches, and discoloration instantly.',
        keywords: ['photo restoration', 'restore old photos', 'fix damaged photos', 'AI photo repair']
      },
      'image-upscale-tool': {
        title: 'AI Image Upscaler - Enhance Resolution up to 8x | Foxholm',
        description: 'Upscale images without losing quality using AI. Perfect for printing, web use, and enhancing low-resolution photos.',
        keywords: ['image upscaler', 'enhance photo resolution', 'AI upscaling', 'increase image quality']
      }
    };

    const pageKey = pagePath.replace('/', '').replace('.html', '');
    const seoData = staticPageSEO[pageKey] || {
      title: 'Foxholm AI Image Tools',
      description: 'Professional AI-powered image processing tools',
      keywords: ['AI image tools', 'photo enhancement', 'image processing']
    };

    let optimizedHTML = template;

    // Update title
    optimizedHTML = optimizedHTML.replace(
      /<title>.*?<\/title>/,
      `<title>${seoData.title}</title>`
    );

    // Update meta description
    if (optimizedHTML.includes('name="description"')) {
      optimizedHTML = optimizedHTML.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${seoData.description}">`
      );
    } else {
      optimizedHTML = optimizedHTML.replace(
        '</head>',
        `  <meta name="description" content="${seoData.description}">\n</head>`
      );
    }

    // Add keywords
    if (!optimizedHTML.includes('name="keywords"')) {
      const keywordsTag = `  <meta name="keywords" content="${seoData.keywords.join(', ')}">\n`;
      optimizedHTML = optimizedHTML.replace('</head>', `${keywordsTag}</head>`);
    }

    // Update Open Graph and Twitter tags
    const ogTags = `
  <meta property="og:title" content="${seoData.title}">
  <meta property="og:description" content="${seoData.description}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seoData.title}">
  <meta name="twitter:description" content="${seoData.description}">`;

    if (!optimizedHTML.includes('property="og:title"')) {
      optimizedHTML = optimizedHTML.replace('</head>', `${ogTags}\n</head>`);
    }

    return optimizedHTML;
  }
}

module.exports = new SEOMiddleware();