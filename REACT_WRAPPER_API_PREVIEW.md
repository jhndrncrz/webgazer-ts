# WebGazer React API Preview

## What the API will look like for developers

This document shows exactly what developers will write when using `@webgazer-ts/react`.

---

## Example 1: Simple Gaze Tracker

```tsx
import { useWebGazer } from '@webgazer-ts/react';

function SimpleGazeTracker() {
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

export default SimpleGazeTracker;
```

**That's it!** Just import the hook, use it, and you're tracking gaze in React.

---

## Example 2: With Calibration

```tsx
import { useWebGazer, useCalibration } from '@webgazer-ts/react';

function GazeWithCalibration() {
  const { isRunning, calibrationCount, gazeData } = useWebGazer({
    autoStart: true,
    showVideoPreview: true,
    showFaceOverlay: true,
  });

  const {
    isCalibrating,
    progress,
    currentPoint,
    startCalibration,
    stopCalibration,
  } = useCalibration({
    pointCount: 9,
    autoAdvance: true,
  });

  if (isCalibrating && currentPoint) {
    return (
      <div>
        <h2>Calibration in Progress</h2>
        <p>Progress: {progress}%</p>
        <p>Click on the red dot</p>
        
        <div
          style={{
            position: 'fixed',
            left: currentPoint.x,
            top: currentPoint.y,
            width: 20,
            height: 20,
            backgroundColor: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        <button onClick={stopCalibration}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Eye Tracking App</h1>
      
      <div>
        Calibration Points: {calibrationCount}
        {calibrationCount < 9 && ' (Need at least 9)'}
      </div>
      
      {gazeData && (
        <div>
          Gaze: ({Math.round(gazeData.x)}, {Math.round(gazeData.y)})
        </div>
      )}
      
      <button onClick={startCalibration}>
        {calibrationCount === 0 ? 'Start Calibration' : 'Re-calibrate'}
      </button>
    </div>
  );
}

export default GazeWithCalibration;
```

---

## Example 3: Track Specific Elements

```tsx
import { useGazeElement } from '@webgazer-ts/react';

function InteractiveButton() {
  const { ref, isLooking, dwellTime } = useGazeElement({
    threshold: 50,        // 50px tolerance
    minDwellTime: 1000,   // 1 second
    onDwell: () => {
      console.log('User dwelled on this button!');
    },
  });

  return (
    <button
      ref={ref}
      style={{
        padding: '20px',
        fontSize: '18px',
        backgroundColor: isLooking ? 'lightblue' : 'lightgray',
        border: dwellTime > 500 ? '3px solid blue' : '1px solid gray',
        transform: `scale(${isLooking ? 1.1 : 1})`,
        transition: 'all 0.2s',
      }}
    >
      Look at me!
      {dwellTime > 0 && ` (${Math.round(dwellTime / 1000)}s)`}
    </button>
  );
}

function Dashboard() {
  return (
    <div>
      <h1>Interactive Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <InteractiveButton />
        <InteractiveButton />
        <InteractiveButton />
        <InteractiveButton />
      </div>
    </div>
  );
}

export default Dashboard;
```

---

## Example 4: Heatmap Visualization

```tsx
import { useWebGazer, useGazeHeatmap } from '@webgazer-ts/react';

function HeatmapDemo() {
  const { isRunning } = useWebGazer({ autoStart: true });
  
  const { 
    canvasRef, 
    points, 
    clear, 
    exportData 
  } = useGazeHeatmap({
    width: window.innerWidth,
    height: window.innerHeight,
    radius: 30,
    maxOpacity: 0.8,
  });

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      
      <div style={{ padding: '20px' }}>
        <h1>Heatmap Visualization</h1>
        <p>Status: {isRunning ? 'Tracking' : 'Not running'}</p>
        <p>Points tracked: {points.length}</p>
        
        <button onClick={clear}>Clear Heatmap</button>
        <button onClick={exportData}>Export Data (CSV)</button>
      </div>
      
      {/* Your content here */}
      <div style={{ padding: '20px' }}>
        <p>Look around this page to see the heatmap build up!</p>
      </div>
    </div>
  );
}

export default HeatmapDemo;
```

---

## Example 5: Context Provider Pattern

