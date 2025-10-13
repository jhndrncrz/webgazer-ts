/**
 * Types for Webgazer React integration
 */

import type { RefObject } from 'react';
import type { GazePrediction as CoreGazePrediction } from '@webgazer-ts/core';

// Re-export Webgazer core types from @webgazer-ts/core
export type { 
  Webgazer as WebgazerInstance,
  GazeCallback,
  GazePrediction 
} from '@webgazer-ts/core';

/**
 * Webgazer module type (what we get from dynamic import - no longer needed but kept for backwards compatibility)
 */
export interface WebgazerModule {
  default: import('@webgazer-ts/core').Webgazer;
  webgazer?: import('@webgazer-ts/core').Webgazer;
  [key: string]: unknown;
}

export interface WebgazerConfig {
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

export interface UseWebgazerOptions extends WebgazerConfig {
  autoStart?: boolean;
  onGaze?: (data: CoreGazePrediction | null, timestamp: number) => void;
}

export interface UseWebgazerReturn {
  // State
  gazeData: CoreGazePrediction | null;
  isRunning: boolean;
  calibrationCount: number;
  
  // Core controls
  start: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  clearData: () => void;
  
  // Video controls
  showVideo: () => void;
  hideVideo: () => void;
  
  // Configuration methods
  setTracker: (trackerName: string) => void;
  setRegression: (regressionName: string) => void;
  showFaceOverlay: (show: boolean) => void;
  showFaceFeedbackBox: (show: boolean) => void;
  showPredictionPoints: (show: boolean) => void;
  setVideoViewerSize: (width: number, height: number) => void;
  applyKalmanFilter: (apply: boolean) => void;
  
  // Calibration controls
  recordScreenPosition: (x: number, y: number, eventType?: 'click' | 'move') => void;
  addMouseEventListeners: () => void;
  removeMouseEventListeners: () => void;
  
  // Direct instance access for advanced use cases
  webgazer: WebgazerInstance | null;
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

export interface UseGazeElementReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T>;
  isLooking: boolean;
  dwellTime: number;
}
