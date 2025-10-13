# React Quick Start

Get started with Webgazer.ts in React using hooks and components.

## Installation

```bash
npm install @webgazer-ts/react
```

::: tip
`@webgazer-ts/core` is automatically included as a dependency - no need to install it separately!
:::

## Basic Hook Usage

The simplest way to add eye tracking to your React app:

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, stop, isRunning } = useWebgazer({
    autoStart: true,
    showVideoPreview: true
  });

  return (
    <div>
      <h1>Eye Tracking Demo</h1>
      
      <p>Status: {isRunning ? '🟢 Running' : '🔴 Stopped'}</p>
      
      {gazeData && (
        <p>
          Looking at: ({Math.round(gazeData.x)}, {Math.round(gazeData.y)})
        </p>
      )}
      
      <button onClick={isRunning ? stop : start}>
        {isRunning ? 'Stop' : 'Start'} Tracking
      </button>
    </div>
  );
}
```

## With Context Provider

For multiple components accessing gaze data:

```tsx
import { WebgazerProvider, useGazeTracking } from '@webgazer-ts/react';

// Child component
function GazeDisplay() {
  const gaze = useGazeTracking();
  
  return gaze ? (
    <div className="gaze-indicator" style={{
      position: 'fixed',
      left: gaze.x,
      top: gaze.y,
      width: 20,
      height: 20,
      background: 'red',
      borderRadius: '50%',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)'
    }} />
  ) : null;
}

// Parent component
function App() {
  return (
    <WebgazerProvider
      autoStart={true}
      showVideoPreview={true}
      showGazeDot={true}
    >
      <h1>My App</h1>
      <GazeDisplay />
      {/* All child components can use useGazeTracking() */}
    </WebgazerProvider>
  );
}
```

## Calibration Flow

Add a calibration screen before your main app:

```tsx
import { useState } from 'react';
import { CalibrationScreen, useWebgazer } from '@webgazer-ts/react';

function App() {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const { calibrationCount } = useWebgazer({ autoStart: true });

  // Show calibration if needed
  if (!isCalibrated && calibrationCount < 9) {
    return (
      <CalibrationScreen
        pointCount={9}
        pointDuration={1000}
        autoAdvance={true}
        onComplete={(result) => {
          if (result.success) {
            setIsCalibrated(true);
          }
        }}
        onCancel={() => setIsCalibrated(true)}
      />
    );
  }

  return (
    <div>
      <h1>Main Application</h1>
      <p>Calibration complete! {calibrationCount} points collected.</p>
    </div>
  );
}
```

## Gaze-Aware Components

Make elements respond to user's gaze:

```tsx
import { GazeElement } from '@webgazer-ts/react';

