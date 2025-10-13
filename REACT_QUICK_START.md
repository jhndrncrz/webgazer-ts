# Quick Start Guide - React Wrapper

## 🎉 Congratulations!

The React wrapper for WebGazer.ts is now ready! Here's how to use it.

## 📦 What You Have

1. **Monorepo Structure** - Two packages working together:
   - `@webgazer-ts/core` - Core eye tracking (built ✅)
   - `@webgazer-ts/react` - React hooks (built ✅)

2. **React Hooks** - Ready to use:
   - `useWebGazer()` - Main tracking hook
   - `useGazeTracking()` - Simplified gaze data hook
   - `useWebGazerContext()` - Context access hook

3. **React Components**:
   - `<WebGazerProvider>` - Context provider

## 🚀 Try It Now

### Option 1: Browser Demo (Easiest)

Open the demo file in your browser:

```bash
open examples/react-demo.html
```

This shows a working React app using the `useWebGazer()` hook!

### Option 2: Use in Your React Project

#### Step 1: Link the package locally

In the WebGazer-3.4.0 directory:

```bash
cd packages/react
npm link
```

#### Step 2: Link in your React project

In your React project directory:

```bash
npm link @webgazer-ts/react
```

#### Step 3: Use the hook

```tsx
import { useWebGazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, stop, isRunning } = useWebGazer({
    autoStart: true,
    showVideoPreview: true,
  });

  return (
    <div>
      <h1>Eye Tracking Demo</h1>
      
      <div>
        Status: {isRunning ? '🟢 Running' : '🔴 Stopped'}
      </div>
      
      {gazeData && (
        <div>
          Gaze: ({Math.round(gazeData.x)}, {Math.round(gazeData.y)})
        </div>
      )}
      
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

## 🎯 Complete Example

### Simple Gaze Tracker

```tsx
import { useWebGazer } from '@webgazer-ts/react';

function GazeTracker() {
  const { 
    gazeData,          // Current gaze position { x, y }
    isRunning,         // Is tracking active?
    calibrationCount,  // Number of calibration points
    start,             // Start tracking
    stop,              // Stop tracking
    clearData,         // Clear calibration data
  } = useWebGazer({
    autoStart: true,              // Start automatically
    showVideoPreview: true,       // Show webcam preview
    showFaceOverlay: true,        // Show face mesh overlay
    showGazeDot: true,            // Show gaze prediction dot
    applyKalmanFilter: true,      // Smooth predictions
  });

  return (
    <div>
      <h1>Gaze Tracker</h1>
      
      {/* Status */}
      <p>Status: {isRunning ? '🟢 Active' : '🔴 Stopped'}</p>
      
      {/* Gaze Position */}
      {gazeData && (
        <p>Looking at: ({Math.round(gazeData.x)}, {Math.round(gazeData.y)})</p>
      )}
      
      {/* Calibration Info */}
      <p>Calibration points: {calibrationCount}</p>
      {calibrationCount < 9 && (
        <small>Click around the screen to calibrate (need at least 9 points)</small>
      )}
      
      {/* Controls */}
      <button onClick={start} disabled={isRunning}>
        Start Tracking
      </button>
      <button onClick={stop} disabled={!isRunning}>
        Stop Tracking
      </button>
      <button onClick={clearData}>
        Clear Calibration
      </button>
    </div>
  );
}

export default GazeTracker;
```

### With Context Provider

```tsx
import { WebGazerProvider, useGazeTracking } from '@webgazer-ts/react';

// Child component that uses gaze data
function GazeDisplay() {
  const gaze = useGazeTracking();
  
  return gaze ? (
    <div>Gaze: ({Math.round(gaze.x)}, {Math.round(gaze.y)})</div>
  ) : (
    <div>Waiting for gaze data...</div>
  );
}

// Root component with provider
function App() {
  return (
    <WebGazerProvider
      autoStart={true}
      showVideoPreview={true}
      showFaceOverlay={true}
    >
      <h1>My App</h1>
      <GazeDisplay />
      {/* Any child component can use useGazeTracking() */}
    </WebGazerProvider>
  );
}

export default App;
```

## 📝 API Reference

### `useWebGazer(options)`

**Options:**
```typescript
{
  autoStart?: boolean;              // Default: false
  tracker?: 'TFFacemesh';           // Default: 'TFFacemesh'
  regression?: 'ridge' | 'ridgeThreaded' | 'ridgeWeighted'; // Default: 'ridge'
  saveDataAcrossSessions?: boolean; // Default: true
  showVideoPreview?: boolean;       // Default: false
  showFaceOverlay?: boolean;        // Default: false
  showFaceFeedbackBox?: boolean;    // Default: false
  showGazeDot?: boolean;            // Default: false
  applyKalmanFilter?: boolean;      // Default: true
  onGaze?: (data, timestamp) => void; // Callback for each prediction
}
```

**Returns:**
```typescript
{
  gazeData: { x: number, y: number } | null;
  isRunning: boolean;
  calibrationCount: number;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  clearData: () => void;
  showVideo: () => void;
  hideVideo: () => void;
}
```

### `useGazeTracking()`

Must be used within `<WebGazerProvider>`.

**Returns:**
```typescript
{ x: number, y: number } | null
```

### `<WebGazerProvider>`

**Props:** All `useWebGazer` options + `children`

```tsx
<WebGazerProvider autoStart={true}>
  {children}
