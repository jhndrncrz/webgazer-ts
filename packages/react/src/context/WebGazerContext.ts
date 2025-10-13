/**
 * WebGazer React Context
 * Provides WebGazer instance and state across the component tree
 */

import { createContext, useContext } from 'react';
import type { GazePrediction } from '../types';

export interface WebGazerContextValue {
  gazeData: GazePrediction | null;
  isRunning: boolean;
  calibrationCount: number;
  isInitialized: boolean;
}

export const WebGazerContext = createContext<WebGazerContextValue | null>(null);

export function useWebGazerContext() {
  const context = useContext(WebGazerContext);
  if (!context) {
    throw new Error('useWebGazerContext must be used within WebGazerProvider');
  }
  return context;
}
