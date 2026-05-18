# Calibration Example

A complete calibration flow using both the `CalibrationScreen` component and the
`useCalibration` hook.

## Using `CalibrationScreen` (Drop-in Component)

The easiest approach — `CalibrationScreen` handles everything automatically:

```tsx
import { useState } from 'react';
import { WebgazerProvider, CalibrationScreen } from '@webgazer-ts/react';
import type { CalibrationResult } from '@webgazer-ts/react';

function App() {
  const [calibrated, setCalibrated] = useState(false);

  return (
    <WebgazerProvider autoStart>
      {!calibrated ? (
        <CalibrationScreen
          pointCount={9}
          pointDuration={1500}
          autoAdvance={true}
          onComplete={(result: CalibrationResult) => {
            console.log(`Calibrated ${result.pointsCalibrated} points`);
            setCalibrated(true);
          }}
          onCancel={() => console.log('Cancelled')}
          theme={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            pointColor: '#6366f1',
            progressColor: '#22c55e',
            textColor: '#ffffff',
          }}
        />
      ) : (
        <TrackingUI onRecalibrate={() => setCalibrated(false)} />
      )}
    </WebgazerProvider>
  );
}
```

## Using `useCalibration` (Full Control)

For custom calibration UIs, use the hook directly:

```tsx
import { useCalibration } from '@webgazer-ts/react';

function MyCalibrationUI() {
  const {
    isCalibrating,
    progress,         // 0–100
    currentPoint,     // { x, y, index } | null
    startCalibration,
    stopCalibration,
    nextPoint,        // Manually advance (when autoAdvance: false)
  } = useCalibration({
    pointCount: 9,
    pointDuration: 1500,     // ms per point when autoAdvance is on
    autoAdvance: true,
    onComplete: (result) => {
      console.log('Done!', result.pointsCalibrated, 'points');
    },
    onPointComplete: (index) => {
      console.log(`Point ${index} done`);
    },
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000' }}>
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)' }}>
        <progress value={progress} max={100} />
        <span>{progress}%</span>
      </div>

      {/* Active calibration point */}
      {currentPoint && (
        <div
          style={{
            position: 'absolute',
            left: currentPoint.x,
            top: currentPoint.y,
            width: 20,
            height: 20,
            background: 'red',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={nextPoint}  // In manual mode: click to advance
        />
      )}

      {/* Controls */}
      {!isCalibrating ? (
        <button onClick={startCalibration}>Start</button>
      ) : (
        <button onClick={stopCalibration}>Cancel</button>
      )}
    </div>
  );
}
```

## Click-to-Advance (Manual Mode)

Disable auto-advance and let the user click on each point:

```tsx
const calibration = useCalibration({
  pointCount: 9,
  autoAdvance: false,   // User must click each point
  onComplete: (r) => setCalibrated(true),
});

// In your render:
{currentPoint && (
  <CalibrationDot
    x={currentPoint.x}
    y={currentPoint.y}
    onClick={() => {
      // Record the point click to webgazer
      webgazer.recordScreenPosition(currentPoint.x, currentPoint.y, 'click');
      nextPoint();
    }}
  />
)}
```

## Vanilla JS Calibration

Without React, use `webgazer.recordScreenPosition()` directly. Each click on a known
screen location trains the regressor:

```html
<!DOCTYPE html>
<html>
<body>
<script src="https://unpkg.com/@webgazer-ts/core@latest/dist/webgazer.js"></script>
<script>
const points = [
  [10, 10], [50, 10], [90, 10],
  [10, 50], [50, 50], [90, 50],
  [10, 90], [50, 90], [90, 90],
].map(([xPct, yPct]) => ({
  x: Math.round(window.innerWidth * xPct / 100),
  y: Math.round(window.innerHeight * yPct / 100),
}));

let idx = 0;
const dot = document.createElement('div');
dot.style.cssText = `
  position: fixed; width: 20px; height: 20px;
  background: red; border-radius: 50%;
  transform: translate(-50%, -50%); cursor: pointer;
`;
document.body.appendChild(dot);

function showPoint() {
  if (idx >= points.length) {
    dot.remove();
    console.log('Calibration complete!');
    return;
  }
  dot.style.left = points[idx].x + 'px';
  dot.style.top = points[idx].y + 'px';
}

dot.onclick = () => {
  webgazer.recordScreenPosition(points[idx].x, points[idx].y, 'click');
  idx++;
  showPoint();
};

webgazer.begin().then(showPoint);
</script>
</body>
</html>
```

## Saving Calibration Across Sessions

```typescript
webgazer.saveDataAcrossSessions(true);
```

When enabled, regression training data is persisted in IndexedDB (via LocalForage) and
restored automatically on the next `begin()` call. Users won't need to re-calibrate on
every page load.

To clear stored data:
```typescript
await webgazer.clearData();
```

## See Also

- [Getting Started](/guide/getting-started)
- [Data Persistence](/guide/core/data-persistence)
- [CalibrationScreen API](/api/react/)
- [Calibration Demo](https://github.com/jhndrncrz/webgazer-ts/blob/main/examples/calibration-demo/index.html)
