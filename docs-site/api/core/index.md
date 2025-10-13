# Core API Reference

Complete API documentation for `@webgazer-ts/core`.

## Overview

The core library provides the main `webgazer` singleton instance with methods for:

- 🎬 **Lifecycle Management** - Start, stop, pause, resume tracking
- ⚙️ **Configuration** - Set trackers, regressors, visual feedback
- 📊 **Data Management** - Add calibration data, clear data, persistence
- 🎯 **Predictions** - Get real-time gaze coordinates
- 🎨 **Rendering** - Control video preview, overlays, gaze dot
- 📡 **Events** - Listen to predictions, calibration updates

## Quick Reference

```typescript
import webgazer from '@webgazer-ts/core';

// Lifecycle
await webgazer.begin();
await webgazer.end();
await webgazer.pause();
await webgazer.resume();

// Configuration
webgazer.setTracker('TFFacemesh');
webgazer.setRegression('ridge');
webgazer.saveDataAcrossSessions(false);
webgazer.applyKalmanFilter(true);

// Visual Feedback
webgazer.showVideoPreview(true);
webgazer.showFaceOverlay(true);
webgazer.showPredictionPoints(true);
webgazer.showFaceFeedbackBox(true);

// Data
webgazer.setGazeListener((data, timestamp) => {});
const prediction = webgazer.getCurrentPrediction();
webgazer.clearData();

// Calibration
webgazer.recordScreenPosition(x, y, 'click');
const count = webgazer.getCalibrationPointCount();

// Mouse Events
webgazer.addMouseEventListeners();
webgazer.removeMouseEventListeners();
```

## Core Classes

### WebGazer (Main Singleton)

The primary interface for all eye tracking operations.

[View detailed API →](./modules/core_WebGazer)

**Key Methods:**
- `begin()` - Initialize and start tracking
- `end()` - Stop and cleanup
- `setGazeListener()` - Subscribe to predictions
- `getCurrentPrediction()` - Get latest gaze position

### Trackers

Face and eye tracking implementations.

[View tracker API →](./modules/trackers_TensorFlowFaceMeshTracker)

**Available Trackers:**
- `TFFacemesh` - MediaPipe FaceMesh (recommended)

### Regressors

Gaze prediction algorithms.

[View regressor API →](./modules/regressors_RidgeRegressor)

**Available Regressors:**
- `ridge` - Standard ridge regression
- `ridgeWeighted` - Weighted ridge regression
- `ridgeThreaded` - Web Worker-based ridge regression

## Type Definitions

### GazePrediction

```typescript
interface GazePrediction {
  x: number;  // Screen X coordinate
  y: number;  // Screen Y coordinate
}
```

### WebgazerConfig

```typescript
interface WebgazerConfig {
  tracker: 'TFFacemesh';
  regressor: 'ridge' | 'ridgeWeighted' | 'ridgeThreaded';
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

### EyeFeatures

```typescript
interface EyeFeatures {
  left: number[];   // Left eye feature vector
  right: number[];  // Right eye feature vector
}
```

## Module Organization

```
@webgazer-ts/core
├── core/
│   ├── WebGazer.ts           // Main singleton
│   └── WebgazerConfig.ts     // Configuration
├── trackers/
│   └── TensorFlowFaceMeshTracker.ts
├── regressors/
│   ├── RidgeRegressor.ts
│   ├── RidgeWeightedRegressor.ts
│   └── RidgeThreadedRegressor.ts
├── events/
│   ├── EventManager.ts
│   └── MouseEventHandler.ts
├── rendering/
│   ├── VideoRenderer.ts
│   ├── OverlayRenderer.ts
│   └── GazeDotRenderer.ts
├── calibration/
│   └── CalibrationManager.ts
└── utils/
    ├── data/
    ├── math/
    ├── image/
    └── filters/
```

## Usage Examples

### Basic Setup

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer
  .setTracker('TFFacemesh')
  .setRegression('ridge')
  .begin();

webgazer.setGazeListener((data) => {
  if (data) {
    console.log(`Gaze: (${data.x}, ${data.y})`);
  }
});
```

### With Configuration

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer
  .setTracker('TFFacemesh')
  .setRegression('ridge')
  .saveDataAcrossSessions(false)
  .applyKalmanFilter(true)
  .showVideoPreview(true)
  .showFaceOverlay(true)
  .showPredictionPoints(true)
  .begin();
```

### Custom Calibration

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();

// Record calibration point
function handleClick(event: MouseEvent) {
  webgazer.recordScreenPosition(event.clientX, event.clientY, 'click');
}

document.addEventListener('click', handleClick);
```

### Access Internal Components

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();

// Get tracker instance
const tracker = webgazer.getTracker();
console.log('Tracker:', tracker.name);

// Get regressor instance
const regressor = webgazer.getRegression();
console.log('Regressor:', regressor.name);

// Get video element
const canvas = webgazer.getVideoElementCanvas();
console.log('Video canvas:', canvas);
```

## Advanced Usage

### Custom Regression Model

```typescript
import webgazer, { Regressor, EyeFeatures, GazePrediction } from '@webgazer-ts/core';

class MyCustomRegressor implements Regressor {
  name = 'myCustom';
  
  predict(eyeFeatures: EyeFeatures): GazePrediction | null {
    // Your prediction logic
    return { x: 500, y: 300 };
  }
  
  addData(eyeFeatures: EyeFeatures, screenPos: [number, number], type: string): void {
    // Your training logic
  }
  
  // ... implement other required methods
}

webgazer.setRegression(new MyCustomRegressor());
```

### Event Handling

```typescript
import webgazer from '@webgazer-ts/core';

// Add event listeners
webgazer.on('prediction', (data) => {
  console.log('Prediction:', data);
});

webgazer.on('calibration', (count) => {
  console.log('Calibration points:', count);
});

// Remove listeners
webgazer.off('prediction', handler);
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (limited)

## Performance Considerations

- Prediction rate: 60 FPS (16.7ms per frame)
- Model loading: ~800ms initial load
- Memory usage: ~50MB typical
- Bundle size: ~15KB gzipped

## Next Steps

- [View full TypeDoc API →](./modules)
- [Read usage guide →](/guide/core/basic-usage)
- [See examples →](/examples/basic)
