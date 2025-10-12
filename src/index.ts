/**
 * WebGazer - Eye Tracking Library
 * Main Entry Point
 * 
 * This is the public API entry point that:
 * 1. Registers default tracker and regressor modules
 * 2. Sets up default configuration
 * 3. Exports the singleton WebGazer instance
 * 4. Exports public types for TypeScript users
 * 
 * @module webgazer
 */

import { WebGazer } from './core/WebGazer';
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
WebGazer.addTrackerModule('TFFacemesh', TensorFlowFaceMeshTracker);

/**
 * Register the Ridge Regression regressor (basic implementation).
 * This regressor uses standard ridge regression for gaze prediction.
 */
WebGazer.addRegressionModule('ridge', RidgeRegressor);

/**
 * Register the Weighted Ridge Regression regressor.
 * This regressor uses time-weighted ridge regression, giving more weight
 * to recent calibration data.
 */
WebGazer.addRegressionModule('weightedRidge', RidgeWeightedRegressor);

/**
 * Register the Threaded Ridge Regression regressor.
 * This regressor uses Web Workers for computation when available,
 * with automatic fallback to synchronous computation.
 */
WebGazer.addRegressionModule('threadedRidge', RidgeThreadedRegressor);

// ============================================================================
// Get Singleton Instance
// ============================================================================

/**
 * Get the singleton WebGazer instance.
 * All interactions with WebGazer should go through this instance.
 */
const webgazer = WebGazer.getInstance();

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
 * Export the WebGazer singleton as the default export.
 * This allows users to import WebGazer like:
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
 * These types allow users to properly type their code when using WebGazer.
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
  WebGazerEventData,
  EventListener,
  MouseEventHandlerConfig,
  EventManagerConfig,
} from './events/types';

export { EventType } from './events/types';

/**
 * Export WebGazerConfig type for configuration management.
 */
export type { WebGazerConfig } from './core/WebGazerConfig';

/**
 * Export WebGazerState enum for state management.
 */
export { WebGazerState } from './core/WebGazer';

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
// Browser Compatibility Check
// ============================================================================

/**
 * Automatically check browser compatibility when the module is loaded.
 * This will log warnings to the console if any required features are missing.
 */
if (typeof window !== 'undefined') {
  // Check compatibility and log info
  const isCompatible = webgazer.detectCompatibility();
  
  if (!isCompatible) {
    console.warn('⚠️ WebGazer: Browser compatibility issues detected.');
    console.warn('Run webgazer.getCompatibilityWarnings() for details.');
  } else {
    console.log('✅ WebGazer: Browser is compatible!');
  }
  
  // Log detailed compatibility info in development mode
  // if (process.env.NODE_ENV === 'development') {
  //   webgazer.logCompatibilityInfo();
  // }
}
