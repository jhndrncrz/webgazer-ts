# React API Reference

Complete API documentation for `@webgazer-ts/react`.

## Overview

The React package provides:

- **7 Hooks** - For programmatic control and data access
- **4 Components** - Pre-built UI elements
- **Full TypeScript** - Complete type definitions
- **Automatic Cleanup** - Proper lifecycle management

## Hooks

### useWebgazer()

Main hook for initializing and controlling Webgazer.

```typescript
const {
  gazeData,
  isRunning,
  calibrationCount,
  start,
  stop,
  pause,
  resume,
  clearData,
  showVideo,
  hideVideo
} = useWebgazer(options);
```

[View detailed documentation →](./modules/hooks_useWebgazer)

### useGazeTracking()

Simple hook for accessing gaze data. Must be used within `WebgazerProvider`.

```typescript
const gazeData = useGazeTracking();
```

### useCalibration()

Programmatic calibration control.

```typescript
const {
  isCalibrating,
  progress,
  currentPoint,
  startCalibration,
  stopCalibration,
  nextPoint
} = useCalibration(options);
```

### useGazeElement()

Track when user looks at specific elements.

```typescript
const {
  ref,
  isLooking,
  dwellTime
} = useGazeElement(options);
```

### useGazeHeatmap()

Generate and visualize gaze heatmaps.

```typescript
const {
  canvasRef,
  points,
  clear,
  exportData,
  exportImage
} = useGazeHeatmap(options);
```

### useGazeRecording()

Record gaze sessions for analysis.

```typescript
const {
  isRecording,
  data,
  startRecording,
  stopRecording,
  clearData,
  exportCSV,
  exportJSON
} = useGazeRecording();
```

### useWebgazerContext()

Access WebgazerContext directly.

```typescript
const context = useWebgazerContext();
```

## Components

### `<WebgazerProvider>`

Context provider for Webgazer. Required for hooks like `useGazeTracking()`.

```tsx
<WebgazerProvider
  autoStart={true}
  showVideoPreview={true}
  tracker="TFFacemesh"
  regression="ridge"
>
  {children}
</WebgazerProvider>
```

[View detailed documentation →](./modules/components_WebgazerProvider)

### `<CalibrationScreen>`

Full-screen calibration UI with animated points.

```tsx
<CalibrationScreen
  pointCount={9}
  pointDuration={1000}
  autoAdvance={true}
  onComplete={(result) => {}}
  onCancel={() => {}}
/>
```

### `<GazeElement>`

Wrapper that responds to user's gaze.

```tsx
<GazeElement
  minDwellTime={2000}
  onDwell={() => {}}
  lookingStyle={{ background: 'yellow' }}
>
  Content
</GazeElement>
```

### `<HeatmapOverlay>`

Visual heatmap overlay.

```tsx
<HeatmapOverlay
  radius={30}
  maxOpacity={0.8}
  showControls={true}
/>
```

## Type Definitions

### UseWebgazerOptions

```typescript
interface UseWebgazerOptions {
  autoStart?: boolean;
  tracker?: 'TFFacemesh';
  regression?: 'ridge' | 'ridgeThreaded' | 'ridgeWeighted';
  saveDataAcrossSessions?: boolean;
  showVideoPreview?: boolean;
  showFaceOverlay?: boolean;
  showGazeDot?: boolean;
  applyKalmanFilter?: boolean;
  onGaze?: (data: GazePrediction | null, timestamp: number) => void;
}
```

### UseWebgazerReturn

