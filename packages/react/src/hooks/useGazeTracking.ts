/**
 * useGazeTracking Hook
 * Simplified hook that just returns the current gaze data
 * Can be used within a WebgazerProvider
 */

import { useWebgazerContext } from '../context/WebgazerContext';
import type { GazePrediction } from '../types';

export function useGazeTracking(): GazePrediction | null {
  const { gazeData } = useWebgazerContext();
  return gazeData;
}