function Dashboard() {
  return (
    <div className="dashboard">
      <GazeElement
        minDwellTime={2000}
        onDwell={() => console.log('User interested in sales!')}
        style={{
          padding: '20px',
          background: 'lightgray',
          transition: 'all 0.3s'
        }}
        lookingStyle={{
          background: 'lightblue',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        <h2>Sales Dashboard</h2>
        <p>Revenue: $1.2M</p>
      </GazeElement>
    </div>
  );
}
```

## Heatmap Visualization

Track where users are looking:

```tsx
import { WebgazerProvider, HeatmapOverlay } from '@webgazer-ts/react';

function App() {
  return (
    <WebgazerProvider autoStart>
      {/* Your app content */}
      <div>
        <h1>Website Content</h1>
        <p>Users are looking around...</p>
      </div>
      
      {/* Heatmap overlay */}
      <HeatmapOverlay
        radius={30}
        maxOpacity={0.8}
        showControls={true}
        gradient={{
          0.0: 'blue',
          0.5: 'lime',
          1.0: 'red'
        }}
      />
    </WebgazerProvider>
  );
}
```

## Recording Sessions

Capture gaze data for analysis:

```tsx
import { useWebgazer, useGazeRecording } from '@webgazer-ts/react';

function RecordingApp() {
  const { isRunning } = useWebgazer({ autoStart: true });
  const {
    isRecording,
    data,
    startRecording,
    stopRecording,
    exportCSV,
    exportJSON,
    clearData
  } = useGazeRecording();

  return (
    <div>
      <h1>Gaze Session Recording</h1>
      
      <div>
        Tracking: {isRunning ? '✅' : '❌'} | 
        Recording: {isRecording ? '🔴' : '⏹️'} | 
        Points: {data.length}
      </div>
      
      <div>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <button onClick={exportCSV} disabled={data.length === 0}>
          Export CSV
        </button>
        
        <button onClick={exportJSON} disabled={data.length === 0}>
          Export JSON
        </button>
        
        <button onClick={clearData} disabled={data.length === 0}>
          Clear Data
        </button>
      </div>
    </div>
  );
}
```

## TypeScript Support

All hooks and components are fully typed:

```tsx
import type {
  GazePrediction,
  UseWebgazerOptions,
  UseWebgazerReturn,
  CalibrationResult,
  WebgazerProviderProps
} from '@webgazer-ts/react';

// Type-safe options
const options: UseWebgazerOptions = {
  autoStart: true,
  tracker: 'TFFacemesh',
  regression: 'ridge',
  showVideoPreview: true,
  onGaze: (data: GazePrediction | null, timestamp: number) => {
    if (data) {
      console.log(`Gaze at (${data.x}, ${data.y}) at ${timestamp}ms`);
    }
  }
};

// Type-safe return values
const result: UseWebgazerReturn = useWebgazer(options);
```

## Next Steps

- [Explore All Hooks](/guide/react/hooks) - Deep dive into each hook
- [Component Documentation](/guide/react/components) - Learn about all components
- [Best Practices](/guide/react/best-practices) - Tips for production apps
- [Complete Examples](/examples/react-basic) - See full working examples

## Common Patterns

### Pattern 1: Conditional Rendering

```tsx
function App() {
  const { isRunning, start } = useWebgazer();
  
  if (!isRunning) {
    return (
      <div>
        <h1>Click to start eye tracking</h1>
        <button onClick={start}>Start</button>
      </div>
    );
  }
  
  return <MainApp />;
}
```

### Pattern 2: Multiple Gaze Elements

```tsx
function InteractiveGrid() {
  const items = ['A', 'B', 'C', 'D'];
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {items.map(item => (
        <GazeElement
          key={item}
          minDwellTime={1500}
          onDwell={() => console.log(`Selected ${item}`)}
          lookingStyle={{ background: 'yellow' }}
        >
          Item {item}
        </GazeElement>
      ))}
    </div>
  );
}
```

### Pattern 3: Custom Calibration UI

```tsx
function CustomCalibration() {
  const {
    isCalibrating,
    currentPoint,
    progress,
    startCalibration,
    stopCalibration
  } = useCalibration({
    pointCount: 9,
    onComplete: (result) => {
      console.log('Calibration complete!', result);
    }
  });

  if (!isCalibrating) {
    return <button onClick={startCalibration}>Calibrate</button>;
  }

  return (
    <div>
      <div>Progress: {Math.round(progress)}%</div>
      {currentPoint && (
        <div
          style={{
            position: 'fixed',
            left: currentPoint.x,
            top: currentPoint.y,
            width: 30,
            height: 30,
            background: 'red',
            borderRadius: '50%'
          }}
        />
      )}
      <button onClick={stopCalibration}>Cancel</button>
    </div>
  );
}
```

## Performance Tips

1. **Use Provider for Multiple Consumers** - Avoid multiple `useWebgazer` calls
2. **Memoize Callbacks** - Use `useCallback` for `onGaze` handlers
3. **Debounce Updates** - For UI updates based on gaze position
4. **Cleanup on Unmount** - Hooks handle this automatically!

```tsx
import { useCallback } from 'react';

function OptimizedApp() {
  const handleGaze = useCallback((data: GazePrediction | null) => {
    // This function won't be recreated on every render
    if (data) {
      console.log(data);
    }
  }, []);

  const { gazeData } = useWebgazer({
    onGaze: handleGaze
  });

  return <div>...</div>;
}
```
