# Recording Gaze Data

Record, export, and analyze gaze sessions without React.

## Core API

Gaze recording in the core library is built on top of the `setGazeListener` callback —
you collect data yourself and export it however you like.

## Basic Recording

```javascript
// Start tracking first
await webgazer.begin();

// Set up recording state
const session = {
  isRecording: false,
  startTime: null,
  data: [],
};

// Configure the listener
webgazer.setGazeListener((data, elapsedTime) => {
  if (!session.isRecording || !data) return;

  session.data.push({
    x: data.x,
    y: data.y,
    timestamp: Date.now(),
    relativeTime: Date.now() - session.startTime,
  });
});

// Control recording
function startRecording() {
  session.data = [];
  session.startTime = Date.now();
  session.isRecording = true;
  console.log('Recording started');
}

function stopRecording() {
  session.isRecording = false;
  console.log(`Recording stopped. ${session.data.length} points captured.`);
  return session.data;
}
```

## HTML Demo

A complete standalone recording page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gaze Recording</title>
  <style>
    body { font-family: system-ui; padding: 2rem; background: #0f1117; color: #e2e8f0; }
    button {
      padding: 10px 20px; border: none; border-radius: 8px;
      font-size: 14px; font-weight: 600; cursor: pointer; margin-right: 8px;
    }
    .start { background: #6366f1; color: white; }
    .stop  { background: #ef4444; color: white; }
    .export { background: #22c55e; color: white; }
    #status { margin: 1rem 0; font-size: 14px; color: #94a3b8; }
    #gaze   { font-size: 24px; font-family: monospace; color: #6366f1; }
  </style>
</head>
<body>
  <h1>Gaze Recorder</h1>
  <div>
    <button class="start" id="btnStart">▶ Start</button>
    <button class="stop" id="btnStop" disabled>⏹ Stop</button>
    <button class="export" id="btnCSV" disabled>📥 CSV</button>
    <button class="export" id="btnJSON" disabled>📥 JSON</button>
  </div>
  <div id="status">Click Start to begin tracking and recording.</div>
  <div id="gaze">—</div>

  <script src="https://unpkg.com/@webgazer-ts/core@latest/dist/webgazer.js"></script>
  <script>
    const session = { isRecording: false, startTime: null, data: [] };

    webgazer.setGazeListener((data) => {
      if (!data) return;
      document.getElementById('gaze').textContent = `(${Math.round(data.x)}, ${Math.round(data.y)})`;
      if (session.isRecording) {
        session.data.push({
          x: Math.round(data.x),
          y: Math.round(data.y),
          timestamp: Date.now(),
          relativeTime: Date.now() - session.startTime,
        });
        document.getElementById('status').textContent =
          `🔴 Recording... ${session.data.length} points`;
      }
    });

    webgazer.begin().then(() => {
      document.getElementById('status').textContent = 'Tracking active. Click Start to record.';
    });

    document.getElementById('btnStart').onclick = () => {
      session.data = [];
      session.startTime = Date.now();
      session.isRecording = true;
      document.getElementById('btnStart').disabled = true;
      document.getElementById('btnStop').disabled = false;
      document.getElementById('btnCSV').disabled = true;
      document.getElementById('btnJSON').disabled = true;
    };

    document.getElementById('btnStop').onclick = () => {
      session.isRecording = false;
      document.getElementById('btnStart').disabled = false;
      document.getElementById('btnStop').disabled = true;
      document.getElementById('btnCSV').disabled = false;
      document.getElementById('btnJSON').disabled = false;
      document.getElementById('status').textContent =
        `✅ Recorded ${session.data.length} points over ${
          (session.data[session.data.length-1]?.relativeTime / 1000).toFixed(1)
        }s`;
    };

    function download(content, filename, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), { href: url, download: filename }).click();
      URL.revokeObjectURL(url);
    }

    document.getElementById('btnCSV').onclick = () => {
      const csv = ['x,y,timestamp,relativeTime',
        ...session.data.map(d => `${d.x},${d.y},${d.timestamp},${d.relativeTime}`)
      ].join('\n');
      download(csv, `gaze-${Date.now()}.csv`, 'text/csv');
    };

    document.getElementById('btnJSON').onclick = () => {
      download(JSON.stringify(session.data, null, 2), `gaze-${Date.now()}.json`, 'application/json');
    };
  </script>
</body>
</html>
```

## Using `storePoints` (WebGazer-Compatible API)

For compatibility with code that uses the original WebGazer.js `storePoints` API:

```javascript
// storePoints stores a circular buffer of the last 50 gaze positions
// indexed by a slot key k (0–49)
webgazer.storePoints(x, y, k);

// getStoredPoints() returns [xArray, yArray] each of length 50
const [storedX, storedY] = webgazer.getStoredPoints();
console.log(storedX, storedY); // Float32Arrays or number arrays
```

This matches the original WebGazer.js API for accuracy measurement workflows.

## TypeScript Version

```typescript
import webgazer from '@webgazer-ts/core';

interface GazeEntry {
  x: number;
  y: number;
  timestamp: number;
  relativeTime: number;
}

class GazeRecorder {
  private data: GazeEntry[] = [];
  private startTime: number | null = null;
  private active = false;

  start(): void {
    this.data = [];
    this.startTime = Date.now();
    this.active = true;
  }

  stop(): GazeEntry[] {
    this.active = false;
    return [...this.data];
  }

  record(x: number, y: number): void {
    if (!this.active || this.startTime === null) return;
    this.data.push({
      x: Math.round(x),
      y: Math.round(y),
      timestamp: Date.now(),
      relativeTime: Date.now() - this.startTime,
    });
  }

  toCSV(): string {
    return [
      'x,y,timestamp,relativeTime',
      ...this.data.map(d => `${d.x},${d.y},${d.timestamp},${d.relativeTime}`),
    ].join('\n');
  }

  toJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }
}

// Usage
const recorder = new GazeRecorder();

await webgazer
  .setGazeListener((data) => {
    if (data) recorder.record(data.x, data.y);
  })
  .begin();

// Start/stop recording from user events
startButton.onclick = () => recorder.start();
stopButton.onclick = () => {
  const data = recorder.stop();
  console.log(`Recorded ${data.length} points`);
};
```

## Exporting Data

### CSV

```javascript
function exportCSV(data) {
  const header = 'x,y,timestamp,relativeTime';
  const rows = data.map(d => `${d.x},${d.y},${d.timestamp},${d.relativeTime}`);
  return [header, ...rows].join('\n');
}
```

### JSON

```javascript
function exportJSON(data) {
  return JSON.stringify(data, null, 2);
}
```

### Uploading to Your Server

```javascript
async function uploadSession(data, sessionId) {
  const response = await fetch('/api/gaze-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, data }),
  });
  return response.json();
}
```

## Data Analysis Tips

```javascript
// Fixation detection — simple velocity threshold
function detectFixations(data, velocityThreshold = 50, minDuration = 100) {
  const fixations = [];
  let start = 0;

  for (let i = 1; i < data.length; i++) {
    const dx = data[i].x - data[i-1].x;
    const dy = data[i].y - data[i-1].y;
    const velocity = Math.sqrt(dx*dx + dy*dy) /
      ((data[i].relativeTime - data[i-1].relativeTime) || 1);

    const isMoving = velocity > velocityThreshold;
    if (isMoving || i === data.length - 1) {
      const duration = data[i].relativeTime - data[start].relativeTime;
      if (duration >= minDuration) {
        const segment = data.slice(start, i);
        fixations.push({
          x: segment.reduce((s, d) => s + d.x, 0) / segment.length,
          y: segment.reduce((s, d) => s + d.y, 0) / segment.length,
          duration,
          startTime: data[start].relativeTime,
        });
      }
      start = i;
    }
  }

  return fixations;
}
```

## See Also

- [React Recording Example](/examples/react-recording)
- [Heatmaps](/guide/advanced/heatmaps)
- [useGazeRecording Hook](/guide/react/hooks)
