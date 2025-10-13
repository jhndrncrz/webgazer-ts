# What is Webgazer.ts?

Webgazer.ts is a modern TypeScript rewrite of [Webgazer.js](https://webgazer.cs.brown.edu), a webcam eye tracking library for academic research. It provides accurate gaze prediction using only a standard webcam, with full backward compatibility and enhanced developer experience.

## Overview

Webgazer.ts enables you to track where users are looking on their screen in real-time using computer vision and machine learning - all running client-side in the browser.

### Key Features

- **🎯 Accurate Eye Tracking** - Uses TensorFlow.js MediaPipe FaceMesh for face detection and ridge regression for gaze prediction
- **⚛️ React Support** - Dedicated React package with hooks and components
- **🔧 Type Safe** - Full TypeScript support with comprehensive type definitions
- **🚀 Drop-in Replacement** - 100% API compatible with original Webgazer.js
- **📊 Built-in Tools** - Calibration, heatmaps, recording, and data persistence
- **🔒 Privacy First** - All processing happens locally in the browser

## How It Works

1. **Face Detection** - MediaPipe FaceMesh detects 468 facial landmarks at 60 FPS
2. **Eye Extraction** - Extracts left and right eye regions from video frames
3. **Feature Processing** - Converts eye images to feature vectors (grayscale, resize, histogram equalization)
4. **Calibration** - User clicks/looks at points on screen to train the model
5. **Gaze Prediction** - Ridge regression predicts screen coordinates from eye features
6. **Smoothing** - 4D Kalman filter smooths predictions to reduce jitter

```
Camera → Face Detection → Eye Extraction → Feature Processing
                                               ↓
                                          Calibration Data
                                               ↓
User Looks at Screen ← Gaze Prediction ← Ridge Regression
```

## Architecture

Webgazer.ts is organized as a monorepo with two packages:

### @webgazer-ts/core

The core library - framework-agnostic, works with any JavaScript project.

**Modules:**
- `core/` - Main WebGazer singleton class
- `trackers/` - Face tracking (TensorFlow FaceMesh)
- `regressors/` - Gaze prediction models (Ridge, RidgeWeighted, RidgeThreaded)
- `events/` - Event handling (mouse, predictions)
- `rendering/` - Visual feedback (video, overlay, gaze dot)
- `calibration/` - Calibration system
- `utils/` - Utilities (data windows, matrix ops, image processing)

### @webgazer-ts/react

React-specific hooks and components built on top of core.

**Exports:**
- **7 Hooks** - `useWebgazer`, `useGazeTracking`, `useCalibration`, `useGazeElement`, `useGazeHeatmap`, `useGazeRecording`, `useWebgazerContext`
- **4 Components** - `<WebgazerProvider>`, `<CalibrationScreen>`, `<GazeElement>`, `<HeatmapOverlay>`

## When to Use Webgazer.ts

### ✅ Good Use Cases

- **Academic Research** - User studies, HCI experiments, reading research
- **UX Testing** - Attention tracking, usability studies, A/B testing
- **Accessibility** - Assistive technology, gaze-based controls
- **Prototyping** - Interactive demos, proof-of-concepts
- **Education** - Learning tools, engagement tracking

### ❌ Not Recommended For

- **Production Applications** - Accuracy varies by user/environment
- **Security-Critical** - Not suitable for authentication
- **Medical Devices** - Not FDA approved or medically validated
- **High-Precision Tasks** - ±100-200px accuracy after calibration

## Comparison with Original

| Feature | Webgazer.js | Webgazer.ts |
|---------|-------------|-------------|
| **Language** | JavaScript | TypeScript |
| **Module System** | UMD | ESM + CJS |
| **API Compatibility** | N/A | 100% compatible |
| **React Support** | Manual integration | Native hooks & components |
| **Type Definitions** | Via DefinitelyTyped | Built-in |
| **Bundle Size** | ~200KB | ~15KB (core, gzipped) |
| **Tree Shaking** | No | Yes |
| **Development** | Webpack | Vite |
| **Testing** | Manual | Vitest |

## Browser Requirements

- **WebRTC Support** - For camera access
- **WebGL** - For TensorFlow.js
- **ES2020** - Modern JavaScript features

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (with limitations)

## Privacy & Data

Webgazer.ts is **privacy-first**:

- ✅ All processing happens **locally in your browser**
- ✅ No video or images sent to any server
- ✅ Optional localStorage for calibration data (disabled by default in v0.2.0+)
- ✅ User must grant camera permission
- ✅ Full control over data collection and storage

## Next Steps

Ready to get started?

- [Installation Guide](/guide/getting-started)
- [Core Library Usage](/guide/core/basic-usage)
- [React Integration](/guide/react/quick-start)
- [API Reference](/api/core/)
