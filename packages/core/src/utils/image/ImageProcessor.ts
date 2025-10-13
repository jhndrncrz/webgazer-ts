/**
 * Image processing utilities for eye tracking
 * Handles grayscale conversion, histogram equalization, and image resizing
 */

/**
 * ImageProcessor - Static utility class for image manipulation operations
 */
export class ImageProcessor {
  /**
   * Convert RGB image data to grayscale using luminosity method
   * Uses weighted average: 0.299*R + 0.587*G + 0.114*B
   * @param pixels - Source pixel data in RGBA format
   * @param width - Image width
   * @param height - Image height
   * @returns Grayscale pixel array (single channel)
   */
  static grayscale(
    pixels: Uint8ClampedArray,
    width: number,
    height: number
  ): Uint8ClampedArray {
    const totalPixels = width * height;
    const grayPixels = new Uint8ClampedArray(totalPixels);
    
    let grayIndex = 0;
    let rgbaIndex = 0;
    
    for (let i = 0; i < totalPixels; i++) {
      // Luminosity method weights for human perception
      const red = pixels[rgbaIndex];
      const green = pixels[rgbaIndex + 1];
      const blue = pixels[rgbaIndex + 2];
      
      const grayValue = red * 0.299 + green * 0.587 + blue * 0.114;
      grayPixels[grayIndex] = grayValue;
      
      grayIndex++;
      rgbaIndex += 4; // Skip alpha channel
    }
    
    return grayPixels;
  }

  /**
   * Perform histogram equalization to enhance contrast
   * Redistributes pixel intensities to span the full dynamic range
   * @param source - Source grayscale pixel data
   * @param step - Sampling step for histogram calculation (default: 5)
   * @param destination - Optional destination array (mutates source if not provided)
   * @returns Equalized pixel data
   */
  static equalizeHistogram(
    source: Uint8ClampedArray,
    step: number = 5,
    destination?: Uint8ClampedArray | number[]
  ): Uint8ClampedArray | number[] {
    const sourceLength = source.length;
    
    // Use source as destination if not provided
    if (!destination) {
      destination = source;
    }
    
    // Build histogram (256 bins for 8-bit grayscale)
    const histogram = new Array<number>(256).fill(0);
    
    // Count pixel occurrences (with stepping for performance)
    for (let i = 0; i < sourceLength; i += step) {
      histogram[source[i]]++;
    }
    
    // Compute cumulative distribution function (CDF)
    // and normalize to [0, 255] range
    const normalizationFactor = (255 * step) / sourceLength;
    let cumulativeSum = 0;
    
    for (let intensity = 0; intensity < 256; intensity++) {
      cumulativeSum += histogram[intensity];
      histogram[intensity] = cumulativeSum * normalizationFactor;
    }
    
    // Map source pixels through the equalized histogram
    for (let i = 0; i < sourceLength; i++) {
      destination[i] = histogram[source[i]];
    }
    
    return destination;
  }

  /**
   * Resize image data to specified dimensions using canvas scaling
   * @param imageData - Source image data
   * @param sourceWidth - Source width
   * @param sourceHeight - Source height
   * @param targetWidth - Target width
   * @param targetHeight - Target height
   * @returns Resized image data
   */
  static resize(
    imageData: ImageData,
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    // Create temporary canvas for source image
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = sourceWidth;
    sourceCanvas.height = sourceHeight;
    
    const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
    if (!sourceContext) {
      throw new Error('Failed to get 2D context for source canvas');
    }
    
    sourceContext.putImageData(imageData, 0, 0);
    
    // Create target canvas for resized image
    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;
    
    const targetContext = targetCanvas.getContext('2d');
    if (!targetContext) {
      throw new Error('Failed to get 2D context for target canvas');
    }
    
    // Perform scaling
    targetContext.drawImage(
      sourceCanvas,
      0, 0, sourceWidth, sourceHeight,
      0, 0, targetWidth, targetHeight
    );
    
    // Extract and return resized image data
    return targetContext.getImageData(0, 0, targetWidth, targetHeight);
  }

  /**
   * Normalize pixel values to [0, 1] range
   * @param pixels - Pixel data to normalize
   * @returns Normalized pixel array
   */
  static normalize(pixels: Uint8ClampedArray): Float32Array {
    const normalized = new Float32Array(pixels.length);
    
    for (let i = 0; i < pixels.length; i++) {
      normalized[i] = pixels[i] / 255;
    }
    
    return normalized;
  }

  /**
   * Apply threshold to create binary image
   * @param pixels - Source grayscale pixels
   * @param threshold - Threshold value (0-255)
   * @returns Binary pixel data (0 or 255)
   */
  static threshold(pixels: Uint8ClampedArray, threshold: number): Uint8ClampedArray {
    const result = new Uint8ClampedArray(pixels.length);
    
    for (let i = 0; i < pixels.length; i++) {
      result[i] = pixels[i] >= threshold ? 255 : 0;
    }
    
    return result;
  }

  /**
   * Extract a rectangular region from image data
   * @param imageData - Source image data
   * @param x - X coordinate of top-left corner
   * @param y - Y coordinate of top-left corner
   * @param width - Width of region
   * @param height - Height of region
   * @returns Extracted region as new ImageData
   */
  static extractRegion(
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number
  ): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    
    context.putImageData(imageData, 0, 0);
    
    return context.getImageData(x, y, width, height);
  }
}

export default ImageProcessor;
