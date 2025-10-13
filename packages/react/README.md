# @webgazer-ts/react

React hooks and components for Webgazer.ts eye tracking library.

[![npm version](https://img.shields.io/npm/v/@webgazer-ts/react.svg)](https://www.npmjs.com/package/@webgazer-ts/react)
[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](../../LICENSE.md)

## Features

✨ **7 Powerful Hooks:**
- `useWebgazer()` - Complete eye tracking control
- `useGazeTracking()` - Simple gaze data access
- `useCalibration()` - Programmatic calibration
- `useGazeElement()` - Track gaze on elements
- `useGazeHeatmap()` - Heatmap visualization
- `useGazeRecording()` - Session recording
- `useWebgazerContext()` - Context access

🎨 **4 Ready-to-Use Components:**
- `<WebgazerProvider>` - Context provider
- `<CalibrationScreen>` - Full-screen calibration UI
- `<GazeElement>` - Gaze-aware wrapper
- `<HeatmapOverlay>` - Heatmap visualization

🔧 **Developer Experience:**
- Full TypeScript support
- Automatic lifecycle management
- Zero configuration needed
- Comprehensive examples

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
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, stop, isRunning } = useWebgazer({
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
import { WebgazerProvider, useGazeTracking } from '@webgazer-ts/react';

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
    <WebgazerProvider
      autoStart={true}
      showVideoPreview={true}
    >
      <GazeDisplay />
    </WebgazerProvider>
  );
}
```

## API Reference

### Hooks

#### `useWebgazer(options?)`

Main hook for initializing and controlling Webgazer.

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

Simplified hook that returns current gaze data. Must be used within `WebgazerProvider`.

**Returns:**
- `GazePrediction | null` - Current gaze position

#### `useCalibration(options?)`

Programmatic control over calibration process.

**Options:**
- `pointCount?: number` - Number of calibration points (default: 9)
- `pointDuration?: number` - Duration per point in ms (default: 1000)
- `autoAdvance?: boolean` - Auto-advance to next point (default: true)
- `onComplete?: (result) => void` - Callback when calibration completes
- `onPointComplete?: (index) => void` - Callback after each point

**Returns:**
- `isCalibrating: boolean` - Is calibration active
- `progress: number` - Progress percentage (0-100)
- `currentPoint: CalibrationPoint | null` - Current point { x, y, index }
- `startCalibration: () => void` - Start calibration
- `stopCalibration: () => void` - Stop calibration
- `nextPoint: () => void` - Advance to next point

**Example:**
```tsx
const { isCalibrating, currentPoint, startCalibration } = useCalibration({
  pointCount: 9,
  autoAdvance: true,
  onComplete: (result) => console.log('Done!', result),
});
```

#### `useGazeElement(options?)`

Track when user is looking at a specific element.

**Options:**
- `threshold?: number` - Hit detection tolerance in pixels (default: 50)
- `minDwellTime?: number` - Min dwell time for callback in ms (default: 0)
- `onEnter?: () => void` - Called when gaze enters element
- `onLeave?: () => void` - Called when gaze leaves element
- `onDwell?: () => void` - Called after minDwellTime

**Returns:**
- `ref: RefObject<HTMLElement>` - Ref to attach to element
- `isLooking: boolean` - Is user currently looking at element
- `dwellTime: number` - Time user has been looking in ms

**Example:**
```tsx
const { ref, isLooking, dwellTime } = useGazeElement({
  threshold: 50,
  minDwellTime: 2000,
  onDwell: () => console.log('User dwelled for 2s!'),
});

<button ref={ref} style={{ opacity: isLooking ? 1 : 0.5 }}>
  Look at me! {dwellTime > 0 && `(${(dwellTime/1000).toFixed(1)}s)`}
</button>
```

#### `useGazeHeatmap(options?)`

Generate and visualize gaze heatmap data.

**Options:**
- `width?: number` - Canvas width (default: window.innerWidth)
- `height?: number` - Canvas height (default: window.innerHeight)
- `radius?: number` - Point radius (default: 30)
- `maxOpacity?: number` - Max opacity (default: 0.8)
- `blur?: number` - Blur amount (default: 15)
- `gradient?: Record<number, string>` - Color gradient

**Returns:**
- `canvasRef: RefObject<HTMLCanvasElement>` - Ref for canvas element
- `points: HeatmapPoint[]` - Array of gaze points
- `clear: () => void` - Clear heatmap
- `exportData: () => string` - Export as CSV string
- `exportImage: () => string | null` - Export as PNG data URL

**Example:**
```tsx
const { canvasRef, points, clear, exportData } = useGazeHeatmap({
  radius: 30,
  maxOpacity: 0.8,
});

<>
  <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0 }} />
  <button onClick={clear}>Clear ({points.length})</button>
</>
```

#### `useGazeRecording()`

Record gaze sessions for analysis.

**Returns:**
- `isRecording: boolean` - Is recording active
- `data: GazeRecordingEntry[]` - Array of recorded points
- `startRecording: () => void` - Start recording
- `stopRecording: () => void` - Stop recording
- `clearData: () => void` - Clear recorded data
- `exportCSV: () => void` - Export and download as CSV
- `exportJSON: () => void` - Export and download as JSON

**Example:**
```tsx
const { isRecording, data, startRecording, stopRecording, exportCSV } = useGazeRecording();

