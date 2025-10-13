/**
 * Type definitions for event system
 */

import type { Point2D } from '../types/geometry';
import type { GazePrediction } from '../types/prediction';

/**
 * Event type enumeration
 */
export enum EventType {
  Click = 'click',
  Move = 'mousemove',
  GazePrediction = 'gaze_prediction',
  TrackerReady = 'tracker_ready',
  RegressorReady = 'regressor_ready',
  CalibrationStart = 'calibration_start',
  CalibrationComplete = 'calibration_complete',
  Error = 'error',
}

/**
 * Mouse event data
 */
export interface MouseEventData {
  position: Point2D;
  timestamp: number;
  eventType: 'click' | 'move';
  target: EventTarget | null;
}

/**
 * Gaze prediction event data
 */
export interface GazePredictionEventData {
  prediction: GazePrediction;
  timestamp: number;
}

/**
 * Error event data
 */
export interface ErrorEventData {
  error: Error;
  context: string;
  timestamp: number;
}

/**
 * Generic event data
 */
export type WebgazerEventData =
  | MouseEventData
  | GazePredictionEventData
  | ErrorEventData
  | Record<string, unknown>;

/**
 * Event listener callback
 */
export type EventListener<T = WebgazerEventData> = (data: T) => void;

/**
 * Mouse event handler configuration
 */
export interface MouseEventHandlerConfig {
  captureClicks: boolean;
  captureMoves: boolean;
  moveThrottle: number; // milliseconds
  ignoredSelectors: string[];
}

/**
 * Event manager configuration
 */
export interface EventManagerConfig {
  enableEventCapture: boolean;
  enableGazePrediction: boolean;
}
