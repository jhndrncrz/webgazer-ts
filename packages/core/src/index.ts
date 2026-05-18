/**
 * Webgazer - Eye Tracking Library
 * Main Entry Point
 * 
 * This is the public API entry point that:
 * 1. Registers default tracker and regressor modules
 * 2. Sets up default configuration
 * 3. Exports the singleton Webgazer instance
 * 4. Exports public types for TypeScript users
 * 
 * @module webgazer
 */

import { Webgazer } from './core/Webgazer';
import { TensorFlowFaceMeshTracker } from './trackers/TensorFlowFaceMeshTracker';
import { RidgeRegressor } from './regressors/RidgeRegressor';
import { RidgeWeightedRegressor } from './regressors/RidgeWeightedRegressor';
import { RidgeThreadedRegressor } from './regressors/RidgeThreadedRegressor';

// ============================================================================
// Module Registration
// ============================================================================

/**
 * Register the TensorFlow FaceMesh tracker as the default face tracker.
 * This tracker uses TensorFlow.js and the MediaPipe FaceMesh model to detect
 * facial landmarks and extract eye features.
 */
Webgazer.addTrackerModule('TFFacemesh', TensorFlowFaceMeshTracker);
Webgazer.addTrackerModule('TFFaceMesh', TensorFlowFaceMeshTracker);

/**
 * Register the Ridge Regression regressor (basic implementation).
 * This regressor uses standard ridge regression for gaze prediction.
 */
Webgazer.addRegressionModule('ridge', RidgeRegressor);

/**
 * Register the Weighted Ridge Regression regressor.
 * This regressor uses time-weighted ridge regression, giving more weight
 * to recent calibration data.
 */
Webgazer.addRegressionModule('weightedRidge', RidgeWeightedRegressor);
Webgazer.addRegressionModule('ridgeWeighted', RidgeWeightedRegressor);

/**
 * Register the Threaded Ridge Regression regressor.
 * This regressor uses Web Workers for computation when available,
 * with automatic fallback to synchronous computation.
 */
Webgazer.addRegressionModule('threadedRidge', RidgeThreadedRegressor);
Webgazer.addRegressionModule('ridgeThreaded', RidgeThreadedRegressor);

// ============================================================================
// Get Singleton Instance
// ============================================================================

/**
 * Get the singleton Webgazer instance.
 * All interactions with Webgazer should go through this instance.
 */
const webgazer = Webgazer.getInstance();

// ============================================================================
// Set Default Configuration
// ============================================================================

/**
 * Set the default tracker to TensorFlow FaceMesh.
 * This is the most accurate and reliable tracker available.
 */
webgazer.setTracker('TFFacemesh');

/**
 * Set the default regressor to standard Ridge Regression.
 * Users can switch to 'weightedRidge' or 'threadedRidge' for different behaviors.
 */
webgazer.setRegression('ridge');

// ============================================================================
// Exports
// ============================================================================

/**
 * Export the Webgazer singleton as the default export.
 * This allows users to import Webgazer like:
 * 
 * @example
 * ```typescript
 * import webgazer from 'webgazer';
 * 
 * await webgazer.begin();
 * webgazer.setGazeListener((data, elapsedTime) => {
 *   if (data) {
 *     console.log(`Gaze at (${data.x}, ${data.y})`);
 *   }
 * });
 * ```
 */
export default webgazer;

/**
 * Also export as a named export for flexibility.
 */
export { webgazer };

// ============================================================================
// Type Exports for TypeScript Users
// ============================================================================

/**
 * Export core types for TypeScript users.
 * These types allow users to properly type their code when using Webgazer.
 */

// Geometry types
export type { Point2D, Rectangle, Size, Bounds, BoundingBox } from './types/geometry';

// Gaze prediction and tracking types
export type {
  GazePrediction,
  EyeFeatures,
  EyePatch,
  TrackingData,
  EyeData,
  RegressionData,
} from './types/prediction';

// Core interfaces
export type { ITracker, IRegressor } from './core/types';

// Calibration types
export type {
  CalibrationPointData,
  CalibrationResult,
  CalibrationProgress,
  CalibrationConfiguration,
  CalibrationEventData,
  CalibrationCallback,
  FaceValidationStatus,
  ValidationBoxConfiguration,
} from './calibration/types';

export { CalibrationState, CalibrationEventType } from './calibration/types';

// Event types
export type {
  MouseEventData,
  GazePredictionEventData,
  ErrorEventData,
  WebgazerEventData,
  EventListener,
  MouseEventHandlerConfig,
  EventManagerConfig,
} from './events/types';

export { EventType } from './events/types';

/**
 * Export Webgazer class type and related types
 */
export type { Webgazer } from './core/Webgazer';
export type { GazeCallback } from './core/Webgazer';

/**
 * Export WebgazerConfig type for configuration management.
 */
export type { WebgazerConfig } from './core/WebgazerConfig';

/**
 * Export WebgazerState enum for state management.
 */
export { WebgazerState } from './core/Webgazer';

/**
 * Export utility classes that users might need.
 */
export { KalmanFilter } from './utils/filters/KalmanFilter';
export { KalmanFilter4D } from './utils/filters/KalmanFilter4D';
export { Matrix } from './utils/math/Matrix';

/**
 * Export filter types
 */
export type { 
  KalmanFilterConfig, 
  KalmanFilter4DConfig, 
  KalmanFilter4DState 
} from './utils/filters/types';

// ============================================================================
// Browser Compatibility Check (on-demand only)
// ============================================================================
// Automatic check is intentionally NOT run at import time to avoid:
//  - Noise in SSR / Node.js environments
//  - Console output in test environments
//  - Unexpected side-effects when the library is imported
//
// Users can manually check compatibility by calling:
//   webgazer.detectCompatibility()
//   webgazer.getCompatibilityWarnings()
