# Getting Started

Get up and running with Webgazer.ts in minutes.

## Installation

Choose the package that fits your project:

::: code-group

```bash [Core (Vanilla JS/TS)]
npm install @webgazer-ts/core
```

```bash [React]
npm install @webgazer-ts/react
```

```bash [Both]
npm install @webgazer-ts/core @webgazer-ts/react
```

:::

::: tip
Using pnpm or yarn? Just replace `npm install` with `pnpm add` or `yarn add`
:::

## Quick Start (Core)

Here's the simplest way to get eye tracking running:

```typescript
import webgazer from '@webgazer-ts/core';

// Initialize and start tracking
await webgazer
  .setTracker('TFFacemesh')
  .setRegression('ridge')
  .begin();

// Show the video preview
webgazer.showVideoPreview(true);

// Listen for gaze predictions
webgazer.setGazeListener((data, timestamp) => {
  if (data) {
    console.log(`Looking at: (${Math.round(data.x)}, ${Math.round(data.y)})`);
  }
});
```

That's it! Your webcam will activate and start tracking eye movements.

### With Calibration

For better accuracy, add calibration:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .calibration-point {
      position: fixed;
      width: 20px;
      height: 20px;
      background: red;
      border-radius: 50%;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="calibration-points"></div>
  
  <script type="module">
    import webgazer from '@webgazer-ts/core';
    
    // Start webgazer
    await webgazer.begin();
    
    // Create 9 calibration points
    const container = document.getElementById('calibration-points');
    const positions = [
      [10, 10], [50, 10], [90, 10],
      [10, 50], [50, 50], [90, 50],
      [10, 90], [50, 90], [90, 90]
    ];
    
    positions.forEach(([x, y]) => {
      const point = document.createElement('div');
      point.className = 'calibration-point';
      point.style.left = `${x}%`;
      point.style.top = `${y}%`;
      
      // Click records calibration data automatically
      point.addEventListener('click', () => {
        point.style.background = 'green';
      });
      
      container.appendChild(point);
    });
  </script>
</body>
</html>
```

## Quick Start (React)

For React applications, use the hooks:

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, stop, isRunning } = useWebgazer({
    autoStart: true,
    showVideoPreview: true
  });

  return (
    <div>
      <h1>Gaze Tracker</h1>
      
      <div>
        Status: {isRunning ? '🟢 Running' : '🔴 Stopped'}
      </div>
      
      {gazeData && (
        <div>
          Looking at: ({Math.round(gazeData.x)}, {Math.round(gazeData.y)})
        </div>
      )}
      
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### With Context Provider

For larger applications, use the provider pattern:

```tsx
import { WebgazerProvider, useGazeTracking } from '@webgazer-ts/react';

function GazeDisplay() {
  const gaze = useGazeTracking();
  
  return gaze ? (
    <div>Gaze: ({Math.round(gaze.x)}, {Math.round(gaze.y)})</div>
  ) : (
    <div>Waiting...</div>
  );
}

function App() {
  return (
    <WebgazerProvider autoStart showVideoPreview>
      <h1>My App</h1>
      <GazeDisplay />
    </WebgazerProvider>
  );
}
```

## CDN Usage (No Build Step)

Want to try Webgazer.ts without a build tool?

```html
<!DOCTYPE html>
<html>
<head>
  <title>Webgazer.ts Demo</title>
</head>
<body>
  <h1>Gaze Tracker</h1>
  <div id="gaze-position">Move your eyes...</div>
  
  <script type="module">
    // Import from CDN
    import webgazer from 'https://cdn.jsdelivr.net/npm/@webgazer-ts/core/+esm';
    
    await webgazer.begin();
    webgazer.showVideoPreview(true);
    
    const display = document.getElementById('gaze-position');
    
    webgazer.setGazeListener((data) => {
      if (data) {
        display.textContent = `Looking at: (${Math.round(data.x)}, ${Math.round(data.y)})`;
      }
    });
  </script>
</body>
</html>
```

## Understanding the Flow

1. **Initialization** - `webgazer.begin()` loads the FaceMesh model (~800ms)
2. **Camera Access** - Browser requests camera permission
3. **Face Detection** - MediaPipe detects face and extracts eye regions at 60 FPS
4. **Calibration** - User clicks on screen to train the regression model
5. **Prediction** - Eye features → Ridge regression → Screen coordinates (x, y)
6. **Smoothing** - Kalman filter reduces jitter in predictions

```
┌──────────────┐
│ begin()      │ Load model, request camera
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ User Clicks  │ Collect calibration data
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Prediction   │ Real-time gaze coordinates
└──────────────┘
```

## Configuration Options

Customize behavior with options:

```typescript
await webgazer
  .setTracker('TFFacemesh')              // Face tracker
  .setRegression('ridge')                 // Regression model
  .saveDataAcrossSessions(false)          // Don't persist data
  .applyKalmanFilter(true)                // Smooth predictions
  .showVideoPreview(true)                 // Show camera
  .showFaceOverlay(true)                  // Show face mesh
  .showPredictionPoints(true)             // Show gaze dot
  .begin();
```

## Next Steps

- **Core Library** - [Learn about configuration](/guide/core/configuration)
- **React** - [Explore all hooks](/guide/react/hooks)
- **Calibration** - [Improve accuracy](/guide/core/calibration)
- **Examples** - [See complete examples](/examples/basic)

## Common Issues

### Camera Not Working

Make sure:
- HTTPS or localhost (required for WebRTC)
- Camera permissions granted
- No other app using the camera

### Poor Accuracy

Try:
- Better lighting conditions
- Calibrate with 9+ points
- Keep head still during calibration
- Position camera at eye level

### Performance Issues

Optimize by:
- Reducing video resolution (320x240 default is fine)
- Disabling overlays when not needed
- Using `ridgeThreaded` regression for Web Worker support

## Getting Help

- 📖 [Read the full guide](/guide/core/basic-usage)
- 💬 [GitHub Discussions](https://github.com/jhndrncrz/webgazer-ts/discussions)
- 🐛 [Report Issues](https://github.com/jhndrncrz/webgazer-ts/issues)
- 📧 [Email Support](mailto:webgazer@lists.cs.brown.edu)
