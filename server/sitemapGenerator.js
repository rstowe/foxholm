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
      loc: `${this.protocol}://www.${this.baseUrl}`,
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString().split('T')[0]
    });

    // Add each subdomain
    subdomains.forEach(subdomain => {
      const config = subdomainRouter.getSubdomainConfig(subdomain);
      urls.push({
        loc: `${this.protocol}://${subdomain}.${this.baseUrl}`,
        changefreq: 'weekly',
        priority: '0.9',
        lastmod: new Date().toISOString().split('T')[0],
        title: config.title,
        description: config.description
      });

      // Add common pages for each subdomain
      const commonPages = ['privacy', 'terms', 'about'];
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
</head>
<body>
    <h1>Sitemap</h1>
    <ul>`;

    // Add each URL as a list item
    urls.forEach(url => {
        html += `\n        <li><a href="${url.loc}">${url.title || url.loc}</a></li>`;
    });

    html += `\n    </ul>
</body>
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