```tsx
import { WebGazerProvider, useGazeTracking } from '@webgazer-ts/react';

// Child component that uses gaze data
function GazeDisplay() {
  const gaze = useGazeTracking();
  
  return gaze ? (
    <div>
      Current gaze: ({Math.round(gaze.x)}, {Math.round(gaze.y)})
    </div>
  ) : (
    <div>Waiting for gaze data...</div>
  );
}

// Another child component
function GazeLogger() {
  const gaze = useGazeTracking();
  
  useEffect(() => {
    if (gaze) {
      console.log('Gaze moved to:', gaze);
    }
  }, [gaze]);
  
  return null;
}

// Root app with provider
function App() {
  return (
    <WebGazerProvider
      config={{
        tracker: 'TFFacemesh',
        regression: 'ridge',
        saveDataAcrossSessions: true,
        showVideoPreview: true,
      }}
      autoStart={true}
    >
      <div>
        <h1>My App</h1>
        <GazeDisplay />
        <GazeLogger />
        {/* Any component can access gaze data */}
      </div>
    </WebGazerProvider>
  );
}

export default App;
```

---

## Example 6: Full-Screen Calibration Component

```tsx
import { CalibrationScreen } from '@webgazer-ts/react';

function App() {
  const [needsCalibration, setNeedsCalibration] = useState(true);
  const [calibrationComplete, setCalibrationComplete] = useState(false);

  if (needsCalibration) {
    return (
      <CalibrationScreen
        pointCount={9}
        pointDuration={1000}
        onComplete={(result) => {
          console.log('Calibration complete:', result);
          setNeedsCalibration(false);
          setCalibrationComplete(true);
        }}
        onCancel={() => {
          setNeedsCalibration(false);
        }}
        theme={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          pointColor: '#ff0000',
          progressColor: '#00ff00',
        }}
      />
    );
  }

  return (
    <div>
      <h1>Main App</h1>
      {calibrationComplete && <p>✅ Calibration complete!</p>}
      <button onClick={() => setNeedsCalibration(true)}>
        Re-calibrate
      </button>
    </div>
  );
}

export default App;
```

---

## Example 7: Gaze-Based Scrolling

```tsx
import { useWebGazer, useGazeScroll } from '@webgazer-ts/react';

function AutoScrollPage() {
  const { isRunning } = useWebGazer({ autoStart: true });
  
  useGazeScroll({
    enabled: isRunning,
    scrollSpeed: 2,
    edgeThreshold: 100,  // Start scrolling 100px from edge
    smoothing: 0.1,
  });

  return (
    <div>
      <h1>Auto-Scroll with Gaze</h1>
      <p>Look near the top or bottom edge to scroll!</p>
      
      <div style={{ height: '200vh', padding: '20px' }}>
        <p>Content 1</p>
        <p style={{ marginTop: '500px' }}>Content 2</p>
        <p style={{ marginTop: '500px' }}>Content 3</p>
        <p style={{ marginTop: '500px' }}>Content 4</p>
      </div>
    </div>
  );
}

export default AutoScrollPage;
```

---

## Example 8: Recording Gaze Sessions

```tsx
import { useWebGazer, useGazeRecording } from '@webgazer-ts/react';

function GazeRecorder() {
  const { isRunning } = useWebGazer({ autoStart: true });
  
  const {
    isRecording,
    startRecording,
    stopRecording,
    data,
    exportCSV,
    exportJSON,
  } = useGazeRecording();

  return (
    <div>
      <h1>Gaze Recording</h1>
      
      <div>
        WebGazer: {isRunning ? '🟢' : '🔴'} |
        Recording: {isRecording ? '🔴 REC' : '⚫ Stopped'}
      </div>
      
      <p>Points recorded: {data.length}</p>
      
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      
      {data.length > 0 && (
        <>
          <button onClick={exportCSV}>Export as CSV</button>
          <button onClick={exportJSON}>Export as JSON</button>
        </>
      )}
      
      {/* Your content to interact with */}
      <div style={{ padding: '40px' }}>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
    </div>
  );
}

export default GazeRecorder;
```

---

## Example 9: TypeScript (Fully Typed)

```tsx
import { useWebGazer } from '@webgazer-ts/react';
import type { GazePrediction, WebGazerConfig } from '@webgazer-ts/react';

function TypedGazeApp() {
  const config: Partial<WebGazerConfig> = {
    tracker: 'TFFacemesh',
    regression: 'ridge',
    saveDataAcrossSessions: true,
  };

  const handleGaze = (data: GazePrediction | null, timestamp: number) => {
    if (data) {
      console.log(`Gaze at (${data.x}, ${data.y}) at ${timestamp}ms`);
    }
  };

  const { gazeData, start, stop, isRunning } = useWebGazer({
    ...config,
    autoStart: true,
    onGaze: handleGaze,
  });

  return (
    <div>
      <h1>Fully Typed Gaze Tracker</h1>
      {gazeData && (
        <div>
          X: {gazeData.x} (type: {typeof gazeData.x})<br />
          Y: {gazeData.y} (type: {typeof gazeData.y})
        </div>
      )}
    </div>
  );
}

export default TypedGazeApp;
```

