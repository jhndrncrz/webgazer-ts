/**
 * Tests for useCalibration hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalibration } from '../hooks/useCalibration';

describe('useCalibration', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCalibration());

    expect(result.current.isCalibrating).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.currentPoint).toBe(null);
  });

  it('should start calibration when startCalibration is called', () => {
    const { result } = renderHook(() => useCalibration({ pointCount: 9 }));

    act(() => {
      result.current.startCalibration();
    });

    expect(result.current.isCalibrating).toBe(true);
    expect(result.current.currentPoint).toBeTruthy();
  });

  it('should generate correct number of points', () => {
    const pointCount = 9;
    const { result } = renderHook(() => useCalibration({ pointCount }));

    act(() => {
      result.current.startCalibration();
    });

    expect(result.current.currentPoint).toBeTruthy();
    expect(result.current.currentPoint?.index).toBe(0);
  });

  it('should advance to next point', async () => {
    const { result } = renderHook(() => useCalibration({
      pointCount: 3,
      autoAdvance: false,
    }));

    act(() => {
      result.current.startCalibration();
    });

    const firstPoint = result.current.currentPoint;

    act(() => {
      result.current.nextPoint();
    });

    expect(result.current.currentPoint?.index).toBe((firstPoint?.index || 0) + 1);
  });

  it('should call onComplete when calibration finishes', async () => {
    let completed = false;
    const onComplete = () => {
      completed = true;
    };

    const { result } = renderHook(() => useCalibration({
      pointCount: 2,
      autoAdvance: false,
      onComplete,
    }));

    act(() => {
      result.current.startCalibration();
    });

    act(() => {
      result.current.nextPoint();
    });

    act(() => {
      result.current.nextPoint();
    });

    expect(completed).toBe(true);
  });

  it('should stop calibration when stopCalibration is called', () => {
    const { result } = renderHook(() => useCalibration());

    act(() => {
      result.current.startCalibration();
    });

    expect(result.current.isCalibrating).toBe(true);

    act(() => {
      result.current.stopCalibration();
    });

    expect(result.current.isCalibrating).toBe(false);
  });
});
