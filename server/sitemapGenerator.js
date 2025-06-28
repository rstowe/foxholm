const subdomainRouter = require('./subdomainRouter');

class SitemapGenerator {
  constructor() {
    this.baseUrl = process.env.DOMAIN || 'foxholm.com';
    this.protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    // For development, use localhost
    if (process.env.NODE_ENV !== 'production' && !process.env.DOMAIN) {
      this.baseUrl = 'localhost:3001';
    }
  }

  // Get all URLs for the sitemap
  getAllUrls() {
    const urls = [];
    const subdomains = subdomainRouter.getAllSubdomains();
    
    // Add main domain
    urls.push({
      loc: `${this.protocol}://${this.baseUrl}`,
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString().split('T')[0]
    });
    
    // Add static pages on root domain
    const staticPages = [
      {
        path: 'headshot-creation-tool',
        title: 'AI Headshot Creation Tool',
        priority: '0.9'
      },
      {
        path: 'image-restoration-tool',
        title: 'Image Restoration Tool',
        priority: '0.9'
      },
      {
        path: 'image-upscale-tool',
        title: 'Image Upscale Tool',
        priority: '0.9'
      }
    ];
    
    staticPages.forEach(page => {
      urls.push({
        loc: `${this.protocol}://${this.baseUrl}/${page.path}`,
        changefreq: 'weekly',
        priority: page.priority,
        lastmod: new Date().toISOString().split('T')[0],
        title: page.title
      });
    });

    // Add each subdomain
    subdomains.forEach(subdomain => {
      const config = subdomainRouter.getSubdomainConfig(subdomain);
      urls.push({
        loc: `${this.protocol}://${subdomain}.${this.baseUrl}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0],
        title: config.title,
        description: config.description
      });

      const commonPages = [];
      commonPages.forEach(page => {
        urls.push({
          loc: `${this.protocol}://${subdomain}.${this.baseUrl}/${page}`,
          changefreq: 'monthly',
          priority: '0.5',
          lastmod: new Date().toISOString().split('T')[0]
        });
      });
    });

    return urls;
  }

  // Generate XML sitemap with subdomain support
  generateXML(currentSubdomain = null) {
    const urls = this.getAllUrls();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // If on a subdomain, prioritize that subdomain's URLs
    if (currentSubdomain) {
      const subdomainUrls = urls.filter(url => 
        url.loc.includes(`${currentSubdomain}.${this.baseUrl}`)
      );
      const otherUrls = urls.filter(url => 
        !url.loc.includes(`${currentSubdomain}.${this.baseUrl}`)
      );
      
      // Add subdomain URLs first with higher priority
      [...subdomainUrls, ...otherUrls].forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
      });
    } else {
      urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
      });
    }

    xml += '</urlset>';
    
    return xml;
  }

  // Generate HTML sitemap
  generateHTML() {
    const urls = this.getAllUrls();
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap - Foxholm AI Image Tools</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #f26522;
            text-align: center;
            margin-bottom: 30px;
        }
        .sitemap-section {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        li:last-child {
            border-bottom: none;
        }
        a {
            color: #f26522;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        .url-description {
            color: #666;
            font-size: 0.9em;
            margin-left: 20px;
        }
    </style>
</head>
<body>
    <h1>Foxholm AI Tools - Sitemap</h1>`;

    // Group URLs by type
    const rootUrls = urls.filter(url => !url.loc.includes('://') || url.loc.includes(`://${this.baseUrl}`));
    const subdomainUrls = urls.filter(url => url.loc.includes(`://${this.baseUrl}`) === false);

    // Root domain section
    html += `\n    <div class="sitemap-section">
        <h2>Main Website</h2>
        <ul>`;
    
    rootUrls.forEach(url => {
        const path = url.loc.replace(`${this.protocol}://${this.baseUrl}`, '');
        const displayPath = path || '/';
        html += `\n            <li>
                <a href="${url.loc}">${displayPath}</a>
                ${url.title ? `<span class="url-description">- ${url.title}</span>` : ''}
            </li>`;
    });

    html += `\n        </ul>
    </div>`;

    // Subdomain sections
    const subdomains = subdomainRouter.getAllSubdomains();
    subdomains.forEach(subdomain => {
        const subdomainUrlsFiltered = urls.filter(url => url.loc.includes(`${subdomain}.${this.baseUrl}`));
        if (subdomainUrlsFiltered.length > 0) {
            const config = subdomainRouter.getSubdomainConfig(subdomain);
            html += `\n    <div class="sitemap-section">
        <h2>${config.title}</h2>
        <ul>`;
            
            subdomainUrlsFiltered.forEach(url => {
                const displayUrl = url.loc.replace(`${this.protocol}://`, '');
                html += `\n            <li>
                <a href="${url.loc}">${displayUrl}</a>
            </li>`;
            });
            
            html += `\n        </ul>
    </div>`;
        }
    });

    html += `\n</body>
</html>`;
    
    return html;
  }

  // Escape XML special characters
  escapeXml(text) {
    const xmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };
    return text.replace(/[&<>"']/g, char => xmlEscapes[char]);
  }
}

module.exports = new SitemapGenerator();