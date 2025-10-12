/**
 * Core type definitions and interfaces for WebGazer
 * Defines the main contracts for trackers, regressors, and configuration
 */

import type { EyeFeatures, EyePatch, GazePrediction, Point2D } from '../types/index';

/**
 * Abstract interface for eye/face tracking implementations
 */
export interface ITracker {
  /**
   * Initialize the tracker with any necessary setup
   */
  initialize(): Promise<void>;

  /**
   * Extract eye patches from video frame
   * @param video - Video element or canvas containing the frame
   * @param canvas - Canvas for rendering/processing
   * @param width - Canvas width
   * @param height - Canvas height
   * @returns Eye features or null if no face detected
   */
  getEyePatches(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ): Promise<EyeFeatures | null>;

  /**
   * Draw face tracking overlay for debugging
   * @param context - Canvas 2D context
   * @param positions - Face landmark positions
   */
  drawOverlay(
    context: CanvasRenderingContext2D,
    positions: unknown
  ): void;

  /**
   * Get current face landmark positions
   * @returns Current positions or null if no face detected
   */
  getPositions(): number[][] | null;

  /**
   * Reset tracker state
   */
  reset(): void;

  /**
   * Tracker name identifier
   */
  readonly name: string;
}

/**
 * Abstract interface for gaze prediction regression implementations
 */
export interface IRegressor {
  /**
   * Initialize the regressor
   */
  initialize(): void;

  /**
   * Add training data point
   * @param eyeFeatures - Eye features from tracker
   * @param screenPosition - Screen coordinates where user looked
   * @param eventType - Type of event (click or move)
   */
  addData(
    eyeFeatures: EyeFeatures,
    screenPosition: [number, number],
    eventType: 'click' | 'move'
  ): void;

  /**
   * Predict gaze location from eye features
   * @param eyeFeatures - Current eye features
   * @returns Predicted gaze point or null if unable to predict
   */
  predict(eyeFeatures: EyeFeatures): GazePrediction | null;

  /**
   * Set bulk training data
   * @param data - Previously saved training data
   */
  setData(data: unknown): void;

  /**
   * Get current training data
   * @returns Training data for persistence
   */
  getData(): unknown;

  /**
   * Update regressor configuration
   * @param config - Partial configuration to update
   */
  updateConfiguration(config: Record<string, unknown>): void;

  /**
   * Regressor name identifier
   */
  readonly name: string;
}

/**
 * Interface for rendering components
 */
export interface IRenderer {
  /**
   * Show or hide the rendered component
   * @param visible - Whether to show the component
   */
  setVisible(visible: boolean): void;

  /**
   * Update the rendered component
   */
  update(): void;

  /**
   * Clean up and remove the component
   */
  destroy(): void;
}

/**
 * Interface for filtering/smoothing algorithms
 */
export interface IFilter<T> {
  /**
   * Update filter with new observation
   * @param observation - New data point
   * @returns Filtered result
   */
  update(observation: T): T;

  /**
   * Reset filter state
   */
  reset(): void;
}

/**
 * Interface for data storage providers
 */
export interface IStorageProvider {
  /**
   * Save data to storage
   * @param key - Storage key
   * @param value - Data to store
   */
  save<T>(key: string, value: T): Promise<void>;

  /**
   * Load data from storage
   * @param key - Storage key
   * @returns Stored data or null if not found
   */
  load<T>(key: string): Promise<T | null>;

  /**
   * Check if key exists
   * @param key - Storage key
   */
  exists(key: string): Promise<boolean>;

  /**
   * Clear all data
   */
  clear(): Promise<void>;

  /**
   * Remove specific key
   * @param key - Storage key
   */
  remove(key: string): Promise<void>;
}

/**
 * Configuration interface for WebGazer
 */
export interface IWebGazerConfig {
  // Video settings
  videoContainerId: string;
  videoElementId: string;
  videoElementCanvasId: string;
  faceOverlayId: string;
  faceFeedbackBoxId: string;
  gazeDotId: string;
  videoViewerWidth: number;
  videoViewerHeight: number;
  
  // Display settings
  showVideo: boolean;
  showFaceOverlay: boolean;
  showFaceFeedbackBox: boolean;
  showGazeDot: boolean;
  showVideoPreview: boolean;
  mirrorVideo: boolean;
  
  // Calibration settings
  storingPoints: boolean;
  
  // Camera settings
  camConstraints: MediaStreamConstraints;
  
  // Filtering settings
  applyKalmanFilter: boolean;
  
  // Data persistence
  saveDataAcrossSessions: boolean;
  
  // Face validation
  faceFeedbackBoxRatio: number;
  
  // Mouse tracking
  moveTickSize: number;
  
  /**
   * Validate configuration values
   * @returns true if valid, throws error otherwise
   */
  validate(): boolean;
  
  /**
   * Reset to default values
   */
  reset(): void;
  
  /**
   * Serialize to JSON
   */
  toJSON(): Record<string, unknown>;
  
  /**
   * Deserialize from JSON
   */
  fromJSON(json: Record<string, unknown>): void;
}

/**
 * Callback type for gaze predictions
 */
export type GazeCallback = (
  data: GazePrediction | null,
  elapsedTime: number
) => void;

/**
 * Constructor type for tracker classes
 */
export type TrackerConstructor = new () => ITracker;

/**
 * Constructor type for regressor classes
 */
export type RegressorConstructor = new () => IRegressor;

/**
 * Event types for calibration
 */
export type EventType = 'click' | 'move';

/**
 * Lifecycle state of WebGazer
 */
export enum WebGazerState {
  NotInitialized = 'NOT_INITIALIZED',
  Initializing = 'INITIALIZING',
  Ready = 'READY',
  Running = 'RUNNING',
  Paused = 'PAUSED',
  Stopped = 'STOPPED',
  Error = 'ERROR',
}
