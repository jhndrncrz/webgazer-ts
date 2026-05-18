# React Full App Example

A complete React application demonstrating all major `@webgazer-ts/react` features:
calibration flow, gaze cursor, heatmap visualization, element gaze detection, and session recording.

## Project Structure

```
src/
├── App.tsx               # Root with WebgazerProvider
├── components/
│   ├── GazeCursor.tsx    # Floating gaze dot
│   ├── GazeMenu.tsx      # Menu activated by gaze dwell
│   ├── HeatmapView.tsx   # Heatmap overlay + controls
│   └── StatusPanel.tsx   # Live tracking stats
└── pages/
    ├── HomePage.tsx      # Main content
    └── CalibrationPage.tsx
```

## `App.tsx` — Root

```tsx
import { useState } from 'react';
import { WebgazerProvider, CalibrationScreen } from '@webgazer-ts/react';
import { HomePage } from './pages/HomePage';

export default function App() {
  const [calibrated, setCalibrated] = useState(false);

  return (
    <WebgazerProvider
      autoStart
      regression="ridge"
      applyKalmanFilter
      saveDataAcrossSessions
      showVideo={false}
    >
      {!calibrated ? (
        <CalibrationScreen
          pointCount={9}
          pointDuration={1500}
          onComplete={() => setCalibrated(true)}
          theme={{
            backgroundColor: 'rgba(15, 17, 23, 0.97)',
            pointColor: '#6366f1',
            progressColor: '#22c55e',
          }}
        />
      ) : (
        <HomePage onRecalibrate={() => setCalibrated(false)} />
      )}
    </WebgazerProvider>
  );
}
```

## `GazeCursor.tsx` — Floating Gaze Dot

```tsx
import { useGazeTracking } from '@webgazer-ts/react';

export function GazeCursor() {
  const { x, y, isTracking } = useGazeTracking({ throttle: 16 }); // ~60fps

  if (!isTracking || x === null || y === null) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 16,
        height: 16,
        border: '2px solid rgba(99, 102, 241, 0.9)',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.2)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'left 60ms linear, top 60ms linear',
      }}
    />
  );
}
```

## `GazeMenu.tsx` — Dwell-Activated Navigation

```tsx
import { useGazeElement } from '@webgazer-ts/react';

interface GazeMenuItemProps {
  label: string;
  onActivate: () => void;
  dwellMs?: number;
}

function GazeMenuItem({ label, onActivate, dwellMs = 1500 }: GazeMenuItemProps) {
  const { ref, isLooking, dwellTime } = useGazeElement({
    threshold: 30,
    minDwellTime: dwellMs,
    onDwell: onActivate,
  });

  const progress = Math.min(dwellTime / dwellMs, 1);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        padding: '12px 24px',
        background: isLooking ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
        borderRadius: 8,
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {label}
      {isLooking && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            width: `${progress * 100}%`,
            background: '#6366f1',
            transition: 'width 0.1s linear',
          }}
        />
      )}
    </div>
  );
}

export function GazeMenu({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <nav>
      <GazeMenuItem label="Home" onActivate={() => onNavigate('home')} />
      <GazeMenuItem label="About" onActivate={() => onNavigate('about')} />
      <GazeMenuItem label="Contact" onActivate={() => onNavigate('contact')} />
    </nav>
  );
}
```

## `HeatmapView.tsx` — Toggle Heatmap Overlay

```tsx
import { useState } from 'react';
import { useGazeHeatmap } from '@webgazer-ts/react';

export function HeatmapView() {
  const [visible, setVisible] = useState(false);
  const { canvasRef, points, clear, exportData } = useGazeHeatmap({
    radius: 35,
    blur: 22,
    maxOpacity: 0.75,
  });

  return (
    <>
      {/* Floating control panel */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 9998,
      }}>
        <button onClick={() => setVisible(v => !v)}>
          {visible ? 'Hide' : 'Show'} Heatmap
        </button>
        <button onClick={clear} disabled={points.length === 0}>
          Clear ({points.length})
        </button>
        <button
          onClick={() => {
            const blob = new Blob([exportData()], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            Object.assign(document.createElement('a'), {
              href: url, download: 'gaze.csv'
            }).click();
            URL.revokeObjectURL(url);
          }}
          disabled={points.length === 0}
        >
          Export CSV
        </button>
      </div>

      {/* Heatmap canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: visible ? 0.8 : 0,
          transition: 'opacity 0.3s',
          zIndex: 9997,
        }}
      />
    </>
  );
}
```

## `StatusPanel.tsx` — Live Stats

```tsx
import { useWebgazer, useGazeTracking } from '@webgazer-ts/react';

export function StatusPanel() {
  const { isRunning, calibrationCount } = useWebgazer();
  const { x, y, hasGazeData } = useGazeTracking({ throttle: 200 });

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(15, 17, 23, 0.85)',
      color: '#e2e8f0',
      padding: '10px 14px',
      borderRadius: 10,
      fontSize: 12,
      fontFamily: 'monospace',
      lineHeight: 1.8,
    }}>
      <div>{isRunning ? '🟢 Tracking' : '⚫ Stopped'}</div>
      <div>Cal. points: {calibrationCount}</div>
      {hasGazeData && x !== null && y !== null && (
        <div>Gaze: ({Math.round(x)}, {Math.round(y)})</div>
      )}
    </div>
  );
}
```

## `HomePage.tsx` — Putting It Together

```tsx
import { GazeCursor } from '../components/GazeCursor';
import { GazeMenu } from '../components/GazeMenu';
import { HeatmapView } from '../components/HeatmapView';
import { StatusPanel } from '../components/StatusPanel';

export function HomePage({ onRecalibrate }: { onRecalibrate: () => void }) {
  return (
    <div>
      {/* Content */}
      <main style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <h1>Eye Tracking Demo</h1>
        <p>Look at the navigation items for 1.5 seconds to activate them.</p>
        <GazeMenu onNavigate={(page) => alert(`Navigating to ${page}`)} />
        <button onClick={onRecalibrate} style={{ marginTop: 20 }}>
          Recalibrate
        </button>
      </main>

      {/* Global UI overlays */}
      <GazeCursor />
      <HeatmapView />
      <StatusPanel />
    </div>
  );
}
```

## See Also

- [React Quick Start](/guide/react/quick-start)
- [React Hooks](/guide/react/hooks)
- [React Components](/guide/react/components)
- [Heatmap Guide](/guide/advanced/heatmaps)
- [Gaze UI Example](/examples/react-gaze-ui)
