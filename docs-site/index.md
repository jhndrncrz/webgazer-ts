---
layout: home

hero:
  name: "Webgazer.ts"
  text: "Eye tracking for the web"
  tagline: TypeScript-first webcam eye tracking library with React support
  image:
    src: /logo.svg
    alt: Webgazer.ts
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/jhndrncrz/webgazer-ts
    - theme: alt
      text: API Reference
      link: /api/core/

features:
  - icon: 🎯
    title: Accurate Gaze Prediction
    details: Advanced ridge regression and Kalman filtering for smooth, accurate eye tracking using just a webcam
  
  - icon: ⚛️
    title: React Native Support
    details: 7 powerful hooks and 4 ready-to-use components for seamless React integration with full TypeScript support
  
  - icon: 🔧
    title: 100% Type Safe
    details: Written in TypeScript from the ground up with comprehensive type definitions and IntelliSense support
  
  - icon: 🚀
    title: Drop-in Replacement
    details: Full API compatibility with original Webgazer.js - migrate existing projects with zero code changes
  
  - icon: 📊
    title: Data Recording & Heatmaps
    details: Built-in tools for session recording, heatmap visualization, and data analysis for UX research
  
  - icon: 🎨
    title: Customizable UI
    details: Full control over video preview, face overlay, gaze dot, and calibration interface appearance
  
  - icon: ⚡
    title: Modern Architecture
    details: Modular design with tree-shaking support, ES modules, and zero unnecessary dependencies
  
  - icon: 🔒
    title: Privacy First
    details: All processing happens in-browser. No data sent to servers. Optional session storage for calibration
  
  - icon: 📱
    title: Device Support
    details: Works on desktop and mobile browsers with WebRTC support. Automatic camera selection and failover
---

## Quick Start

::: code-group

```bash [npm]
npm install @webgazer-ts/core
# or with React
npm install @webgazer-ts/react
```

```bash [pnpm]
pnpm add @webgazer-ts/core
# or with React
pnpm add @webgazer-ts/react
```

```bash [yarn]
yarn add @webgazer-ts/core
# or with React
yarn add @webgazer-ts/react
```

:::

## Basic Usage

::: code-group

```typescript [Vanilla JS/TS]
import webgazer from '@webgazer-ts/core';

// Start eye tracking
await webgazer
  .setTracker('TFFacemesh')
  .setRegression('ridge')
  .begin();

// Show video preview
webgazer.showVideoPreview(true);

// Listen to gaze predictions
webgazer.setGazeListener((data, timestamp) => {
  console.log(`Gaze at (${data.x}, ${data.y})`);
});
```

```tsx [React]
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, isRunning } = useWebgazer({
    autoStart: true,
    showVideoPreview: true
  });

  return (
    <div>
      <h1>Gaze Tracker</h1>
      {gazeData && (
        <p>Looking at: ({gazeData.x}, {gazeData.y})</p>
      )}
      <button onClick={start}>
        {isRunning ? 'Running' : 'Start'}
      </button>
    </div>
  );
}
```

:::

## Why Webgazer.ts?

### 🔄 **Backward Compatible**

Complete API compatibility with [Webgazer.js](https://webgazer.cs.brown.edu). All your existing code works without changes:

```typescript
// This is valid Webgazer.js code that works in Webgazer.ts
webgazer.setRegression('ridge')
  .setTracker('TFFacemesh')
  .setGazeListener((data) => {
    console.log(data);
  })
  .begin();
```

### ⚡ **Modern Development Experience**

Built with modern tools and best practices:

- **TypeScript** - Full type safety and IntelliSense
- **ES Modules** - Tree-shaking and optimized builds
- **Vite** - Lightning-fast dev server and builds
- **Monorepo** - Organized with pnpm workspaces

### 📦 **Two Packages, One Goal**

**@webgazer-ts/core** - Pure JavaScript/TypeScript implementation
- Zero framework dependencies
- Works with any frontend stack
- Full control over initialization and lifecycle

**@webgazer-ts/react** - React hooks and components
- 7 powerful hooks for every use case
- 4 pre-built UI components
- Automatic cleanup and lifecycle management

## Use Cases

### 🎓 Academic Research
- User attention studies
- Reading behavior analysis
- Accessibility research
- HCI experiments

### 💼 UX Research
- Website usability testing
- A/B testing with gaze data
- Heatmap analysis
- User engagement metrics

### ♿ Accessibility
- Gaze-based navigation
- Assistive technology integration
- Eye-controlled interfaces
- Accessibility testing

### 🎮 Interactive Applications
- Gaze-aware games
- Attention-based UI
- Interactive storytelling
- Adaptive interfaces

## Performance Metrics

<div class="metrics">

| Metric | Value |
|--------|-------|
| **Prediction Rate** | 60 FPS (16.7ms) |
| **Accuracy** | 100-200px (calibrated) |
| **Initialization** | ~800ms (model load) |
| **Memory Usage** | ~50MB (typical) |
| **Bundle Size (core)** | ~15KB (gzipped) |
| **Bundle Size (react)** | ~8KB (gzipped) |

</div>

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 15+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires WebRTC support and camera permissions.

## Credits

Webgazer.ts is a TypeScript rewrite of [Webgazer.js](https://webgazer.cs.brown.edu) by the Brown HCI Lab.

**Original Authors:**
- Alexandra Papoutsaki
- James Laskey
- Jeff Huang

**TypeScript Rewrite:**
- John Adrian Cruz

## License

Licensed under **GPL-3.0-or-later**

For academic research use. See [LICENSE](https://github.com/jhndrncrz/webgazer-ts/blob/main/LICENSE.md) for details.

<style>
.metrics table {
  margin: 2rem 0;
}

.metrics td:last-child {
  font-weight: 600;
  color: var(--vp-c-brand);
}
</style>
