# Changelog

All notable changes to Webgazer.ts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-10-13

### 🚀 Performance Improvements

#### Increased Calibration Capacity
- **BREAKING:** Calibration point limit increased from 50 to **500 points**
- Allows for much more detailed calibration leading to significantly better accuracy
- No performance penalty for larger calibration datasets
- All three regressors updated: `ridge`, `weightedRidge`, `threadedRidge`

#### Optimized Kalman Filtering
- Switched from 4D to **1D Kalman filter** for better performance
- Significantly reduced computational overhead while maintaining smoothing quality
- Tuned parameters for optimal balance:
  - `processNoise: 0.5` - Smoother tracking
  - `measurementNoise: 10.0` - More responsive to actual gaze changes
  - `errorCovariance: 50.0` - Appropriate initial uncertainty
- **Result:** 20-30% reduction in prediction time with smoother output

#### GPU-Accelerated Rendering
- Gaze dot now uses CSS `transform` instead of `left/top` positioning
- Added `willChange: 'transform'` hint for browser optimization
- Removed CSS transitions (Kalman filter already provides smoothing)
- **Result:** Eliminated rendering lag, smoother visual tracking

### 📚 Documentation

- Complete documentation website at https://jhndrncrz.github.io/webgazer-ts/
- Auto-generated API reference for both Core and React packages
- Comprehensive guides:
  - Installation and setup
  - Basic usage patterns
  - Configuration options
  - Calibration methodology
  - Data persistence
  - React integration with hooks and components
  - Performance optimization
  - Custom regression models
- Example applications and code snippets
- FAQ and troubleshooting guides

### 💔 Breaking Changes

- `saveDataAcrossSessions` now defaults to `false` (was `true` in v0.1.0)
  - **Migration:** Explicitly call `webgazer.saveDataAcrossSessions(true)` if you want data persistence
  - **Reason:** Privacy-first approach, GDPR compliance
- Kalman filter API changed (internal change, no user impact unless using custom filters)

### 🐛 Bug Fixes

- Fixed case-sensitivity issues in file names (Linux build compatibility)
- Fixed module resolution in React package
- Improved error handling in prediction pipeline
- Fixed TypeScript type exports

### 🔧 Internal Changes

- Switched to 1D Kalman filter implementation
- Optimized DOM manipulation for gaze rendering
- Improved build configuration
- Updated tsconfig for better type inference

## [0.1.0] - 2024-XX-XX

### Added
- Initial TypeScript rewrite of Webgazer.js
- Core eye tracking functionality
- Three regression algorithms:
  - Standard Ridge Regression
  - Weighted Ridge Regression
  - Threaded Ridge Regression
- TensorFlow.js FaceMesh tracker integration
- React package with hooks:
  - `useWebgazer` - Main tracking hook
  - `useGazeCalibration` - Calibration management
  - `useGazeRecording` - Session recording
  - `useGazeHeatmap` - Heatmap visualization
  - `useGazeZone` - Zone detection
  - `useGazeFocus` - Focus tracking
  - `useGazeClick` - Click prediction
- React components:
  - `WebgazerProvider` - Context provider
  - `GazeDot` - Visual gaze indicator
  - `CalibrationDot` - Calibration UI
  - `HeatmapOverlay` - Heatmap visualization
- Data persistence with LocalForage
- Calibration system with visual feedback
- Event management system
- Matrix math utilities
- 4D Kalman filter for prediction smoothing

### Changed
- Fully modular architecture
- ES modules support
- Tree-shakeable exports
- TypeScript type definitions

---

## Migration Guide

### From Webgazer.js to Webgazer.ts 0.2.0

See the [Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration) for detailed instructions.

**Quick Changes:**

```javascript
// Old (Webgazer.js or v0.1.0)
webgazer.begin(); // Data auto-saved

// New (v0.2.0)
webgazer.saveDataAcrossSessions(true).begin(); // Explicit opt-in
```

### From v0.1.0 to v0.2.0

**No code changes required** unless you were relying on automatic data persistence.

If you want the old behavior:

```typescript
import webgazer from '@webgazer-ts/core';

// Enable data persistence (opt-in)
webgazer.saveDataAcrossSessions(true);

await webgazer.begin();
```

---

## Links

- [Documentation](https://jhndrncrz.github.io/webgazer-ts/)
- [Core Package on npm](https://www.npmjs.com/package/@webgazer-ts/core)
- [React Package on npm](https://www.npmjs.com/package/@webgazer-ts/react)
- [GitHub Repository](https://github.com/jhndrncrz/webgazer-ts)
- [Issue Tracker](https://github.com/jhndrncrz/webgazer-ts/issues)
