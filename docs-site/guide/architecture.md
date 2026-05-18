# Architecture

Overview of the Webgazer.ts system design, data flow, and key design decisions.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      @webgazer-ts/core                      │
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Tracker  │───▶│Regressor │───▶│  Filter  │──▶ GazeXY   │
│  │(TFFacemesh│    │ (Ridge)  │    │ (Kalman) │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│        ▲                ▲                                   │
│        │                │                                   │
│  ┌──────────┐    ┌──────────┐                              │
│  │  Camera  │    │ Storage  │                              │
│  │  Stream  │    │(IndexedDB│                              │
│  └──────────┘    └──────────┘                              │
│                                                             │
│               Webgazer (Singleton)                          │
│         ┌──────────────────────────┐                        │
│         │ EventManager             │                        │
│         │ BrowserCompatibility     │                        │
│         │ MediaDeviceManager       │                        │
│         └──────────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                          │
              ┌───────────▼──────────┐
              │  @webgazer-ts/react  │
              │  WebgazerProvider    │
              │  useWebgazer         │
              │  useGazeTracking     │
              │  useCalibration      │
              └──────────────────────┘
```

## Core Components

### Webgazer (Singleton)

The central class in `packages/core/src/core/Webgazer.ts`. Implemented as a singleton so the camera stream and ML model are shared across your entire application — multiple calls to `Webgazer.getInstance()` return the same object.

**Responsibilities:**
- Owns the prediction loop (`requestAnimationFrame`)
- Manages tracker and regressor lifecycle
- Exposes the public API (`begin`, `pause`, `resume`, `end`, etc.)
- Routes calibration data from mouse/touch events to regressors

### Trackers

Located in `packages/core/src/trackers/`. Trackers receive raw video frames and produce **eye features** (facial landmarks, eye patch images, iris positions).

| Tracker | Key | Description |
|---------|-----|-------------|
| `TFFacemeshTracker` | `'TFFacemesh'` | Uses TensorFlow.js `@tensorflow-models/face-landmarks-detection` (MediaPipe FaceMesh). Detects 468 facial landmarks in real time. |

**Interface** — `ITracker`:
```typescript
interface ITracker {
  initialize(videoElement: HTMLVideoElement): Promise<void>;
  getCurrentPrediction(videoElement: HTMLVideoElement): Promise<EyeFeatures | null>;
  drawFaceOverlay(canvas: HTMLCanvasElement, videoElement: HTMLVideoElement): void;
}
```

**Registering custom trackers:**
```typescript
webgazer.addTrackerModule('myTracker', MyTrackerClass);
webgazer.setTracker('myTracker');
```

### Regressors

Located in `packages/core/src/regressors/`. Regressors map eye features → screen coordinates using statistical learning.

| Regressor | Key | Description |
|-----------|-----|-------------|
| `RidgeRegressor` | `'ridge'` | Standard ridge regression (L2 regularization). Best general-purpose option. |
| `RidgeWeightedRegressor` | `'weightedRidge'` | Time-decayed weighting — more recent calibration clicks count more. |
| `RidgeThreadedRegressor` | `'threadedRidge'` | Runs heavy matrix math in a Web Worker to keep the UI thread free. |

All three share the same base class `Regressor` (in `regressors/base/Regressor.ts`), which manages:
- `DataWindow` circular buffers for click and trail data
- Kalman filter application
- `getData()`/`setData()` for persistence

**Interface** — `IRegressor`:
```typescript
interface IRegressor {
  initialize(): void;
  predict(eyeFeatures: EyeFeatures): GazePrediction | null;
  addData(eyeFeatures: EyeFeatures, screenPos: Point2D, type: 'click' | 'move'): void;
  getData(): RegressorData;
  setData(data: RegressorData): void;
}
```

### Filters

Located in `packages/core/src/utils/filters/`.

#### `KalmanFilter` (2D)
A lightweight per-axis Kalman filter used for basic smoothing. Each axis runs a `SingleDimensionKalmanFilter` independently.

**Tunable parameters:**
| Parameter | Default | Effect |
|-----------|---------|--------|
| `processNoise` (Q) | `1` | Higher → trusts motion more, less lag |
| `measurementNoise` (R) | `25` | Higher → smoother but more lag |
| `errorCovariance` (P₀) | `100` | Initial uncertainty |

#### `KalmanFilter4D`
A full constant-velocity Kalman filter operating in (x, y, ẋ, ẏ) state space. Used internally by the ridge regressors. More accurate for tracking fast eye movements.

### Storage (`StorageManager`)

Located in `packages/core/src/utils/data/StorageManager.ts`. Uses **LocalForage** (which falls back through IndexedDB → WebSQL → localStorage) to persist calibration data across page loads.

Triggered by `webgazer.saveDataAcrossSessions(true)` — when enabled, regressor training data is saved and restored on the next `begin()` call.

### Events (`EventManager`)

Located in `packages/core/src/events/`. Wraps `document` click and `mousemove` events to feed calibration data into the active regressors automatically. Enabled by `webgazer.addMouseEventListeners()` (called automatically in `begin()`).

### BrowserCompatibility

Located in `packages/core/src/utils/browser/BrowserCompatibility.ts`. Checks for required browser APIs at runtime:
- `getUserMedia` / `MediaDevices`
- `requestAnimationFrame`
- `WebGL` (for TensorFlow.js GPU acceleration)
- `IndexedDB`

Call `webgazer.detectCompatibility()` to run the check and `webgazer.getCompatibilityWarnings()` to retrieve a list of issues.

### MediaDeviceManager

Located in `packages/core/src/utils/browser/MediaDeviceManager.ts`. Handles all camera permission and stream lifecycle:
- `getUserMedia()` with configurable constraints
- Permission state detection (`checkCameraPermission()`)
- Track stopping on `end()`

## Data Flow

```
Frame N:
  Camera → VideoElement → TFFacemeshTracker
                               │
                         EyeFeatures (eye patches, landmarks)
                               │
                         RidgeRegressor.predict()
                               │
                          Raw (x, y)
                               │
                         KalmanFilter4D.update()
                               │
                         Smoothed (x, y)
                               │
                    setGazeListener callback ──▶ Your Code

Calibration event (click/move):
  User clicks at (X, Y) ──▶ EventManager
                                  │
                          RidgeRegressor.addData(eyeFeatures, {X, Y})
                          → Stored in DataWindow circular buffer
                          → Influences next predict() call
```

## Package Architecture (Monorepo)

```
webgazer-ts/
├── packages/
│   ├── core/                    # @webgazer-ts/core
│   │   ├── src/
│   │   │   ├── core/            # Webgazer singleton + config
│   │   │   ├── trackers/        # TFFacemesh implementation
│   │   │   ├── regressors/      # Ridge regression variants
│   │   │   ├── utils/
│   │   │   │   ├── browser/     # Camera, DOM, compatibility
│   │   │   │   ├── data/        # DataWindow, StorageManager
│   │   │   │   ├── filters/     # Kalman filters
│   │   │   │   ├── image/       # Eye patch extraction
│   │   │   │   └── math/        # Matrix operations
│   │   │   ├── events/          # Mouse/click event handlers
│   │   │   ├── workers/         # Web Worker for threadedRidge
│   │   │   └── types/           # Shared TypeScript types
│   │   ├── vite.config.ts       # Builds ESM + UMD bundles
│   │   └── package.json
│   └── react/                   # @webgazer-ts/react
│       ├── src/
│       │   ├── context/         # WebgazerContext
│       │   ├── hooks/           # useWebgazer, useGazeTracking, etc.
│       │   ├── components/      # CalibrationScreen, HeatmapOverlay, etc.
│       │   └── types/           # React-specific types
│       └── package.json
├── examples/                    # Runnable HTML demos
├── docs-site/                   # This documentation (VitePress)
└── pnpm-workspace.yaml
```

## Design Principles

### 1. Singleton Architecture
The `Webgazer` class is a singleton, matching the original WebGazer.js global design. This ensures:
- A single camera stream (no duplicate permission prompts)
- Consistent calibration state across components
- The `window.webgazer` global works correctly in script-tag usage

### 2. Pluggable Modules
Both trackers and regressors are registered in a static map and can be swapped at any point before or after `begin()`:
```typescript
Webgazer.addRegressionModule('myAlgo', MyRegressorClass); // static
webgazer.addRegressionModule('myAlgo', MyRegressorClass); // instance (same effect)
webgazer.setRegression('myAlgo');
```

### 3. Privacy by Default
- The camera stream is never uploaded
- `saveDataAcrossSessions(false)` is the callee's choice (default: `true` for better UX)
- Calling `end()` stops the camera stream immediately and removes all DOM elements

### 4. Drop-in Compatibility
The public API mirrors the original Brown HCI WebGazer.js exactly. See the [API Compatibility Matrix](/guide/compatibility) for the full list.

### 5. TypeScript-First
All internal and public APIs are fully typed. The UMD bundle exposes the same types via the `window.webgazer` global for TypeScript users who want `instanceof` checks.

## See Also

- [API Compatibility Matrix](/guide/compatibility)
- [Source Code](https://github.com/jhndrncrz/webgazer-ts)
- [Contributing](/guide/contributing)
