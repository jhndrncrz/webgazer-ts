# Performance Optimization

Techniques for making gaze tracking smooth, responsive, and lightweight in production.

## Measuring Performance

Before optimizing, measure. Webgazer-TS exposes timing metrics through the prediction loop:

```typescript
// The gaze listener receives an elapsed time argument
webgazer.setGazeListener((data, elapsedTime) => {
  if (data) {
    // elapsedTime = ms since tracking started
    console.log(`Gaze at (${data.x}, ${data.y}) at t=${elapsedTime.toFixed(0)}ms`);
  }
});
```

Use the browser's **Performance tab** to identify bottlenecks:
- Heavy frames usually occur in TensorFlow.js face detection
- Ridge regression matrix math is the second-largest cost
- Canvas rendering (prediction dot, face overlay) is typically negligible

## 1. Use the Threaded Regressor

The default `ridge` regressor runs matrix operations on the main thread, which can cause
frame drops on slower devices. `threadedRidge` moves this work to a Web Worker:

```typescript
webgazer.setRegression('threadedRidge');
```

```tsx
// React
const webgazer = useWebgazer({ regression: 'threadedRidge' });
```

**Trade-offs:**
- ✅ Main thread stays smooth
- ✅ Better on mobile and lower-end CPUs
- ⚠️ Slightly higher prediction latency (1–2 extra frames for Worker round-trip)
- ⚠️ Web Workers are not available in all environments (e.g. some sandboxed iframes)

## 2. Throttle the Gaze Listener

If your UI doesn't need gaze updates at 30+ fps (e.g. you're computing attention zones rather
than moving a cursor), throttle the callback:

```typescript
let lastUpdate = 0;
const THROTTLE_MS = 100; // ~10 fps

webgazer.setGazeListener((data, t) => {
  const now = Date.now();
  if (now - lastUpdate < THROTTLE_MS) return;
  lastUpdate = now;

  if (data) {
    updateUI(data.x, data.y);
  }
});
```

In React, use the `throttle` option on `useGazeTracking`:

```tsx
import { useGazeTracking } from '@webgazer-ts/react';

function MyComponent() {
  const { x, y } = useGazeTracking({ throttle: 100 }); // Max 10 updates/sec
  // ...
}
```

## 3. Reduce Camera Resolution

Higher camera resolution → larger TensorFlow.js input → more computation.
The default constraints request the browser's default (often 720p or 1080p).

Reduce to 480p for a significant speedup with minimal accuracy loss:

```typescript
// Before begin()
webgazer.params.camConstraints = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: 'user',
  }
};

// Or use the API
await webgazer.setCameraConstraints({
  video: { width: 640, height: 480, facingMode: 'user' }
});

await webgazer.begin();
```

## 4. Tune the Data Window Size

Ridge regression performance scales with the number of calibration points. The default
data window keeps up to **500** click points. If prediction is slow, reduce it:

```typescript
// This requires a custom regressor or direct config access
// The default ridge regressor uses a dataWindowSize of 500

// Simplest workaround: clear old data periodically
setInterval(() => {
  if (webgazer.isReady()) {
    webgazer.clearData(); // Wipes training data, requires re-calibration
  }
}, 5 * 60 * 1000); // Every 5 minutes
```

## 5. Disable Unused Rendering

Each active renderer costs a small amount per frame. Disable those you don't need:

```typescript
webgazer
  .showVideo(false)            // Hide webcam preview box
  .showFaceOverlay(false)      // Hide face landmark overlay
  .showFaceFeedbackBox(false)  // Hide face detection feedback box
  .showPredictionPoints(false) // Hide gaze prediction dot
  .begin();
```

Or hide all at once and only show when debugging:

```typescript
function enableDebugMode(on: boolean) {
  webgazer
    .showVideo(on)
    .showFaceOverlay(on)
    .showFaceFeedbackBox(on)
    .showPredictionPoints(on);
}
```

## 6. Kalman Filter Tuning

The Kalman filter runs every frame and adds minimal overhead — but its parameters affect
perceived smoothness vs. latency. See the [Kalman Filter guide](/guide/advanced/kalman-filter)
for tuning details. To disable entirely:

```typescript
webgazer.applyKalmanFilter(false); // Use raw regression output
```

## 7. Pause When Not in Viewport

Avoid running prediction when the page is not visible (e.g. user switches tabs):

```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    webgazer.pause();
  } else {
    webgazer.resume();
  }
});
```

## 8. Lazy Load TensorFlow.js

The `@webgazer-ts/core` UMD bundle includes TensorFlow.js and weighs ~2.7MB (gzip: ~460KB).
Avoid loading it on pages where eye tracking is not used:

```typescript
// Dynamic import — only loads when needed
async function enableTracking() {
  const webgazer = (await import('@webgazer-ts/core')).default;
  await webgazer.begin();
}
```

For Vite/webpack users, the ESM import is automatically code-split if you use dynamic imports.

## 9. Skip Frames During Heavy Load

If your page is doing heavy work (e.g. WebGL rendering), you can let Webgazer skip frames
using the built-in pause/resume:

```typescript
// Before heavy computation
webgazer.pause();
await doHeavyWork();
await webgazer.resume();
```

## Performance Summary

| Technique | Impact | Cost |
|-----------|--------|------|
| `threadedRidge` regressor | ★★★★ | Minimal — 1-2 frame latency |
| Throttle listener (100ms) | ★★★ | Reduced UI update rate |
| Reduce camera resolution | ★★★ | Tiny accuracy loss |
| Disable rendering overlays | ★★ | None |
| Kalman filter disabled | ★ | Jittery output |
| Pause on tab hidden | ★★★ | Must resume manually |
| Dynamic import | ★★ | Slightly longer first load |

## Device-Specific Notes

### Mobile / Low-end Devices
- Always use `threadedRidge`
- Set camera to 480p
- Throttle listener to 100–200ms
- Disable all rendering overlays

### Desktop (Fast CPU/GPU)
- Default `ridge` is fine
- Use 720p for better tracking accuracy
- Kalman filter provides meaningful smoothing at full frame rate

### Embedded Contexts (iframes, Electron)
- Verify `getUserMedia` is available before calling `begin()`
- Web Workers may not be available — use `ridge` instead of `threadedRidge`
- Call `webgazer.detectCompatibility()` and check `webgazer.getCompatibilityWarnings()`

## See Also

- [Kalman Filter Guide](/guide/advanced/kalman-filter)
- [Custom Regression](/guide/advanced/custom-regression)
- [Configuration Reference](/guide/core/configuration)
- [threadedRidge Architecture](/guide/architecture)
