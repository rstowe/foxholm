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
      // For headshot, we'll use image-to-image generation
      // First, prepare the image
      const processedImage = await this.preprocessImage(imageData, {
        width: 512,
        height: 512,
        format: options.outputFormat
      });

      // Generate with Together AI
      const response = await this.generateWithTogetherAI(prompt, {
        width: options.outputFormat === 'square' ? 512 : 512,
        height: options.outputFormat === 'square' ? 512 : 640
      });

      return {
        originalImage: imageData,
        processedImage: response.imageUrl,
        processingDetails: {
          prompt,
          options,
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
      
      // Generate restoration
      const response = await this.generateWithTogetherAI(enhancedPrompt, {
        width: 1024,
        height: 1024
      });

      return {
        originalImage: imageData,
        processedImage: response.imageUrl,
        analysis,
        processingDetails: {
          prompt: enhancedPrompt,
          options,
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

      // Generate upscaled version
      const response = await this.generateWithTogetherAI(prompt, {
        width: targetWidth,
        height: targetHeight
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
      
      const requestOptions = {
        model: 'black-forest-labs/FLUX.1-kontext-pro',
        prompt: prompt,
        width: params.width || this.defaultParams.width,
        height: params.height || this.defaultParams.height,
        steps: 4,
        n: 1,
        safety_checker: false
      };
      
      console.log('Sending request to Together AI with options:', JSON.stringify(requestOptions, null, 2));
      
      const response = await this.together.images.create(requestOptions);

      console.log('Received response from Together AI:', JSON.stringify({
        data: {
          hasData: !!response.data,
          items: response.data ? response.data.length : 0
        }
      }, null, 2));

      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.error('❌ Invalid response structure from Together AI:', JSON.stringify(response, null, 2));
        throw new Error('Invalid response structure from Together AI');
      }

      const firstImage = response.data[0];
      console.log('First image data:', JSON.stringify(firstImage, null, 2));

      return {
        imageUrl: firstImage.url || firstImage.b64_json,
        model: requestOptions.model,
        prompt: requestOptions.prompt
      };
    } catch (error) {
      console.error('Together AI generation error:', error);
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
      
      // Draw and resize
      ctx.drawImage(img, 0, 0, options.width, options.height);
      
      // Convert back to base64
      const processedBase64 = canvas.toDataURL('image/png');
      return processedBase64;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
    }
  }

  async analyzeImageDamage(imageData) {
    // Simple placeholder analysis - in production, this would use computer vision
    return {
      damageDetected: ['fading', 'scratches'],
      damageLevel: 'moderate',
      damageDescription: 'vintage photograph with moderate fading and minor scratches',
      recommendedEnhancement: 'moderate'
    };
  }

  async getImageDimensions(base64Data) {
    try {
      const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      const img = await Canvas.loadImage(buffer);
      
      return {
        width: img.width,
        height: img.height
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