---

## Example 10: Complete Dashboard

```tsx
import {
  WebGazerProvider,
  useWebGazer,
  useGazeElement,
  useGazeHeatmap,
  CalibrationScreen,
} from '@webgazer-ts/react';

function DashboardCard({ title, value }) {
  const { ref, isLooking, dwellTime } = useGazeElement({
    minDwellTime: 2000,
    onDwell: () => {
      console.log(`User interested in: ${title}`);
      // Could trigger analytics, show more details, etc.
    },
  });

  return (
    <div
      ref={ref}
      style={{
        padding: '20px',
        border: isLooking ? '3px solid blue' : '1px solid gray',
        borderRadius: '8px',
        backgroundColor: isLooking ? '#e3f2fd' : 'white',
        transition: 'all 0.3s',
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{value}</p>
      {dwellTime > 1000 && (
        <small>Viewing: {Math.round(dwellTime / 1000)}s</small>
      )}
    </div>
  );
}

function Dashboard() {
  const [showCalibration, setShowCalibration] = useState(true);
  const { calibrationCount, isRunning } = useWebGazer();
  const { canvasRef } = useGazeHeatmap();

  if (showCalibration && calibrationCount < 9) {
    return (
      <CalibrationScreen
        pointCount={9}
        onComplete={() => setShowCalibration(false)}
      />
    );
  }

  return (
    <div>
      <canvas ref={canvasRef} style={{ position: 'fixed', pointerEvents: 'none' }} />
      
      <header>
        <h1>Analytics Dashboard</h1>
        <div>
          Status: {isRunning ? '🟢 Tracking' : '🔴 Not running'} |
          Calibration: {calibrationCount} points
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <DashboardCard title="Users" value="1,234" />
        <DashboardCard title="Revenue" value="$56,789" />
        <DashboardCard title="Conversions" value="89%" />
        <DashboardCard title="Avg. Time" value="5:32" />
        <DashboardCard title="Bounce Rate" value="23%" />
        <DashboardCard title="Page Views" value="45,678" />
      </div>
    </div>
  );
}

function App() {
  return (
    <WebGazerProvider autoStart>
      <Dashboard />
    </WebGazerProvider>
  );
}

export default App;
```

---

## Comparison: Before vs After

### Before (Vanilla JS in React)

```tsx
function GazeTrackerOld() {
  useEffect(() => {
    // Initialize WebGazer
    webgazer
      .setRegression('ridge')
      .setTracker('TFFacemesh')
      .begin();
    
    // Set listener
    webgazer.setGazeListener((data, time) => {
      console.log(data);
    });
    
    // Cleanup
    return () => {
      webgazer.end();
    };
  }, []);
  
  return <div>Tracking...</div>;
}
```

**Issues:**
- ❌ Manual lifecycle management
- ❌ No React state integration
- ❌ Hard to access gaze data in JSX
- ❌ Cleanup bugs if not careful
- ❌ No TypeScript types

### After (React Hooks)

```tsx
function GazeTrackerNew() {
  const { gazeData } = useWebGazer({
    autoStart: true,
    tracker: 'TFFacemesh',
    regression: 'ridge',
  });
  
  return <div>Gaze: {gazeData?.x}, {gazeData?.y}</div>;
}
```

**Benefits:**
- ✅ Automatic lifecycle management
- ✅ Integrated with React state
- ✅ Easy to use in JSX
- ✅ Auto-cleanup on unmount
- ✅ Full TypeScript support

---

## Summary

The React wrapper makes WebGazer:
- **Easier to use** - Hooks instead of imperative API
- **More React-y** - Fits the React mental model
- **Type-safe** - Full TypeScript support
- **Less error-prone** - Auto cleanup, no memory leaks
- **More powerful** - Advanced hooks for common patterns

**Bottom line**: 3 lines of code vs 30+ lines for the same functionality.

---

## Next Steps

Want to see this API become reality? The implementation plan is ready in:
- `REACT_WRAPPER_IMPLEMENTATION_PLAN.md` - Full technical plan
- `REACT_WRAPPER_DECISION.md` - Decision guide

Ready to start? Just say the word! 🚀
