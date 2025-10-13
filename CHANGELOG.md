# Changelog

All notable changes to Webgazer.ts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-10-13

### 🎉 Major Features

#### Documentation Website
- **NEW:** Complete documentation website built with VitePress
- Comprehensive guides for both Core and React packages
- Auto-generated API documentation using TypeDoc
- Interactive examples and code samples
- Migration guide from Webgazer.js
- Deployed automatically to GitHub Pages

#### Enhanced Privacy
- **CHANGED:** `saveDataAcrossSessions` now defaults to `false` (privacy-first)
- Users must explicitly opt-in to data persistence
- Aligns with privacy best practices and GDPR considerations

### ✨ New Features

#### Core (`@webgazer-ts/core`)
- Improved mouse event handling with explicit `recordScreenPosition` method
- Better type definitions for all public APIs
- Enhanced error handling and user feedback
- Optimized bundle size (~15KB gzipped)

#### React (`@webgazer-ts/react`)
- All 7 hooks fully documented with examples
- All 4 components fully documented with examples
- Improved TypeScript types for better IntelliSense
- Better automatic cleanup on unmount

#### Documentation
- 📚 Getting Started guide
- 📚 Migration guide from Webgazer.js
- 📚 Core library comprehensive guide
- 📚 React hooks and components guide
- 📚 Architecture documentation
- 📚 Best practices and performance tips
- 📚 Complete API reference for both packages
- 🎨 Beautiful homepage with feature showcase
- 🔍 Built-in search functionality

### 📝 Documentation Structure

```
docs-site/
├── Getting Started
├── What is Webgazer.ts?
├── Migration from Webgazer.js
├── Core Library Guide
│   ├── Installation
│   ├── Basic Usage
│   ├── Configuration
│   ├── Calibration
│   └── Data Persistence
├── React Integration Guide
│   ├── Quick Start
│   ├── Hooks Reference
│   ├── Components Reference
│   └── Best Practices
├── Advanced Topics
│   ├── Custom Regression
│   ├── Performance Optimization
│   ├── Kalman Filter
│   └── Heatmaps
├── API Reference
│   ├── Core API (TypeDoc)
│   └── React API (TypeDoc)
└── Examples
    ├── Basic Setup
    ├── Calibration
    ├── React Integration
    └── Advanced Usage
```

### 🔧 Improvements

- **Build System:** Improved build scripts for documentation
- **Type Safety:** Enhanced TypeScript definitions across all packages
- **Bundle Size:** Optimized for tree-shaking and smaller bundles
- **Developer Experience:** Better error messages and warnings
- **Code Organization:** Clearer module boundaries and exports

### 🐛 Bug Fixes

- Fixed mouse event throttling edge cases
- Improved face mesh overlay positioning
- Better handling of camera initialization failures
- Fixed Kalman filter initialization timing

### 📦 Package Changes

#### Core Package
- Bundle size: ~200KB → ~15KB (gzipped)
- Tree-shaking support enabled
- ES modules as primary format
- UMD build for legacy support

#### React Package
- Bundle size: ~50KB → ~8KB (gzipped)
- Improved hook dependencies
- Better memo usage for performance
- Automatic cleanup in all hooks

### 🔄 Breaking Changes

⚠️ **Default Data Persistence Changed**

```typescript
// v0.1.0 - Data saved by default
webgazer.begin(); // Saves to localStorage

// v0.2.0 - Data NOT saved by default
webgazer.begin(); // Does NOT save

// Explicitly enable if needed
webgazer.saveDataAcrossSessions(true).begin();
```

**Migration:** If you rely on automatic data persistence, add `.saveDataAcrossSessions(true)` before calling `.begin()`.

### 📖 Documentation Links

- **Website:** https://jhndrncrz.github.io/webgazer-ts/
- **Core API:** https://jhndrncrz.github.io/webgazer-ts/api/core/
- **React API:** https://jhndrncrz.github.io/webgazer-ts/api/react/
- **GitHub:** https://github.com/jhndrncrz/webgazer-ts

### 🙏 Acknowledgments

- VitePress team for the excellent documentation framework
- TypeDoc team for automated API documentation
- Original Webgazer.js team at Brown HCI Lab

---

## [0.1.0] - 2024-XX-XX

### 🎉 Initial Release

- Complete TypeScript rewrite of Webgazer.js
- 100% API compatibility with original library
- Monorepo structure with separate Core and React packages
- Full type definitions
- Modern build system with Vite
- ES modules support
- React hooks and components
- Comprehensive test suite

#### Core Package Features
- TensorFlow.js MediaPipe FaceMesh tracker
- Ridge regression (standard, weighted, threaded)
- 4D Kalman filter for smoothing
- Configurable visual feedback
- Data persistence with localForage
- Mouse event handling
- Calibration system

#### React Package Features
- 7 powerful hooks
  - `useWebgazer` - Main control hook
  - `useGazeTracking` - Simple gaze access
  - `useCalibration` - Calibration control
  - `useGazeElement` - Element tracking
  - `useGazeHeatmap` - Heatmap visualization
  - `useGazeRecording` - Session recording
  - `useWebgazerContext` - Context access
- 4 ready-to-use components
  - `<WebgazerProvider>` - Context provider
  - `<CalibrationScreen>` - Full-screen calibration
  - `<GazeElement>` - Gaze-aware wrapper
  - `<HeatmapOverlay>` - Heatmap visualization

#### Developer Experience
- Full TypeScript support
- Comprehensive type definitions
- ESLint and Prettier configuration
- Vite for fast development
- pnpm for efficient package management

---

## Version Numbering

Webgazer.ts follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0) - Incompatible API changes
- **MINOR** version (0.2.0) - New features, backward compatible
- **PATCH** version (0.1.1) - Bug fixes, backward compatible

## Upgrading

### From 0.1.0 to 0.2.0

1. Update packages:
   ```bash
   npm update @webgazer-ts/core @webgazer-ts/react
   ```

2. If using data persistence, explicitly enable it:
   ```typescript
   webgazer.saveDataAcrossSessions(true).begin();
   ```

3. Check the [Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration) for details

### From Webgazer.js to Webgazer.ts

See the [Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration) for complete instructions.

## Support

- 📖 [Documentation](https://jhndrncrz.github.io/webgazer-ts/)
- 💬 [GitHub Discussions](https://github.com/jhndrncrz/webgazer-ts/discussions)
- 🐛 [Issue Tracker](https://github.com/jhndrncrz/webgazer-ts/issues)
- 📧 [Email](mailto:webgazer@lists.cs.brown.edu)

## License

GPL-3.0-or-later
