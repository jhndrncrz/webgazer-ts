# Basic Usage

Learn the fundamental concepts and APIs of Webgazer.ts.

## Quick Start

The simplest way to get eye tracking running:

```typescript
import webgazer from '@webgazer-ts/core';

// Start eye tracking
await webgazer.begin();

// Listen to gaze predictions
webgazer.setGazeListener((data, elapsedTime) => {
  if (data) {
    console.log(`Gaze at (${data.x}, ${data.y}) - ${elapsedTime}ms`);
  }
});
```

## Core Concepts

### 1. Initialization

Before tracking, initialize Webgazer:

```typescript
// Basic initialization
await webgazer.begin();

// With configuration
webgazer
  .setRegression('ridge') // Choose regression algorithm
  .setTracker('TFFacemesh') // Choose face tracker
  .showVideo(true) // Show camera feed
  .showFaceOverlay(true) // Show face detection overlay
  .showFaceFeedbackBox(true); // Show feedback box

await webgazer.begin();
```

### 2. Gaze Prediction

Get eye gaze coordinates in real-time:

```typescript
// Continuous listening (recommended)
webgazer.setGazeListener((data, elapsedTime) => {
  if (data) {
    // data.x, data.y = gaze coordinates
    // data.eyeFeatures = detailed eye information
    moveCursor(data.x, data.y);
  }
});

// One-time prediction
const prediction = await webgazer.getCurrentPrediction();
if (prediction) {
  console.log(prediction.x, prediction.y);
}
```

### 3. Calibration

Calibration improves accuracy (see [Calibration Guide](/guide/core/calibration)):

```typescript
// Click-based calibration
document.getElementById('calibrate-btn').addEventListener('click', async (e) => {
  // Record calibration point
  await webgazer.recordScreenPosition(e.clientX, e.clientY);
});

// Verify accuracy
const accuracy = await webgazer.getAccuracy();
console.log(`Accuracy: ${accuracy}px average error`);
```

### 4. Control Flow

Start, pause, resume, and stop tracking:

```typescript
// Start tracking
await webgazer.begin();

// Pause (keeps model, stops camera)
webgazer.pause();

// Resume
webgazer.resume();

// Stop (clears everything)
await webgazer.end();

// Check if running
const isRunning = webgazer.isReady();
```

## Common Patterns

### Eye Tracking Cursor

Move an element to follow gaze:

```typescript
const cursor = document.getElementById('gaze-cursor');

webgazer.setGazeListener((data) => {
  if (data) {
    cursor.style.left = `${data.x - 10}px`;
    cursor.style.top = `${data.y - 10}px`;
  }
});
```

```css
#gaze-cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.5);
  pointer-events: none;
  z-index: 9999;
}
```

### Element Detection

Detect when user looks at elements:

```typescript
function isLookingAt(element: HTMLElement, gazeX: number, gazeY: number): boolean {
  const rect = element.getBoundingClientRect();
  return (
    gazeX >= rect.left &&
    gazeX <= rect.right &&
    gazeY >= rect.top &&
    gazeY <= rect.bottom
  );
}

const button = document.getElementById('my-button');

webgazer.setGazeListener((data) => {
  if (data && isLookingAt(button, data.x, data.y)) {
    button.classList.add('gaze-active');
  } else {
    button.classList.remove('gaze-active');
  }
});
```

### Dwell Time Activation

Trigger action after looking at element for duration:

```typescript
class DwellDetector {
  private dwellStart: number | null = null;
  private dwellThreshold = 1000; // ms

  check(element: HTMLElement, gazeX: number, gazeY: number): boolean {
    const isLooking = isLookingAt(element, gazeX, gazeY);
    
    if (isLooking) {
      if (!this.dwellStart) {
        this.dwellStart = Date.now();
      }
      const dwellTime = Date.now() - this.dwellStart;
      return dwellTime >= this.dwellThreshold;
    } else {
      this.dwellStart = null;
      return false;
    }
  }
}

const detector = new DwellDetector();

webgazer.setGazeListener((data) => {
  if (data && detector.check(button, data.x, data.y)) {
    button.click();
  }
});
```

### Gaze Heatmap

Track where users look over time:

```typescript
const gazePoints: Array<{x: number, y: number, timestamp: number}> = [];

webgazer.setGazeListener((data) => {
  if (data) {
    gazePoints.push({
      x: data.x,
      y: data.y,
      timestamp: Date.now()
    });
  }
});

// Generate heatmap after session
function generateHeatmap() {
  // Use library like heatmap.js
  const heatmapData = gazePoints.map(p => ({
    x: Math.round(p.x),
    y: Math.round(p.y),
    value: 1
  }));
  
  return heatmapData;
}
```

## API Reference

### Core Methods

| Method | Description |
|--------|-------------|
| `begin()` | Initialize and start tracking |
| `end()` | Stop tracking and cleanup |
| `pause()` | Pause tracking (keep model) |
| `resume()` | Resume tracking |
| `isReady()` | Check if tracking is active |

### Configuration

| Method | Description |
|--------|-------------|
| `setRegression(name)` | Set regression algorithm |
| `setTracker(name)` | Set face tracker |
| `showVideo(bool)` | Show/hide camera feed |
| `showFaceOverlay(bool)` | Show/hide face detection |
| `showFaceFeedbackBox(bool)` | Show/hide feedback box |

### Prediction

| Method | Description |
|--------|-------------|
| `setGazeListener(callback)` | Listen to gaze predictions |
| `getCurrentPrediction()` | Get single prediction |
| `recordScreenPosition(x, y)` | Record calibration point |

See [API Reference](/api/core/) for complete documentation.

## Next Steps

- [Configuration](/guide/core/configuration) - Customize behavior
- [Calibration](/guide/core/calibration) - Improve accuracy
- [Data Persistence](/guide/core/data-persistence) - Save training data
- [Examples](/examples/basic) - See complete examples
