/**
 * Browser Runtime Behavior Tests
 * 
 * Tests that verify the runtime behavior of the library matches the original
 * WebGazer.js, including camera permission handling, pause/resume semantics,
 * and callback behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import webgazer from '../index';
import { WebgazerState } from '../core/Webgazer';

// ---------------------------------------------------------------------------
// Setup: Mock navigator.mediaDevices.getUserMedia
// ---------------------------------------------------------------------------

function mockGetUserMediaSuccess() {
  const mockStream = {
    getTracks: () => [{ stop: vi.fn(), kind: 'video' }],
    getVideoTracks: () => [{ stop: vi.fn(), getSettings: () => ({ width: 640, height: 480 }) }],
    getAudioTracks: () => []
  } as unknown as MediaStream;

  Object.defineProperty(navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue(mockStream),
      enumerateDevices: vi.fn().mockResolvedValue([]),
    }
  });

  return mockStream;
}

function mockGetUserMediaDenied() {
  Object.defineProperty(navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn().mockRejectedValue(
        new DOMException('Permission denied', 'NotAllowedError')
      ),
      enumerateDevices: vi.fn().mockResolvedValue([]),
    }
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Import does not trigger camera access', () => {
  it('importing the module does not call getUserMedia', () => {
    // At this point the module is imported but begin() was never called
    // getUserMedia must not have been invoked.
    // (The mock was not installed until this test, so if getUserMedia was called
    // at import time it would have used the real one — which would fail in jsdom)
    // We can verify by checking the instance state:
    expect(webgazer.getState()).not.toBe(WebgazerState.Running);
    expect(webgazer.getState()).not.toBe(WebgazerState.Initializing);
  });

  it('isReady() is false before begin()', () => {
    expect(webgazer.isReady()).toBe(false);
  });
});

describe('getCurrentPrediction() before initialization', () => {
  it('returns null when webgazer is not running', async () => {
    // isReady() is false → getCurrentPrediction should return null safely
    const prediction = await webgazer.getCurrentPrediction();
    expect(prediction).toBeNull();
  });

  it('returns null with index argument when not running', async () => {
    const prediction = await webgazer.getCurrentPrediction(0);
    expect(prediction).toBeNull();
  });
});

describe('Gaze listener registration', () => {
  afterEach(() => {
    webgazer.clearGazeListener();
  });

  it('setGazeListener returns this (chainable)', () => {
    const result = webgazer.setGazeListener(() => {});
    // Should return the Webgazer instance
    expect(result).toBe(webgazer);
  });

  it('clearGazeListener returns this (chainable)', () => {
    webgazer.setGazeListener(() => {});
    const result = webgazer.clearGazeListener();
    expect(result).toBe(webgazer);
  });

  it('setting and clearing gaze listener does not throw', () => {
    expect(() => {
      webgazer.setGazeListener((data, time) => {
        // no-op
      });
    }).not.toThrow();

    expect(() => {
      webgazer.clearGazeListener();
    }).not.toThrow();
  });
});

describe('pause() and resume() without begin()', () => {
  it('pause() returns this without throwing when not running', () => {
    const result = webgazer.pause();
    expect(result).toBe(webgazer);
  });

  it('resume() returns a Promise resolving to this when not paused', async () => {
    const result = await webgazer.resume();
    expect(result).toBe(webgazer);
  });
});

describe('saveDataAcrossSessions() chainability', () => {
  it('is synchronous and returns this', () => {
    const t0 = performance.now();
    const result = webgazer.saveDataAcrossSessions(false);
    const t1 = performance.now();

    // Must be synchronous (complete in < 5ms)
    expect(t1 - t0).toBeLessThan(5);
    // Must return the instance
    expect(result).toBe(webgazer);
  });

  it('can be chained with other methods', () => {
    expect(() => {
      webgazer
        .saveDataAcrossSessions(true)
        .applyKalmanFilter(true)
        .showVideo(false)
        .clearGazeListener();
    }).not.toThrow();
  });
});

describe('Camera permission denial', () => {
  beforeEach(() => {
    // Reset state
    mockGetUserMediaDenied();
  });

  it('begin() with denied camera calls onFail callback and rejects', async () => {
    const onFail = vi.fn();

    try {
      await webgazer.begin(onFail);
      // If we reach here without throwing, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // begin() should reject when camera is denied
      expect(error).toBeDefined();
    }
    // The onFail callback must have been called
    expect(onFail).toHaveBeenCalled();
  });
});

describe('Tracker and regressor registration errors', () => {
  it('setTracker with unknown name throws descriptive error', () => {
    expect(() => webgazer.setTracker('nonExistentTracker')).toThrow();
  });

  it('setRegression with unknown name throws descriptive error', () => {
    expect(() => webgazer.setRegression('nonExistentRegression')).toThrow();
  });

  it('addRegression with unknown name throws descriptive error', () => {
    expect(() => webgazer.addRegression('nonExistentRegression')).toThrow();
  });
});
