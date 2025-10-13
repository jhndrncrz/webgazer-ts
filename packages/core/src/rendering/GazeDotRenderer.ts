/**
 * Gaze Dot Renderer
 * Renders the gaze prediction as a visual dot on screen
 */

import type { GazeDotRendererConfig } from './types';
import type { IRenderer } from '../core/types';
import type { Point2D } from '../types/geometry';
import { DOMManager } from '../utils/browser/DOMManager';

/**
 * GazeDotRenderer class
 * Renders gaze prediction as a dot overlay
 */
export class GazeDotRenderer implements IRenderer {
  private config: GazeDotRendererConfig;
  private dotElement: HTMLDivElement | null = null;
  private isInitialized: boolean = false;
  private currentPosition: Point2D | null = null;

  /**
   * Create a new GazeDotRenderer
   * @param config - Gaze dot renderer configuration
   */
  constructor(config: GazeDotRendererConfig) {
    this.config = { ...config };
  }

  /**
   * Initialize the gaze dot renderer
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    this.dotElement = DOMManager.createElement('div', {
      id: this.config.dotId,
      styles: {
        position: 'fixed',
        width: `${this.config.size}px`,
        height: `${this.config.size}px`,
        borderRadius: '50%',
        backgroundColor: this.config.color,
        pointerEvents: 'none',
        zIndex: '999999',
        display: this.config.visible ? 'block' : 'none',
        transform: 'translate(-50%, -50%)',
        // Remove CSS transition for better performance - Kalman filter already smooths
        willChange: 'transform',  // Hint browser for GPU acceleration
      },
    });

    DOMManager.appendToBody(this.dotElement);
    this.isInitialized = true;
  }

  /**
   * Update the gaze dot position
   */
  public update(): void {
    // Position is updated via setPosition()
  }

  /**
   * Set the gaze dot position
   * @param position - Gaze point position
   */
  public setPosition(position: Point2D): void {
    if (!this.dotElement) {
      return;
    }

    this.currentPosition = position;

    // Use transform instead of left/top for better performance (GPU accelerated)
    DOMManager.applyStyles(this.dotElement, {
      transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
    });
  }

  /**
   * Get current dot position
   * @returns Current position or null
   */
  public getPosition(): Point2D | null {
    return this.currentPosition;
  }

  /**
   * Set visibility
   * @param visible - Whether dot should be visible
   */
  public setVisible(visible: boolean): void {
    this.config.visible = visible;

    if (this.dotElement) {
      DOMManager.setVisible(this.dotElement, visible);
    }
  }

  /**
   * Set smooth animation
   * @param smooth - Whether to use smooth transitions
   */
  public setSmooth(smooth: boolean): void {
    this.config.smooth = smooth;
    // Note: Smoothing is now handled by Kalman filter for better performance
    // CSS transitions are removed to avoid double smoothing and improve responsiveness
  }

  /**
   * Set dot color
   * @param color - CSS color string
   */
  public setColor(color: string): void {
    this.config.color = color;

    if (this.dotElement) {
      DOMManager.applyStyles(this.dotElement, {
        backgroundColor: color,
      });
    }
  }

  /**
   * Set dot size
   * @param size - Dot diameter in pixels
   */
  public setSize(size: number): void {
    this.config.size = size;

    if (this.dotElement) {
      DOMManager.applyStyles(this.dotElement, {
        width: `${size}px`,
        height: `${size}px`,
      });
    }
  }

  /**
   * Update configuration
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<GazeDotRendererConfig>): void {
    this.config = { ...this.config, ...config };

    if (!this.dotElement) {
      return;
    }

    if (config.visible !== undefined) {
      this.setVisible(config.visible);
    }

    if (config.smooth !== undefined) {
      this.setSmooth(config.smooth);
    }

    if (config.color !== undefined) {
      this.setColor(config.color);
    }

    if (config.size !== undefined) {
      this.setSize(config.size);
    }
  }

  /**
   * Destroy the gaze dot renderer
   */
  public destroy(): void {
    if (this.dotElement && this.dotElement.parentNode) {
      DOMManager.removeElement(this.dotElement);
    }

    this.dotElement = null;
    this.currentPosition = null;
    this.isInitialized = false;
  }
}
