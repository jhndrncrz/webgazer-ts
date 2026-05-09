/**
 * Webgazer React Context
 * Provides Webgazer instance and state across the component tree
 */

import { createContext, useContext } from 'react';
import type { UseWebgazerReturn } from '../types';

export interface WebgazerContextValue extends UseWebgazerReturn {
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
