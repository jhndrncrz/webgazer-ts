import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { Webgazer } from '@webgazer-ts/core';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Create a properly typed mock Webgazer instance
const mockWebgazer: Partial<Webgazer> = {
  setTracker: () => mockWebgazer as Webgazer,
  setRegression: () => mockWebgazer as Webgazer,
  saveDataAcrossSessions: () => mockWebgazer as Webgazer,
  applyKalmanFilter: () => mockWebgazer as Webgazer,
  begin: () => Promise.resolve(mockWebgazer as Webgazer),
  end: () => mockWebgazer as Webgazer,
  pause: () => mockWebgazer as Webgazer,
  resume: () => Promise.resolve(mockWebgazer as Webgazer),
  clearData: () => Promise.resolve(),
  showVideoPreview: () => mockWebgazer as Webgazer,
  showVideo: () => mockWebgazer as Webgazer,
  showFaceOverlay: () => mockWebgazer as Webgazer,
  showFaceFeedbackBox: () => mockWebgazer as Webgazer,
  showPredictionPoints: () => mockWebgazer as Webgazer,
  setGazeListener: () => mockWebgazer as Webgazer,
  getStoredPoints: () => [[], []],
  getCalibrationDataCount: () => 0,
  addMouseEventListeners: () => mockWebgazer as Webgazer,
  removeMouseEventListeners: () => mockWebgazer as Webgazer,
  detectCompatibility: () => true,
  getCompatibilityWarnings: () => [],
  logCompatibilityInfo: () => {},
  getCurrentPrediction: () => Promise.resolve(null),
  isReady: () => false,
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webgazer?: Partial<Webgazer>;
  }
}

// Mock Webgazer on global window
if (typeof global !== 'undefined') {
  global.window = global.window || ({} as Window & typeof globalThis);
  global.window.webgazer = mockWebgazer;
}
