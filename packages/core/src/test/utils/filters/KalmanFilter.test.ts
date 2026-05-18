import { describe, it, expect } from 'vitest';
import KalmanFilter from '../../../utils/filters/KalmanFilter';

describe('KalmanFilter', () => {
  it('should initialize correctly with config', () => {
    const filter = new KalmanFilter({
      processNoise: 0.1,
      measurementNoise: 10,
      errorCovariance: 50
    });
    expect(filter.isInitialized()).toBe(false);
  });

  it('should return initial measurement on first update', () => {
    const filter = new KalmanFilter();
    const result = filter.update([100, 200]);
    expect(result).toEqual([100, 200]);
    expect(filter.isInitialized()).toBe(true);
  });

  it('should smooth out noisy measurements', () => {
    const filter = new KalmanFilter({
      processNoise: 0.001,
      measurementNoise: 100, // high measurement noise means trust prediction more
      errorCovariance: 1
    });

    filter.update([100, 100]); // Initialize
    
    // Simulate slight movement with high noise
    const r1 = filter.update([110, 90]);
    
    // Because measurement noise is high, it shouldn't jump fully to 110/90
    expect(r1[0]).toBeLessThan(110);
    expect(r1[0]).toBeGreaterThan(100);
    expect(r1[1]).toBeLessThan(100);
    expect(r1[1]).toBeGreaterThan(90);
  });

  it('should reset properly', () => {
    const filter = new KalmanFilter();
    filter.update([10, 20]);
    expect(filter.isInitialized()).toBe(true);

    filter.reset();
    expect(filter.isInitialized()).toBe(false);
  });

  it('should return correct state', () => {
    const filter = new KalmanFilter();
    filter.update([50, 60]);
    const state = filter.getState();
    expect(state.x.estimate).toBe(50);
    expect(state.y.estimate).toBe(60);
  });
});
