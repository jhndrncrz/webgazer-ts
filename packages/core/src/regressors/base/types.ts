/**
 * Type definitions for regressor system
 */

import type { EyeFeatures } from '../../types/index';

/**
 * Regressor state
 */
export enum RegressorState {
  NotInitialized = 'not_initialized',
  Ready = 'ready',
  Training = 'training',
  Error = 'error',
}

/**
 * Training data point
 */
export interface TrainingDataPoint {
  eyeFeatures: number[];
  screenX: number;
  screenY: number;
  timestamp: number;
  eventType: 'click' | 'move';
}

/**
 * Regressor configuration
 */
export interface RegressorConfiguration {
  ridgeParameter: number;
  dataWindowSize: number;
  trailDataWindowSize: number;
  trailTimeWindow: number;
  useKalmanFilter: boolean;
}

/**
 * Regressor training data storage
 */
export interface RegressorData {
  dataClicks: TrainingDataPoint[];
  dataTrail: TrainingDataPoint[];
}

/**
 * Regressor performance metrics
 */
export interface RegressorMetrics {
  totalPredictions: number;
  averagePredictionTime: number;
  lastPredictionTime: number;
  totalTrainingPoints: number;
  clickPoints: number;
  movePoints: number;
}
