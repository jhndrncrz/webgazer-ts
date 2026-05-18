import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWebgazer } from '../../hooks/useWebgazer';

// Mock the core webgazer instance
vi.mock('@webgazer-ts/core', () => {
  const mockWebgazer = {
    setTracker: vi.fn().mockReturnThis(),
    setRegression: vi.fn().mockReturnThis(),
    saveDataAcrossSessions: vi.fn().mockReturnThis(),
    applyKalmanFilter: vi.fn().mockReturnThis(),
    setGazeListener: vi.fn().mockReturnThis(),
    clearGazeListener: vi.fn().mockReturnThis(),
    getStoredPoints: vi.fn().mockReturnValue([[], []]),
    begin: vi.fn().mockResolvedValue(undefined),
    end: vi.fn().mockReturnThis(),
    pause: vi.fn().mockReturnThis(),
    resume: vi.fn().mockResolvedValue(undefined),
    clearData: vi.fn().mockResolvedValue(undefined),
    showVideoPreview: vi.fn().mockReturnThis(),
    showFaceOverlay: vi.fn().mockReturnThis(),
    showFaceFeedbackBox: vi.fn().mockReturnThis(),
    showPredictionPoints: vi.fn().mockReturnThis(),
    setVideoViewerSize: vi.fn(),
    recordScreenPosition: vi.fn().mockReturnThis(),
    addMouseEventListeners: vi.fn().mockReturnThis(),
    removeMouseEventListeners: vi.fn().mockReturnThis(),
  };

  return { default: mockWebgazer };
});

import webgazer from '@webgazer-ts/core';

describe('useWebgazer hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('applies default configuration options on mount', async () => {
    renderHook(() => useWebgazer());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    expect(webgazer.setTracker).toHaveBeenCalledWith('TFFacemesh');
    expect(webgazer.setRegression).toHaveBeenCalledWith('ridge');
    expect(webgazer.applyKalmanFilter).toHaveBeenCalledWith(true);
    expect(webgazer.setGazeListener).toHaveBeenCalled();
  });

  it('applies custom tracker and regression options', async () => {
    renderHook(() => useWebgazer({ tracker: 'TFFacemesh', regression: 'weightedRidge' }));
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    expect(webgazer.setTracker).toHaveBeenCalledWith('TFFacemesh');
    expect(webgazer.setRegression).toHaveBeenCalledWith('weightedRidge');
  });

  it('calls begin() when autoStart is true', async () => {
    renderHook(() => useWebgazer({ autoStart: true }));
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    expect(webgazer.begin).toHaveBeenCalled();
  });

  it('does NOT call begin() when autoStart is false (default)', async () => {
    renderHook(() => useWebgazer());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    expect(webgazer.begin).not.toHaveBeenCalled();
  });

  it('start() calls begin() and sets isRunning to true', async () => {
    const { result } = renderHook(() => useWebgazer());
    await act(async () => { await result.current.start(); });

    expect(webgazer.begin).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(true);
  });

  it('stop() calls end() and sets isRunning to false', async () => {
    const { result } = renderHook(() => useWebgazer());
    await act(async () => { await result.current.start(); });
    await act(async () => { await result.current.stop(); });

    expect(webgazer.end).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
  });

  it('pause() calls pause() on webgazer', async () => {
    const { result } = renderHook(() => useWebgazer());
    await act(async () => { await result.current.start(); });
    await act(async () => { await result.current.pause(); });

    expect(webgazer.pause).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
  });

  it('resume() calls resume() on webgazer', async () => {
    const { result } = renderHook(() => useWebgazer());
    await act(async () => { await result.current.start(); });
    await act(async () => { await result.current.pause(); });
    await act(async () => { await result.current.resume(); });

    expect(webgazer.resume).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(true);
  });

  it('always calls clearGazeListener on unmount regardless of started state', () => {
    const { unmount } = renderHook(() => useWebgazer());
    unmount();
    expect(webgazer.clearGazeListener).toHaveBeenCalled();
  });

  it('does NOT call end() on unmount if begin() was never called', () => {
    const { unmount } = renderHook(() => useWebgazer());
    unmount();
    // begin() was not called, so end() should NOT be called
    expect(webgazer.end).not.toHaveBeenCalled();
  });

  it('race condition: unmount during begin() calls clearGazeListener and end()', async () => {
    // Make begin() pause to simulate slow init
    let resolveBegin!: (value?: unknown) => void;
    (webgazer.begin as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => new Promise(r => { resolveBegin = r; })
    );

    const { unmount } = renderHook(() => useWebgazer({ autoStart: true }));
    // Unmount while begin() is still pending
    unmount();
    // Now resolve begin()
    await act(async () => { resolveBegin(); await new Promise(r => setTimeout(r, 0)); });

    // clearGazeListener should have been called even mid-init
    expect(webgazer.clearGazeListener).toHaveBeenCalled();
    // end() is called because the guard detects post-unmount
    expect(webgazer.end).toHaveBeenCalled();
  });
});

