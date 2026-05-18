import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import webgazer from '../index';
import { WebgazerState } from '../core/Webgazer';

describe('Webgazer Modern Enhancements', () => {
  beforeEach(() => {
    webgazer.setLogLevel('none');
  });

  describe('Performance Throttling', () => {
    it('sets maxFPS and predictionInterval correctly', () => {
      webgazer.setMaxFPS(30);
      expect(webgazer.getConfig().maxFPS).toBe(30);
      
      webgazer.setPredictionInterval(100); // 10 FPS
      expect(webgazer.getConfig().maxFPS).toBe(10);
    });

    it('sets faceDetectionInterval correctly', () => {
      webgazer.setFaceDetectionInterval(5);
      expect(webgazer.getConfig().faceDetectionInterval).toBe(5);
      
      webgazer.setFaceDetectionInterval(0); // Should floor at 1
      expect(webgazer.getConfig().faceDetectionInterval).toBe(1);
    });
  });

  describe('Quality of Life', () => {
    it('handles logLevel and debugMode', () => {
      webgazer.setLogLevel('warn');
      expect(webgazer.getConfig().logLevel).toBe('warn');
      
      webgazer.setDebugMode(true);
      expect(webgazer.getConfig().logLevel).toBe('debug');
      
      webgazer.setDebugMode(false);
      expect(webgazer.getConfig().logLevel).toBe('info');
    });

    it('manages autoPauseOnBlur config', () => {
      webgazer.setAutoPauseOnBlur(true);
      expect(webgazer.getConfig().autoPauseOnBlur).toBe(true);
      
      webgazer.setAutoPauseOnBlur(false);
      expect(webgazer.getConfig().autoPauseOnBlur).toBe(false);
    });
  });

  describe('Gaze Smoothing', () => {
    it('sets smoothing types and parameters', () => {
      webgazer.setSmoothingType('ema');
      expect(webgazer.getConfig().smoothingType).toBe('ema');
      
      webgazer.setEMAAlpha(0.1);
      expect(webgazer.getConfig().emaAlpha).toBe(0.1);
      
      webgazer.setSmoothingType('average');
      expect(webgazer.getConfig().smoothingType).toBe('average');
    });
  });

  describe('Event Emitter Aliases', () => {
    it('supports .on() and .off() chaining', () => {
      const handler = vi.fn();
      const instance = webgazer.on('prediction', handler);
      
      expect(instance).toBe(webgazer);
      
      webgazer.off('prediction', handler);
      expect(instance).toBe(webgazer);
    });
  });
});
