/**
 * Webgazer React Context
 * Provides Webgazer instance and state across the component tree
 */

import { createContext, useContext } from 'react';
import type { GazePrediction } from '../types';

export interface WebgazerContextValue {
  gazeData: GazePrediction | null;
  isRunning: boolean;
  calibrationCount: number;
  isInitialized: boolean;
}

export const WebgazerContext = createContext<WebgazerContextValue | null>(null);

export function useWebgazerContext() {
  const context = useContext(WebgazerContext);
  if (!context) {
    throw new Error('useWebgazerContext must be used within WebgazerProvider');
  }
  return context;
}
