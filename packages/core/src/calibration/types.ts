/**
 * Type definitions for calibration system
 */

import type { Point2D } from '../types/geometry';
import type { EyeFeatures } from '../types/prediction';

/**
 * Calibration state
 */
export enum CalibrationState {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Completed = 'completed',
  Failed = 'failed',
}

/**
 * Calibration point configuration
 */
export interface CalibrationPointConfig {
  x: number;
  y: number;
  duration: number;
  clickRequired: boolean;
}

/**
 * Calibration configuration
 */
export interface CalibrationConfiguration {
  pointCount: number;
  pointDuration: number;
  pointSize: number;
  pointColor: string;
  requireClick: boolean;
  showProgress: boolean;
  autoAdvance: boolean;
}

/**
 * Calibration point data
 */
export interface CalibrationPointData {
  screenPosition: Point2D;
  eyeFeatures: EyeFeatures;
  timestamp: number;
}

/**
 * Calibration result
 */
export interface CalibrationResult {
  success: boolean;
  pointsCollected: number;
  averageAccuracy?: number;
  message: string;
}

/**
 * Calibration progress
 */
export interface CalibrationProgress {
  currentPoint: number;
  totalPoints: number;
  percentage: number;
  state: CalibrationState;
}

/**
 * Validation box configuration
 */
export interface ValidationBoxConfiguration {
  containerId: string;
  boxId: string;
  ratio: number;
  colors: {
    valid: string;
    invalid: string;
    warning: string;
  };
  showInstructions: boolean;
  instructionText: string;
}

/**
 * Face validation status
 */
export interface FaceValidationStatus {
  isValid: boolean;
  isCentered: boolean;
  isCorrectDistance: boolean;
  message: string;
}

/**
 * Calibration event types
 */
export enum CalibrationEventType {
  Started = 'calibration_started',
  PointStarted = 'calibration_point_started',
  PointCompleted = 'calibration_point_completed',
  Completed = 'calibration_completed',
  Failed = 'calibration_failed',
  Cancelled = 'calibration_cancelled',
}

/**
 * Calibration event data
 */
export interface CalibrationEventData {
  type: CalibrationEventType;
  progress?: CalibrationProgress;
  result?: CalibrationResult;
  error?: string;
}

/**
 * Calibration callback type
 */
export type CalibrationCallback = (data: CalibrationEventData) => void;
