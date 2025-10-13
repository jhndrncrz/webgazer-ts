/**
 * WebGazerProvider Component
 * Provides WebGazer context to child components
 */

import React from 'react';
import { WebGazerContext } from '../context/WebGazerContext';
import { useWebGazer } from '../hooks/useWebGazer';
import type { UseWebGazerOptions } from '../types';

export interface WebGazerProviderProps extends UseWebGazerOptions {
  children: React.ReactNode;
}

export function WebGazerProvider({ children, ...options }: WebGazerProviderProps) {
  const webgazer = useWebGazer(options);

  const contextValue = {
    gazeData: webgazer.gazeData,
    isRunning: webgazer.isRunning,
    calibrationCount: webgazer.calibrationCount,
    isInitialized: true,
  };

  return (
    <WebGazerContext.Provider value={contextValue}>
      {children}
    </WebGazerContext.Provider>
  );
}
