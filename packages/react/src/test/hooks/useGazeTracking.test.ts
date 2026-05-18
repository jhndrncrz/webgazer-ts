import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGazeTracking } from '../../hooks/useGazeTracking';

const mockStart = vi.fn().mockResolvedValue(undefined);
const mockStop = vi.fn().mockResolvedValue(undefined);

vi.mock('../../context/WebgazerContext', () => ({
  useWebgazerContext: vi.fn(() => ({
    gazeData: { x: 100, y: 200 },
    isRunning: true,
    calibrationCount: 5,
    start: mockStart,
    stop: mockStop,
  }))
}));

import { useWebgazerContext } from '../../context/WebgazerContext';

describe('useGazeTracking hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns gaze data with x/y convenience properties', () => {
    const { result } = renderHook(() => useGazeTracking());
    expect(result.current.x).toBe(100);
    expect(result.current.y).toBe(200);
    expect(result.current.gazeData).toEqual({ x: 100, y: 200 });
  });

  it('hasGazeData is true when gazeData is present', () => {
    const { result } = renderHook(() => useGazeTracking());
    expect(result.current.hasGazeData).toBe(true);
  });

  it('isTracking reflects isRunning from context', () => {
    const { result } = renderHook(() => useGazeTracking());
    expect(result.current.isTracking).toBe(true);
  });

  it('start() delegates to context start', async () => {
    const { result } = renderHook(() => useGazeTracking());
    await result.current.start();
    expect(mockStart).toHaveBeenCalled();
  });

  it('stop() delegates to context stop', async () => {
    const { result } = renderHook(() => useGazeTracking());
    await result.current.stop();
    expect(mockStop).toHaveBeenCalled();
  });

  it('x and y are null when gazeData is null', () => {
    vi.mocked(useWebgazerContext).mockReturnValueOnce({
      gazeData: null,
      isRunning: false,
      calibrationCount: 0,
      start: mockStart,
      stop: mockStop,
    } as any);

    const { result } = renderHook(() => useGazeTracking());
    expect(result.current.x).toBeNull();
    expect(result.current.y).toBeNull();
    expect(result.current.hasGazeData).toBe(false);
  });
});

