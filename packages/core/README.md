# @webgazer-ts/core

[![npm version](https://img.shields.io/npm/v/@webgazer-ts/core.svg)](https://www.npmjs.com/package/@webgazer-ts/core)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](../../LICENSE.md)
[![Documentation](https://img.shields.io/badge/docs-online-brightgreen.svg)](https://jhndrncrz.github.io/webgazer-ts/)

Modern TypeScript rewrite of [Webgazer.js](https://webgazer.cs.brown.edu) - webcam eye tracking for academic research.

## 📚 Documentation

**[View Full Documentation →](https://jhndrncrz.github.io/webgazer-ts/)**

- [Getting Started](https://jhndrncrz.github.io/webgazer-ts/guide/getting-started)
- [API Reference](https://jhndrncrz.github.io/webgazer-ts/api/core/)
- [Configuration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/core/configuration)
- [Examples](https://jhndrncrz.github.io/webgazer-ts/examples/basic)

## Features

- 🎯 **Accurate Gaze Tracking** - Ridge regression + Kalman filtering
- 🔧 **100% API Compatible** - Drop-in replacement for Webgazer.js
- 📦 **TypeScript Native** - Full type safety and IntelliSense
- ⚡ **Modern Build** - ES modules, tree-shaking, optimized bundles
- 🎨 **Visual Feedback** - Video preview, face overlay, gaze dot
- 💾 **Data Persistence** - Optional localStorage for calibration
- 🔒 **Privacy First** - All processing happens locally

## Installation

```bash
npm install @webgazer-ts/core
```

## Quick Start

```typescript
import webgazer from '@webgazer-ts/core';

// Initialize and start tracking
await webgazer
  .setTracker('TFFacemesh')
  .setRegression('ridge')
  .begin();

// Show video preview
webgazer.showVideoPreview(true);

// Listen for gaze predictions
webgazer.setGazeListener((data, timestamp) => {
  if (data) {
    console.log(`Looking at: (${data.x}, ${data.y})`);
  }
});
```

## Usage

### ES Modules (Recommended)

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();
```

### CommonJS

```javascript
const webgazer = require('@webgazer-ts/core').default;

webgazer.begin();
```

### Browser (UMD)

```html
<script src="node_modules/@webgazer-ts/core/dist/webgazer.js"></script>
<script>
  // Available as global 'webgazer'
  webgazer.begin();
</script>
```

### CDN

```html
<script type="module">
  import webgazer from 'https://cdn.jsdelivr.net/npm/@webgazer-ts/core/+esm';
  await webgazer.begin();
</script>
```

## API Overview

### Lifecycle

```typescript
await webgazer.begin();        // Initialize and start
await webgazer.end();          // Stop and cleanup
await webgazer.pause();        // Pause tracking
await webgazer.resume();       // Resume tracking
```

### Configuration

```typescript
webgazer
  .setTracker('TFFacemesh')              // Face tracker
  .setRegression('ridge')                 // Regression model
  .saveDataAcrossSessions(false)          // Data persistence
  .applyKalmanFilter(true)                // Smoothing
  .showVideoPreview(true)                 // Show camera
  .showFaceOverlay(true)                  // Show face mesh
  .showPredictionPoints(true)             // Show gaze dot
  .showFaceFeedbackBox(true);            // Show positioning guide
```

### Predictions

```typescript
// Listen to predictions (60 FPS)
webgazer.setGazeListener((data, timestamp) => {
  if (data) {
    console.log(`Gaze: (${data.x}, ${data.y})`);
  }
});

// Get current prediction
const prediction = webgazer.getCurrentPrediction();
```

### Calibration

```typescript
// Add calibration point
webgazer.recordScreenPosition(x, y, 'click');

// Clear calibration data
webgazer.clearData();

// Get calibration count
const count = webgazer.getCalibrationPointCount();
```

### Mouse Events

```typescript
// Enable automatic calibration from mouse
webgazer.addMouseEventListeners();

// Disable
webgazer.removeMouseEventListeners();
```

## TypeScript

Full type definitions included:

```typescript
import webgazer, { 
  GazePrediction, 
  WebgazerConfig,
  EyeFeatures 
} from '@webgazer-ts/core';

const handleGaze = (data: GazePrediction | null, timestamp: number) => {
  if (data) {
    const { x, y } = data;
    console.log(`Gaze at (${x}, ${y})`);
  }
};

webgazer.setGazeListener(handleGaze);
```

## Configuration Options

```typescript
interface WebgazerConfig {
  tracker: 'TFFacemesh';
  regressor: 'ridge' | 'ridgeThreaded' | 'ridgeWeighted';
  saveDataAcrossSessions: boolean;
  videoViewerWidth: number;
  videoViewerHeight: number;
  showVideo: boolean;
  showFaceOverlay: boolean;
  showPredictionPoints: boolean;
  showFaceFeedbackBox: boolean;
  applyKalmanFilter: boolean;
}
```

## Browser Support

Requires:
- HTTPS or localhost (for camera access)
- WebRTC support
- WebGL (for TensorFlow.js)

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (limited)

## 🚀 Drop-in Replacement Guide

`@webgazer-ts/core` is designed to be a seamless replacement for the original WebGazer.js.

### 1. Script Tag Usage (CDN)
If you previously used:
```html
<script src="https://webgazer.cs.brown.edu/webgazer.js"></script>
```
You can now use:
```html
<script src="https://unpkg.com/@webgazer-ts/core@latest/dist/webgazer.js"></script>
```
The `window.webgazer` global is automatically initialized.

### 2. NPM Usage
```bash
npm install @webgazer-ts/core
```
```typescript
import webgazer from '@webgazer-ts/core';
// Everything works as expected!
```

### 3. API Compatibility Matrix
| Feature | Status | Notes |
|---------|--------|-------|
| `webgazer.begin()` | ✅ | Returns `Promise<Webgazer>` (modern) |
| `webgazer.params` | ✅ | Full parity with original config |
| `webgazer.util` | ✅ | Includes `DataWindow` and `bound` |
| `ridge`, `weightedRidge` | ✅ | Default regression models |
| `TFFacemesh` | ✅ | Default tracker |

## API Overview

### Lifecycle

```typescript
await webgazer.begin();        // Initialize and start
webgazer.end();                // Stop and cleanup
webgazer.pause();              // Pause tracking
webgazer.resume();             // Resume tracking
```

### Configuration

```typescript
webgazer
  .setTracker('TFFacemesh')              // Face tracker
  .setRegression('ridge')                 // Regression model
  .saveDataAcrossSessions(false)          // Data persistence
  .applyKalmanFilter(true)                // Smoothing
  .showVideoPreview(true)                 // Show camera
  .showFaceOverlay(true)                  // Show face mesh
  .showPredictionPoints(true)             // Show gaze dot
  .showFaceFeedbackBox(true);            // Show positioning guide
```

### Predictions

```typescript
// Listen to predictions (60 FPS)
webgazer.setGazeListener((data, timestamp) => {
  if (data) {
    console.log(`Gaze: (${data.x}, ${data.y})`);
  }
});

// Get current prediction
const prediction = await webgazer.getCurrentPrediction();
```

## 🤝 Credits & Citation

This project is a TypeScript port of the original **WebGazer.js** developed by the Brown HCI Group. All core algorithms and methodology are credited to the original authors.

If you use this library in academic work, please cite the original paper:

```bibtex
@inproceedings{papoutsaki2016webgazer,
  author     = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey and Nediyana Daskalova and Jeff Huang and James Hays},
  title      = {{Webgazer}: Scalable Webcam Eye Tracking Using User Interactions},
  booktitle  = {Proceedings of the 25th International Joint Conference on Artificial Intelligence (IJCAI)},
  pages      = {3839--3845},
  year       = {2016}
}
```

## License

GPL-3.0-or-later

See [LICENSE.md](../../LICENSE.md) for details.

