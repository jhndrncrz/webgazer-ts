/**
 * Regressor module exports
 * Provides gaze prediction regression implementations
 */

export { Regressor } from './base/Regressor';
export type {
  RegressorState,
  RegressorConfiguration,
  RegressorData,
  RegressorMetrics,
  TrainingDataPoint,
} from './base/types';
export { RidgeRegressor } from './RidgeRegressor';
export { RidgeWeightedRegressor } from './RidgeWeightedRegressor';
export { RidgeThreadedRegressor } from './RidgeThreadedRegressor';
