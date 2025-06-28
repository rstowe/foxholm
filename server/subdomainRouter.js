// Subdomain configurations
const subdomainConfigs = {
  headshot: {
    title: 'AI Professional Headshot Generator',
    description: 'Transform any photo into a professional headshot in seconds',
    features: ['Professional styles', 'Background options', 'Multiple formats'],
    formFields: {
      style: {
        type: 'radio',
        label: 'Style Selection',
        options: [
          { value: 'corporate', label: 'Corporate Professional' },
          { value: 'creative', label: 'Creative Professional' },
          { value: 'linkedin', label: 'LinkedIn Optimized' },
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
        ],
        required: true
      },
      clothing: {
        type: 'radio',
        label: 'Style Adjustments',
        options: [
          { value: 'suit', label: 'Add a Suit or Blazer' },
          { value: 'business-casual', label: 'Add Business Casual Clothing' },
          { value: 'touchup', label: 'Professional Facial Touch-up' }
        ]
      },
      outputFormat: {
        type: 'radio',
        label: 'Output Format',
        options: [
          { value: 'square', label: 'Square (LinkedIn)' },
          { value: 'portrait', label: 'Portrait (Resume)' },
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
        type: 'radio',
        label: 'Adjust Colors',
        options: [
          { value: 'maintain', label: 'Maintain Original Color' },
          { value: 'colorize', label: 'Colorize Photo' },
          { value: 'desaturate', label: 'Desaturate Photo' },
        ],
        required: true
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
  const prompts = {
    headshot: (opts) => {
      let prompt = `Professional headshot portrait, ${opts.style || 'corporate'} style`;
      if (opts.background) {
        prompt += `, ${opts.background} background`;
      }
      if (opts.clothing?.includes('suit')) {
        prompt += ', wearing professional suit';
      }
      if (opts.clothing?.includes('business-casual')) {
        prompt += ', wearing business casual attire';
      }
      if (opts.clothing?.includes('touchup')) {
        prompt += ', professional retouching, skin smoothing, blemish removal, even skin tone, refined details';
      }
      else {
        prompt += ', maintain facial features and likeness, preserve original facial structure, keep natural skin texture, authentic appearance, same person, minimal retouching, true to original subject, preserve identifying features, adjust facial lighting as needed for asthetics';
      }
      prompt += ', high quality, sharp focus, professional lighting';
      return prompt;
    },
    
    restore: (opts) => {
      let prompt = 'Restore and enhance this vintage photograph with intelligent reconstruction. The image requires both restoration and creative enhancement. Generative Lighting Reconstruction: Analyze and recreate proper lighting based on era and setting Generate natural shadows and highlights where missing Reconstruct three-dimensional lighting that matches the time period Fill in completely faded areas using contextual lighting patterns Create believable ambient lighting for underexposed regions Generate missing reflections and light interactions on surfaces Advanced Restoration with Creative Enhancement: Intelligently reconstruct missing or severely damaged portions Generate plausible details for areas beyond repair (clothing patterns, background elements) Enhance facial features using period-appropriate beauty standards Recreate texture details that have been lost (fabric, skin, hair) Generate missing environmental context based on visible clues Color and Tone Enhancement: For B&W: Apply rich, period-accurate tonal range with proper contrast For color: Reconstruct color palette using historical color theory Generate color information for faded areas based on context Create atmospheric depth through intelligent color grading Preservation Guidelines: Maintain historical authenticity while taking creative liberties for improvement Generate details that could plausibly have existed in the original Balance restoration with artistic enhancement Keep the soul of the vintage aesthetic while dramatically improving quality Output: Professional museum-quality restoration that looks like the photograph was taken yesterday but developed using period techniques. ';
      
      if (opts.colorization) {
        prompt += ' Intelligently colorize this black and white/sepia image with historically accurate and vibrant colors. Smart Color Generation: Analyze the era, setting, and context to generate period-appropriate color palettes Use AI inference to determine likely skin tones based on lighting and ethnic features Generate rich, saturated colors while maintaining photographic realism Create natural color variations and gradients (not flat coloring) Add subtle color bleeding and chromatic effects found in vintage color photography Contextual Color Logic: Infer fabric colors based on texture, sheen, and time period fashion Generate environmental colors using seasonal and geographical clues Create believable color relationships between objects (complementary/harmonious) Add authentic color temperature variations based on lighting conditions Generate realistic color depth and atmospheric perspective Enhanced Color Details: Create subtle color variations in skin (blush, undertones, tan lines) Generate natural eye colors with proper iris patterns Add period-appropriate makeup colors if applicable Create realistic hair color with natural highlights and shadows Generate authentic material colors (wood grain, metal patina, fabric dyes) Apply colors confidently and vividly - aim for how the scene would look in perfect color photography of that era, not muted or uncertain coloring.naturally, and heavily, colorize the black and white or sepia tones in the image while matching shading and hues expected. ';
      } 
            
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