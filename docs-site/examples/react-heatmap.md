# React Heatmap Example

Visualize gaze attention density with a full-screen heatmap overlay in React.

## Complete Heatmap Application

```tsx
import { useState } from 'react';
import {
  WebgazerProvider,
  CalibrationScreen,
  useGazeHeatmap,
  useWebgazer,
  useGazeTracking,
} from '@webgazer-ts/react';

// ── Heatmap Canvas ──────────────────────────────────────────────────
function HeatmapCanvas({ visible }: { visible: boolean }) {
  const { canvasRef } = useGazeHeatmap({
    radius: 40,
    blur: 25,
    maxOpacity: 0.8,
    gradient: {
      0.0: 'rgba(0,0,255,0)',
      0.3: '#00bcd4',
      0.6: '#ffeb3b',
      1.0: '#f44336',
    },
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: visible ? 0.85 : 0,
        transition: 'opacity 0.4s ease',
        zIndex: 100,
      }}
    />
  );
}

// ── Control Panel ───────────────────────────────────────────────────
function ControlPanel({
  heatmapVisible,
  onToggleHeatmap,
  onRecalibrate,
}: {
  heatmapVisible: boolean;
  onToggleHeatmap: () => void;
  onRecalibrate: () => void;
}) {
  const { isRunning, start, stop } = useWebgazer();
  const { x, y } = useGazeTracking({ throttle: 100 });
  const { points, clear, exportData, exportImage } = useGazeHeatmap();

  const downloadCSV = () => {
    const blob = new Blob([exportData()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), {
      href: url,
      download: `heatmap-${Date.now()}.csv`,
    }).click();
    URL.revokeObjectURL(url);
  };

  const saveImage = () => {
    const url = exportImage();
    if (url) {
      Object.assign(document.createElement('a'), {
        href: url,
        download: `heatmap-${Date.now()}.png`,
      }).click();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'rgba(15, 17, 23, 0.92)',
      border: '1px solid #2d3152',
      borderRadius: 14,
      padding: '16px 18px',
      color: '#e2e8f0',
      fontFamily: 'system-ui, sans-serif',
      fontSize: 13,
      minWidth: 200,
      zIndex: 200,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 12, color: '#a5b4fc' }}>
        🔥 Gaze Heatmap
      </div>

      {/* Stats */}
      <div style={{ color: '#94a3b8', marginBottom: 10, fontSize: 12 }}>
        <div>Points: {points.length}</div>
        {x !== null && y !== null && (
          <div>Gaze: ({Math.round(x)}, {Math.round(y)})</div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={isRunning ? stop : start} style={btnStyle}>
          {isRunning ? '⏸ Stop Tracking' : '▶ Start Tracking'}
        </button>
        <button onClick={onToggleHeatmap} style={btnStyle}>
          {heatmapVisible ? '🙈 Hide Heatmap' : '👁 Show Heatmap'}
        </button>
        <button onClick={onRecalibrate} style={btnStyle} disabled={!isRunning}>
          🎯 Recalibrate
        </button>
        <button onClick={clear} style={btnStyle} disabled={points.length === 0}>
          🗑 Clear Data
        </button>
        <button onClick={downloadCSV} style={btnStyle} disabled={points.length === 0}>
          📥 Export CSV
        </button>
        <button onClick={saveImage} style={btnStyle} disabled={points.length === 0}>
          🖼 Save PNG
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 10px',
  background: 'rgba(99,102,241,0.12)',
  border: '1px solid #3f4468',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 12,
  cursor: 'pointer',
  textAlign: 'left',
};

// ── Root App ─────────────────────────────────────────────────────────
function HeatmapApp() {
  const [calibrated, setCalibrated] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(true);

  return (
    <div>
      {/* Your page content */}
      <main style={{ padding: '3rem', maxWidth: 900, margin: '0 auto' }}>
        <h1>Gaze Heatmap Demo</h1>
        <p>
          Look around the page and click to calibrate. Toggle the heatmap overlay
          to see where you've been focusing.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {['Alpha', 'Beta', 'Gamma', 'Delta'].map(name => (
            <div key={name} style={{
              padding: 20,
              background: '#1a1d27',
              border: '1px solid #2d3152',
              borderRadius: 12,
            }}>
              <h3>{name}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>
                Look at different sections to see attention patterns in the heatmap.
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Calibration flow */}
      {!calibrated && (
        <CalibrationScreen
          pointCount={9}
          onComplete={() => setCalibrated(true)}
        />
      )}

      {/* Heatmap overlay */}
      <HeatmapCanvas visible={heatmapVisible} />

      {/* Controls */}
      <ControlPanel
        heatmapVisible={heatmapVisible}
        onToggleHeatmap={() => setHeatmapVisible(v => !v)}
        onRecalibrate={() => setCalibrated(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WebgazerProvider autoStart saveDataAcrossSessions showVideo={false}>
      <HeatmapApp />
    </WebgazerProvider>
  );
}
```

## Timed Session Recording

Capture gaze for a fixed duration and then display the heatmap:

```tsx
import { useState, useEffect } from 'react';
import { useGazeHeatmap } from '@webgazer-ts/react';

function TimedSession({ durationMs = 30000 }) {
  const [phase, setPhase] = useState<'ready' | 'recording' | 'review'>('ready');
  const [timeLeft, setTimeLeft] = useState(durationMs / 1000);
  const { canvasRef, points, exportImage } = useGazeHeatmap({ radius: 35 });

  useEffect(() => {
    if (phase !== 'recording') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('review');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div>
      {phase === 'ready' && (
        <button onClick={() => { setTimeLeft(durationMs / 1000); setPhase('recording'); }}>
          Start {durationMs / 1000}s Session
        </button>
      )}

      {phase === 'recording' && (
        <div>
          Recording... {timeLeft}s remaining ({points.length} points)
        </div>
      )}

      {phase === 'review' && (
        <div>
          <div>Session complete! {points.length} gaze points recorded.</div>
          <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} />
          <button onClick={() => {
            const url = exportImage();
            if (url) window.open(url);
          }}>View Full Heatmap</button>
          <button onClick={() => setPhase('ready')}>New Session</button>
        </div>
      )}
    </div>
  );
}
```

## See Also

- [Heatmap Guide](/guide/advanced/heatmaps)
- [Recording Example](/examples/react-recording)
- [useGazeHeatmap API](/api/react/)
- [Full App Example](/examples/react-full-app)
