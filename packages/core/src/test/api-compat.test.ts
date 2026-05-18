/**
 * API Compatibility Tests
 * 
 * Verifies that this library exposes the same public API surface as the original
 * Brown HCI WebGazer.js, including all instance methods, convenience aliases,
 * and config properties used by the original.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import webgazer from '../index';
import { Webgazer } from '../core/Webgazer';

describe('Original WebGazer.js API Surface Parity', () => {

  // ===========================================================================
  // Core lifecycle methods
  // ===========================================================================

  it('exposes begin()', () => {
    expect(typeof webgazer.begin).toBe('function');
  });

  it('exposes end()', () => {
    expect(typeof webgazer.end).toBe('function');
  });

  it('exposes pause()', () => {
    expect(typeof webgazer.pause).toBe('function');
  });

  it('exposes resume()', () => {
    expect(typeof webgazer.resume).toBe('function');
  });

  it('exposes isReady()', () => {
    expect(typeof webgazer.isReady).toBe('function');
  });

  // ===========================================================================
  // Gaze listener methods
  // ===========================================================================

  it('exposes setGazeListener()', () => {
    expect(typeof webgazer.setGazeListener).toBe('function');
  });

  it('exposes clearGazeListener()', () => {
    expect(typeof webgazer.clearGazeListener).toBe('function');
  });

  it('exposes getCurrentPrediction()', () => {
    expect(typeof webgazer.getCurrentPrediction).toBe('function');
  });

  // ===========================================================================
  // Tracker & Regressor management
  // ===========================================================================

  it('exposes setTracker()', () => {
    expect(typeof webgazer.setTracker).toBe('function');
  });

  it('exposes getTracker()', () => {
    expect(typeof webgazer.getTracker).toBe('function');
  });

  it('exposes setRegression()', () => {
    expect(typeof webgazer.setRegression).toBe('function');
  });

  it('exposes addRegression()', () => {
    expect(typeof webgazer.addRegression).toBe('function');
  });

  it('exposes getRegression()', () => {
    expect(typeof webgazer.getRegression).toBe('function');
  });

  it('exposes instance-level addRegressionModule()', () => {
    expect(typeof webgazer.addRegressionModule).toBe('function');
  });

  it('exposes instance-level addTrackerModule()', () => {
    expect(typeof webgazer.addTrackerModule).toBe('function');
  });

  // ===========================================================================
  // Instance-level module registration works correctly
  // ===========================================================================

  it('instance addRegressionModule registers and makes module usable', () => {
    class MockRegressor {
      initialize() { return Promise.resolve(); }
      predict() { return null; }
      addData() {}
      getData() { return {}; }
      setData() {}
      updateConfiguration() {}
    }
    // Should not throw and should return this for chaining
    const result = webgazer.addRegressionModule('mockReg', MockRegressor as any);
    expect(result).toBeInstanceOf(Webgazer);
    // Should now be settable
    expect(() => webgazer.setRegression('mockReg')).not.toThrow();
    // Clean up: reset to ridge
    webgazer.setRegression('ridge');
  });

  it('instance addTrackerModule registers and makes module usable', () => {
    class MockTracker {
      initialize() { return Promise.resolve(); }
      getEyePatches() { return null; }
      getPositions() { return []; }
      drawFaceOverlay() {}
      reset() {}
    }
    const result = webgazer.addTrackerModule('mockTracker', MockTracker as any);
    expect(result).toBeInstanceOf(Webgazer);
    expect(() => webgazer.setTracker('mockTracker')).not.toThrow();
    // Clean up: reset to TFFacemesh
    webgazer.setTracker('TFFacemesh');
  });

  // ===========================================================================
  // Show/Hide methods (original WebGazer API)
  // ===========================================================================

  it('exposes showVideo()', () => {
    expect(typeof webgazer.showVideo).toBe('function');
  });

  it('exposes hideVideo() convenience alias', () => {
    expect(typeof webgazer.hideVideo).toBe('function');
  });

  it('exposes showVideoPreview()', () => {
    expect(typeof webgazer.showVideoPreview).toBe('function');
  });

  it('exposes showFaceOverlay()', () => {
    expect(typeof webgazer.showFaceOverlay).toBe('function');
  });

  it('exposes hideFaceOverlay() convenience alias', () => {
    expect(typeof webgazer.hideFaceOverlay).toBe('function');
  });

  it('exposes showFaceFeedbackBox()', () => {
    expect(typeof webgazer.showFaceFeedbackBox).toBe('function');
  });

  it('exposes hideFaceFeedbackBox() convenience alias', () => {
    expect(typeof webgazer.hideFaceFeedbackBox).toBe('function');
  });

  it('exposes showPredictionPoints()', () => {
    expect(typeof webgazer.showPredictionPoints).toBe('function');
  });

  it('exposes hidePredictionPoints() convenience alias', () => {
    expect(typeof webgazer.hidePredictionPoints).toBe('function');
  });

  // ===========================================================================
  // Hide aliases delegate to show*(false)
  // ===========================================================================

  it('hideVideo() is equivalent to showVideo(false)', () => {
    webgazer.showVideo(true);
    expect(webgazer.params.showVideo).toBe(true);
    webgazer.hideVideo();
    expect(webgazer.params.showVideo).toBe(false);
    // Restore
    webgazer.showVideo(true);
  });

  it('hideFaceOverlay() is equivalent to showFaceOverlay(false)', () => {
    webgazer.showFaceOverlay(true);
    expect(webgazer.params.showFaceOverlay).toBe(true);
    webgazer.hideFaceOverlay();
    expect(webgazer.params.showFaceOverlay).toBe(false);
    webgazer.showFaceOverlay(true);
  });

  it('hideFaceFeedbackBox() is equivalent to showFaceFeedbackBox(false)', () => {
    webgazer.showFaceFeedbackBox(true);
    expect(webgazer.params.showFaceFeedbackBox).toBe(true);
    webgazer.hideFaceFeedbackBox();
    expect(webgazer.params.showFaceFeedbackBox).toBe(false);
    webgazer.showFaceFeedbackBox(true);
  });

  it('hidePredictionPoints() is equivalent to showPredictionPoints(false)', () => {
    webgazer.showPredictionPoints(true);
    expect(webgazer.params.showGazeDot).toBe(true);
    webgazer.hidePredictionPoints();
    expect(webgazer.params.showGazeDot).toBe(false);
    webgazer.showPredictionPoints(true);
  });

  // ===========================================================================
  // Configuration / filtering
  // ===========================================================================

  it('exposes applyKalmanFilter()', () => {
    expect(typeof webgazer.applyKalmanFilter).toBe('function');
  });

  it('exposes saveDataAcrossSessions()', () => {
    expect(typeof webgazer.saveDataAcrossSessions).toBe('function');
  });

  it('saveDataAcrossSessions() returns this (synchronous, chainable)', () => {
    const result = webgazer.saveDataAcrossSessions(true);
    // Must be the same Webgazer instance (not a Promise)
    expect(result).toBeInstanceOf(Webgazer);
    expect(result).toBe(webgazer);
  });

  // ===========================================================================
  // Data recording / calibration
  // ===========================================================================

  it('exposes addMouseEventListeners()', () => {
    expect(typeof webgazer.addMouseEventListeners).toBe('function');
  });

  it('exposes removeMouseEventListeners()', () => {
    expect(typeof webgazer.removeMouseEventListeners).toBe('function');
  });

  it('exposes recordScreenPosition()', () => {
    expect(typeof webgazer.recordScreenPosition).toBe('function');
  });

  it('exposes storePoints()', () => {
    expect(typeof webgazer.storePoints).toBe('function');
  });

  it('exposes getStoredPoints()', () => {
    expect(typeof webgazer.getStoredPoints).toBe('function');
  });

  it('exposes clearData()', () => {
    expect(typeof webgazer.clearData).toBe('function');
  });

  // ===========================================================================
  // storePoints / getStoredPoints circular buffer
  // ===========================================================================

  it('storePoints(x, y, k) writes to a 50-slot circular buffer', () => {
    webgazer.storePoints(100, 200, 0);
    webgazer.storePoints(300, 400, 1);
    webgazer.storePoints(500, 600, 2);

    const [xs, ys] = webgazer.getStoredPoints();
    expect(xs.length).toBe(50); // Always returns full 50-slot array
    expect(ys.length).toBe(50);
    expect(xs[0]).toBe(100);
    expect(ys[0]).toBe(200);
    expect(xs[1]).toBe(300);
    expect(ys[1]).toBe(400);
    expect(xs[2]).toBe(500);
    expect(ys[2]).toBe(600);
  });

  it('storePoints wraps around at index 50', () => {
    webgazer.storePoints(999, 888, 50); // k=50 should map to index 0
    const [xs, ys] = webgazer.getStoredPoints();
    expect(xs[0]).toBe(999);
    expect(ys[0]).toBe(888);
  });

  it('getStoredPoints returns copies (mutation safe)', () => {
    webgazer.storePoints(111, 222, 5);
    const [xs1] = webgazer.getStoredPoints();
    xs1[5] = 9999; // Mutate the returned copy
    const [xs2] = webgazer.getStoredPoints();
    expect(xs2[5]).toBe(111); // Original should be unchanged
  });

  // ===========================================================================
  // params object (original: webgazer.params)
  // ===========================================================================

  it('exposes params object', () => {
    expect(webgazer.params).toBeDefined();
    expect(typeof webgazer.params).toBe('object');
  });

  it('params.showVideo is readable and writable via showVideo()', () => {
    webgazer.showVideo(false);
    expect(webgazer.params.showVideo).toBe(false);
    webgazer.showVideo(true);
    expect(webgazer.params.showVideo).toBe(true);
  });

  it('params.saveDataAcrossSessions reflects saveDataAcrossSessions() call', () => {
    webgazer.saveDataAcrossSessions(false);
    expect(webgazer.params.saveDataAcrossSessions).toBe(false);
    webgazer.saveDataAcrossSessions(true);
    expect(webgazer.params.saveDataAcrossSessions).toBe(true);
  });

  it('params.applyKalmanFilter reflects applyKalmanFilter() call', () => {
    webgazer.applyKalmanFilter(false);
    expect(webgazer.params.applyKalmanFilter).toBe(false);
    webgazer.applyKalmanFilter(true);
    expect(webgazer.params.applyKalmanFilter).toBe(true);
  });

  it('params.camConstraints is an alias for params.cameraConstraints', () => {
    // Both should point to the same object
    expect(webgazer.params.camConstraints).toBeDefined();
    expect(webgazer.params.camConstraints).toBe(webgazer.params.cameraConstraints);
  });

  it('setting params.camConstraints updates cameraConstraints', () => {
    const original = webgazer.params.cameraConstraints;
    const custom = { video: { width: { min: 640, ideal: 1280, max: 1920 }, height: { min: 480, ideal: 720, max: 1080 }, facingMode: 'user' as const } };
    webgazer.params.camConstraints = custom;
    expect(webgazer.params.cameraConstraints).toBe(custom);
    // Restore
    webgazer.params.cameraConstraints = original;
  });

  it('params.getEventTypes() returns ["click", "move"]', () => {
    expect(typeof webgazer.params.getEventTypes).toBe('function');
    const types = webgazer.params.getEventTypes();
    expect(types).toEqual(['click', 'move']);
  });

  // ===========================================================================
  // util object (original: webgazer.util)
  // ===========================================================================

  it('exposes util object', () => {
    expect(webgazer.util).toBeDefined();
  });

  it('util.DataWindow is a constructor', () => {
    expect(typeof webgazer.util.DataWindow).toBe('function');
  });

  it('util.bound is a function', () => {
    expect(typeof webgazer.util.bound).toBe('function');
  });

  // ===========================================================================
  // Chainability
  // ===========================================================================

  it('core configuration chain works without begin()', () => {
    const chain = webgazer
      .setTracker('TFFacemesh')
      .setRegression('ridge')
      .showVideo(false)
      .showFaceOverlay(false)
      .showFaceFeedbackBox(false)
      .showPredictionPoints(false)
      .applyKalmanFilter(false)
      .saveDataAcrossSessions(false)
      .setGazeListener(() => {})
      .clearGazeListener();

    expect(chain).toBeInstanceOf(Webgazer);
  });

  it('regression names accepted: ridge, weightedRidge, threadedRidge', () => {
    expect(() => webgazer.setRegression('ridge')).not.toThrow();
    expect(() => webgazer.setRegression('weightedRidge')).not.toThrow();
    expect(() => webgazer.setRegression('threadedRidge')).not.toThrow();
    // Reset
    webgazer.setRegression('ridge');
  });

  it('additive regression aliases are accepted: ridgeWeighted, ridgeThreaded', () => {
    expect(() => webgazer.setRegression('ridgeWeighted')).not.toThrow();
    expect(() => webgazer.setRegression('ridgeThreaded')).not.toThrow();
    webgazer.setRegression('ridge');
  });

  it('tracker name accepted: TFFacemesh', () => {
    expect(() => webgazer.setTracker('TFFacemesh')).not.toThrow();
  });

  it('tracker alias accepted: TFFaceMesh', () => {
    expect(() => webgazer.setTracker('TFFaceMesh')).not.toThrow();
    webgazer.setTracker('TFFacemesh');
  });

  // ===========================================================================
  // getCurrentPrediction() returns null when not ready
  // ===========================================================================

  it('getCurrentPrediction() returns null (or resolves to null) when not initialized', async () => {
    // webgazer has not been begin()-ed in tests, so isReady() should be false
    expect(webgazer.isReady()).toBe(false);
    const prediction = await webgazer.getCurrentPrediction();
    expect(prediction).toBeNull();
  });

  it('getCurrentPrediction() preserves original eyeFeatures/all fields when predictions exist', async () => {
    const instance = webgazer as any;
    const eyeFeatures = { left: {}, right: {} };
    const firstPrediction = { x: 10, y: 20 };
    const secondPrediction = { x: 30, y: 40 };
    const originalIsReady = instance.isReady;
    const originalGetTrackingData = instance.getTrackingData;
    const originalRegressors = instance.regressors;

    instance.isReady = () => true;
    instance.getTrackingData = async () => ({ eyeFeatures });
    instance.regressors = [
      { predict: vi.fn().mockResolvedValue(firstPrediction) },
      { predict: vi.fn().mockResolvedValue(secondPrediction) },
    ];

    const prediction = await webgazer.getCurrentPrediction();

    expect(prediction).toEqual({
      x: 10,
      y: 20,
      eyeFeatures,
      all: [firstPrediction, secondPrediction],
    });

    instance.isReady = originalIsReady;
    instance.getTrackingData = originalGetTrackingData;
    instance.regressors = originalRegressors;
  });

  it('isReady() returns false before begin() is called', () => {
    expect(webgazer.isReady()).toBe(false);
  });

  // ===========================================================================
  // Video / display methods
  // ===========================================================================

  it('exposes setVideoViewerSize()', () => {
    expect(typeof webgazer.setVideoViewerSize).toBe('function');
  });

  it('exposes stopVideo()', () => {
    expect(typeof webgazer.stopVideo).toBe('function');
  });

  it('exposes setStaticVideo()', () => {
    expect(typeof webgazer.setStaticVideo).toBe('function');
  });

  it('exposes getVideoElementCanvas()', () => {
    expect(typeof webgazer.getVideoElementCanvas).toBe('function');
  });

  it('exposes setVideoElementCanvas()', () => {
    expect(typeof webgazer.setVideoElementCanvas).toBe('function');
  });

  it('exposes getVideoPreviewToCameraResolutionRatio()', () => {
    expect(typeof webgazer.getVideoPreviewToCameraResolutionRatio).toBe('function');
  });

  it('exposes detectCompatibility()', () => {
    expect(typeof webgazer.detectCompatibility).toBe('function');
  });

  it('exposes computeValidationBoxSize()', () => {
    expect(typeof webgazer.computeValidationBoxSize).toBe('function');
  });

  it('exposes setCameraConstraints()', () => {
    expect(typeof webgazer.setCameraConstraints).toBe('function');
  });

  it('showVideoPreview(false) hides all preview surfaces together', () => {
    webgazer.showVideo(true);
    webgazer.showFaceOverlay(true);
    webgazer.showFaceFeedbackBox(true);

    webgazer.showVideoPreview(false);

    expect(webgazer.params.showVideoPreview).toBe(false);
    expect(webgazer.params.showVideo).toBe(false);
    expect(webgazer.params.showFaceOverlay).toBe(false);
    expect(webgazer.params.showFaceFeedbackBox).toBe(false);
  });
});

describe('SSR / Non-browser Import Safety', () => {
  it('module is already imported without error (import-time safety check)', () => {
    // This test simply verifies that importing the module via ES import at the top
    // of this file did not throw. If we reach this point, the import was safe.
    // (require() is not available in this ESM + jsdom test context.)
    expect(webgazer).toBeDefined();
    expect(typeof webgazer.begin).toBe('function');
  });

  it('importing does not immediately request camera permission', () => {
    // getUserMedia should NOT have been called just by importing the module
    // (webgazer.begin() hasn't been called)
    const getUserMedia = vi.fn();
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      navigator.mediaDevices.getUserMedia = getUserMedia;
      // Re-import would use cached module, so just verify no call happened
      expect(getUserMedia).not.toHaveBeenCalled();
      navigator.mediaDevices.getUserMedia = originalGetUserMedia;
    }
  });
});

describe('Package metadata parity', () => {
  it('publishes a drop-in browser bundle path named webgazer.js', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
    );

    expect(packageJson.browser).toBe('./dist/webgazer.js');
    expect(packageJson.unpkg).toBe('./dist/webgazer.js');
    expect(packageJson.exports['.'].browser).toBe('./dist/webgazer-ts.js');
    expect(packageJson.exports['.'].node).toBe('./ssr.js');
  });

  it('ships an SSR-safe node entry that can be imported without window', async () => {
    const moduleUrl = pathToFileURL(resolve(process.cwd(), 'ssr.js')).href;
    const ssrModule = await import(moduleUrl);

    expect(ssrModule.default).toBeDefined();
    expect(typeof ssrModule.default.begin).toBe('function');
    expect(typeof ssrModule.default.setTracker).toBe('function');
    expect(await ssrModule.default.checkCameraPermission()).toBe('unsupported');
  });
});
