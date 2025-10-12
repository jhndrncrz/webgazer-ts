# WebGazer Examples

This directory contains examples demonstrating how to use the WebGazer eye tracking library.

## Examples

### 1. Minimal HTML Example (`minimal-example.html`)

A complete, standalone HTML file that demonstrates basic WebGazer usage with a beautiful UI.

**Features:**
- Start/stop eye tracking
- Manual calibration by clicking points
- Real-time gaze visualization with red dot
- Gaze heatmap overlay
- Live statistics display
- Pause/resume functionality
- Clear calibration data

**How to Run:**
```bash
# Option 1: Using a simple HTTP server
python3 -m http.server 8000
# Then open: http://localhost:8000/examples/minimal-example.html

# Option 2: Using Node.js http-server
npx http-server -p 8000
# Then open: http://localhost:8000/examples/minimal-example.html

# Option 3: Using VS Code Live Server extension
# Right-click on minimal-example.html and select "Open with Live Server"
```

**Usage Instructions:**
1. Click "Start WebGazer" and allow camera access
2. Click "Start Calibration" to enter calibration mode
3. Click on the blue calibration points as they appear
4. After calibration, your gaze will be tracked automatically
5. The red dot shows where the system thinks you're looking

### 2. TypeScript Example (`typescript-example.ts`)

A comprehensive TypeScript example showing advanced usage patterns and full type safety.

**Features:**
- Full TypeScript type safety
- Object-oriented architecture with `EyeTrackingApp` class
- Manual calibration with visual overlay
- Gaze history tracking
- Element detection (check if user is looking at specific elements)
- Statistics collection
- Multiple usage examples:
  - Basic usage
  - Custom calibration
  - Switching regression algorithms
  - Pause and resume

**How to Use in Your Project:**

```typescript
import webgazer from 'webgazer';
import EyeTrackingApp from './examples/typescript-example';

// Create and initialize the app
const app = new EyeTrackingApp();
await app.initialize();

// Run calibration
await app.calibrate(9); // 9 calibration points

// Let it track for a while
await new Promise(resolve => setTimeout(resolve, 10000));

// Get statistics
const stats = app.getStatistics();
console.log('Session stats:', stats);

// Clean up
app.stop();
```

## API Overview

### Core Methods

```typescript
// Start WebGazer
await webgazer.begin();

// Set gaze prediction callback
webgazer.setGazeListener((data, elapsedTime) => {
  if (data) {
    console.log(`Gaze at (${data.x}, ${data.y})`);
  }
});

// Record calibration point
webgazer.recordScreenPosition(x, y, 'click');

// Enable automatic mouse tracking for calibration
webgazer.addMouseEventListeners();

// Pause tracking
webgazer.pause();

// Resume tracking
await webgazer.resume();

// Stop and clean up
webgazer.end();

// Clear calibration data
await webgazer.clearData();
```

### Configuration Methods

```typescript
// Show/hide video preview
webgazer.showVideoPreview(true);
webgazer.showFaceOverlay(true);
webgazer.showFaceFeedbackBox(true);
webgazer.showPredictionPoints(true);

// Enable Kalman filter for smoothing
webgazer.applyKalmanFilter(true);

// Save data across browser sessions
webgazer.saveDataAcrossSessions(true);

// Set video viewer size
webgazer.setVideoViewerSize(320, 240);

// Set camera constraints
await webgazer.setCameraConstraints({
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 }
  }
});
```

### Tracker and Regressor Methods

```typescript
// Set tracker (default: 'TFFacemesh')
webgazer.setTracker('TFFacemesh');

// Set regression algorithm
webgazer.setRegression('ridge'); // Options: 'ridge', 'weightedRidge', 'threadedRidge'

// Add additional regressor
webgazer.addRegression('weightedRidge');

// Get current prediction
const prediction = await webgazer.getCurrentPrediction();
```

### Browser Compatibility

```typescript
// Check browser compatibility
const isCompatible = webgazer.detectCompatibility();

// Get compatibility warnings
const warnings = webgazer.getCompatibilityWarnings();
console.log('Warnings:', warnings);

// Log detailed compatibility info
webgazer.logCompatibilityInfo();
```

## TypeScript Types

The library exports comprehensive TypeScript types:

```typescript
import type {
  GazePrediction,
  EyeFeatures,
  Point2D,
  Rectangle,
  ITracker,
  IRegressor,
  WebGazerConfig,
} from 'webgazer';

// Use types in your code
function handleGaze(prediction: GazePrediction): void {
  console.log(`x: ${prediction.x}, y: ${prediction.y}`);
}
```

## Calibration

WebGazer requires calibration to learn your specific eye characteristics. There are two approaches:

### 1. Manual Calibration (Examples show this)
- Create calibration points on the screen
- User clicks or looks at each point
- Call `webgazer.recordScreenPosition(x, y, 'click')` for each point
- Collect 5-9 points distributed across the screen

### 2. Automatic Mouse Tracking
- Call `webgazer.addMouseEventListeners()`
- System automatically records where you click and move your mouse
- Learns over time as you interact with the page
- Best for continuous improvement

## Tips for Best Results

1. **Good Lighting**: Ensure your face is well-lit
2. **Stable Position**: Sit still and keep your head at a consistent distance from the camera
3. **Calibration**: Collect calibration points from all areas of the screen
4. **Multiple Points**: Use at least 9 calibration points for best accuracy
5. **Patience**: Give the system a few seconds to stabilize after starting
6. **Recalibrate**: If accuracy degrades, run calibration again
7. **Kalman Filter**: Enable for smoother predictions: `webgazer.applyKalmanFilter(true)`

## Browser Requirements

- **Camera Access**: WebRTC getUserMedia API
- **WebGL**: For TensorFlow.js (face tracking)
- **Modern Browser**: Chrome, Firefox, Edge, Safari (latest versions)
- **HTTPS**: Required for camera access (except localhost)

## Troubleshooting

### Camera Not Working
- Ensure you're on HTTPS (or localhost)
- Check browser permissions for camera access
- Verify no other application is using the camera

### Poor Tracking Accuracy
- Improve lighting conditions
- Run calibration with more points
- Enable Kalman filter: `webgazer.applyKalmanFilter(true)`
- Try the weighted regression: `webgazer.setRegression('weightedRidge')`
- Sit closer to the camera
- Recalibrate if your position changes

### Performance Issues
- Reduce video resolution:
  ```typescript
  await webgazer.setCameraConstraints({
    video: { width: 320, height: 240 }
  });
  ```
- Use threaded regression: `webgazer.setRegression('threadedRidge')`
- Hide overlays: `webgazer.showVideoPreview(false)`

## Next Steps

1. Run the minimal example to understand basic usage
2. Study the TypeScript example for advanced patterns
3. Integrate WebGazer into your own project
4. Customize the calibration UI to match your application
5. Experiment with different regression algorithms

## Resources

- **GitHub**: https://github.com/brownhci/WebGazer
- **Paper**: http://www.cv-foundation.org/openaccess/content_ijcv/papers/Papoutsaki_WebGazer_IJCV_2016.pdf
- **API Documentation**: See the TypeScript types and JSDoc comments in the source code

## License

WebGazer is licensed under the GPL v3.0 license.
