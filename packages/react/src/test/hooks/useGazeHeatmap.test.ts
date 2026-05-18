import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGazeHeatmap } from '../../hooks/useGazeHeatmap';

// Mock useWebgazerContext
vi.mock('../../context/WebgazerContext', () => ({
  useWebgazerContext: vi.fn(() => ({
    gazeData: null,
    isRunning: false,
  }))
}));

import { useWebgazerContext } from '../../context/WebgazerContext';

describe('useGazeHeatmap hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty points array', () => {
    const { result } = renderHook(() => useGazeHeatmap());
    expect(result.current.points).toHaveLength(0);
  });

  it('clear() resets points to empty array', () => {
    vi.mocked(useWebgazerContext).mockReturnValueOnce({
      gazeData: { x: 100, y: 200 },
      isRunning: true,
    } as any);

    const { result } = renderHook(() => useGazeHeatmap());

    act(() => {
      result.current.clear();
    });

    expect(result.current.points).toHaveLength(0);
  });

  it('exportData() returns a CSV string', () => {
    const { result } = renderHook(() => useGazeHeatmap());
    const csv = result.current.exportData();
    expect(typeof csv).toBe('string');
    expect(csv).toContain('x,y,timestamp');
  });
});
