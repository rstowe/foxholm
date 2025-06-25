// Subdomain configurations
const subdomainConfigs = {
    headshot: {
      title: 'AI Professional Headshot Generator',
      description: 'Transform any photo into a professional headshot in seconds',
      features: ['Professional styles', 'Background options', 'Multiple formats'],
      formFields: {
        style: {
          type: 'select',
          label: 'Style Selection',
          options: [
            { value: 'corporate', label: 'Corporate Professional' },
            { value: 'creative', label: 'Creative Professional' },
            { value: 'linkedin', label: 'LinkedIn Optimized' },
            { value: 'business-casual', label: 'Business Casual' },
            { value: 'executive', label: 'Formal Executive' }
          ],
          required: true
        },
        background: {
          type: 'radio',
          label: 'Background Preference',
          options: [
            { value: 'office', label: 'Office Setting' },
            { value: 'solid', label: 'Solid Color' },
            { value: 'gradient', label: 'Gradient' },
            { value: 'custom', label: 'Custom Upload' }
          ],
          required: true
        },
        clothing: {
          type: 'checkbox',
          label: 'Clothing Adjustments',
          options: [
            { value: 'suit', label: 'Add Suit/Blazer' },
            { value: 'collar', label: 'Adjust Collar' },
            { value: 'touchup', label: 'Professional Touch-up' }
          ]
        },
        outputFormat: {
          type: 'select',
          label: 'Output Format',
          options: [
            { value: 'square', label: 'Square (LinkedIn)' },
            { value: 'portrait', label: 'Portrait (Resume)' },
            { value: 'pack', label: 'Multiple Sizes Pack' }
          ],
          required: true
        }
      },
      seo: {
        title: 'AI Professional Headshot Generator - Free Online Tool | Foxholm',
        description: 'Transform any photo into a professional headshot in seconds. Perfect for LinkedIn, resumes, and business profiles. No photographer needed.',
        keywords: ['AI headshot generator', 'professional headshot AI', 'LinkedIn photo maker']
      }
    },
    
    restore: {
      title: 'AI Photo Restoration & Enhancement',
      description: 'Restore old, damaged, or faded photos using advanced AI',
      features: ['Scratch removal', 'Color restoration', 'Damage repair'],
      formFields: {
        colorization: {
          type: 'toggle',
          label: 'Colorize Photo',
          description: 'Automatically add color to black and white photos',
          default: false
        }
      },
      seo: {
        title: 'AI Photo Restoration - Restore Old & Damaged Photos Online | Foxholm',
        description: 'Instantly restore old, damaged, or faded photos using AI. Fix scratches, tears, and discoloration. Bring family memories back to life.',
        keywords: ['restore old photos AI', 'photo restoration online', 'fix damaged photos']
      }
    },
    
    upscale: {
      title: 'AI Image Upscaling',
      description: 'Enhance image resolution up to 8x without losing quality',
      features: ['Up to 8x resolution', 'Smart enhancement', 'Noise reduction'],
      formFields: {
        targetResolution: {
          type: 'select',
          label: 'Target Resolution',
          options: [
            { value: '2x', label: '2x (Recommended)' },
            { value: '4x', label: '4x (High Quality)' },
            { value: '8x', label: '8x (Maximum)' },
            { value: 'custom', label: 'Custom Size' }
          ],
          required: true
        },
        enhancementType: {
          type: 'radio',
          label: 'Enhancement Type',
          options: [
            { value: 'photo', label: 'Photo (Faces & Details)' },
            { value: 'artwork', label: 'Artwork (Illustrations)' },
            { value: 'text', label: 'Text (Documents)' },
            { value: 'general', label: 'General' }
          ],
          required: true
        },
        noiseReduction: {
          type: 'slider',
          label: 'Noise Reduction',
          min: 0,
          max: 100,
          step: 10,
          unit: '%',
          default: 50
        },
        sharpeningLevel: {
          type: 'slider',
          label: 'Sharpening Level',
          min: 0,
          max: 100,
          step: 10,
          unit: '%',
          default: 30
        }
      },
      seo: {
        title: 'AI Image Upscaler - Enhance Resolution 8x Free | Foxholm',
        description: 'Upscale images up to 8x without losing quality. Perfect for printing, web use, or enhancing old photos. Powered by advanced AI.',
        keywords: ['AI image upscaler', 'increase image resolution', 'upscale photo online']
      }
    }
  };
  
  // Extract subdomain from host
  function extractSubdomain(host) {
    if (!host) return process.env.DEFAULT_SUBDOMAIN || 'headshot';
    
    try {
      // Handle cases like 'localhost:3000' or 'headshot.localhost:3000'
      const hostname = host.split(':')[0];
      
      // Handle localhost with subdomains (e.g., headshot.localhost)
      if (hostname.endsWith('.localhost')) {
        const subdomain = hostname.split('.')[0];
        return subdomain === 'localhost' ? (process.env.DEFAULT_SUBDOMAIN || 'headshot') : subdomain;
      }
      
      // Handle IP addresses - use default subdomain
      if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return process.env.DEFAULT_SUBDOMAIN || 'headshot';
      }
      
      // Extract subdomain from domain (e.g., headshot.example.com)
      const parts = hostname.split('.');
      if (parts.length > 2) {
        return parts[0];
      }
      
      // No subdomain found, use default
      return process.env.DEFAULT_SUBDOMAIN || 'headshot';
      
    } catch (error) {
      console.error('Error extracting subdomain:', error);
      return process.env.DEFAULT_SUBDOMAIN || 'headshot';
    }
  }
  
  // Get configuration for a subdomain
  function getSubdomainConfig(subdomain) {
    try {
      // Default to headshot if no subdomain provided
      if (!subdomain) {
        return subdomainConfigs['headshot'] || null;
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
      
      // If no match found, log and return default
      if (!matchedSubdomain) {
        console.warn(`No config found for subdomain: ${normalizedSubdomain}, falling back to default`);
        return subdomainConfigs['headshot'] || null;
      }
      
      // Return the matched config
      console.log(`Found config for subdomain: ${matchedSubdomain}`);
      return subdomainConfigs[matchedSubdomain];
      
    } catch (error) {
      console.error('Error in getSubdomainConfig:', error);
      return subdomainConfigs['headshot'] || null;
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
    const prompts = {
      headshot: (opts) => {
        let prompt = `Professional headshot portrait, ${opts.style || 'corporate'} style`;
        if (opts.background) {
          prompt += `, ${opts.background} background`;
        }
        if (opts.clothing?.includes('suit')) {
          prompt += ', wearing professional suit';
        }
        prompt += ', high quality, sharp focus, professional lighting';
        return prompt;
      },
      
      restore: (opts) => {
        let prompt = 'Restore this damaged vintage photograph. The image has significant age-related damage including possibly: Heavy fading and uneven exposure Yellow/brown discoloration and age spots Loss of contrast and detail Damaged/faded edges Various stains and marks throughout Please perform professional photo restoration to: Enhance clarity and sharpness while preserving the vintage aesthetic Correct exposure and contrast issues Remove age spots, stains, and discoloration Repair damaged areas and edges Restore facial features and clothing details Maintain the historical authenticity and time period character ';
        
        if (opts.colorization) {
          prompt += 'naturally, and heavily, colorize the image while matching shading and hues expected. ';
        } else {
          prompt += 'If the photo has minimal color, apply a consistent black and white color. If the image is color, repair the color palette to be consistent. ';
        }
        
        prompt += 'Preserve any important details visible in the original Output: High-quality restored vintage photograph that looks like a well-preserved original from the same time period.';
        
        return prompt;
      },
      
      upscale: (opts) => {
        let prompt = `Upscale image to ${opts.targetResolution || '2x'} resolution`;
        if (opts.enhancementType) {
          prompt += `, optimized for ${opts.enhancementType}`;
        }
        if (opts.noiseReduction > 0) {
          prompt += `, reduce noise by ${opts.noiseReduction}%`;
        }
        if (opts.sharpeningLevel > 0) {
          prompt += `, sharpen details by ${opts.sharpeningLevel}%`;
        }
        prompt += ', maintain quality, enhance details';
        return prompt;
      }
    };
    
    const promptGenerator = prompts[subdomain];
    return promptGenerator ? promptGenerator(options) : 'Generate high quality image';
  }
  
  module.exports = {
    extractSubdomain,
    getSubdomainConfig,
    getAllSubdomains,
    generatePrompt
  };