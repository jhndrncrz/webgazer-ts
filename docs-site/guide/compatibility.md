# API Compatibility Matrix

This page documents the compatibility of `@webgazer-ts/core` against the original
**[WebGazer.js](https://github.com/brownhci/WebGazer)** public API, developed by the
[Brown HCI Group](https://hci.cs.brown.edu/) at Brown University
([Papoutsaki et al., IJCAI 2016](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf)).

> [!NOTE]
> **Status symbols:** ✅ Fully compatible · ⚠️ Minor difference noted · ❌ Not implemented

## Core Lifecycle Methods

| Method | Original WebGazer | webgazer-ts Status | Notes |
|--------|-------------------|-------------------|-------|
| `begin(onFail?)` | ✅ | ✅ | Async, returns Promise resolving to instance |
| `end()` | ✅ | ✅ | Synchronous, returns `this` |
| `pause()` | ✅ | ✅ | Synchronous, returns `this` |
| `resume()` | ✅ | ✅ | Async, returns Promise resolving to `this` |
| `isReady()` | ✅ | ✅ | Synchronous boolean |

## Gaze Prediction

| Method | Original WebGazer | webgazer-ts Status | Notes |
|--------|-------------------|-------------------|-------|
| `setGazeListener(fn)` | ✅ | ✅ | Returns `this` |
| `clearGazeListener()` | ✅ | ✅ | Returns `this` |
| `getCurrentPrediction(index?)` | ✅ | ✅ | Returns `Promise<{x, y} \| null>` |

## Tracker Management

| Method | Original WebGazer | webgazer-ts Status | Notes |
|--------|-------------------|-------------------|-------|
| `setTracker(name)` | ✅ | ✅ | Returns `this` |
| `getTracker()` | ✅ | ✅ | Returns tracker instance |
| `addTrackerModule(name, Ctor)` on instance | ✅ | ✅ | Added in v0.2.x |

### Supported Tracker Names

| Name | Original | webgazer-ts |
|------|----------|-------------|
| `TFFacemesh` | ✅ | ✅ |

## Regression Management

| Method | Original WebGazer | webgazer-ts Status | Notes |
|--------|-------------------|-------------------|-------|
| `setRegression(name)` | ✅ | ✅ | Returns `this` |
| `addRegression(name)` | ✅ | ✅ | Returns `this` |
| `getRegression()` | ✅ | ✅ | Returns array of regressors |
| `addRegressionModule(name, Ctor)` on instance | ✅ | ✅ | Added in v0.2.x |

### Supported Regression Names

| Name | Original | webgazer-ts |
|------|----------|-------------|
| `ridge` | ✅ | ✅ |
| `weightedRidge` | ✅ | ✅ |
| `threadedRidge` | ✅ | ✅ |

## Display Methods

| Method | Original WebGazer | webgazer-ts Status | Notes |
|--------|-------------------|-------------------|-------|
| `showVideo(bool)` | ✅ | ✅ | Returns `this` |
| `hideVideo()` | ✅ | ✅ | Convenience alias for `showVideo(false)` |
| `showVideoPreview(bool)` | ✅ | ✅ | Returns `this` |
| `showFaceOverlay(bool)` | ✅ | ✅ | Returns `this` |
| `hideFaceOverlay()` | ✅ | ✅ | Convenience alias |
| `showFaceFeedbackBox(bool)` | ✅ | ✅ | Returns `this` |
| `hideFaceFeedbackBox()` | ✅ | ✅ | Convenience alias |
| `showPredictionPoints(bool)` | ✅ | ✅ | Returns `this` |
| `hidePredictionPoints()` | ✅ | ✅ | Convenience alias |
| `setVideoViewerSize(w, h)` | ✅ | ✅ | |
| `stopVideo()` | ✅ | ✅ | Returns `this` |
| `setStaticVideo(path)` | ✅ | ✅ | Returns `this` |
| `getVideoElementCanvas()` | ✅ | ✅ | |
| `setVideoElementCanvas(canvas)` | ✅ | ✅ | |
| `getVideoPreviewToCameraResolutionRatio()` | ✅ | ✅ | |

## Data & Calibration

| Method | Original WebGazer | webgazer-ts Status | Notes |
|--------|-------------------|-------------------|-------|
| `addMouseEventListeners()` | ✅ | ✅ | Returns `this` |
| `removeMouseEventListeners()` | ✅ | ✅ | Returns `this` |
| `recordScreenPosition(x, y, type?)` | ✅ | ✅ | Returns `this` |
| `storePoints(x, y, k)` | ✅ | ✅ | 50-slot circular buffer, matching original |
| `getStoredPoints()` | ✅ | ✅ | Returns `[xArray, yArray]` (50 slots) |
| `clearData()` | ✅ | ✅ | Async |
| `saveDataAcrossSessions(bool)` | ✅ | ✅ | Synchronous, returns `this` (matches original) |

## Configuration

| Method / Property | Original WebGazer | webgazer-ts Status | Notes |
|-------------------|-------------------|-------------------|-------|
| `applyKalmanFilter(bool)` | ✅ | ✅ | Returns `this` |
| `setCameraConstraints(constraints)` | ✅ | ✅ | Async |
| `detectCompatibility()` | ✅ | ✅ | |
| `computeValidationBoxSize()` | ✅ | ✅ | |
| `params` | ✅ | ✅ | Config object |
| `params.camConstraints` | ✅ | ✅ | Alias for `params.cameraConstraints` |
| `params.cameraConstraints` | — | ✅ | Extended name (webgazer-ts addition) |
| `params.getEventTypes()` | ✅ | ✅ | Returns `['click', 'move']` |
| `params.saveDataAcrossSessions` | ✅ | ✅ | Boolean property |
| `params.showVideo` | ✅ | ✅ | Boolean property |
| `params.showFaceOverlay` | ✅ | ✅ | Boolean property |
| `params.showFaceFeedbackBox` | ✅ | ✅ | Boolean property |
| `params.showGazeDot` | ✅ | ✅ | Boolean property |
| `params.applyKalmanFilter` | ✅ | ✅ | Boolean property |
| `params.mirrorVideo` | ✅ | ✅ | Boolean property |
| `params.moveTickSize` | ✅ | ✅ | Number |
| `params.faceFeedbackBoxRatio` | ✅ | ✅ | Number |
| `util` | ✅ | ✅ | Utility object |
| `util.DataWindow` | ✅ | ✅ | Circular buffer constructor |
| `util.bound` | ✅ | ✅ | Bounds-clamping function |

## Browser Global (Script Tag Usage)

| Feature | Original WebGazer | webgazer-ts Status | Notes |
|---------|-------------------|-------------------|-------|
| `window.webgazer` set after UMD load | ✅ | ✅ | Set via footer script in UMD bundle |
| Named exports also available | — | ✅ | `window.webgazer.WebgazerState`, etc. |
| CDN-compatible bundle | ✅ | ✅ | Available at `dist/webgazer.js` |

## Package Exports (npm)

| Import Style | Status | Notes |
|-------------|--------|-------|
| `import webgazer from '@webgazer-ts/core'` | ✅ | Default export is the singleton instance |
| `import { webgazer } from '@webgazer-ts/core'` | ✅ | Named export also available |
| `const webgazer = require('@webgazer-ts/core').default` | ✅ | CommonJS |
| TypeScript types | ✅ | Emitted to `dist/index.d.ts` |
| ESM bundle | ✅ | `dist/webgazer-ts.js` |
| UMD bundle | ✅ | `dist/webgazer.js` |

## webgazer-ts Additions (Not in Original)

These APIs are unique to `webgazer-ts` and not present in the original WebGazer.js:

| Feature | Description |
|---------|-------------|
| `checkCameraPermission()` | Check permission state before calling `begin()` |
| `getState()` | Returns `WebgazerState` enum value |
| `getEventManager()` | Access the event manager for advanced usage |
| `getCalibrationManager()` | Access the calibration manager |
| `getCalibrationDataCount()` | Number of training points recorded |
| `getCompatibilityWarnings()` | Array of browser compatibility warnings |
| React package (`@webgazer-ts/react`) | `useWebgazer`, `useGazeTracking`, `WebgazerProvider`, etc. |

## Known Differences

1. **`saveDataAcrossSessions(bool)`** — The original stores data on each click event. webgazer-ts saves in the background when this method is called with `true`. Behavior is functionally equivalent.

2. **`storePoints(x, y, k)`** — In the original, this is used internally by the prediction loop. In webgazer-ts, the function is public and works the same way (50-slot circular buffer indexed by `k`).

3. **`begin()` return value** — The original returns a Promise (sometimes). webgazer-ts always returns `Promise<Webgazer>`.

4. **`tracker.TFFaceMesh` vs `tracker.TFFacemesh`** — The original uses `TFFaceMesh` (capital M) internally, but the lookup key in `curTrackerMap` is `TFFacemesh`. webgazer-ts uses `TFFacemesh` consistently.