<>
  <button onClick={isRecording ? stopRecording : startRecording}>
    {isRecording ? 'Stop' : 'Start'} Recording
  </button>
  <p>Recorded: {data.length} points</p>
  <button onClick={exportCSV}>Export CSV</button>
</>
```

### Components

#### `<WebgazerProvider>`

Context provider for Webgazer. Accepts all `useWebgazer` options as props.

```tsx
<WebgazerProvider autoStart={true}>
  {/* Your components */}
</WebgazerProvider>
```

#### `<CalibrationScreen>`

Full-screen calibration UI with animated points.

**Props:**
- `pointCount?: number` - Number of points (default: 9)
- `pointDuration?: number` - Duration per point (default: 1000)
- `autoAdvance?: boolean` - Auto-advance (default: true)
- `onComplete?: (result) => void` - Completion callback
- `onCancel?: () => void` - Cancel callback
- `theme?: object` - Customize colors

**Example:**
```tsx
<CalibrationScreen
  pointCount={9}
  onComplete={(result) => {
    if (result.success) {
      console.log('Calibration complete!');
    }
  }}
  theme={{
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    pointColor: '#ff0000',
    progressColor: '#00ff00',
  }}
/>
```

#### `<GazeElement>`

Wrapper component that responds to gaze.

**Props:**
- All `useGazeElement` options
- `children: ReactNode` - Content to wrap
- `className?: string` - CSS class
- `style?: CSSProperties` - Base style
- `lookingStyle?: CSSProperties` - Style when looking
- `onDwellStyle?: CSSProperties` - Style when dwelling

**Example:**
```tsx
<GazeElement
  minDwellTime={2000}
  onDwell={() => console.log('Dwelled!')}
  style={{ padding: '20px', background: 'gray' }}
  lookingStyle={{ background: 'lightblue', transform: 'scale(1.1)' }}
  onDwellStyle={{ background: 'yellow' }}
>
  <h3>Interactive Card</h3>
  <p>Look at me to interact!</p>
</GazeElement>
```

#### `<HeatmapOverlay>`

Visual overlay showing gaze heatmap.

**Props:**
- All `useGazeHeatmap` options
- `showControls?: boolean` - Show control buttons (default: false)
- `onClear?: () => void` - Clear callback
- `style?: CSSProperties` - Canvas style

**Example:**
```tsx
<HeatmapOverlay
  radius={30}
  showControls={true}
  onClear={() => console.log('Heatmap cleared')}
/>
```

## Complete Examples

### Example 1: Full Calibration Flow

```tsx
import { useState } from 'react';
import { CalibrationScreen, useWebgazer } from '@webgazer-ts/react';

function App() {
  const [needsCalibration, setNeedsCalibration] = useState(true);
  const { calibrationCount } = useWebgazer({ autoStart: true });

  if (needsCalibration && calibrationCount < 9) {
    return (
      <CalibrationScreen
        pointCount={9}
        onComplete={() => setNeedsCalibration(false)}
      />
    );
  }

  return <div>Main App Content</div>;
}
```

### Example 2: Gaze-Aware Dashboard

```tsx
import { WebgazerProvider, GazeElement } from '@webgazer-ts/react';

function Dashboard() {
  return (
    <WebgazerProvider autoStart>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <GazeElement
          minDwellTime={2000}
          onDwell={() => console.log('User interested in sales')}
          lookingStyle={{ transform: 'scale(1.05)' }}
        >
          <Card title="Sales" value="$1.2M" />
        </GazeElement>
        
        <GazeElement
          minDwellTime={2000}
          onDwell={() => console.log('User checking users')}
          lookingStyle={{ transform: 'scale(1.05)' }}
        >
          <Card title="Users" value="10.5K" />
        </GazeElement>
      </div>
    </WebgazerProvider>
  );
}
```

### Example 3: Heatmap Analysis

```tsx
import { WebgazerProvider, HeatmapOverlay } from '@webgazer-ts/react';

function App() {
  return (
    <WebgazerProvider autoStart>
      <HeatmapOverlay 
        showControls 
        radius={40}
        gradient={{
          0.0: 'blue',
          0.5: 'lime',
          1.0: 'red',
        }}
      />
      <YourContent />
    </WebgazerProvider>
  );
}
```

### Example 4: Session Recording

```tsx
import { useWebgazer, useGazeRecording } from '@webgazer-ts/react';

function RecordingApp() {
  const { isRunning } = useWebgazer({ autoStart: true });
  const { isRecording, data, startRecording, stopRecording, exportCSV } = useGazeRecording();

  return (
    <div>
      <p>Status: {isRunning ? 'Tracking' : 'Not running'}</p>
      
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? '⏹️ Stop' : '🔴 Start'} Recording
      </button>
      
      <p>Recorded: {data.length} points</p>
      
      <button onClick={exportCSV} disabled={data.length === 0}>
        Export CSV
      </button>
    </div>
  );
}
```

## TypeScript

Fully typed with TypeScript. All types are exported:

```tsx
import type {
  GazePrediction,
  WebgazerConfig,
  UseWebgazerOptions,
  UseWebgazerReturn,
  UseCalibrationOptions,
  CalibrationResult,
  UseGazeElementOptions,
  UseGazeElementReturn,
  HeatmapPoint,
  UseGazeHeatmapOptions,
  GazeRecordingEntry,
} from '@webgazer-ts/react';
```

## License

GPL-3.0-or-later

## Credits

Based on [Webgazer.js](https://webgazer.cs.brown.edu) by Brown HCI.
