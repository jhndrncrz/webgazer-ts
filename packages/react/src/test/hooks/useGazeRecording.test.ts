import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGazeRecording } from '../../hooks/useGazeRecording';

// Mock useWebgazerContext
vi.mock('../../context/WebgazerContext', () => ({
  useWebgazerContext: vi.fn(() => ({
    gazeData: null,
    isRunning: false,
  }))
}));

describe('useGazeRecording hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes in stopped/not-recording state', () => {
    const { result } = renderHook(() => useGazeRecording());
    expect(result.current.isRecording).toBe(false);
    expect(result.current.data).toHaveLength(0);
  });

  it('startRecording() sets isRecording to true', () => {
    const { result } = renderHook(() => useGazeRecording());

    act(() => {
      result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);
  });

  it('stopRecording() sets isRecording to false', () => {
    const { result } = renderHook(() => useGazeRecording());

    act(() => { result.current.startRecording(); });
    act(() => { result.current.stopRecording(); });

    expect(result.current.isRecording).toBe(false);
  });

  it('clearData() empties the recorded data', () => {
    const { result } = renderHook(() => useGazeRecording());

    act(() => { result.current.startRecording(); });
    act(() => { result.current.stopRecording(); });
    act(() => { result.current.clearData(); });

    expect(result.current.data).toHaveLength(0);
  });
});

