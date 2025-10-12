/**
 * Type definitions for image processing utilities
 */

/**
 * Configuration for image processing operations
 */
export interface ImageProcessingConfig {
  /** Whether to apply histogram equalization */
  applyEqualization: boolean;
  
  /** Step size for histogram calculations */
  histogramStep: number;
  
  /** Target dimensions for resizing */
  targetSize?: {
    width: number;
    height: number;
  };
}

/**
 * Result of image processing operation
 */
export interface ProcessedImage {
  /** Processed pixel data */
  data: Uint8ClampedArray | Float32Array;
  
  /** Image width */
  width: number;
  
  /** Image height */
  height: number;
  
  /** Number of channels (1 for grayscale, 3 for RGB, 4 for RGBA) */
  channels: number;
}
