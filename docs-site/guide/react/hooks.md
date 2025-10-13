# React Hooks

Complete reference for all React hooks provided by `@webgazer-ts/react`.

## useWebgazer

Access the Webgazer instance and control methods.

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function MyComponent() {
  const {
    webgazer,     // Webgazer instance
    isReady,      // Is tracking active?
    begin,        // Start tracking
    end,          // Stop tracking
    pause,        // Pause tracking
    resume        // Resume tracking
  } = useWebgazer();

  return (
    <button onClick={begin} disabled={isReady}>
      {isReady ? 'Tracking Active' : 'Start Tracking'}
    </button>
  );
}
```

## useGazeTracking

Track gaze position in real-time.

```tsx
import { useGazeTracking } from '@webgazer-ts/react';

function GazeCursor() {
  const { x, y, isTracking } = useGazeTracking();

  if (!isTracking) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 10,
        height: 10,
        background: 'red',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}
    />
  );
}
```

## useGazeElement

Detect when user is looking at an element.

```tsx
import { useGazeElement } from '@webgazer-ts/react';

function GazeButton() {
  const { ref, isGazedAt, dwellTime } = useGazeElement({
    dwellThreshold: 1000 // Trigger after 1 second
  });

  return (
    <button
      ref={ref}
      style={{
        background: isGazedAt ? 'green' : 'gray',
        transform: `scale(${1 + dwellTime / 1000})`
      }}
    >
      Look at me! ({dwellTime}ms)
    </button>
  );
}
```

## useCalibration

Handle calibration flow.

```tsx
import { useCalibration } from '@webgazer-ts/react';

function CalibrationUI() {
  const { calibrate, isCalibrating, progress } = useCalibration();

  return (
    <div>
      <button onClick={() => calibrate(9)}>
        Calibrate (9 points)
      </button>
      {isCalibrating && (
        <div>Calibrating... {progress}%</div>
      )}
    </div>
  );
}
```

## useGazeRecording

Record gaze data for analysis.

```tsx
import { useGazeRecording } from '@webgazer-ts/react';

function GazeRecorder() {
  const { startRecording, stopRecording, data, isRecording } = useGazeRecording();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gaze-data.json';
    a.click();
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop' : 'Start'} Recording
      </button>
      {data.length > 0 && (
        <button onClick={handleExport}>
          Export {data.length} points
        </button>
      )}
    </div>
  );
}
```

## useGazeHistory

Track gaze history with filtering.

```tsx
import { useGazeHistory } from '@webgazer-ts/react';

function GazeHeatmap() {
  const points = useGazeHistory({
    maxPoints: 1000,
    timeWindow: 10000 // Last 10 seconds
  });

  return (
    <svg width="100%" height="100%">
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={3}
          fill="red"
          opacity={0.3}
        />
      ))}
    </svg>
  );
}
```

## useWebgazerState

Access global Webgazer state.

```tsx
import { useWebgazerState } from '@webgazer-ts/react';

function StatusDisplay() {
  const {
    isReady,
    isFaceDetected,
    currentPrediction,
    config
  } = useWebgazerState();

  return (
    <div>
      <div>Ready: {isReady ? '✅' : '❌'}</div>
      <div>Face: {isFaceDetected ? '✅' : '❌'}</div>
      <div>Regression: {config.regression}</div>
      {currentPrediction && (
        <div>Gaze: ({currentPrediction.x}, {currentPrediction.y})</div>
      )}
    </div>
  );
}
```

## Hook Options

### useGazeTracking Options

```typescript
{
  enabled?: boolean;           // Enable/disable tracking
  smoothing?: number;          // Smoothing factor (0-1)
  throttleMs?: number;         // Throttle updates (ms)
}
```

### useGazeElement Options

```typescript
{
  dwellThreshold?: number;     // Dwell time trigger (ms)
  onGazeEnter?: () => void;   // Called when gaze enters
  onGazeLeave?: () => void;   // Called when gaze leaves
  onDwell?: () => void;        // Called when dwell threshold reached
}
```

### useGazeRecording Options

```typescript
{
  autoStart?: boolean;         // Start recording immediately
  includeTimestamp?: boolean;  // Include timestamps
  includeEyeFeatures?: boolean;// Include eye features
}
```

## Next Steps

- [Components](/guide/react/components) - Pre-built React components
- [Best Practices](/guide/react/best-practices) - Optimization tips
- [Examples](/examples/react-basic) - Complete examples
- [API Reference](/api/react/) - Full API documentation
