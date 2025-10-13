/**
 * React Hooks for Webgazer
 */

export { useWebgazer } from './useWebgazer';
export { useGazeTracking } from './useGazeTracking';
export { useCalibration } from './useCalibration';
export { useGazeElement } from './useGazeElement';
export { useGazeHeatmap } from './useGazeHeatmap';
export { useGazeRecording } from './useGazeRecording';

// Re-export types
export type { 
  HeatmapPoint, 
  UseGazeHeatmapOptions, 
  UseGazeHeatmapReturn 
} from './useGazeHeatmap';

export type {
  GazeRecordingEntry,
  UseGazeRecordingReturn
} from './useGazeRecording';
