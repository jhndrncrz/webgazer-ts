# React Recording Example

Record, export, and replay gaze sessions using the `useGazeRecording` hook.

## Basic Recording

```tsx
import { useGazeRecording } from '@webgazer-ts/react';

function RecordingControls() {
  const {
    isRecording,
    data,
    startRecording,
    stopRecording,
    clearData,
    exportCSV,
    exportJSON,
  } = useGazeRecording();

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? '⏹ Stop' : '⏺ Record'}
      </button>

      {data.length > 0 && !isRecording && (
        <>
          <span>{data.length} points recorded</span>
          <button onClick={exportCSV}>Download CSV</button>
          <button onClick={exportJSON}>Download JSON</button>
          <button onClick={clearData}>Clear</button>
        </>
      )}
    </div>
  );
}
```

## Recording Data Format

Each entry in `data` contains:

```typescript
interface GazeRecordingEntry {
  x: number;        // Screen X coordinate (pixels)
  y: number;        // Screen Y coordinate (pixels)
  timestamp: number;        // Absolute Unix timestamp (ms)
  relativeTime: number;     // ms since recording started
}
```

**CSV export format:**
```
x,y,timestamp,relativeTime
512,384,1716912345678,0
513,385,1716912345703,25
515,383,1716912345728,50
```

**JSON export format:**
```json
[
  { "x": 512, "y": 384, "timestamp": 1716912345678, "relativeTime": 0 },
  { "x": 513, "y": 385, "timestamp": 1716912345703, "relativeTime": 25 }
]
```

## Full Recording Session UI

```tsx
import { useState } from 'react';
import {
  WebgazerProvider,
  CalibrationScreen,
  useGazeRecording,
  useGazeTracking,
} from '@webgazer-ts/react';

function RecordingSession() {
  const [phase, setPhase] = useState<'calibrate' | 'ready' | 'recording' | 'review'>('calibrate');
  const {
    isRecording,
    data,
    startRecording,
    stopRecording,
    clearData,
    exportCSV,
    exportJSON,
  } = useGazeRecording();
  const { x, y } = useGazeTracking({ throttle: 100 });

  const start = () => {
    clearData();
    startRecording();
    setPhase('recording');
  };

  const stop = () => {
    stopRecording();
    setPhase('review');
  };

  return (
    <>
      {phase === 'calibrate' && (
        <CalibrationScreen
          pointCount={9}
          onComplete={() => setPhase('ready')}
        />
      )}

      {phase === 'ready' && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Ready to Record</h2>
          <p>Browse the page normally — gaze data will be captured.</p>
          <button onClick={start} style={{ fontSize: 18, padding: '12px 24px' }}>
            ⏺ Start Recording
          </button>
        </div>
      )}

      {phase === 'recording' && (
        <div style={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 99,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 9999,
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'white',
            animation: 'pulse 1s infinite' }} />
          Recording — {data.length} points
          {x !== null && ` | Gaze: (${Math.round(x)}, ${Math.round(y ?? 0)})`}
          <button onClick={stop} style={{ marginLeft: 12, background: 'white',
            color: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px',
            cursor: 'pointer', fontWeight: 700 }}>
            Stop
          </button>
        </div>
      )}

      {phase === 'review' && (
        <ReviewPanel
          data={data}
          onExportCSV={exportCSV}
          onExportJSON={exportJSON}
          onClear={() => { clearData(); setPhase('ready'); }}
          onRecalibrate={() => setPhase('calibrate')}
        />
      )}
    </>
  );
}

function ReviewPanel({
  data, onExportCSV, onExportJSON, onClear, onRecalibrate
}: {
  data: { x: number; y: number; timestamp: number; relativeTime: number }[];
  onExportCSV: () => void;
  onExportJSON: () => void;
  onClear: () => void;
  onRecalibrate: () => void;
}) {
  const duration = data.length > 0
    ? ((data[data.length - 1].relativeTime) / 1000).toFixed(1)
    : '0';

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
      <h2>Session Complete</h2>
      <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 16px' }}>
        <dt>Duration</dt><dd>{duration}s</dd>
        <dt>Data points</dt><dd>{data.length}</dd>
        <dt>Sample rate</dt>
        <dd>~{data.length > 0 ? Math.round(data.length / parseFloat(duration)) : 0} pts/s</dd>
      </dl>

      <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
        <button onClick={onExportCSV}>📥 Download CSV</button>
        <button onClick={onExportJSON}>📥 Download JSON</button>
        <button onClick={onClear}>🗑 Clear & Record Again</button>
        <button onClick={onRecalibrate}>🎯 Recalibrate</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WebgazerProvider autoStart showVideo={false}>
      <RecordingSession />
    </WebgazerProvider>
  );
}
```

## Replaying Recorded Data

You can replay recorded gaze data as a visual animation:

```tsx
import { useState, useEffect, useRef } from 'react';
import type { GazeRecordingEntry } from '@webgazer-ts/react';

function GazeReplay({ data }: { data: GazeRecordingEntry[] }) {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const play = () => {
    startRef.current = performance.now() - (data[0]?.relativeTime ?? 0);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;

    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      const idx = data.findLastIndex(d => d.relativeTime <= elapsed);
      if (idx >= 0) setCurrentIdx(idx);

      if (elapsed > (data[data.length - 1]?.relativeTime ?? 0)) {
        setPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, data]);

  const current = currentIdx >= 0 ? data[currentIdx] : null;

  return (
    <div>
      <button onClick={play} disabled={playing || data.length === 0}>
        {playing ? '▶ Playing...' : '▶ Replay Session'}
      </button>

      {current && (
        <div style={{
          position: 'fixed',
          left: current.x,
          top: current.y,
          width: 16,
          height: 16,
          background: 'rgba(99, 102, 241, 0.7)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
        }} />
      )}
    </div>
  );
}
```

## Analyzing Recording Data

```typescript
function analyzeGazeData(data: GazeRecordingEntry[]) {
  if (data.length === 0) return null;

  const xs = data.map(d => d.x);
  const ys = data.map(d => d.y);

  return {
    totalPoints: data.length,
    duration: data[data.length - 1].relativeTime,
    centroid: {
      x: xs.reduce((a, b) => a + b) / data.length,
      y: ys.reduce((a, b) => a + b) / data.length,
    },
    spread: {
      xRange: Math.max(...xs) - Math.min(...xs),
      yRange: Math.max(...ys) - Math.min(...ys),
    },
    heatZones: buildHeatZones(data, 100), // 100px grid cells
  };
}

function buildHeatZones(
  data: GazeRecordingEntry[],
  cellSize: number
): Map<string, number> {
  const zones = new Map<string, number>();
  data.forEach(({ x, y }) => {
    const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
    zones.set(key, (zones.get(key) ?? 0) + 1);
  });
  return zones;
}
```

## See Also

- [useGazeRecording Hook](/guide/react/hooks)
- [Heatmap Example](/examples/react-heatmap)
- [Full App Example](/examples/react-full-app)
- [API Reference](/api/react/)
