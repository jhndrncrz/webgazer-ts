# @webgazer-ts/react

React hooks and components for WebGazer.ts eye tracking library.

## Installation

```bash
npm install @webgazer-ts/react
# or
pnpm add @webgazer-ts/react
# or
yarn add @webgazer-ts/react
```

## Quick Start

### Basic Usage

```tsx
import { useWebGazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, stop, isRunning } = useWebGazer({
    autoStart: true,
  });

  return (
    <div>
      <h1>Gaze Tracker</h1>
      
      <div>
        Status: {isRunning ? '🟢 Running' : '🔴 Stopped'}
      </div>
      
      {gazeData && (
        <div>
          Looking at: ({Math.round(gazeData.x)}, {Math.round(gazeData.y)})
        </div>
      )}
      
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### With Provider Pattern

```tsx
import { WebGazerProvider, useGazeTracking } from '@webgazer-ts/react';

function GazeDisplay() {
  const gaze = useGazeTracking();
  
  return gaze ? (
    <div>Gaze: ({gaze.x}, {gaze.y})</div>
  ) : (
    <div>Waiting for gaze data...</div>
  );
}

function App() {
  return (
    <WebGazerProvider
      autoStart={true}
      showVideoPreview={true}
    >
      <GazeDisplay />
    </WebGazerProvider>
  );
}
```

## API Reference

### Hooks

#### `useWebGazer(options?)`

Main hook for initializing and controlling WebGazer.

**Options:**
- `autoStart?: boolean` - Start tracking automatically (default: false)
- `tracker?: 'TFFacemesh'` - Face tracker to use
- `regression?: 'ridge' | 'ridgeThreaded' | 'ridgeWeighted'` - Regression model
- `saveDataAcrossSessions?: boolean` - Save calibration data (default: true)
- `showVideoPreview?: boolean` - Show video preview (default: false)
- `showFaceOverlay?: boolean` - Show face mesh overlay (default: false)
- `showGazeDot?: boolean` - Show gaze prediction dot (default: false)
- `applyKalmanFilter?: boolean` - Use Kalman filter (default: true)
- `onGaze?: (data, timestamp) => void` - Callback for gaze updates

**Returns:**
- `gazeData: GazePrediction | null` - Current gaze position
- `isRunning: boolean` - Whether tracking is active
- `calibrationCount: number` - Number of calibration points
- `start: () => Promise<void>` - Start tracking
- `stop: () => Promise<void>` - Stop tracking
- `pause: () => Promise<void>` - Pause tracking
- `resume: () => Promise<void>` - Resume tracking
- `clearData: () => void` - Clear calibration data
- `showVideo: () => void` - Show video preview
- `hideVideo: () => void` - Hide video preview

#### `useGazeTracking()`

Simplified hook that returns current gaze data. Must be used within `WebGazerProvider`.

**Returns:**
- `GazePrediction | null` - Current gaze position

### Components

#### `<WebGazerProvider>`

Context provider for WebGazer. Accepts all `useWebGazer` options as props.

```tsx
<WebGazerProvider autoStart={true}>
  {/* Your components */}
</WebGazerProvider>
```

## TypeScript

Fully typed with TypeScript. All types are exported:

```tsx
import type {
  GazePrediction,
  WebGazerConfig,
  UseWebGazerOptions,
  UseWebGazerReturn,
} from '@webgazer-ts/react';
```

## License

GPL-3.0-or-later

## Credits

Based on [WebGazer.js](https://webgazer.cs.brown.edu) by Brown HCI.
