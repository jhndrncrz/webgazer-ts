import { describe, it, expect, vi } from 'vitest';
import webgazer from '../index';
import { Webgazer } from '../core/Webgazer';

describe('Webgazer Extensibility', () => {
  it('allows setting a custom tracker by constructor', () => {
    class CustomTracker {
      initialize = vi.fn().mockResolvedValue(undefined);
      getEyePatches = vi.fn();
      getPositions = vi.fn().mockReturnValue([]);
      drawFaceOverlay = vi.fn();
      reset = vi.fn();
    }

    webgazer.setTracker(CustomTracker as any);
    const tracker = webgazer.getTracker();
    expect(tracker).toBeInstanceOf(CustomTracker);
    
    // Clean up
    webgazer.setTracker('TFFacemesh');
  });

  it('allows setting a custom regressor by constructor', () => {
    class CustomRegressor {
      initialize = vi.fn().mockResolvedValue(undefined);
      predict = vi.fn().mockResolvedValue(null);
      addData = vi.fn();
      getData = vi.fn().mockReturnValue({});
      setData = vi.fn();
      updateConfiguration = vi.fn();
    }

    webgazer.setRegression(CustomRegressor as any);
    const regressors = webgazer.getRegression();
    expect(regressors[0]).toBeInstanceOf(CustomRegressor);
    
    // Clean up
    webgazer.setRegression('ridge');
  });

  it('allows adding a custom regressor by constructor', () => {
    class AnotherRegressor {
      initialize = vi.fn().mockResolvedValue(undefined);
      predict = vi.fn().mockResolvedValue(null);
      addData = vi.fn();
      getData = vi.fn().mockReturnValue({});
      setData = vi.fn();
      updateConfiguration = vi.fn();
    }

    const initialCount = webgazer.getRegression().length;
    webgazer.addRegression(AnotherRegressor as any);
    const regressors = webgazer.getRegression();
    expect(regressors.length).toBe(initialCount + 1);
    expect(regressors[regressors.length - 1]).toBeInstanceOf(AnotherRegressor);
    
    // Clean up
    webgazer.setRegression('ridge');
  });
});
