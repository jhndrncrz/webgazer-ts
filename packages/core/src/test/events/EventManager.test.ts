import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventManager } from '../../events/EventManager';
import { EventType } from '../../events/types';

// Regression guard: verify EventType enum values haven't drifted
describe('EventType enum values', () => {
  it('GazePrediction is snake_case, not camelCase', () => {
    expect(EventType.GazePrediction).toBe('gaze_prediction');
    expect(EventType.GazePrediction).not.toBe('gazePrediction');
  });

  it('Click is lowercase', () => {
    expect(EventType.Click).toBe('click');
  });

  it('Error is lowercase', () => {
    expect(EventType.Error).toBe('error');
  });
});

describe('EventManager', () => {
  let em: EventManager;

  beforeEach(() => {
    em = new EventManager({ enableEventCapture: true, enableGazePrediction: true });
  });

  it('initializes with provided config', () => {
    expect(em.getConfig()).toEqual({ enableEventCapture: true, enableGazePrediction: true });
  });

  it('adds and counts listeners', () => {
    const listener = vi.fn();
    em.addEventListener(EventType.GazePrediction, listener);
    expect(em.hasListeners(EventType.GazePrediction)).toBe(true);
    expect(em.getListenerCount(EventType.GazePrediction)).toBe(1);
  });

  it('removes individual listener', () => {
    const listener = vi.fn();
    em.addEventListener(EventType.GazePrediction, listener);
    em.removeEventListener(EventType.GazePrediction, listener);
    expect(em.hasListeners(EventType.GazePrediction)).toBe(false);
  });

  it('emits events to all matching listeners', () => {
    const l1 = vi.fn();
    const l2 = vi.fn();
    em.addEventListener(EventType.GazePrediction, l1);
    em.addEventListener(EventType.GazePrediction, l2);

    const payload = { prediction: { x: 10, y: 20 }, timestamp: 999 };
    em.emit(EventType.GazePrediction, payload as any);

    expect(l1).toHaveBeenCalledWith(payload);
    expect(l2).toHaveBeenCalledWith(payload);
  });

  it('does not emit to listeners for different event types', () => {
    const listener = vi.fn();
    em.addEventListener(EventType.Click, listener);
    em.emit(EventType.GazePrediction, {} as any);
    expect(listener).not.toHaveBeenCalled();
  });

  it('handles listener throwing without crashing', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const thrower = vi.fn().mockImplementation(() => { throw new Error('boom'); });
    em.addEventListener(EventType.Error, thrower);

    expect(() => em.emit(EventType.Error, {} as any)).not.toThrow();
    consoleSpy.mockRestore();
  });

  it('removeAllListeners() for specific event only removes that event', () => {
    const l1 = vi.fn();
    const l2 = vi.fn();
    em.addEventListener(EventType.Click, l1);
    em.addEventListener(EventType.GazePrediction, l2);

    em.removeAllListeners(EventType.Click);

    expect(em.hasListeners(EventType.Click)).toBe(false);
    expect(em.hasListeners(EventType.GazePrediction)).toBe(true);
  });

  it('removeAllListeners() with no arg clears everything', () => {
    em.addEventListener(EventType.Click, vi.fn());
    em.addEventListener(EventType.Error, vi.fn());
    em.removeAllListeners();
    expect(em.getTotalListenerCount()).toBe(0);
  });

  it('getEventTypes() returns registered event types', () => {
    em.addEventListener(EventType.Click, vi.fn());
    em.addEventListener(EventType.GazePrediction, vi.fn());
    const types = em.getEventTypes();
    expect(types).toContain(EventType.Click);
    expect(types).toContain(EventType.GazePrediction);
  });

  it('updateConfig() merges config', () => {
    em.updateConfig({ enableGazePrediction: false });
    expect(em.getConfig().enableGazePrediction).toBe(false);
    expect(em.getConfig().enableEventCapture).toBe(true);
  });

  it('destroy() clears all listeners', () => {
    em.addEventListener(EventType.Click, vi.fn());
    em.destroy();
    expect(em.getTotalListenerCount()).toBe(0);
  });
});

