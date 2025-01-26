import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

class ImageComparisonService {
  constructor() {
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await tf.ready();
      await tf.setBackend('webgl');
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing TensorFlow.js:', error);
      throw error;
    }
  }

  async compareImages(image1, image2) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const tensor1 = await this.preprocessImage(image1);
      const tensor2 = await this.preprocessImage(image2);
      
      const similarity = await this.calculateSimilarity(tensor1, tensor2);
      tf.dispose([tensor1, tensor2]);
      
      return {
        similarity,
        match: similarity > 0.8
      };
    } catch (error) {
      console.error('Error comparing images:', error);
      throw error;
    }
  }

  async preprocessImage(imageSource) {
    return new Promise(async (resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();
          resolve(tensor);
        };
        
        img.onerror = reject;
        
        if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
          img.src = imageSource;
        } else {
          img.src = imageSource;
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async calculateSimilarity(tensor1, tensor2) {
    const cosineDistance = tf.metrics.cosineProximity(tensor1, tensor2).dataSync()[0];
    return 1 - Math.abs(cosineDistance);
  }
}

export default ImageComparisonService;