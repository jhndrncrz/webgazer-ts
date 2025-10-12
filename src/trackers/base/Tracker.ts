/**
 * Abstract base class for eye/face tracking
 * All tracker implementations must extend this class
 */

import type { ITracker } from '../../core/types';
import type { EyeFeatures } from '../../types/index';
import {
  TrackerState,
  type TrackerMetrics,
  type TrackerConfiguration,
} from './types';

/**
 * Abstract Tracker base class
 * Provides common functionality and enforces interface contract
 */
export abstract class Tracker implements ITracker {
  protected videoElement: HTMLVideoElement | null = null;
  protected canvas: HTMLCanvasElement | null = null;
  protected faceOverlay: HTMLCanvasElement | null = null;
  protected state: TrackerState = TrackerState.NotInitialized;
  protected configuration: TrackerConfiguration;
  protected metrics: TrackerMetrics;

  /**
   * Create a new Tracker instance
   * @param config - Optional tracker configuration
   */
  constructor(config?: Partial<TrackerConfiguration>) {
    this.configuration = {
      enableOverlay: true,
      overlayColor: '#00FF00',
      overlayLineWidth: 2,
      extractEyePatches: true,
      trackingQuality: 'medium',
      ...config,
    };

    this.metrics = {
      faceDetectionTime: 0,
      eyeExtractionTime: 0,
      totalProcessingTime: 0,
      framesProcessed: 0,
      averageFrameTime: 0,
    };
  }

  /**
   * Initialize the tracker (ITracker interface implementation)
   * Sets up the tracking model
   */
  public abstract initialize(): Promise<void>;

  /**
   * Get eye patches from video frame (ITracker interface implementation)
   * @param video - Video element containing the frame
   * @param canvas - Canvas for processing
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns Eye features with patches, or null if no face detected
   */
  public abstract getEyePatches(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): Promise<EyeFeatures | null>;

  /**
   * Draw face overlay on canvas (ITracker interface implementation)
   * @param context - Canvas 2D rendering context
   * @param positions - Face landmark positions
   */
  public abstract drawOverlay(context: CanvasRenderingContext2D, positions: number[]): void;

  /**
   * Get current face/eye positions (ITracker interface implementation)
   * @returns Array of position data or null if no face detected
   */
  public abstract getPositions(): number[][] | null;

  /**
   * Tracker name identifier (ITracker interface implementation)
   */
  public abstract readonly name: string;

  /**
   * Reset the tracker state
   */
  public reset(): void {
    this.state = TrackerState.NotInitialized;
    this.resetMetrics();
  }

  /**
   * Get current tracker state
   * @returns Current state
   */
  public getState(): TrackerState {
    return this.state;
  }

  /**
   * Check if tracker is ready
   * @returns True if ready to track
   */
  public isReady(): boolean {
    return this.state === TrackerState.Ready || this.state === TrackerState.Tracking;
  }

  /**
   * Get tracker configuration
   * @returns Current configuration
   */
  public getConfiguration(): TrackerConfiguration {
    return { ...this.configuration };
  }

  /**
   * Update tracker configuration
   * @param config - Partial configuration to update
   */
  public updateConfiguration(config: Partial<TrackerConfiguration>): void {
    this.configuration = { ...this.configuration, ...config };
  }

  /**
   * Get tracker performance metrics
   * @returns Current metrics
   */
  public getMetrics(): TrackerMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset performance metrics
   */
  protected resetMetrics(): void {
    this.metrics = {
      faceDetectionTime: 0,
      eyeExtractionTime: 0,
      totalProcessingTime: 0,
      framesProcessed: 0,
      averageFrameTime: 0,
    };
  }

  /**
   * Update metrics after processing a frame
   * @param faceDetectionTime - Time spent on face detection (ms)
   * @param eyeExtractionTime - Time spent on eye extraction (ms)
   */
  protected updateMetrics(faceDetectionTime: number, eyeExtractionTime: number): void {
    const totalTime = faceDetectionTime + eyeExtractionTime;
    this.metrics.faceDetectionTime = faceDetectionTime;
    this.metrics.eyeExtractionTime = eyeExtractionTime;
    this.metrics.totalProcessingTime = totalTime;
    this.metrics.framesProcessed++;
    
    // Calculate rolling average
    this.metrics.averageFrameTime =
      (this.metrics.averageFrameTime * (this.metrics.framesProcessed - 1) + totalTime) /
      this.metrics.framesProcessed;
  }

  /**
   * Set video and canvas elements for tracking
   * Internal method for subclasses to store element references
   * @param videoElement - Video element to track
   * @param canvas - Canvas for processing
   * @param faceOverlay - Optional overlay canvas
   */
  protected setElements(
    videoElement: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    faceOverlay?: HTMLCanvasElement
  ): void {
    this.videoElement = videoElement;
    this.canvas = canvas;
    this.faceOverlay = faceOverlay || null;
  }

  /**
   * Validate that required elements are set
   * @throws Error if elements are not initialized
   */
  protected validateElements(): void {
    if (!this.videoElement) {
      throw new Error('Video element not initialized');
    }
    if (!this.canvas) {
      throw new Error('Canvas element not initialized');
    }
  }

  /**
   * Get video element
   * @returns Video element or null
   */
  protected getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  /**
   * Get canvas element
   * @returns Canvas element or null
   */
  protected getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Get face overlay canvas
   * @returns Overlay canvas or null
   */
  protected getFaceOverlay(): HTMLCanvasElement | null {
    return this.faceOverlay;
  }

  /**
   * Check if overlay is enabled
   * @returns True if overlay should be drawn
   */
  protected isOverlayEnabled(): boolean {
    return this.configuration.enableOverlay && this.faceOverlay !== null;
  }

  /**
   * Set tracker state
   * @param state - New state
   */
  protected setState(state: TrackerState): void {
    this.state = state;
  }
}
