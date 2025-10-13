/**
 * Canvas Renderer
 * Utility class for canvas drawing operations
 */

import type { CanvasRendererConfig } from './types';
import { DOMManager } from '../utils/browser/DOMManager';

/**
 * CanvasRenderer class
 * Provides canvas drawing utilities
 */
export class CanvasRenderer {
  private config: CanvasRendererConfig;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  /**
   * Create a new CanvasRenderer
   * @param config - Canvas renderer configuration
   */
  constructor(config: CanvasRendererConfig) {
    this.config = { ...config };
  }

  /**
   * Initialize the canvas renderer
   * @param existingCanvas - Optional existing canvas element to use
   */
  public initialize(existingCanvas?: HTMLCanvasElement): void {
    if (existingCanvas) {
      this.canvas = existingCanvas;
    } else {
      this.canvas = DOMManager.createCanvas(this.config.width, this.config.height, {
        id: this.config.canvasId,
      });
      DOMManager.appendToBody(this.canvas);
    }

    this.context = DOMManager.getCanvas2DContext(this.canvas, {
      willReadFrequently: true,
    });
  }

  /**
   * Get canvas element
   * @returns Canvas element or null
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Get 2D rendering context
   * @returns 2D context or null
   */
  public getContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  /**
   * Clear the canvas
   */
  public clear(): void {
    if (!this.canvas || !this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw image to canvas
   * @param image - Image source
   * @param sourceX - Source X coordinate
   * @param sourceY - Source Y coordinate
   * @param sourceWidth - Source width
   * @param sourceHeight - Source height
   * @param destX - Destination X coordinate
   * @param destY - Destination Y coordinate
   * @param destWidth - Destination width
   * @param destHeight - Destination height
   */
  public drawImage(
    image: CanvasImageSource,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destX: number,
    destY: number,
    destWidth: number,
    destHeight: number
  ): void {
    if (!this.context) {
      return;
    }

    if (this.config.clearBeforeDraw) {
      this.clear();
    }

    this.context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
  }

  /**
   * Draw video frame to canvas
   * @param video - Video element
   */
  public drawVideo(video: HTMLVideoElement): void {
    if (!this.canvas || !this.context) {
      return;
    }

    if (this.config.clearBeforeDraw) {
      this.clear();
    }

    this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Get image data from canvas
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width
   * @param height - Height
   * @returns ImageData or null
   */
  public getImageData(
    x: number,
    y: number,
    width: number,
    height: number
  ): ImageData | null {
    if (!this.context) {
      return null;
    }

    try {
      return this.context.getImageData(x, y, width, height);
    } catch (error) {
      console.error('Failed to get image data:', error);
      return null;
    }
  }

  /**
   * Put image data to canvas
   * @param imageData - Image data to draw
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  public putImageData(imageData: ImageData, x: number, y: number): void {
    if (!this.context) {
      return;
    }

    this.context.putImageData(imageData, x, y);
  }

  /**
   * Set canvas dimensions
   * @param width - Canvas width
   * @param height - Canvas height
   */
  public setDimensions(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;

    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  /**
   * Destroy the canvas renderer
   */
  public destroy(): void {
    if (this.canvas && this.canvas.parentNode) {
      DOMManager.removeElement(this.canvas);
    }

    this.canvas = null;
    this.context = null;
  }
}
