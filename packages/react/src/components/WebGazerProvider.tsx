/**
 * WebgazerProvider Component
 * Provides Webgazer context to child components
 */

import React from 'react';
import { WebgazerContext } from '../context/WebgazerContext';
import { useWebgazer } from '../hooks/useWebgazer';
import type { UseWebgazerOptions } from '../types';

export interface WebgazerProviderProps extends UseWebgazerOptions {
  children: React.ReactNode;
}

export function WebgazerProvider({ children, ...options }: WebgazerProviderProps) {
  const webgazer = useWebgazer(options);

  const contextValue = {
    gazeData: webgazer.gazeData,
    isRunning: webgazer.isRunning,
    calibrationCount: webgazer.calibrationCount,
    isInitialized: true,
  };

  return (
    <WebgazerContext.Provider value={contextValue}>
      {children}
    </WebgazerContext.Provider>
  );
}