```typescript
interface UseWebgazerReturn {
  gazeData: GazePrediction | null;
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

### GazePrediction

```typescript
interface GazePrediction {
  x: number;
  y: number;
}
```

### UseCalibrationOptions

```typescript
interface UseCalibrationOptions {
  pointCount?: number;
  pointDuration?: number;
  autoAdvance?: boolean;
  onComplete?: (result: CalibrationResult) => void;
  onPointComplete?: (index: number) => void;
}
```

### CalibrationPoint

```typescript
interface CalibrationPoint {
  x: number;
  y: number;
  index: number;
}
```

### CalibrationResult

```typescript
interface CalibrationResult {
  success: boolean;
  pointsCollected: number;
  duration: number;
}
```

### UseGazeElementOptions

```typescript
interface UseGazeElementOptions {
  threshold?: number;
  minDwellTime?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onDwell?: () => void;
}
```

### HeatmapPoint

```typescript
interface HeatmapPoint {
  x: number;
  y: number;
  timestamp: number;
  value: number;
}
```

### GazeRecordingEntry

```typescript
interface GazeRecordingEntry {
  timestamp: number;
  x: number;
  y: number;
}
```

## Usage Examples

### Basic Tracking

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, isRunning, start } = useWebgazer({
    autoStart: true
  });

  return (
    <div>
      {gazeData && <p>Gaze: ({gazeData.x}, {gazeData.y})</p>}
      <button onClick={start}>Start</button>
    </div>
  );
}
```

### With Provider

```tsx
import { WebgazerProvider, useGazeTracking } from '@webgazer-ts/react';

function Child() {
  const gaze = useGazeTracking();
  return <div>{gaze ? `${gaze.x}, ${gaze.y}` : 'No gaze'}</div>;
}

function App() {
  return (
    <WebgazerProvider autoStart>
      <Child />
    </WebgazerProvider>
  );
}
```

### Calibration

```tsx
import { CalibrationScreen } from '@webgazer-ts/react';

function App() {
  return (
    <CalibrationScreen
      pointCount={9}
      onComplete={() => console.log('Done!')}
    />
  );
}
```

### Gaze-Aware UI

```tsx
import { GazeElement } from '@webgazer-ts/react';

function Card() {
  return (
    <GazeElement
      minDwellTime={2000}
      onDwell={() => console.log('User dwelled')}
      lookingStyle={{ transform: 'scale(1.1)' }}
    >
      <h2>Card Content</h2>
    </GazeElement>
  );
}
```

### Heatmap

```tsx
import { HeatmapOverlay } from '@webgazer-ts/react';

function App() {
  return (
    <>
      <YourContent />
      <HeatmapOverlay showControls radius={30} />
    </>
  );
}
```

### Recording

```tsx
import { useGazeRecording } from '@webgazer-ts/react';

function Recorder() {
  const { isRecording, startRecording, exportCSV } = useGazeRecording();
  
  return (
    <div>
      <button onClick={startRecording}>
        {isRecording ? 'Recording...' : 'Start'}
      </button>
      <button onClick={exportCSV}>Export</button>
    </div>
  );
}
```

## Best Practices

### 1. Use Provider for Multiple Consumers

```tsx
// ✅ Good - Single webgazer instance
<WebgazerProvider autoStart>
  <ComponentA />
  <ComponentB />
  <ComponentC />
</WebgazerProvider>

// ❌ Bad - Multiple instances
function ComponentA() {
  useWebgazer(); // Creates instance 1
}
function ComponentB() {
  useWebgazer(); // Creates instance 2
}
```

### 2. Memoize Callbacks

```tsx
const handleGaze = useCallback((data: GazePrediction | null) => {
  // Handler logic
}, []);

useWebgazer({ onGaze: handleGaze });
```

### 3. Cleanup Automatically

```tsx
// Hooks handle cleanup automatically
useEffect(() => {
  // No need for manual cleanup!
}, []);
```

### 4. Type Everything

```tsx
import type { GazePrediction, UseWebgazerOptions } from '@webgazer-ts/react';

const options: UseWebgazerOptions = {
  autoStart: true
};

const handleGaze = (data: GazePrediction | null) => {
  // Fully typed
};
```

## Performance Tips

1. **Debounce UI updates** - Don't update on every gaze event
2. **Use CSS transforms** - For smooth gaze dot movement
3. **Lazy load** - Only initialize when needed
4. **Memoize expensive calculations** - Use React.memo, useMemo

## Browser Support

Same as `@webgazer-ts/core`:
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+

## Next Steps

- [View full TypeDoc API →](./modules)
- [Read React guide →](/guide/react/quick-start)
- [See examples →](/examples/react-basic)
