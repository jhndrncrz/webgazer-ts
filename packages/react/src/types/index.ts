/**
 * Types for WebGazer React integration
 */

import type { RefObject } from 'react';

export interface GazePrediction {
  x: number;
  y: number;
}

export interface WebGazerConfig {
  tracker?: 'TFFacemesh';
  regression?: 'ridge' | 'ridgeThreaded' | 'ridgeWeighted';
  saveDataAcrossSessions?: boolean;
  videoViewerWidth?: number;
  videoViewerHeight?: number;
  showVideoPreview?: boolean;
  showFaceOverlay?: boolean;
  showFaceFeedbackBox?: boolean;
  showGazeDot?: boolean;
  applyKalmanFilter?: boolean;
}

export interface UseWebGazerOptions extends WebGazerConfig {
  autoStart?: boolean;
  onGaze?: (data: GazePrediction | null, timestamp: number) => void;
}

export interface UseWebGazerReturn {
  gazeData: GazePrediction | null;
  isRunning: boolean;
  calibrationCount: number;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  clearData: () => void;
  showVideo: () => void;
  hideVideo: () => void;
}

export interface UseCalibrationOptions {
  pointCount?: number;
  pointDuration?: number;
  autoAdvance?: boolean;
  onComplete?: (result: CalibrationResult) => void;
  onPointComplete?: (index: number) => void;
}

export interface CalibrationResult {
  success: boolean;
  pointsCalibrated: number;
  accuracy?: number;
}

export interface CalibrationPoint {
  x: number;
  y: number;
  index: number;
}

export interface UseCalibrationReturn {
  isCalibrating: boolean;
  progress: number;
  currentPoint: CalibrationPoint | null;
  startCalibration: () => void;
  stopCalibration: () => void;
  nextPoint: () => void;
}

export interface UseGazeTrackingOptions {
  throttle?: number;
  filter?: boolean;
}

export interface UseGazeElementOptions {
  threshold?: number;
  minDwellTime?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onDwell?: () => void;
}

export interface UseGazeElementReturn {
  ref: RefObject<HTMLElement>;
  isLooking: boolean;
  dwellTime: number;
}
