/**
 * Type definitions for tracker system
 */

import type { EyeFeatures, EyePatch } from '../../types/index';

/**
 * Tracker initialization options
 */
export interface TrackerInitializationOptions {
  videoElement: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  faceOverlay?: HTMLCanvasElement;
}

/**
 * Tracker state
 */
export enum TrackerState {
  NotInitialized = 'not_initialized',
  Initializing = 'initializing',
  Ready = 'ready',
  Tracking = 'tracking',
  Error = 'error',
}

/**
 * Tracker performance metrics
 */
export interface TrackerMetrics {
  faceDetectionTime: number;
  eyeExtractionTime: number;
  totalProcessingTime: number;
  framesProcessed: number;
  averageFrameTime: number;
}

/**
 * Tracker configuration
 */
export interface TrackerConfiguration {
  enableOverlay: boolean;
  overlayColor: string;
  overlayLineWidth: number;
  extractEyePatches: boolean;
  trackingQuality: 'low' | 'medium' | 'high';
}
