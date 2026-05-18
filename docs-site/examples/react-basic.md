# React Basic Example

A minimal React application with eye tracking using `@webgazer-ts/react`.

## Installation

```bash
npm install @webgazer-ts/react @webgazer-ts/core
# or
pnpm add @webgazer-ts/react @webgazer-ts/core
```

## Minimal Example

```tsx
import { WebgazerProvider, useGazeTracking } from '@webgazer-ts/react';

function GazeCursor() {
  const { x, y, isTracking } = useGazeTracking();

  if (!isTracking || x === null || y === null) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 12,
        height: 12,
        background: 'rgba(99, 102, 241, 0.8)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        transition: 'left 0.05s, top 0.05s',
        zIndex: 9999,
      }}
    />
  );
}

function StartButton() {
  const { start, stop, isRunning } = useWebgazer();

  return (
    <button onClick={isRunning ? stop : start}>
      {isRunning ? 'Stop Tracking' : 'Start Eye Tracking'}
    </button>
  );
}

export default function App() {
  return (
    <WebgazerProvider>
      <h1>My Eye Tracking App</h1>
      <StartButton />
      <GazeCursor />
    </WebgazerProvider>
  );
}
```

## Complete Starter App

A more complete example with status display, error handling, and calibration:

```tsx
import { useState } from 'react';
import {
  WebgazerProvider,
  useWebgazer,
  useGazeTracking,
  CalibrationScreen,
} from '@webgazer-ts/react';

function StatusBar() {
  const { isRunning, calibrationCount } = useWebgazer();
  const { x, y } = useGazeTracking();

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 8,
      fontSize: 13,
      fontFamily: 'monospace',
    }}>
      <div>Status: {isRunning ? '🟢 Tracking' : '⚫ Stopped'}</div>
      <div>Calibration points: {calibrationCount}</div>
      {x !== null && <div>Gaze: ({Math.round(x)}, {Math.round(y ?? 0)})</div>}
    </div>
  );
}

function Controls() {
  const [showCal, setShowCal] = useState(false);
  const { start, stop, isRunning } = useWebgazer();

  return (
    <div style={{ display: 'flex', gap: 8, padding: 20 }}>
      <button onClick={isRunning ? stop : start}>
        {isRunning ? 'Stop' : 'Start'} Tracking
      </button>
      <button onClick={() => setShowCal(true)} disabled={!isRunning}>
        Calibrate
      </button>

      {showCal && (
        <CalibrationScreen
          pointCount={9}
          onComplete={() => setShowCal(false)}
          onCancel={() => setShowCal(false)}
        />
      )}
    </div>
  );
}

function GazeDot() {
  const { x, y, isTracking } = useGazeTracking();
  if (!isTracking || x === null || y === null) return null;

  return (
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      width: 14,
      height: 14,
      background: '#6366f1',
      border: '2px solid white',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 9998,
    }} />
  );
}

export default function App() {
  return (
    <WebgazerProvider>
      <h1>React Eye Tracking Demo</h1>
      <Controls />
      <StatusBar />
      <GazeDot />
    </WebgazerProvider>
  );
}
```

## Configuration via `WebgazerProvider`

```tsx
<WebgazerProvider
  autoStart={false}            // Don't start camera on mount
  regression="ridge"           // Gaze prediction algorithm
  tracker="TFFacemesh"         // Face tracker
  applyKalmanFilter={true}     // Smooth predictions
  saveDataAcrossSessions={true} // Persist calibration
  showVideo={true}             // Show webcam preview
  showFaceOverlay={false}      // Hide face mesh overlay
>
  <App />
</WebgazerProvider>
```

## See Also

- [React Hooks Reference](/guide/react/hooks)
- [React Components](/guide/react/components)
- [React Quick Start](/guide/react/quick-start)
- [Full React App Example](/examples/react-full-app)
