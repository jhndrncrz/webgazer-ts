/**
 * Eye feature extraction utilities
 * Processes eye patches and extracts feature vectors for regression
 */

import type { EyeFeatures, EyePatch } from '../../types/index';
import ImageProcessor from './ImageProcessor';

/**
 * Configuration for eye feature extraction
 */
export interface EyeExtractionConfig {
  /** Width to resize eye patches to */
  resizeWidth: number;
  
  /** Height to resize eye patches to */
  resizeHeight: number;
  
  /** Step size for histogram equalization */
  histogramStep: number;
  
  /** Which eye(s) to track: 'left', 'right', or 'both' */
  trackEye: 'left' | 'right' | 'both';
}

/**
 * Default configuration for eye extraction
 */
const DEFAULT_CONFIG: EyeExtractionConfig = {
  resizeWidth: 10,
  resizeHeight: 6,
  histogramStep: 5,
  trackEye: 'both'
};

/**
 * Eye class - Represents a single eye patch with metadata
 */
export class Eye implements EyePatch {
  public patch: ImageData;
  public imageX: number;
  public imageY: number;
  public width: number;
  public height: number;

  constructor(
    patch: ImageData,
    imageX: number,
    imageY: number,
    width: number,
    height: number
  ) {
    this.patch = patch;
    this.imageX = imageX;
    this.imageY = imageY;
    this.width = width;
    this.height = height;
  }
}

/**
 * EyeExtractor - Extracts and processes eye features for gaze prediction
 */
export class EyeExtractor {
  private config: EyeExtractionConfig;

  constructor(config: Partial<EyeExtractionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Extract feature vector from eye patches
   * Processes eye images through resize, grayscale, and histogram equalization
   * @param eyes - Left and right eye patches
   * @returns Feature vector for regression
   */
  extractFeatures(eyes: EyeFeatures): number[] {
    const { trackEye } = this.config;
    
    // Process selected eye(s)
    if (trackEye === 'left') {
      return this.processEyePatch(eyes.left);
    } else if (trackEye === 'right') {
      return this.processEyePatch(eyes.right);
    } else {
      // Process both eyes and concatenate features
      const leftFeatures = this.processEyePatch(eyes.left);
      const rightFeatures = this.processEyePatch(eyes.right);
      return leftFeatures.concat(rightFeatures);
    }
  }

  /**
   * Process a single eye patch into feature vector
   * @param eyePatch - Eye patch to process
   * @returns Feature vector
   */
  private processEyePatch(eyePatch: EyePatch): number[] {
    // Resize eye patch to standard dimensions
    const resized = this.resizeEye(
      eyePatch,
      this.config.resizeWidth,
      this.config.resizeHeight
    );
    
    // Convert to grayscale
    const grayscale = ImageProcessor.grayscale(
      resized.data,
      resized.width,
      resized.height
    );
    
    // Apply histogram equalization for contrast enhancement
    const equalizedHistogram: number[] = [];
    ImageProcessor.equalizeHistogram(
      grayscale,
      this.config.histogramStep,
      equalizedHistogram
    );
    
    return equalizedHistogram;
  }

  /**
   * Resize an eye patch to specified dimensions
   * @param eyePatch - Eye patch to resize
   * @param targetWidth - Target width
   * @param targetHeight - Target height
   * @returns Resized image data
   */
  resizeEye(
    eyePatch: EyePatch,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    return ImageProcessor.resize(
      eyePatch.patch,
      eyePatch.width,
      eyePatch.height,
      targetWidth,
      targetHeight
    );
  }

  /**
   * Update extractor configuration
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<EyeExtractionConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   * @returns Current extractor configuration
   */
  getConfig(): EyeExtractionConfig {
    return { ...this.config };
  }

  /**
   * Calculate total feature vector length for current configuration
   * @returns Number of features in output vector
   */
  getFeatureLength(): number {
    const singleEyeFeatures = this.config.resizeWidth * this.config.resizeHeight;
    
    if (this.config.trackEye === 'both') {
      return singleEyeFeatures * 2;
    }
    
    return singleEyeFeatures;
  }
}

/**
 * Utility function to bound a point within screen dimensions
 * @param point - Point with x and y coordinates
 * @returns Bounded point within screen boundaries
 */
export function boundToScreen(point: { x: number; y: number }): { x: number; y: number } {
  const screenWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  
  const screenHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  
  return {
    x: Math.max(0, Math.min(point.x, screenWidth)),
    y: Math.max(0, Math.min(point.y, screenHeight))
  };
}

export default EyeExtractor;
