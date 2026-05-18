# Webgazer Compatibility Matrix

This document tracks the compatibility between `webgazer-ts` and the original Brown HCI WebGazer.js.

## Core API

| Member | Type | Compatible | Notes |
|--------|------|------------|-------|
| `begin()` | Method | ✅ | Returns `Promise<Webgazer>` instead of `this` immediately. |
| `end()` | Method | ✅ | |
| `pause()` | Method | ✅ | |
| `resume()` | Method | ✅ | |
| `isReady()` | Method | ✅ | |
| `setGazeListener()` | Method | ✅ | |
| `clearGazeListener()` | Method | ✅ | |
| `getCurrentPrediction()` | Method | ✅ | Returns `Promise<GazePrediction>` |
| `setTracker()` | Method | ✅ | Supports original string aliases |
| `setRegression()` | Method | ✅ | Supports original string aliases |
| `addRegression()` | Method | ✅ | |
| `showVideo()` | Method | ✅ | |
| `hideVideo()` | Method | ✅ | Convenience alias added |
| `showFaceOverlay()` | Method | ✅ | |
| `hideFaceOverlay()` | Method | ✅ | |
| `showPredictionPoints()` | Method | ✅ | |
| `hidePredictionPoints()` | Method | ✅ | |
| `saveDataAcrossSessions()` | Method | ✅ | |
| `applyKalmanFilter()` | Method | ✅ | |
| `recordScreenPosition()` | Method | ✅ | |
| `addMouseEventListeners()` | Method | ✅ | |
| `removeMouseEventListeners()` | Method | ✅ | |
| `params` | Property | ✅ | Maps to internal configuration |
| `util` | Property | ✅ | Includes `DataWindow` and `bound` |

## Regression Models

| Original Name | Alias in webgazer-ts | Status |
|---------------|----------------------|--------|
| `ridge` | `ridge` | ✅ |
| `weightedRidge` | `weightedRidge` | ✅ |
| `threadedRidge` | `threadedRidge` | ✅ |

## Trackers

| Original Name | Alias in webgazer-ts | Status |
|---------------|----------------------|--------|
| `TFFacemesh` | `TFFacemesh` | ✅ |

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome | ✅ |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ✅ |
| Mobile | ⚠️ (Requires modern hardware) |

## Known Differences

1. **Async/Await:** `begin()` and `getCurrentPrediction()` are async in `webgazer-ts`. While you can still use them without awaiting (they will work in the background), awaiting is recommended for better control.
2. **State Lifecycle:** `webgazer-ts` implements a more accurate state transition. The state only becomes `Running` after the first successful eye tracking data is received. Prior to that (between `begin()` finishing and first tracking), the state is `Ready`.
3. **Default Persistence:** `saveDataAcrossSessions` defaults to `false` in `webgazer-ts` v0.2.0+ for privacy compliance.
4. **Type Safety:** You get full IntelliSense and compile-time checks with `webgazer-ts`.
