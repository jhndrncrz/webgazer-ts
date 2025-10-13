/**
 * Prediction-related type definitions for Webgazer
 * Defines types for gaze predictions, eye features, and tracking data
 */

import { Point2D, Rectangle } from './geometry';

/**
 * Represents a gaze prediction result
 */
export interface GazePrediction {
  /** X coordinate of predicted gaze point */
  x: number;
  /** Y coordinate of predicted gaze point */
  y: number;
  /** Eye features used for this prediction */
  eyeFeatures?: EyeFeatures;
  /** All predictions from multiple regressors (if applicable) */
  all?: GazePrediction[];
}

/**
 * Represents extracted eye features from both eyes
 */
export interface EyeFeatures {
  left: EyePatch;
  right: EyePatch;
}

/**
 * Represents a single eye patch with image data and metadata
 */
export interface EyePatch {
  /** X position in source image */
  imageX: number;
  /** Y position in source image */
  imageY: number;
  /** Width of eye patch */
  width: number;
  /** Height of eye patch */
  height: number;
  /** Patch image data as ImageData */
  patch: ImageData;
}

/**
 * Represents tracking data for a single frame
 */
export interface TrackingData {
  /** Timestamp of the tracking data */
  timestamp: number;
  /** Eye features extracted from the frame */
  eyeFeatures: EyeFeatures | null;
  /** Face detection confidence (0-1) */
  confidence?: number;
}

/**
 * Represents processed eye data used for regression
 */
export interface EyeData {
  /** Flattened feature vector from eye patches */
  features: number[];
  /** Source eye features */
  eyeFeatures: EyeFeatures;
}

/**
 * Represents a calibration data point
 */
export interface CalibrationPoint {
  /** Screen position where user looked */
  screenPosition: Point2D;
  /** Eye features at that moment */
  eyeFeatures: EyeFeatures;
  /** Event type that triggered this point */
  eventType: 'click' | 'move';
  /** Timestamp */
  timestamp: number;
}

/**
 * Represents stored regression data
 */
export interface RegressionData {
  /** Array of screen X positions */
  screenXArray: number[][];
  /** Array of screen Y positions */
  screenYArray: number[][];
  /** Array of eye feature vectors */
  eyeFeatures: number[][];
  /** Calibration points */
  calibrationPoints: CalibrationPoint[];
}
