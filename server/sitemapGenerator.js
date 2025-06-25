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
    const subdomains = subdomainRouter.getAllSubdomains();
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap - Foxholm AI Image Tools</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f7fa;
        }
        h1 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        h2 {
            color: #764ba2;
            margin-top: 2rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .sitemap-section {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }
        .url-list {
            list-style: none;
            padding: 0;
        }
        .url-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f7fafc;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .url-item:hover {
            background: #e0e7ff;
            transform: translateX(5px);
        }
        .url-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
        }
        .url-link:hover {
            color: #764ba2;
        }
        .url-description {
            color: #718096;
            margin-top: 0.5rem;
            font-size: 0.95rem;
        }
        .url-meta {
            font-size: 0.875rem;
            color: #a0aec0;
            margin-top: 0.5rem;
        }
        .main-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-bottom: 2rem;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        .feature-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        .feature-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #667eea;
        }
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
            color: #718096;
        }
    </style>
</head>
<body>
    <h1>Foxholm AI Image Tools - Sitemap</h1>
    
    <a href="${this.protocol}://www.${this.baseUrl}" class="main-link">← Back to Main Site</a>
    
    <div class="sitemap-section">
        <h2>Main Domain</h2>
        <ul class="url-list">
            <li class="url-item">
                <a href="${this.protocol}://www.${this.baseUrl}" class="url-link">Foxholm Homepage</a>
                <div class="url-description">Transform your images with powerful AI tools</div>
                <div class="url-meta">Priority: High | Updates: Weekly</div>
            </li>
        </ul>
    </div>

    <div class="sitemap-section">
        <h2>AI Image Tools</h2>
        <div class="feature-grid">`;

    // Add each subdomain as a feature card
    subdomains.forEach(subdomain => {
      const config = subdomainRouter.getSubdomainConfig(subdomain);
      const url = `${this.protocol}://${subdomain}.${this.baseUrl}`;
      
      html += `
            <div class="feature-card">
                <h3><a href="${url}" class="url-link">${config.title}</a></h3>
                <div class="url-description">${config.description}</div>
                <div class="url-meta">
                    Features: ${config.features.join(', ')}
                </div>
            </div>`;
    });

    html += `
        </div>
    </div>

    <div class="sitemap-section">
        <h2>Legal & Information Pages</h2>
        <ul class="url-list">`;

    // Add legal pages
    const legalPages = [
      { path: 'privacy', title: 'Privacy Policy', desc: 'How we handle your data and protect your privacy' },
      { path: 'terms', title: 'Terms of Service', desc: 'Terms and conditions for using our services' },
      { path: 'about', title: 'About Us', desc: 'Learn more about Foxholm and our mission' }
    ];

    legalPages.forEach(page => {
      html += `
            <li class="url-item">
                <a href="${this.protocol}://www.${this.baseUrl}/${page.path}" class="url-link">${page.title}</a>
                <div class="url-description">${page.desc}</div>
                <div class="url-meta">Available on all subdomains</div>
            </li>`;
    });

    html += `
        </ul>
    </div>

    <div class="footer">
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        <p><a href="/sitemap.xml">XML Sitemap</a> | <a href="/">Home</a></p>
    </div>
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