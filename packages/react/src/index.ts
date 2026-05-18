/**
 * @webgazer-ts/react
 * React hooks and components for Webgazer.ts eye tracking
 */

// Hooks
export { 
  useWebgazer, 
  useGazeTracking,
  useCalibration,
  useGazeElement,
  useGazeHeatmap,
  useGazeRecording,
} from './hooks';

// Components
export { 
  WebgazerProvider,
  CalibrationScreen,
  GazeElement,
  HeatmapOverlay,
} from './components';

export type { 
  WebgazerProviderProps,
  CalibrationScreenProps,
  GazeElementProps,
  HeatmapOverlayProps,
} from './components';

// Context
export { useWebgazerContext } from './context/WebgazerContext';

// Types
export type {
  GazePrediction,
  WebgazerConfig,
  UseWebgazerOptions,
  UseWebgazerReturn,
  UseCalibrationOptions,
  CalibrationResult,
  CalibrationPoint,
  UseCalibrationReturn,
  UseGazeTrackingOptions,
  UseGazeElementOptions,
  UseGazeElementReturn,
} from './types';

// Hook-specific types
export type {
  HeatmapPoint,
  UseGazeHeatmapOptions,
  UseGazeHeatmapReturn,
  GazeRecordingEntry,
  UseGazeRecordingReturn,
  UseGazeTrackingReturn,
} from './hooks';
