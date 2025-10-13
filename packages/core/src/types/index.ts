/**
 * Central export point for all Webgazer type definitions
 */

// Geometry types
export type {
  Point2D,
  Rectangle,
  Size,
  Bounds,
  BoundingBox,
} from './geometry';

// Prediction types
export type {
  GazePrediction,
  EyeFeatures,
  EyePatch,
  TrackingData,
  EyeData,
  CalibrationPoint,
  RegressionData,
} from './prediction';

// External library types are declared globally in external.ts
export type {} from './external';
