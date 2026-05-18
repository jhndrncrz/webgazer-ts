import { describe, it, expect, vi, beforeEach } from 'vitest';
import webgazer from '../index';
import { WebgazerState } from '../core/Webgazer';

describe('Webgazer Accurate Lifecycle', () => {
  beforeEach(() => {
    webgazer.end();
    webgazer.setLogLevel('none');
  });

  it('transitions through Initializing -> Ready -> Running', async () => {
    // Mock mediaDevices.getUserMedia
    const mockStream = {
      getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
      getVideoTracks: vi.fn().mockReturnValue([{ getSettings: () => ({ width: 640, height: 480 }) }])
    };
    
    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream)
      }
    });

    vi.spyOn(HTMLVideoElement.prototype, 'play').mockResolvedValue(undefined);
    vi.stubGlobal('requestAnimationFrame', vi.fn());

    // Mock initialization methods to avoid heavy TF.js/regressor setup
    vi.spyOn(webgazer as any, 'initializeTracker').mockResolvedValue(undefined);
    vi.spyOn(webgazer as any, 'initializeRegressors').mockResolvedValue(undefined);
    vi.spyOn(webgazer as any, 'initializeOverlayRenderer').mockReturnValue(undefined);
    vi.spyOn(webgazer as any, 'initializeGazeDotRenderer').mockReturnValue(undefined);

    // 1. Initially NotInitialized or Stopped
    expect([WebgazerState.NotInitialized, WebgazerState.Stopped]).toContain(webgazer.getState());

    // 2. Start begin() - should be Initializing internally (hard to capture without race)
    const beginPromise = webgazer.begin();
    
    // 3. After begin() resolves, state should be READY, not RUNNING
    await beginPromise;
    expect(webgazer.getState()).toBe(WebgazerState.Ready);
    expect(webgazer.isReady()).toBe(true);

    // 4. Manually trigger the prediction loop callback with data
    // In a real scenario, this happens inside requestAnimationFrame
    const predictCallback = (vi.mocked(window.requestAnimationFrame).mock.calls[0][0] as any);
    
    // Mock tracker to return data
    vi.spyOn(webgazer as any, 'getEyeFeatures').mockResolvedValue({ left: {}, right: {} } as any);
    vi.spyOn(webgazer as any, 'getPredictions').mockResolvedValue([{ x: 100, y: 100 }]);

    // Run the loop once
    await predictCallback(performance.now());

    // 5. State should now be RUNNING
    expect(webgazer.getState()).toBe(WebgazerState.Running);
  });
});
