/**
 * useGazeTracking Hook
 * Simplified hook that returns the current gaze data with convenience properties.
 * Must be used inside a <WebgazerProvider>.
 */

import { useWebgazerContext } from '../context/WebgazerContext';
import type { GazePrediction } from '../types';

export interface UseGazeTrackingReturn {
  /** Current raw gaze prediction (null if no face detected) */
  gazeData: GazePrediction | null;
  /** Convenience: x coordinate of the gaze, or null */
  x: number | null;
  /** Convenience: y coordinate of the gaze, or null */
  y: number | null;
  /** Whether there is currently valid gaze data */
  hasGazeData: boolean;
  /** Whether the tracker is running */
  isTracking: boolean;
  /** Number of calibration points recorded */
  calibrationCount: number;
  /** Start eye tracking */
  start: () => Promise<void>;
  /** Stop eye tracking */
  stop: () => Promise<void>;
}

export function useGazeTracking(): UseGazeTrackingReturn {
  const { gazeData, isRunning, calibrationCount, start, stop } = useWebgazerContext();

  return {
    gazeData,
    x: gazeData?.x ?? null,
    y: gazeData?.y ?? null,
    hasGazeData: gazeData !== null,
    isTracking: isRunning,
    calibrationCount,
    start,
    stop,
  };
}
