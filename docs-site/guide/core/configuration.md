# Configuration

Customize Webgazer.ts behavior with configuration options.

## Regression Algorithms

Choose the regression algorithm for gaze prediction:

```typescript
// Standard ridge regression (default)
webgazer.setRegression('ridge');

// Weighted ridge (prioritizes recent data)
webgazer.setRegression('weightedRidge');

// Threaded ridge (uses Web Workers)
webgazer.setRegression('threadedRidge');
```

### Algorithm Comparison

| Algorithm | Speed | Accuracy | Use Case |
|-----------|-------|----------|----------|
| `ridge` | ⚡⚡⚡ Fast | ✓ Good | General purpose |
| `weightedRidge` | ⚡⚡ Medium | ✓✓ Better | Adapts to user movement |
| `threadedRidge` | ⚡⚡⚡ Fast | ✓ Good | Large datasets, non-blocking |

## Face Tracking

Configure face detection:

```typescript
// TensorFlow FaceMesh (default, recommended)
webgazer.setTracker('TFFacemesh');
```

## Visual Feedback

Control what users see:

```typescript
// Show/hide camera feed
webgazer.showVideo(true);

// Show/hide face detection overlay
webgazer.showFaceOverlay(true);

// Show/hide face feedback box
webgazer.showFaceFeedbackBox(true);

// Show/hide gaze prediction dot
webgazer.showPredictionPoints(true);
```

### Custom Video Element

Place the video feed anywhere:

```typescript
// Set custom video element
const videoElement = document.getElementById('my-video');
webgazer.setVideoElement(videoElement);
```

```html
<video id="my-video" autoplay playsinline></video>
```

## Data Persistence

Control how calibration data is stored:

```typescript
// Save data across browser sessions (default: false)
webgazer.saveDataAcrossSessions(true);

// Clear all stored data
webgazer.clearData();

// Get current training data
const data = webgazer.getStoredData();
```

::: warning Privacy Note
Only enable data persistence with explicit user consent. Calibration data may contain sensitive biometric information.
:::

## Smoothing & Filtering

Reduce jitter in gaze predictions:

```typescript
// Enable Kalman filter (recommended)
webgazer.applyKalmanFilter(true);

// Adjust smoothing strength (0-1, default: 0.5)
webgazer.setKalmanFilterStrength(0.7);
```

### Custom Kalman Filter

For advanced use cases:

```typescript
import { KalmanFilter, KalmanFilter4D } from '@webgazer-ts/core';

// 2D Kalman filter (x, y only)
const filter2D = new KalmanFilter({
  R: 0.01, // Measurement noise
  Q: 3     // Process noise
});

// 4D Kalman filter (x, y, vx, vy)
const filter4D = new KalmanFilter4D({
  measurementNoise: 10,
  processNoise: 1,
  initialState: { x: 0, y: 0, vx: 0, vy: 0 }
});

// Apply to predictions
webgazer.setGazeListener((data) => {
  if (data) {
    const filtered = filter2D.filter(data.x, data.y);
    console.log(filtered);
  }
});
```

## Camera Settings

Configure webcam input:

```typescript
// Request specific camera resolution
const constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  }
};

webgazer.setCameraConstraints(constraints);
```

## Performance Tuning

Optimize for your use case:

```typescript
// Set maximum frame rate (default: 60)
webgazer.setMaxFPS(30);

// Or set by interval in ms
webgazer.setPredictionInterval(33); // ~30 FPS

// Skip frames for face detection (for slow devices)
// 1 = every frame, 2 = every other frame, etc.
webgazer.setFaceDetectionInterval(2);
```

## Logging & Debugging

Control console output:

```typescript
// Set log level ('debug' | 'info' | 'warn' | 'error' | 'none')
webgazer.setLogLevel('debug');

// Legacy alias for setLogLevel('debug')
webgazer.setDebugMode(true);
```

## Quality of Life Features

### Auto-Pause on Blur

Automatically stop tracking when the user switches tabs to save battery and respect privacy.

```typescript
webgazer.setAutoPauseOnBlur(true);
```

## Smoothing & Filtering

Reduce jitter in gaze predictions:

```typescript
// Choose smoothing algorithm ('average' | 'kalman' | 'ema')
webgazer.setSmoothingType('ema');

// Configure Exponential Moving Average (EMA) strength (0-1)
webgazer.setEMAAlpha(0.2);

// Enable/disable Kalman filter
webgazer.applyKalmanFilter(true);
```

## Event Callbacks

Hook into Webgazer lifecycle using the EventEmitter style:

```typescript
// When tracking starts
webgazer.on('start', () => {
  console.log('Tracking started');
});

// When prediction updates
webgazer.on('prediction', (data) => {
  console.log('New prediction:', data);
});
```


## Advanced Configuration

### Complete Configuration Object

```typescript
const config = {
  // Regression
  regression: 'weightedRidge',
  
  // Tracker
  tracker: 'TFFacemesh',
  
  // Visual
  showVideo: true,
  showFaceOverlay: true,
  showFaceFeedbackBox: true,
  showPredictionPoints: false,
  
  // Performance
  predictionInterval: 16,
  faceDetectionInterval: 1,
  
  // Data
  saveDataAcrossSessions: false,
  
  // Filtering
  applyKalmanFilter: true,
  kalmanFilterStrength: 0.5,
  
  // Camera
  cameraConstraints: {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  }
};

// Apply all at once
Object.entries(config).forEach(([key, value]) => {
  const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  if (typeof webgazer[method] === 'function') {
    webgazer[method](value);
  }
});
```

## Configuration Examples

### High Accuracy Mode

```typescript
webgazer
  .setRegression('weightedRidge')
  .applyKalmanFilter(true)
  .setKalmanFilterStrength(0.7)
  .showFaceFeedbackBox(true)
  .saveDataAcrossSessions(true);
```

### Performance Mode

```typescript
webgazer
  .setRegression('ridge')
  .setPredictionInterval(33) // 30 FPS
  .setFaceDetectionInterval(2)
  .showVideo(false)
  .showFaceOverlay(false);
```

### Privacy Mode

```typescript
webgazer
  .saveDataAcrossSessions(false)
  .showVideo(false)
  .showPredictionPoints(false);

// Clear data on session end
window.addEventListener('beforeunload', () => {
  webgazer.clearData();
});
```

## Runtime Configuration

Change settings while tracking:

```typescript
// Start with default settings
await webgazer.begin();

// Change settings dynamically
document.getElementById('high-accuracy').addEventListener('click', () => {
  webgazer.setRegression('weightedRidge');
  webgazer.applyKalmanFilter(true);
});

document.getElementById('fast-mode').addEventListener('click', () => {
  webgazer.setRegression('ridge');
  webgazer.setPredictionInterval(33);
});
```

## Debugging

Enable verbose logging:

```typescript
// Enable debug mode
webgazer.setDebugMode(true);

// Log compatibility info
webgazer.logCompatibilityInfo();

// Get current configuration
const currentConfig = webgazer.getConfig();
console.log('Current config:', currentConfig);
```

## Next Steps

- [Calibration](/guide/core/calibration) - Improve accuracy
- [Data Persistence](/guide/core/data-persistence) - Manage stored data
- [Performance Optimization](/guide/advanced/performance) - Advanced tuning
- [API Reference](/api/core/) - Complete API documentation
