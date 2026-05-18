# Webgazer.ts

[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![npm version](https://img.shields.io/npm/v/@webgazer-ts/core.svg)](https://www.npmjs.com/package/@webgazer-ts/core)
[![Documentation](https://img.shields.io/badge/docs-online-brightgreen.svg)](https://jhndrncrz.github.io/webgazer-ts/)

Modern AI-assisted TypeScript rewrite of [Webgazer.js](https://webgazer.cs.brown.edu) with React support and improved performance.

## ✨ Features

- 🎯 **Eye tracking in the browser** - No special hardware required
- � **Drop-in replacement** - Compatible with original Webgazer.js
- ⚛️ **React integration** - Official hooks and components
- 🔒 **Privacy-first** - All processing happens locally
- 📘 **Full TypeScript** - Complete type safety
- 🎨 **Modern architecture** - Modular, tree-shakeable code
- ⚡ **Performance optimized** - GPU acceleration, Kalman filtering
- �📚 **Complete documentation** - Guides, API reference, examples

## 📦 Packages

| Package | npm | Description |
|---------|-----|-------------|
| [@webgazer-ts/core](./packages/core) | [![npm](https://img.shields.io/npm/v/@webgazer-ts/core.svg)](https://www.npmjs.com/package/@webgazer-ts/core) | Core eye tracking library |
| [@webgazer-ts/react](./packages/react) | [![npm](https://img.shields.io/npm/v/@webgazer-ts/react.svg)](https://www.npmjs.com/package/@webgazer-ts/react) | React hooks and components |

## 🚀 Drop-in Replacement Guide

`webgazer-ts` is designed to be a seamless replacement for the original WebGazer.js.

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

You can also use the new top-level facade package:
```bash
npm install webgazer-ts
```
```typescript
import webgazer from 'webgazer-ts';
import { useWebgazer } from 'webgazer-ts/react';
```

### 3. API Compatibility Matrix
| Feature | Status | Notes |
|---------|--------|-------|
| `webgazer.begin()` | ✅ | Returns `Promise<Webgazer>` (modern) |
| `webgazer.params` | ✅ | Full parity with original config |
| `webgazer.util` | ✅ | Includes `DataWindow` and `bound` |
| `ridge`, `weightedRidge` | ✅ | Default regression models |
| `TFFacemesh` | ✅ | Default tracker |

## ✨ Modern Enhancements

`webgazer-ts` adds several features not present in the original library:

- 🔋 **Performance Throttling:** Set `maxFPS` or `predictionInterval` to save battery.
- ⚡ **Tracker Skipping:** Use `faceDetectionInterval` to skip expensive face tracking frames.
- 🌙 **Auto-Pause:** Automatically pause tracking when the tab is hidden.
- 📜 **Structured Logging:** Configurable log levels (`debug`, `info`, `warn`, `error`).
- 📈 **Enhanced Smoothing:** New **EMA (Exponential Moving Average)** smoothing option.
- 🔊 **Event Emitter:** Use `.on()` and `.off()` for clean event handling.
- 📦 **TS Extensibility:** Pass custom Tracker/Regressor constructors directly.
- ⏱️ **Accurate Lifecycle:** The state only becomes `Running` once eye tracking is actually producing data.

## 📚 Documentation

**[Full Documentation Website →](https://jhndrncrz.github.io/webgazer-ts/)**

- 📖 [Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration)
- 🔧 [Core API Reference](https://jhndrncrz.github.io/webgazer-ts/api/core/)
- ⚛️ [React Hooks Guide](https://jhndrncrz.github.io/webgazer-ts/guide/react/hooks)

## 🙏 Credits & Acknowledgments

> **This library is built entirely upon the foundational research of the Brown HCI Group.
> All core algorithms, the regression methodology, the Kalman filter design, and the calibration
> strategy originate from their work. Every correct gaze prediction this library makes is their achievement.**

### Original Research: WebGazer.js

**"WebGazer: Scalable Webcam Eye Tracking Using User Interactions"**
*Alexandra Papoutsaki, Patsorn Sangkloy, James Laskey, Nediyana Daskalova, Jeff Huang, James Hays*
*IJCAI 2016 — pp. 3839–3845*

| Resource | Link |
|----------|------|
| 📄 **Paper (PDF)** | [cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf) |
| 🌐 **Project Website** | [webgazer.cs.brown.edu](https://webgazer.cs.brown.edu) |
| 💻 **Official Repository** | [github.com/brownhci/WebGazer](https://github.com/brownhci/WebGazer) |
| 📚 **All Publications** | [webgazer.cs.brown.edu/#publications](https://webgazer.cs.brown.edu/#publications) |

### The Researchers

| Person | Role |
|--------|------|
| **[Alexandra Papoutsaki](http://cs.brown.edu/people/apapouts/)** | Creator & lead researcher — invented the core insight of using natural user interactions for in-browser gaze calibration |
| **[Jeff Huang](https://jeffhuang.com/)** | Co-author & long-term maintainer — PI of the [Brown HCI Group](https://hci.cs.brown.edu/) |
| **[James Hays](https://faculty.cc.gatech.edu/~hays/)** | Co-author — computer vision expertise behind feature extraction |
| **Patsorn Sangkloy, James Laskey, Nediyana Daskalova** | Co-authors on the IJCAI 2016 paper |
| **Aaron Gokaslan** | Core developer of the JavaScript implementation |
| **James Tompkin** | Research advisor at Brown University |

### How to Cite

**Always cite the original WebGazer.js paper — not this TypeScript rewrite.**

```bibtex
@inproceedings{papoutsaki2016webgazer,
  author    = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey
               and Nediyana Daskalova and Jeff Huang and James Hays},
  title     = {{WebGazer}: Scalable Webcam Eye Tracking Using User Interactions},
  booktitle = {Proceedings of the 25th International Joint Conference
               on Artificial Intelligence ({IJCAI})},
  pages     = {3839--3845},
  year      = {2016},
  url       = {https://webgazer.cs.brown.edu}
}
```

See [CREDITS.md](./CREDITS.md) for the full acknowledgment including the complete author list,
funding sources, additional publications, and dependency credits.


## � Quick Start

### Core Library (Vanilla JS/TS)

```bash
npm install @webgazer-ts/core
```

```typescript
import webgazer from '@webgazer-ts/core';

// Start eye tracking
await webgazer.begin();

// Listen for gaze predictions
webgazer.setGazeListener((data, elapsedTime) => {
  if (data) {
    console.log(`Gaze at (${data.x}, ${data.y})`);
  }
});

// When done
webgazer.end();
```

### React Integration

```bash
npm install @webgazer-ts/react
```

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, isTracking, start, stop } = useWebgazer({
    autoStart: true,
  });

  return (
    <div>
      <h1>Gaze Position</h1>
      {gazeData && (
        <p>Looking at: ({gazeData.x.toFixed(0)}, {gazeData.y.toFixed(0)})</p>
      )}
      <button onClick={() => isTracking ? stop() : start()}>
        {isTracking ? 'Stop' : 'Start'} Tracking
      </button>
    </div>
  );
}
```

### CDN (Browser)

```html
<!-- UMD bundle — sets window.webgazer exactly like original WebGazer.js -->
<script src="https://unpkg.com/@webgazer-ts/core@latest/dist/webgazer.js"></script>

<script>
  webgazer.begin().then(() => {
    webgazer.setGazeListener((data, time) => {
      if (data) {
        console.log('Gaze:', data.x, data.y);
      }
    });
  });
</script>
```

## ⚠️ Academic Research Project

> [!IMPORTANT]
> This is an **AI-assisted rewrite** of the original [Webgazer.js](https://github.com/brownhci/Webgazer) developed for academic research. It is **not for production use**. For production, use the official Webgazer.js library.

The TypeScript port maintains drop-in API compatibility with the original while adding type safety, modern build tooling, and React integration.

## 🔒 Camera Permissions

Use `checkCameraPermission()` to check permission state **before** calling `begin()`, enabling better UX:

```typescript
import webgazer from '@webgazer-ts/core';

const permission = await webgazer.checkCameraPermission();
// Returns: 'granted' | 'denied' | 'prompt' | 'unsupported'

if (permission === 'denied') {
  console.warn('Camera permission denied. Ask user to reset in browser settings.');
} else {
  await webgazer.begin();
}
```

## 📖 Documentation

- [Core Package README](./packages/core/README.md) - API documentation for vanilla JS
- [React Package README](./packages/react/README.md) - React hooks and components
- **[📚 Full Documentation Website](https://jhndrncrz.github.io/webgazer-ts/)** - Complete guides, API reference, and examples
- [CHANGELOG](./CHANGELOG.md) - Version history and release notes

## 🎯 Features

### Core Package
- ✅ 100% API compatible with original Webgazer.js
- ✅ Single file bundle (no external dependencies)
- ✅ Full TypeScript support
- ✅ Self-calibration from clicks and mouse movements
- ✅ Multiple regression models (ridge, ridgeThreaded, ridgeWeighted)
- ✅ TensorFlow.js face mesh tracking
- ✅ Kalman filter for smooth predictions

### React Package
- ✅ `useWebgazer()` - Main tracking hook
- ✅ `useGazeTracking()` - Simplified gaze data hook
- ✅ `<WebgazerProvider>` - Context provider
- ✅ Full TypeScript support
- ✅ Automatic lifecycle management
- ✅ Zero configuration needed

## 🛠️ Development

This is a pnpm workspace monorepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:react

# Development mode (watch)
pnpm dev          # Core package
pnpm dev:react    # React package
```

## 📁 Project Structure

```
webgazer-ts/
├── packages/
│   ├── core/              # @webgazer-ts/core
│   │   ├── src/           # Source code
│   │   ├── dist/          # Built files
│   │   └── package.json
│   └── react/             # @webgazer-ts/react
│       ├── src/           # React hooks and components
│       ├── dist/          # Built files
│       └── package.json
├── examples/              # Example demos
├── docs/                  # Documentation
└── pnpm-workspace.yaml    # Workspace configuration
```

## 📄 License

GPL-3.0-or-later

See [LICENSE.md](LICENSE.md) for details.

---

Made with ❤️ for academic research

## 🔄 Drop-in Replacement Guide

### Script Tag Usage

Replace the original:
```html
<!-- Original -->
<script src="https://webgazer.cs.brown.edu/webgazer.js"></script>
```

With:
```html
<!-- webgazer-ts (same window.webgazer API) -->
<script src="https://unpkg.com/@webgazer-ts/core@latest/dist/webgazer.js"></script>
```

Your existing `webgazer.begin()`, `webgazer.setGazeListener(...)`, `webgazer.pause()`, etc. calls work identically.

### npm Package Usage

Replace:
```javascript
import webgazer from 'webgazer'; // if using a bundled version
```

With:
```javascript
import webgazer from '@webgazer-ts/core'; // or '@webgazer-ts/react' for React
```

### Key Compatibility Notes

- All original method names are supported: `begin`, `end`, `pause`, `resume`, `isReady`, `setGazeListener`, `clearGazeListener`, `getCurrentPrediction`, `setRegression`, `addRegression`, `addRegressionModule`, `setTracker`, `addTrackerModule`, `showVideo`, `hideVideo`, `showFaceOverlay`, `showFaceFeedbackBox`, `showPredictionPoints`, `applyKalmanFilter`, `saveDataAcrossSessions`, `params`, `util`, and more.
- Regression names `ridge`, `weightedRidge`, `threadedRidge` are supported ✅
- Tracker name `TFFacemesh` is supported ✅
- `window.webgazer` is set from the UMD bundle ✅
- `params.camConstraints` alias is supported ✅

See the full [API Compatibility Matrix](./docs-site/guide/compatibility.md) for details.

**Built with respect for the original [Webgazer.js](https://webgazer.cs.brown.edu) team** ❤️
