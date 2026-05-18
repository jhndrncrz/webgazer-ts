# Webgazer Examples

This directory contains example implementations of Webgazer, demonstrating various usage patterns from simple standalone scripts to full React applications.

## 📁 Available Examples

### 1. Vanilla JavaScript Demo (`vanilla-js-demo/`)
**No frameworks, no build tools - just open in your browser!**

A standalone project that demonstrates Webgazer using vanilla JavaScript and ES modules.

- ✅ ES module import of Webgazer core
- ✅ Automatic calibration (starts with `begin()`)
- ✅ Real-time gaze tracking with visual feedback
- ✅ Interactive click targets for calibration
- ✅ Status monitoring (tracking state, calibration count, gaze position)
- ✅ Toggle-able visual gaze dot overlay

[See vanilla-js-demo/README.md for details](./vanilla-js-demo/README.md)

### 2. React Demo (`react-demo/`)
**Full React project with TypeScript and Vite**

A complete React application using the official `@webgazer-ts/react` package.

- ✅ Using the official `useWebgazer()` hook from `@webgazer-ts/react`
- ✅ TypeScript integration
- ✅ Proper React component patterns
- ✅ Modern build setup with Vite
- ✅ Automatic calibration (no manual setup)

[See react-demo/README.md for details](./react-demo/README.md)

## 🎯 Key Concept: Automatic Continuous Calibration

All demos demonstrate a crucial Webgazer concept: **Calibration starts automatically when you call `webgazer.begin()`!**

### How it works:
- `begin()` internally calls `addMouseEventListeners()` (matches original Webgazer API).
- Every click throughout the session improves the model.
- The model learns the mapping: eye features → screen position.
- There's no "calibration complete" state - it improves as you use it!

### Manual Calibration Control (Optional)
If you want to pause/resume calibration:
```javascript
// Pause calibration (stop learning from clicks)
webgazer.removeMouseEventListeners();

// Resume calibration (restart learning)
webgazer.addMouseEventListeners();
```

## 🏗️ Directory Structure

```
examples/
├── README.md                    # This document
├── vanilla-js-demo/             # Standalone vanilla JS demo project
│   ├── index.html              # Complete demo
│   └── README.md               # Setup and usage instructions
└── react-demo/                  # Full React project
    ├── src/                    # Source code
    ├── package.json            # Dependencies
    ├── vite.config.ts          # Build config
    └── README.md               # Setup and usage instructions
```

## 🚀 Quick Start

### Vanilla JS Demo
```bash
cd examples/vanilla-js-demo
python3 -m http.server 8000
# Visit http://localhost:8000
```

### React Demo
```bash
cd examples/react-demo
pnpm install
pnpm dev
# Visit http://localhost:3000
```

## 🔍 Additional Documentation
- **`../CALIBRATION_EXPLAINED.md`** - Deep dive into how calibration works.
- **`../TYPE_SAFETY_IMPROVEMENTS.md`** - TypeScript improvements made.
- **`../TYPE_SHARING_STRATEGY.md`** - How types are shared between packages.
