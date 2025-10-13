/**
 * useGazeTracking Hook
 * Simplified hook that just returns the current gaze data
 * Can be used within a WebGazerProvider
 */

import { useWebGazerContext } from '../context/WebGazerContext';
import type { GazePrediction } from '../types';

export function useGazeTracking(): GazePrediction | null {
  const { gazeData } = useWebGazerContext();
  return gazeData;
}
