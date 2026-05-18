# What is Webgazer.ts?

Webgazer.ts is a modern TypeScript rewrite of **[WebGazer.js](https://webgazer.cs.brown.edu)** —
a landmark webcam-based eye tracking library developed by the
**[Brown HCI Group](https://hci.cs.brown.edu/)** at Brown University.

The original WebGazer.js was introduced in a [2016 IJCAI paper](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf)
by Alexandra Papoutsaki, Jeff Huang, and colleagues. It demonstrated for the first time that
ordinary webcam sessions — with no specialist hardware or dedicated lab setup — could produce
accurate, real-time gaze predictions entirely inside the browser. Webgazer.ts is a faithful port
of that work to TypeScript, with React support and modern build tooling added on top.

::: tip Attribution
All gaze prediction algorithms, the ridge regression approach, Kalman filter design, eye-patch
feature extraction, and calibration strategy in this library originate from the Brown HCI Group's
research. **[Read the original paper →](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf)**
:::

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

## 🙏 Acknowledgments

Webgazer.ts stands entirely on the shoulders of the original **WebGazer.js** project.

### The Research

**"WebGazer: Scalable Webcam Eye Tracking Using User Interactions"**
*IJCAI 2016, pp. 3839–3845*

- **[Paper (PDF)](http://cs.brown.edu/people/apapouts/papers/ijcai2016webgazer.pdf)** — read the foundational research
- **[Project Website](https://webgazer.cs.brown.edu)** — official demos, documentation, and contact
- **[Official Repository](https://github.com/brownhci/WebGazer)** — the actively maintained original
- **[All Publications](https://webgazer.cs.brown.edu/#publications)** — IJCAI 2016, CHIIR 2017, ETRA 2018

### The Researchers

| Person | Contribution |
|--------|--------------|
| **[Alexandra Papoutsaki](http://cs.brown.edu/people/apapouts/)** | Creator — originated the insight that natural browser interactions suffice for real-time gaze calibration |
| **[Jeff Huang](https://jeffhuang.com/)** | Co-author & maintainer — PI of the [Brown HCI Group](https://hci.cs.brown.edu/) |
| **[James Hays](https://faculty.cc.gatech.edu/~hays/)** | Co-author — computer vision and feature extraction |
| **Patsorn Sangkloy, James Laskey, Nediyana Daskalova** | Co-authors on the IJCAI 2016 paper |
| **Aaron Gokaslan, James Tompkin** | Core developer and research advisor respectively |

### How to Cite

If you use this library in academic work, cite the **original WebGazer.js paper** (not this port):

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

See [CREDITS.md](https://github.com/jhndrncrz/webgazer-ts/blob/main/CREDITS.md) for the
complete acknowledgment including funding sources, dependency credits, and the full author list.

## ⏭️ Next Steps

Ready to get started?

- [Installation Guide](/guide/getting-started)
- [Core Library Usage](/guide/core/basic-usage)
- [React Integration](/guide/react/quick-start)
- [API Reference](/api/core/)
- [API Compatibility Matrix](/guide/compatibility)
