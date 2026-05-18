/**
 * React Package API Surface Tests
 * 
 * Verifies all expected exports are present in @webgazer-ts/react
 * so they cannot be accidentally removed without failing CI.
 */

import { describe, it, expect } from 'vitest';

// Test imports – if these fail at compile/module load, the test file fails
import * as ReactPackage from '../index';

describe('@webgazer-ts/react export surface', () => {
  // -------------------------------------------------------------------------
  // Hooks
  // -------------------------------------------------------------------------

  it('exports useWebgazer', () => {
    expect(typeof ReactPackage.useWebgazer).toBe('function');
  });

  it('exports useGazeTracking', () => {
    expect(typeof ReactPackage.useGazeTracking).toBe('function');
  });

  it('exports useCalibration', () => {
    expect(typeof ReactPackage.useCalibration).toBe('function');
  });

  it('exports useGazeElement', () => {
    expect(typeof ReactPackage.useGazeElement).toBe('function');
  });

  it('exports useGazeHeatmap', () => {
    expect(typeof ReactPackage.useGazeHeatmap).toBe('function');
  });

  it('exports useGazeRecording', () => {
    expect(typeof ReactPackage.useGazeRecording).toBe('function');
  });

  // -------------------------------------------------------------------------
  // Components
  // -------------------------------------------------------------------------

  it('exports WebgazerProvider', () => {
    expect(typeof ReactPackage.WebgazerProvider).toBe('function');
  });

  it('exports CalibrationScreen', () => {
    expect(typeof ReactPackage.CalibrationScreen).toBe('function');
  });

  it('exports GazeElement', () => {
    expect(typeof ReactPackage.GazeElement).toBe('function');
  });

  it('exports HeatmapOverlay', () => {
    expect(typeof ReactPackage.HeatmapOverlay).toBe('function');
  });

  // -------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------

  it('exports useWebgazerContext', () => {
    expect(typeof ReactPackage.useWebgazerContext).toBe('function');
  });
});
