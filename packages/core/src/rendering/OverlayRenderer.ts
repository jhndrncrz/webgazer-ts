/**
 * Overlay Renderer
 * Renders face tracking overlay with landmarks and eye regions
 */

import type { OverlayRendererConfig } from './types';
import type { IRenderer } from '../core/types';
import type { Point2D, Rectangle } from '../types/geometry';
import { DOMManager } from '../utils/browser/DOMManager';

/**
 * OverlayRenderer class
 * Renders face landmarks and eye regions as overlay
 */
export class OverlayRenderer implements IRenderer {
  private config: OverlayRendererConfig;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private isInitialized: boolean = false;

  /**
   * Create a new OverlayRenderer
   * @param config - Overlay renderer configuration
   */
  constructor(config: OverlayRendererConfig) {
    this.config = { ...config };
  }

  /**
   * Initialize the overlay renderer
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.canvas = DOMManager.createCanvas(this.config.width, this.config.height, {
      id: this.config.canvasId,
      styles: {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: `${this.config.zIndex}`,
        pointerEvents: 'none',
        display: this.config.showLandmarks || this.config.showEyeRegions || this.config.showFaceBox ? 'block' : 'none',
      },
    });

    const container = DOMManager.getElementById(this.config.containerId);
    if (container) {
      container.appendChild(this.canvas);
    } else {
      DOMManager.appendToBody(this.canvas);
    }

    this.context = DOMManager.getCanvas2DContext(this.canvas, {
      willReadFrequently: true, // Face overlay is drawn frequently
    });

    this.isInitialized = true;
    
    console.log('✅ Overlay canvas created:', this.config.width, 'x', this.config.height);
  }

  /**
   * Update the overlay (no-op for overlay renderer)
   */
  public update(): void {
    // Overlay is drawn manually via drawLandmarks/drawEyeRegions
  }

  /**
   * Set dimensions
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
   * Set CSS style dimensions (for scaling)
   * This is different from canvas dimensions - canvas dimensions are actual pixels,
   * while style dimensions control the display size
   * @param width - CSS width in pixels
   * @param height - CSS height in pixels
   */
  public setStyleDimensions(width: number, height: number): void {
    if (this.canvas) {
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    }
  }

  /**
   * Set visibility
   * @param visible - Whether overlay should be visible
   */
  public setVisible(visible: boolean): void {
    if (this.canvas) {
      DOMManager.setVisible(this.canvas, visible);
    }
  }

  /**
   * Clear the overlay
   */
  public clear(): void {
    if (!this.canvas || !this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw face landmarks
   * @param landmarks - Array of landmark points
   */
  public drawLandmarks(landmarks: Point2D[]): void {
    if (!this.context || !this.config.showLandmarks) {
      return;
    }

    this.clear();

    // Draw all face mesh points (like legacy version)
    // Use cyan color (#32EEDB) to match legacy
    this.context.fillStyle = this.config.landmarkColor || '#32EEDB';
    this.context.strokeStyle = this.config.landmarkColor || '#32EEDB';
    this.context.lineWidth = 0.5;
    
    for (const point of landmarks) {
      this.context.beginPath();
      this.context.arc(point.x, point.y, this.config.landmarkRadius, 0, 2 * Math.PI);
      this.context.closePath();
      this.context.fill();
    }
  }

  /**
   * Draw eye regions
   * @param leftEye - Left eye bounding box (optional)
   * @param rightEye - Right eye bounding box (optional)
   */
  public drawEyeRegions(leftEye?: Rectangle, rightEye?: Rectangle): void {
    if (!this.context || !this.config.showEyeRegions) {
      return;
    }

    this.context.strokeStyle = this.config.eyeRegionColor;
    this.context.lineWidth = this.config.eyeRegionLineWidth;

    if (leftEye) {
      this.drawRectangle(leftEye);
    }

    if (rightEye) {
      this.drawRectangle(rightEye);
    }
  }

  /**
   * Draw face bounding box
   * @param faceBox - Face bounding box
   */
  public drawFaceBox(faceBox: Rectangle): void {
    if (!this.context || !this.config.showFaceBox) {
      return;
    }

    this.context.strokeStyle = this.config.faceBoxColor;
    this.context.lineWidth = this.config.faceBoxLineWidth;
    this.drawRectangle(faceBox);
  }

  /**
   * Draw complete overlay with all components
   * @param landmarks - Face landmarks
   * @param leftEye - Left eye region
   * @param rightEye - Right eye region
   * @param faceBox - Face bounding box (optional)
   */
  public drawOverlay(
    landmarks: Point2D[],
    leftEye?: Rectangle,
    rightEye?: Rectangle,
    faceBox?: Rectangle
  ): void {
    this.clear();

    if (faceBox && this.config.showFaceBox) {
      this.drawFaceBox(faceBox);
    }

    if (this.config.showLandmarks) {
      this.drawLandmarks(landmarks);
    }

    if (this.config.showEyeRegions) {
      this.drawEyeRegions(leftEye, rightEye);
    }
  }

  /**
   * Draw rectangle helper
   * @param rect - Rectangle to draw
   */
  private drawRectangle(rect: Rectangle): void {
    if (!this.context) {
      return;
    }

    this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  /**
   * Get canvas element
   * @returns Canvas element or null
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Update configuration
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<OverlayRendererConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.canvas && (config.width || config.height)) {
      this.setDimensions(
        config.width ?? this.config.width,
        config.height ?? this.config.height
      );
    }
  }

  /**
   * Destroy the overlay renderer
   */
  public destroy(): void {
    if (this.canvas && this.canvas.parentNode) {
      DOMManager.removeElement(this.canvas);
    }

    this.canvas = null;
    this.context = null;
    this.isInitialized = false;
  }
}
