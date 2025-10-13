/**
 * @webgazer-ts/react
 * React hooks and components for WebGazer.ts eye tracking
 */

// Hooks
export { useWebGazer, useGazeTracking } from './hooks';

// Components
export { WebGazerProvider } from './components';
export type { WebGazerProviderProps } from './components';

// Context
export { useWebGazerContext } from './context/WebGazerContext';

// Types
export type {
  GazePrediction,
  WebGazerConfig,
  UseWebGazerOptions,
  UseWebGazerReturn,
  UseCalibrationOptions,
  CalibrationResult,
  CalibrationPoint,
  UseCalibrationReturn,
  UseGazeTrackingOptions,
  UseGazeElementOptions,
  UseGazeElementReturn,
} from './types';
