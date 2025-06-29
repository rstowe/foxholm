// Server-side translations for subdomain configurations
module.exports = {
  headshot: {
    title: 'AI Professional Headshot Generator',
    description: 'Transform any photo into a professional headshot in seconds',
    features: ['Professional styles', 'Background options', 'Multiple formats'],
    formFields: {
      style: {
        label: 'Style Selection',
        options: [
          { value: 'corporate', label: 'Corporate Professional' },
          { value: 'creative', label: 'Creative Professional' },
          { value: 'linkedin', label: 'LinkedIn Optimized' },
        ]
      },
      background: {
        label: 'Background Preference',
        options: [
          { value: 'office', label: 'Office Setting' },
          { value: 'solid', label: 'Solid Color' },
          { value: 'gradient', label: 'Gradient' },
        ]
      },
      clothing: {
        label: 'Style Adjustments',
        options: [
          { value: 'suit', label: 'Add a Suit or Blazer' },
          { value: 'business-casual', label: 'Add Business Casual Clothing' },
          { value: 'touchup', label: 'Professional Facial Touch-up' }
        ]
      },
      outputFormat: {
        label: 'Output Format',
        options: [
          { value: 'square', label: 'Square (LinkedIn)' },
          { value: 'portrait', label: 'Portrait (Resume)' },
        ]
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
        label: 'Adjust Colors',
        options: [
            { value: 'recreate', label: 'Recreate Vintage Photo' },
          { value: 'maintain', label: 'Maintain Original Color' },
          { value: 'colorize', label: 'Colorize Photo' },
          { value: 'desaturate', label: 'Desaturate Photo' },
        ]
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
        label: 'Target Resolution',
        options: [
          { value: '2x', label: '2x (Recommended)' },
          { value: '4x', label: '4x (High Quality)' },
          { value: '8x', label: '8x (Maximum)' },
          { value: 'custom', label: 'Custom Size' }
        ]
      },
      enhancementType: {
        label: 'Enhancement Type',
        options: [
          { value: 'photo', label: 'Photo (Faces & Details)' },
          { value: 'artwork', label: 'Artwork (Illustrations)' },
          { value: 'text', label: 'Text (Documents)' },
          { value: 'general', label: 'General' }
        ]
      },
      noiseReduction: {
        label: 'Noise Reduction',
        unit: '%',
      },
      sharpeningLevel: {
        label: 'Sharpening Level',
        unit: '%',
      }
    },
    seo: {
      title: 'AI Image Upscaler - Enhance Resolution 8x Free | Foxholm',
      description: 'Upscale images up to 8x without losing quality. Perfect for printing, web use, or enhancing old photos. Powered by advanced AI.',
      keywords: ['AI image upscaler', 'increase image resolution', 'upscale photo online']
    }
  },
  
  // Common field types
  fieldTypes: {
    radio: 'radio',
    select: 'select',
    slider: 'slider',
  },
  
  // Common slider settings
  sliderSettings: {
    min: 0,
    max: 100,
    step: 10,
    default: 0
  }
};
