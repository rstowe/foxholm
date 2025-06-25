const Together = require('together-ai');
const Canvas = require('canvas');
const { PNG } = require('pngjs');
const fs = require('fs').promises;
const path = require('path');
const subdomainRouter = require('./subdomainRouter');

class ImageProcessor {
  constructor() {
    this.together = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    });
    
    this.defaultParams = {
      width: 1024,
      height: 1024
    };
    
    // Model configuration for different operations
    // FLUX.1-kontext-pro supports image-to-image via image_url parameter
    this.modelConfig = {
      headshot: {
        model: 'black-forest-labs/FLUX.1-kontext-pro',
        supportsImage: true // FLUX.1-kontext-pro supports img2img with image_url
      },
      restore: {
        model: 'black-forest-labs/FLUX.1-kontext-pro',
        supportsImage: true
      },
      upscale: {
        model: 'black-forest-labs/FLUX.1-kontext-pro',
        supportsImage: true
      }
    };
  }

  async processImage(subdomain, imageData, options) {
    try {
      // Validate subdomain
      const config = subdomainRouter.getSubdomainConfig(subdomain);
      if (!config) {
        throw new Error(`Invalid subdomain: ${subdomain}`);
      }

      // Generate prompt based on subdomain and options
      const prompt = subdomainRouter.generatePrompt(subdomain, options);
      console.log(`Processing ${subdomain} request with prompt:`, prompt);

      // Process based on subdomain type
      let result;
      switch (subdomain) {
        case 'headshot':
          result = await this.processHeadshot(imageData, prompt, options);
          break;
        case 'restore':
          result = await this.processRestore(imageData, prompt, options);
          break;
        case 'upscale':
          result = await this.processUpscale(imageData, prompt, options);
          break;
        default:
          throw new Error(`Unsupported subdomain: ${subdomain}`);
      }

      return result;
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  }

  async processHeadshot(imageData, prompt, options) {
    try {
      // Generate with Together AI using image-to-image
      const response = await this.generateWithTogetherAI(prompt, {
        image: imageData,
        width: options.outputFormat === 'square' ? 512 : 512,
        height: options.outputFormat === 'square' ? 512 : 640,
        subdomain: 'headshot',
        strength: 0.75 // Adjust transformation strength for headshots
      });

      return {
        originalImage: imageData,
        processedImage: response.imageUrl,
        processingDetails: {
          prompt,
          options,
          model: response.model,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Headshot processing error:', error);
      throw error;
    }
  }

  async processRestore(imageData, prompt, options) {
    try {
      // For restoration, we'll analyze the image first
      const analysis = await this.analyzeImageDamage(imageData);
      
      // Enhance the prompt based on analysis
      const enhancedPrompt = `${prompt}, ${analysis.damageDescription}`;
      
      // Generate restoration with source image
      const response = await this.generateWithTogetherAI(enhancedPrompt, {
        image: imageData,
        width: 1024,
        height: 1024,
        subdomain: 'restore',
        strength: 0.8 // Higher strength for restoration
      });

      return {
        originalImage: imageData,
        processedImage: response.imageUrl,
        analysis,
        processingDetails: {
          prompt: enhancedPrompt,
          options,
          model: response.model,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Restore processing error:', error);
      throw error;
    }
  }

  async processUpscale(imageData, prompt, options) {
    try {
      // Get original image dimensions
      const dimensions = await this.getImageDimensions(imageData);
      
      // Calculate target dimensions
      const scale = this.getScaleFactor(options.targetResolution);
      const targetWidth = Math.min(dimensions.width * scale, 4096);
      const targetHeight = Math.min(dimensions.height * scale, 4096);

      // Generate upscaled version with source image
      const response = await this.generateWithTogetherAI(prompt, {
        image: imageData,
        width: targetWidth,
        height: targetHeight,
        subdomain: 'upscale',
        strength: 0.6 // Lower strength to preserve details during upscaling
      });

      return {
        originalImage: imageData,
        processedImage: response.imageUrl,
        originalDimensions: dimensions,
        targetDimensions: {
          width: targetWidth,
          height: targetHeight
        },
        processingDetails: {
          prompt,
          options,
          scale,
          model: response.model,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Upscale processing error:', error);
      throw error;
    }
  }

  async generateWithTogetherAI(prompt, params = {}) {
    try {
      console.log('🚀 Generating image with Together AI...');
      console.log('API Key:', process.env.TOGETHER_API_KEY ? 'Present' : 'Missing');
      
      // Get model configuration for the subdomain
      const modelInfo = params.subdomain ? this.modelConfig[params.subdomain] : {
        model: 'black-forest-labs/FLUX.1-kontext-pro',
        supportsImage: true
      };
      
      // Clean and prepare the base64 image if provided
      let imageUrl = null;
      if (params.image && modelInfo.supportsImage) {
        // Remove data URL prefix if present to get clean base64
        const base64Data = params.image.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        
        // Validate base64 data
        try {
          const buffer = Buffer.from(base64Data, 'base64');
          console.log(`Image data size: ${buffer.length} bytes`);
          
          // Create a data URL for the image_url parameter
          // Try with the full data URL format
          imageUrl = params.image.startsWith('data:') 
            ? params.image 
            : `data:image/png;base64,${base64Data}`;
            
          console.log('Created image URL for API:', imageUrl.substring(0, 100) + '...');
        } catch (error) {
          console.error('Invalid base64 image data:', error);
          throw new Error('Invalid image data provided');
        }
      }
      
      // Build request parameters for FLUX.1-kontext-pro
      const requestOptions = {
        model: modelInfo.model,
        prompt: prompt,
        width: params.width || this.defaultParams.width,
        height: params.height || this.defaultParams.height,
        steps: params.steps || 39, // FLUX.1-kontext-pro benefits from more steps
        n: 1,
        seed: params.seed || Math.floor(Math.random() * 10000000) // For reproducibility
      };
      
      // Add image_url for image-to-image generation if model supports it
      if (imageUrl && modelInfo.supportsImage) {
        // FLUX.1-kontext-pro uses image_url parameter
        requestOptions.image_url = imageUrl;
        
        // Add additional parameters for control
        if (params.strength !== undefined) {
          requestOptions.strength = params.strength;
        }
        if (params.guidance_scale !== undefined) {
          requestOptions.guidance_scale = params.guidance_scale;
        }
        
        console.log(`Using image-to-image mode with FLUX.1-kontext-pro`);
        console.log('Image parameters:', {
          hasImageUrl: !!requestOptions.image_url,
          imageUrlLength: imageUrl.length,
          strength: requestOptions.strength,
          guidance_scale: requestOptions.guidance_scale
        });
      }
      
      console.log('Sending request to Together AI with options:', {
        model: requestOptions.model,
        prompt: requestOptions.prompt,
        width: requestOptions.width,
        height: requestOptions.height,
        steps: requestOptions.steps,
        hasImageUrl: !!requestOptions.image_url,
        seed: requestOptions.seed
      });
      
      // Make the API request
      const response = await this.together.images.create(requestOptions);

      console.log('Received response from Together AI:', {
        hasData: !!response.data,
        dataLength: response.data ? response.data.length : 0
      });

      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error('❌ Invalid response structure from Together AI');
        console.error('Full response:', JSON.stringify(response, null, 2));
        throw new Error('Invalid response structure from Together AI');
      }

      const firstImage = response.data[0];
      console.log('Image generation successful');

      // Return the URL or base64 data
      return {
        imageUrl: firstImage.url || `data:image/png;base64,${firstImage.b64_json}`,
        model: requestOptions.model,
        prompt: requestOptions.prompt,
        seed: requestOptions.seed, // Return seed for reproducibility
        usedImg2Img: !!imageUrl
      };
    } catch (error) {
      console.error('Together AI generation error:', error);
      console.error('Full error object:', error);
      
      // Provide more specific error messages
      if (error.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        if (error.response.status === 401) {
          throw new Error('Invalid API key. Please check your Together AI API key.');
        } else if (error.response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (error.response.status === 400) {
          console.error('Bad request - possible issues with image_url format');
          // If data URL doesn't work, suggest alternative
          if (imageUrl && imageUrl.startsWith('data:')) {
            throw new Error('The API may not accept data URLs. Consider implementing image upload to get a proper URL.');
          }
          throw new Error('Invalid request parameters. Please check image format and size.');
        } else if (error.response.status === 422) {
          console.error('Unprocessable entity - check model capabilities');
          throw new Error('The model parameters are invalid. Please check the Together AI documentation.');
        }
      }
      
      throw error;
    }
  }

  async preprocessImage(base64Data, options) {
    try {
      // Remove data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      
      // Load image with canvas
      const img = await Canvas.loadImage(buffer);
      const canvas = Canvas.createCanvas(options.width, options.height);
      const ctx = canvas.getContext('2d');
      
      // Calculate aspect ratio preserving dimensions
      const aspectRatio = img.width / img.height;
      let drawWidth = options.width;
      let drawHeight = options.height;
      let offsetX = 0;
      let offsetY = 0;
      
      if (aspectRatio > options.width / options.height) {
        drawHeight = options.width / aspectRatio;
        offsetY = (options.height - drawHeight) / 2;
      } else {
        drawWidth = options.height * aspectRatio;
        offsetX = (options.width - drawWidth) / 2;
      }
      
      // Fill background (white)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, options.width, options.height);
      
      // Draw image centered and aspect ratio preserved
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Convert back to base64
      const processedBase64 = canvas.toDataURL('image/png');
      return processedBase64;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
    }
  }

  async analyzeImageDamage(imageData) {
    // Enhanced analysis placeholder - in production, this would use computer vision
    // Could potentially use a vision model API for real damage detection
    return {
      damageDetected: ['fading', 'scratches', 'tears', 'discoloration'],
      damageLevel: 'moderate',
      damageDescription: 'vintage photograph with moderate fading, minor scratches, slight tears, and age-related discoloration',
      recommendedEnhancement: 'moderate',
      colorAnalysis: {
        hasColor: true,
        dominantTones: ['sepia', 'brown', 'faded']
      }
    };
  }

  async getImageDimensions(base64Data) {
    try {
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      const img = await Canvas.loadImage(buffer);
      
      return {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      };
    } catch (error) {
      console.error('Get dimensions error:', error);
      throw error;
    }
  }

  getScaleFactor(resolution) {
    const scaleMap = {
      '2x': 2,
      '4x': 4,
      '8x': 8,
      'custom': 2
    };
    return scaleMap[resolution] || 2;
  }
}

module.exports = new ImageProcessor();