</WebGazerProvider>
```

## 🔧 Build Commands

```bash
# Build everything
pnpm build

# Build specific package
pnpm build:core
pnpm build:react

# Development (watch mode)
pnpm dev          # Core package
pnpm dev:react    # React package

# Clean builds
pnpm clean
```

## 📚 Documentation

- **`REACT_WRAPPER_COMPLETE.md`** - Full implementation details
- **`REACT_WRAPPER_API_PREVIEW.md`** - 10 comprehensive examples
- **`packages/react/README.md`** - React package API docs
- **`packages/core/README.md`** - Core package API docs

## 🎨 Advanced Usage Ideas

### 1. Gaze-Aware Button

```tsx
function GazeButton() {
  const gaze = useGazeTracking();
  const buttonRef = useRef(null);
  const [isLooking, setIsLooking] = useState(false);

  useEffect(() => {
    if (!gaze || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const looking = (
      gaze.x >= rect.left &&
      gaze.x <= rect.right &&
      gaze.y >= rect.top &&
      gaze.y <= rect.bottom
    );
    
    setIsLooking(looking);
  }, [gaze]);

  return (
    <button
      ref={buttonRef}
      style={{
        background: isLooking ? 'lightblue' : 'gray',
        transform: isLooking ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.2s',
      }}
    >
      Look at me!
    </button>
  );
}
```

### 2. Gaze Logger

```tsx
function GazeLogger() {
  const { gazeData } = useWebGazer({
    autoStart: true,
    onGaze: (data, timestamp) => {
      console.log(`Gaze at ${timestamp}ms:`, data);
      // Send to analytics, etc.
    },
  });

  return null; // Silent component
}
```

### 3. Custom Calibration Screen

```tsx
function CalibrationScreen({ onComplete }) {
  const { calibrationCount, clearData } = useWebGazer();
  const [points] = useState([
    { x: 100, y: 100 },
    { x: window.innerWidth / 2, y: 100 },
    { x: window.innerWidth - 100, y: 100 },
    // ... more points
  ]);

  useEffect(() => {
    if (calibrationCount >= points.length) {
      onComplete();
    }
  }, [calibrationCount]);

  return (
    <div>
      <h2>Calibration</h2>
      <p>Click on each red dot</p>
      <p>Progress: {calibrationCount} / {points.length}</p>
      
      {points.map((point, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            width: 20,
            height: 20,
            background: 'red',
            borderRadius: '50%',
            opacity: i < calibrationCount ? 0.3 : 1,
          }}
        />
      ))}
      
      <button onClick={clearData}>Restart</button>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@webgazer-ts/react'"

**Solution:** Make sure you've linked the package:
```bash
cd packages/react
npm link
```

Then in your project:
```bash
npm link @webgazer-ts/react
```

### Issue: "Cannot find module '@webgazer-ts/core'"

**Solution:** Build the core package first:
```bash
cd packages/core
pnpm run build
```

### Issue: No gaze data appearing

**Solution:** 
1. Make sure you called `start()` or set `autoStart: true`
2. Allow camera permissions when prompted
3. Click around the screen to calibrate (need at least 9 points)
4. Check browser console for errors

### Issue: TypeScript errors

**Solution:** The packages have full TypeScript support. Make sure:
1. Your `tsconfig.json` includes the packages
2. You've built the packages (which generates `.d.ts` files)
3. Your IDE has reloaded the TypeScript server

## ✨ What's Next?

The MVP is complete! Future enhancements could include:

- **Phase 2:** Advanced hooks
  - `useCalibration()` - Programmatic calibration
  - `useGazeElement()` - Track gaze on elements
  - `useGazeHeatmap()` - Heatmap visualization
  
- **Phase 3:** UI Components
  - `<CalibrationScreen>` - Full-screen calibration
  - `<GazeElement>` - Gaze-aware wrapper
  - `<HeatmapOverlay>` - Visual heatmap

- **Phase 4:** Testing
  - Unit tests
  - Integration tests
  - Storybook examples

- **Phase 5:** Publishing
  - Publish to NPM
  - CI/CD pipeline
  - Automated versioning

## 🎓 Learn More

- Read `REACT_WRAPPER_API_PREVIEW.md` for 10 complete examples
- Check `REACT_WRAPPER_IMPLEMENTATION_PLAN.md` for technical details
- See `packages/react/README.md` for full API documentation

## 🙌 Feedback

Try it out and let me know:
- What works well?
- What's confusing?
- What features would you like to see?

---

**Happy eye tracking with React! 👁️⚛️**
