/**
 * Video Renderer
 * Manages video element display and stream handling
 */

import type { IRenderer } from '../core/types';
import type { VideoRendererConfig } from './types';
import { DOMManager } from '../utils/browser/DOMManager';

/**
 * VideoRenderer class
 * Handles video element creation, display, and stream management
 */
export class VideoRenderer implements IRenderer {
  private config: VideoRendererConfig;
  private container: HTMLElement | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;

  /**
   * Create a new VideoRenderer
   * @param config - Video renderer configuration
   */
  constructor(config: VideoRendererConfig) {
    this.config = { ...config };
  }

  /**
   * Initialize the video renderer
   * Creates DOM elements and sets up video display
   */
  public initialize(): void {
    // Create container
    this.container = DOMManager.createElement('div', {
      id: this.config.containerId,
      styles: {
        position: 'fixed',
        zIndex: '100000',
      },
    });

    // Create video element
    this.videoElement = DOMManager.createVideoElement({
      id: this.config.videoElementId,
      autoplay: true,
      muted: true,
      playsInline: true,
      styles: {
        display: this.config.visible ? 'block' : 'none',
        position: 'absolute',
        transform: this.config.mirror ? 'scaleX(-1)' : 'none',
      },
    });

    // Create canvas for processing
    this.canvas = DOMManager.createCanvas(this.config.width, this.config.height, {
      id: this.config.canvasId,
      styles: {
        display: 'none',
      },
    });

    // Append to container
    this.container.appendChild(this.videoElement);
    this.container.appendChild(this.canvas);
    DOMManager.appendToBody(this.container);
  }

  /**
   * Set video stream
   * @param stream - MediaStream to display
   */
  public setStream(stream: MediaStream): void {
    if (!this.videoElement) {
      throw new Error('Video element not initialized');
    }

    this.stream = stream;
    this.videoElement.srcObject = stream;
  }

  /**
   * Get video element
   * @returns Video element or null
   */
  public getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  /**
   * Get canvas element
   * @returns Canvas element or null
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Set video dimensions
   * @param width - Video width
   * @param height - Video height
   */
  public setDimensions(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;

    if (this.videoElement) {
      DOMManager.setDimensions(this.videoElement, {
        width: `${width}px`,
        height: `${height}px`,
      });
    }

    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  /**
   * Set mirror effect
   * @param mirror - Whether to mirror the video
   */
  public setMirror(mirror: boolean): void {
    this.config.mirror = mirror;

    if (this.videoElement) {
      DOMManager.applyStyles(this.videoElement, {
        transform: mirror ? 'scaleX(-1)' : 'none',
      });
    }
  }

  /**
   * Show or hide the video element
   * @param visible - Whether to show the video
   */
  public setVisible(visible: boolean): void {
    this.config.visible = visible;

    if (this.videoElement) {
      DOMManager.setVisible(this.videoElement, visible);
    }
  }

  /**
   * Update video display
   * Captures current frame to canvas
   */
  public update(): void {
    if (!this.videoElement || !this.canvas) {
      return;
    }

    // Check if video is ready
    if (
      this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA &&
      this.videoElement.videoWidth > 0
    ) {
      const context = DOMManager.getCanvas2DContext(this.canvas);
      if (context) {
        context.drawImage(
          this.videoElement,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }
    }
  }

  /**
   * Get current video frame as ImageData
   * @returns ImageData or null if not available
   */
  public getCurrentFrame(): ImageData | null {
    if (!this.canvas) {
      return null;
    }

    const context = DOMManager.getCanvas2DContext(this.canvas);
    if (!context) {
      return null;
    }

    try {
      return context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    } catch (error) {
      console.error('Failed to get current frame:', error);
      return null;
    }
  }

  /**
   * Get video resolution ratio
   * @returns [widthRatio, heightRatio] or null if not available
   */
  public getResolutionRatio(): [number, number] | null {
    if (!this.videoElement) {
      return null;
    }

    const videoWidth = this.videoElement.videoWidth;
    const videoHeight = this.videoElement.videoHeight;
    const displayWidth = this.config.width;
    const displayHeight = this.config.height;

    if (videoWidth === 0 || videoHeight === 0) {
      return null;
    }

    return [displayWidth / videoWidth, displayHeight / videoHeight];
  }

  /**
   * Check if video is playing
   * @returns True if video is playing
   */
  public isPlaying(): boolean {
    if (!this.videoElement) {
      return false;
    }

    return (
      !this.videoElement.paused &&
      !this.videoElement.ended &&
      this.videoElement.readyState > 2
    );
  }

  /**
   * Stop video stream
   */
  public stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  /**
   * Clean up and remove the video renderer
   */
  public destroy(): void {
    this.stop();

    if (this.container) {
      DOMManager.removeElement(this.container);
      this.container = null;
    }

    this.videoElement = null;
    this.canvas = null;
  }
}
