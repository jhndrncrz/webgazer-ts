# Heatmaps

Generate gaze heatmap visualizations to understand where users focus their attention.

## Overview

A gaze heatmap overlays a color-coded density map on your page showing where the user has been
looking. High-density areas appear red/yellow; areas never looked at appear transparent.

WebGazer-TS provides a `useGazeHeatmap` React hook and a `HeatmapOverlay` component for
rendering heatmaps, as well as utilities for exporting the data.

## Quick Start

### With the `HeatmapOverlay` Component

The easiest approach — drop it anywhere inside a `<WebgazerProvider>`:

```tsx
import { WebgazerProvider, HeatmapOverlay } from '@webgazer-ts/react';

export function App() {
  return (
    <WebgazerProvider autoStart>
      <YourPageContent />
      <HeatmapOverlay />  {/* Full-screen canvas, pointer-events: none */}
    </WebgazerProvider>
  );
}
```

### With the `useGazeHeatmap` Hook

For more control, use the hook directly:

```tsx
import { useGazeHeatmap } from '@webgazer-ts/react';

function MyHeatmap() {
  const { canvasRef, points, clear, exportImage } = useGazeHeatmap({
    radius: 40,
    maxOpacity: 0.7,
    blur: 20,
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <YourContent />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      />
      <div>
        <button onClick={clear}>Clear ({points.length} points)</button>
        <button onClick={() => {
          const dataUrl = exportImage();
          if (dataUrl) window.open(dataUrl);
        }}>
          Save as PNG
        </button>
      </div>
    </div>
  );
}
```

## Configuration Options

### `useGazeHeatmap` Options

```typescript
interface UseGazeHeatmapOptions {
  /** Canvas width in pixels. Default: window.innerWidth */
  width?: number;

  /** Canvas height in pixels. Default: window.innerHeight */
  height?: number;

  /** Radius of each gaze point's influence (px). Default: 30 */
  radius?: number;

  /** Maximum opacity of the densest areas (0–1). Default: 0.8 */
  maxOpacity?: number;

  /** Gaussian blur applied to the heat layer (px). Default: 15 */
  blur?: number;

  /** Color gradient stops (0–1 → CSS color). Default: blue→cyan→lime→yellow→red */
  gradient?: Record<number, string>;
}
```

### Custom Gradient

```typescript
const { canvasRef } = useGazeHeatmap({
  gradient: {
    0.0: 'rgba(0, 0, 255, 0)',   // Transparent blue at low density
    0.4: '#00bcd4',               // Cyan
    0.6: '#ffeb3b',               // Yellow
    1.0: '#f44336',               // Red at high density
  },
});
```

## Returned Values

```typescript
interface UseGazeHeatmapReturn {
  /** Attach to a <canvas> element */
  canvasRef: React.RefObject<HTMLCanvasElement>;

  /** All collected gaze points (up to 1000) */
  points: HeatmapPoint[];  // { x, y, timestamp }

  /** Clear all points and the canvas */
  clear: () => void;

  /** Export points as CSV string */
  exportData: () => string;

  /** Export canvas as PNG data URL */
  exportImage: () => string | null;
}
```

## Exporting Data

### Export as CSV

```tsx
function DownloadButton() {
  const { exportData } = useGazeHeatmap();

  const handleDownload = () => {
    const csv = exportData();
    // csv format: "x,y,timestamp\n100,200,1716912345678\n..."
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gaze-heatmap.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>Download CSV</button>;
}
```

### Export as PNG

```tsx
function SaveButton() {
  const { exportImage } = useGazeHeatmap();

  return (
    <button onClick={() => {
      const dataUrl = exportImage(); // Returns PNG data URL
      if (dataUrl) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'heatmap.png';
        a.click();
      }
    }}>
      Save Heatmap PNG
    </button>
  );
}
```

## Full Example — Research Session

A complete example suitable for user research sessions, combining recording control with heatmap visualization:

```tsx
import { useState } from 'react';
import { WebgazerProvider, useGazeHeatmap } from '@webgazer-ts/react';

function ResearchSession() {
  const [phase, setPhase] = useState<'idle' | 'recording' | 'review'>('idle');
  const { canvasRef, points, clear, exportData, exportImage } = useGazeHeatmap({
    radius: 35,
    blur: 20,
    maxOpacity: 0.75,
  });

  return (
    <div>
      <header>
        <h1>User Research Session</h1>
        <div>
          {phase === 'idle' && (
            <button onClick={() => setPhase('recording')}>Start Session</button>
          )}
          {phase === 'recording' && (
            <button onClick={() => setPhase('review')}>End Session</button>
          )}
          {phase === 'review' && (
            <>
              <button onClick={exportData}>Download CSV ({points.length} points)</button>
              <button onClick={() => {
                const url = exportImage();
                if (url) window.open(url);
              }}>View Heatmap PNG</button>
              <button onClick={() => { clear(); setPhase('idle'); }}>New Session</button>
            </>
          )}
        </div>
      </header>

      <main>
        {/* Your stimulus content here */}
        <YourStimulusContent />

        {/* Heatmap overlay — only show during review */}
        {phase === 'review' && (
          <canvas
            ref={canvasRef}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WebgazerProvider autoStart>
      <ResearchSession />
    </WebgazerProvider>
  );
}
```

## Vanilla JS Heatmap

Without React, you can build a simple heatmap manually using the `setGazeListener` callback:

```javascript
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;opacity:0.7';
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const points = [];

webgazer.setGazeListener((data) => {
  if (!data) return;
  points.push({ x: data.x, y: data.y });

  // Redraw every 30 points for performance
  if (points.length % 30 !== 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = 'blur(20px)';

  points.forEach(({ x, y }) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 40, y - 40, 80, 80);
  });

  ctx.filter = 'none';
});
```

## Performance Notes

- The hook caps stored points at **1,000** to prevent unbounded memory growth.
- Canvas redraws are triggered by React state updates on every new gaze point. For long
  sessions, consider throttling: pass `throttleMs` to your `useGazeTracking` hook and
  only call `setPoints` on the throttled callback.
- For sessions with many thousands of points, consider offloading the canvas rendering to
  a Web Worker using `OffscreenCanvas`.

## See Also

- [Performance Optimization](/guide/advanced/performance)
- [Recording Gaze Data](/examples/recording)
- [React Heatmap Example](/examples/react-heatmap)
- [API Reference — useGazeHeatmap](/api/react/)
