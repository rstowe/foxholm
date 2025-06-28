// Subdomain configurations
const subdomainConfigs = {
  headshot: {
    emoji: '📸',
    title: 'AI Professional Headshot Generator',
    description: 'Transform any photo into a professional headshot in seconds',
    features: ['Professional styles', 'Background options', 'Multiple formats'],
    promptGenerator: (opts) => {
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
    emoji: '🖼️',
    title: 'AI Photo Restoration & Enhancement',
    description: 'Restore old, damaged, or faded photos using advanced AI',
    features: ['Scratch removal', 'Color restoration', 'Damage repair'],
    promptGenerator: (opts) => {
        let prompt = '';
        
      if (opts.colorization === 'recreate') {
        prompt +="Generate a completely new photograph inspired by this vintage reference image. Do not restore or enhance the original - create an entirely new modern photograph from scratch. Analyze the vintage photo to identify the subjects, their poses, expressions, and setting, then generate a brand new high-resolution photograph as if you were photographing these exact same people today. Critical facial accuracy requirements: precisely match all facial proportions and measurements from the original, maintain exact eye shape, size, spacing and color, preserve precise nose structure and proportions, keep identical mouth shape and lip thickness, maintain exact jawline and chin structure, preserve unique identifying features like moles, dimples, or asymmetries, match the subject's exact age and ethnic features, ensure the generated face would be recognized as the same person by anyone who knows them. Facial quality guidelines: maintain smooth, natural skin texture without adding excessive wrinkles or age lines not present in original, avoid over-interpreting image artifacts as facial features, preserve the subject's apparent age without artificial aging, use clean professional portrait lighting that flatters facial features, generate healthy natural skin tones without oversaturation or discoloration, do not add texture details that weren't clearly visible in the original photo, keep skin rendering realistic but not hyper-detailed. Build new photorealistic humans with these exact facial features using soft flattering light, construct a new version of the same environment with contemporary photographic standards, create fresh high-definition details while maintaining identity. This is complete regeneration with facial authentication priority. The output must be unmistakably the same people with their exact facial characteristics and apparent age, just photographed with modern equipment and flattering professional lighting."       } 
      else {
        prompt += 'Restore this vintage photograph with conservative age preservation. Clean and repair only: Remove dust, scratches, tears and surface damage. Fix color fading and exposure while preserving original tones. Age preservation rules: When facial details are unclear or blurry, default to smoother, younger appearance. Never add wrinkles, age spots, or aging features unless they are clearly and explicitly visible in the original. If skin texture is not clearly defined in the original, restore with smooth, youthful skin. Preserve any clearly visible features but do not interpret blur as aged skin. When in doubt about age-related features, choose the younger interpretation. Maintain original composition and poses without adding any aging details. Technical approach: Repair photo damage without adding texture that suggests age. Keep faces at their apparent age or younger, never older. Restore missing details with youthful characteristics when original is unclear. Output: A cleaned photograph that preserves or reduces apparent age, never adding wrinkles or aging features not explicitly visible in the original damaged photo.'}
      if (opts.colorization === 'colorize') {
        prompt += ' Intelligently colorize this black and white/sepia image with historically accurate and vibrant colors. Smart Color Generation: Analyze the era, setting, and context to generate period-appropriate color palettes Use AI inference to determine likely skin tones based on lighting and ethnic features Generate rich, saturated colors while maintaining photographic realism Create natural color variations and gradients (not flat coloring) Add subtle color bleeding and chromatic effects found in vintage color photography Contextual Color Logic: Infer fabric colors based on texture, sheen, and time period fashion Generate environmental colors using seasonal and geographical clues Create believable color relationships between objects (complementary/harmonious) Add authentic color temperature variations based on lighting conditions Generate realistic color depth and atmospheric perspective Enhanced Color Details: Create subtle color variations in skin (blush, undertones, tan lines) Generate natural eye colors with proper iris patterns Add period-appropriate makeup colors if applicable Create realistic hair color with natural highlights and shadows Generate authentic material colors (wood grain, metal patina, fabric dyes) Apply colors confidently and vividly - aim for how the scene would look in perfect color photography of that era, not muted or uncertain coloring.naturally, and heavily, colorize the black and white or sepia tones in the image while matching shading and hues expected. ';
      } 
      else if (opts.colorization === 'desaturate') {
        prompt += ' Desaturate this image to remove color and create a grayscale image. This will help to remove any color noise and improve the overall quality of the image. ';
      }
            
      return prompt;
    },
    formFields: {
      colorization: {
        type: 'radio',
        label: 'Adjust Colors',
        options: [
          { value: 'maintain', label: 'Maintain Original Color' },
          { value: 'recreate', label: 'Recreate Vintage Photo' },
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
    emoji: '🔍',
    title: 'AI Image Upscaling',
    description: 'Enhance image resolution up to 8x without losing quality',
    features: ['Up to 8x resolution', 'Smart enhancement', 'Noise reduction'],
    promptGenerator: (opts) => {
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
    },
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

module.exports = subdomainConfigs;
