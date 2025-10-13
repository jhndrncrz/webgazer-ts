# Webgazer Examples

This directory contains minimal example implementations of Webgazer, demonstrating the simplest possible usage patterns.

## 📁 Available Examples

### 1. Vanilla JavaScript Demo (`vanilla-js-demo/`)
**No frameworks, no build tools - just open in your browser!**

A standalone HTML file that demonstrates Webgazer using vanilla JavaScript and ES modules.

```bash
cd vanilla-js-demo
python3 -m http.server 8000
# Visit: http://localhost:8000
```

**What it demonstrates:**
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

```bash
cd react-demo
pnpm install  # or npm install
pnpm dev      # or npm run dev
# Visit: http://localhost:3000
```

**What it demonstrates:**
- ✅ Using the official `useWebgazer()` hook from `@webgazer-ts/react`
- ✅ TypeScript integration
- ✅ Proper React component patterns
- ✅ Modern build setup with Vite
- ✅ Automatic calibration (no manual setup)

[See react-demo/README.md for details](./react-demo/README.md)

### 3. CDN React Demo (`minimal-react-demo.html`)
**React without build tools - just open in your browser!**

A standalone HTML file that uses React via CDN with Babel transpilation.

```bash
open minimal-react-demo.html
# or
python3 -m http.server 8000
# Visit: http://localhost:8000/minimal-react-demo.html
```

**What it demonstrates:**
- ✅ Custom `useWebgazer()` hook implementation
- ✅ React state management with eye tracking
- ✅ How to integrate Webgazer into React apps
- ✅ No build tools required (uses Babel standalone)

### 4. Legacy Examples
- `minimal-demo.html` - Original standalone demo (moved to `vanilla-js-demo/index.html`)
- `MinimalReactDemo.tsx` - TypeScript component (moved to `react-demo/src/App.tsx`)
- `typescript-example.ts` - Legacy TypeScript example (kept for reference)

## 🎯 Key Concept: Automatic Continuous Calibration

**All demos demonstrate a crucial Webgazer concept:**

Calibration starts **automatically** when you call `webgazer.begin()`!

How it works:
- `begin()` internally calls `addMouseEventListeners()` (matches original Webgazer API)
- Every click throughout the session improves the model
- The model learns the mapping: eye features → screen position
- There's no "calibration complete" state - it improves forever!

**You do NOT need to explicitly call `addMouseEventListeners()`** unless you previously called `removeMouseEventListeners()` to pause calibration.

## 📖 Understanding the Code

### The Automatic Calibration
```javascript
// This is all you need!
await webgazer.begin();

// Calibration is now active - begin() calls addMouseEventListeners() internally
// Every click and move trains the model
```

That's it! No explicit calibration setup needed.

### Manual Calibration Control (Optional)
If you want to pause/resume calibration:
```javascript
// Pause calibration (stop learning from clicks)
webgazer.removeMouseEventListeners();

// Resume calibration (restart learning)
webgazer.addMouseEventListeners();
```

This single method enables/disables continuous learning from all user interactions.

### Optional: Calibration UI
The `CalibrationScreen` component (and `useCalibration` hook) are **optional UI sugar** that:
- Guide users to click specific points
- Provide visual feedback
- Count calibration points

But they're not required - the model learns from **any** click!

## 🔍 For More Details

See the comprehensive documentation:
- **`../CALIBRATION_EXPLAINED.md`** - Deep dive into how calibration works
- **`../TYPE_SAFETY_IMPROVEMENTS.md`** - TypeScript improvements made
- **`../TYPE_SHARING_STRATEGY.md`** - How types are shared between packages

## 🚀 Quick Start Workflow

1. **Choose your demo** based on your tech stack:
   - Plain JS? → `minimal-demo.html`
   - React learning? → `minimal-react-demo.html`
   - React project? → `MinimalReactDemo.tsx`

2. **Open/import the demo**

3. **Click "Start Tracking"**

4. **Click around naturally** - each click improves accuracy

5. **Watch the gaze position** update in real-time

## ⚠️ Common Mistakes

❌ **DON'T** think you need to call `addMouseEventListeners()` - it's automatic
❌ **DON'T** wait for "calibration to complete" - there is no completion state
❌ **DON'T** think you need a `CalibrationScreen` component - it's optional UI sugar

✅ **DO** just call `begin()` - calibration starts automatically
✅ **DO** let users interact naturally - every click improves the model
✅ **DO** understand that calibration is continuous throughout the session

## 🎓 Learning Path

1. Start with `minimal-demo.html` to understand the basics
2. Check out `minimal-react-demo.html` to see React integration
3. Read `CALIBRATION_EXPLAINED.md` for deep understanding
4. Use `MinimalReactDemo.tsx` as a template for your project

## 📦 Legacy Example

The `typescript-example.ts` file contains a more complex example from the original codebase. It's kept for reference but the minimal demos above are recommended for learning.
