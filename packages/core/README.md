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
<script src="node_modules/@webgazer-ts/core/dist/webgazer-ts.umd.cjs"></script>
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

## Migration from Webgazer.js

This package is 100% API compatible with Webgazer.js:

```typescript
// This exact code works in both libraries
webgazer
  .setRegression('ridge')
  .setTracker('TFFacemesh')
  .setGazeListener((data) => console.log(data))
  .begin();
```

**Breaking Changes in v0.2.0:**
- `saveDataAcrossSessions` now defaults to `false` (privacy-first)

To keep old behavior:
```typescript
webgazer.saveDataAcrossSessions(true).begin();
```

See [Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration) for details.

## React Integration

For React apps, use the React package:

```bash
npm install @webgazer-ts/react
```

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, isRunning, start } = useWebgazer({
    autoStart: true
  });

  return <div>Gaze: {gazeData?.x}, {gazeData?.y}</div>;
}
```

See [@webgazer-ts/react](https://www.npmjs.com/package/@webgazer-ts/react) for full React documentation.

## Examples

### Basic Setup

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();
webgazer.showVideoPreview(true);

webgazer.setGazeListener((data) => {
  if (data) {
    console.log(`Looking at (${data.x}, ${data.y})`);
  }
});
```

### With Calibration

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();

// Add calibration points
document.addEventListener('click', (e) => {
  webgazer.recordScreenPosition(e.clientX, e.clientY, 'click');
  console.log('Calibration points:', webgazer.getCalibrationPointCount());
});
```

### Custom Regression

```typescript
import webgazer, { Regressor, EyeFeatures } from '@webgazer-ts/core';

class MyRegressor implements Regressor {
  predict(eyeFeatures: EyeFeatures) {
    // Your prediction logic
    return { x: 500, y: 300 };
  }
  
  addData(eyeFeatures: EyeFeatures, screenPos: [number, number], type: string) {
    // Your training logic
  }
  
  // ... implement other required methods
}

webgazer.setRegression(new MyRegressor());
```

## Performance

- **Prediction Rate:** 60 FPS (16.7ms)
- **Initialization:** ~800ms (model loading)
- **Accuracy:** ±100-200px (after calibration)
- **Memory:** ~50MB typical
- **Bundle Size:** ~15KB gzipped (core only)

## Privacy

- ✅ All processing happens **locally in your browser**
- ✅ No video or images sent to any server
- ✅ Optional localStorage (opt-in in v0.2.0+)
- ✅ User must grant camera permission
- ✅ Full control over data

## Academic Use

This library is designed for academic research. Please cite the original Webgazer.js:

```bibtex
@inproceedings{papoutsaki2016webgazer,
  author = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey and Nediyana Daskalova and Jeff Huang and James Hays},
  title = {WebGazer: Scalable Webcam Eye Tracking Using User Interactions},
  booktitle = {Proceedings of the 25th International Joint Conference on Artificial Intelligence (IJCAI)},
  pages = {3839--3845},
  year = {2016}
}
```

## License

GPL-3.0-or-later

For academic research use. See [LICENSE.md](../../LICENSE.md) for details.

## Credits

Based on [Webgazer.js](https://webgazer.cs.brown.edu) by Brown HCI Lab.

**Original Authors:**
- Alexandra Papoutsaki
- James Laskey
- Jeff Huang

**TypeScript Rewrite:**
- John Adrian Cruz

## Support

- 📖 [Documentation](https://jhndrncrz.github.io/webgazer-ts/)
- 💬 [GitHub Discussions](https://github.com/jhndrncrz/webgazer-ts/discussions)
- 🐛 [Issue Tracker](https://github.com/jhndrncrz/webgazer-ts/issues)
- 📧 [Email](mailto:webgazer@lists.cs.brown.edu)

## Links

- [npm Package](https://www.npmjs.com/package/@webgazer-ts/core)
- [GitHub Repository](https://github.com/jhndrncrz/webgazer-ts)
- [Documentation Site](https://jhndrncrz.github.io/webgazer-ts/)
- [Original Webgazer.js](https://webgazer.cs.brown.edu)

---

Made with ❤️ for academic research
