export default {
  // Privacy banner
  privacy: {
    noSignups: "No sign-ups",
    noImageStorage: "We do not store your images",
    noCookies: "No cookies"
  },
  
  // Footer
  footer: {
    copyright: "© 2025 Foxholm. Professional AI Image Studio.",
    loading: "Loading...",
    error: "Error loading page"
  },
  
  // Common
  common: {
    separator: "|",
    loading: "Loading Foxholm Studio...",
    error: {
      configLoad: "Failed to load tool configuration. Please try again later.",
      noImage: "Please upload an image first",
      subdomain: "Could not determine subdomain from URL",
      processing: "Processing failed",
      processImage: "Failed to process image"
    },
    success: {
      resultReady: "Your enhanced result is ready!"
    },
    buttons: {
      processing: "Processing...",
      generate: "Generate AI Enhanced Image"
    },
    messages: {
      noCustomization: "No customization options available for this service."
    },
    app: {
      title: "Foxholm AI",
      altLogo: "Foxholm Logo"
    },
    defaultSubdomains: [
      { name: 'Headshot', path: 'headshot' },
      { name: 'Restore', path: 'restore' },
      { name: 'Upscale', path: 'upscale' }
    ],
    imageUploader: {
      dropText: 'Drop your image here',
      clickText: 'or click to select • JPG, PNG, GIF',
      changeButton: 'Change Image',
      errors: {
        invalidType: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
        fileTooLarge: 'File is too large. Maximum size is {{maxSize}}MB.',
        dimensionsTooLarge: 'Image dimensions are too large. Maximum size is {{maxDimension}}x{{maxDimension}}px.',
        processError: 'Failed to process image. Please try another file.',
        invalidFile: 'Invalid image file. Please try another file.'
      }
    },
    processingStatus: {
      advertisement: 'Advertisement',
      adDimensions: '360 x 450',
      messages: [
        'Initializing...',
        'Uploading image...',
        'Analyzing content...',
        'Applying AI enhancements...',
        'Generating result...',
        'Finalizing...'
      ],
      timeEstimate: 'Processing time: 20-30 seconds'
    },
    resultDisplay: {
      aria: {
        regionLabel: 'Image processing results'
      },
      comparisonView: {
        enhanced: 'Enhanced',
        original: 'Original',
        compare: 'Compare',
        resultOnly: 'Result Only'
      },
      processingDetails: {
        title: 'Processing Details',
        original: 'Original',
        enhanced: 'Enhanced',
        detected: 'Detected',
        processedAt: 'Processed at',
        dimensions: '{{width}} × {{height}}'
      },
      actions: {
        download: '⬇ Download Image',
        downloadComplete: '✓ Downloaded!',
        tryAnother: '🔄 Try Another'
      },
      share: {
        title: 'Check out my AI-enhanced image!',
        text: 'Created with Foxholm AI Image Tools',
        linkCopied: 'Link copied to clipboard!',
        satisfactionPrompt: 'Happy with the result? Share your experience!',
        social: {
          twitter: 'Twitter',
          facebook: 'Facebook',
          instagram: 'Instagram'
        }
      }
    }
  }
};
