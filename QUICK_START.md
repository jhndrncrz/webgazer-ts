# 🎯 WebGazer-TS: Quick Start Guide

## Files You Need

### For Drop-in Replacement (Browser)
```
dist/webgazer-ts.umd.cjs  (2.0 MB uncompressed, 385 KB gzipped)
```

### For Modern Build Tools (npm/webpack/vite)
```
dist/webgazer-ts.js       (2.6 MB uncompressed, 460 KB gzipped)
dist/index.d.ts           (TypeScript definitions)
```

---

## Usage: 3 Simple Steps

### Step 1: Include the Script
```html
<!DOCTYPE html>
<html>
<head>
    <title>WebGazer Test</title>
</head>
<body>
    <!-- Single script tag - that's it! -->
    <script src="dist/webgazer-ts.umd.cjs"></script>
</body>
</html>
```

### Step 2: Initialize WebGazer
```html
<script>
    // Start WebGazer
    webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .applyKalmanFilter(true)
        .showVideoPreview(true)
        .begin();
</script>
```

### Step 3: Set Gaze Listener
```html
<script>
    // Get gaze predictions
    webgazer.setGazeListener(function(data, timestamp) {
        if (data) {
            console.log('Looking at:', data.x, data.y);
        }
    });
    
    // Enable auto-calibration (clicks + mouse movements)
    webgazer.addMouseEventListeners();
</script>
```

**Done!** The system will:
1. Ask for camera permission
2. Detect your face
3. Track your eyes
4. Learn from your clicks and mouse movements
5. Predict where you're looking

---

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WebGazer-TS Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        #gazeData {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>WebGazer-TS Demo</h1>
    <p>Click "Start" and allow camera access. Then click around the screen to calibrate!</p>
    
    <button onclick="startTracking()">Start Eye Tracking</button>
    <button onclick="stopTracking()">Stop</button>
    
    <div id="gazeData">
        <strong>Gaze Position:</strong><br>
        X: <span id="gazeX">-</span><br>
        Y: <span id="gazeY">-</span><br>
        Points: <span id="calibCount">0</span>
    </div>

    <!-- Load WebGazer -->
    <script src="dist/webgazer-ts.umd.cjs"></script>
    
    <script>
        async function startTracking() {
            try {
                // Initialize WebGazer
                await webgazer
                    .setRegression('ridge')
                    .setTracker('TFFacemesh')
                    .applyKalmanFilter(true)
                    .showVideoPreview(true)
                    .showFaceOverlay(true)
                    .showFaceFeedbackBox(true)
                    .begin();
                
                // Set gaze listener
                webgazer.setGazeListener((data, timestamp) => {
                    if (data) {
                        document.getElementById('gazeX').textContent = Math.round(data.x);
                        document.getElementById('gazeY').textContent = Math.round(data.y);
                        
                        const count = webgazer.getCalibrationDataCount();
                        document.getElementById('calibCount').textContent = count;
                    }
                });
                
                // Enable automatic calibration from clicks and mouse movements
                webgazer.addMouseEventListeners();
                
                console.log('✅ Eye tracking started!');
                console.log('Click around the screen to calibrate.');
                
            } catch (error) {
                console.error('Failed to start:', error);
                alert('Error: ' + error.message);
            }
        }
        
        function stopTracking() {
            webgazer.end();
            console.log('Eye tracking stopped');
        }
    </script>
</body>
</html>
```

---

## What Happens When You Run This?

### 1. Camera Access (First Time)
```
Browser: "Allow camera access?"
You: Click "Allow"
```

### 2. Face Detection
```
✅ Camera activated
✅ Face detected
✅ Eye regions extracted
🎥 Video preview shown (optional)
```

### 3. Calibration
```
Click #1: (100, 100) → System learns
Click #2: (500, 300) → Improves
Click #3: (900, 500) → Gets better
...
Move mouse around → Continuous learning
```

### 4. Tracking
```
You look at top-left: → Prediction: (150, 80)
You look at center:   → Prediction: (960, 540)
You look at bottom:   → Prediction: (850, 950)
```

---

## Calibration Tips

### Quick Calibration (30 seconds)
1. Click 5-9 points spread across screen:
   - Four corners
   - Center
   - Mid-points of edges
2. Move mouse naturally while browsing
3. System adapts in real-time

### Best Accuracy (2 minutes)
1. Click 20-30 points all over screen
2. Spread clicks evenly
3. Look directly at cursor when clicking
4. Stay at same distance from screen
5. Keep head relatively still
6. Move mouse between major UI elements

---

## Troubleshooting

### ❌ "webgazer is not defined"
**Solution**: Make sure script tag loads before your code:
```html
<script src="dist/webgazer-ts.umd.cjs"></script>  <!-- Load first -->
<script src="your-code.js"></script>              <!-- Then your code -->
```

### ❌ "Camera access denied"
**Solutions**:
- Check browser permissions (camera icon in address bar)
- Try different browser (Chrome, Firefox, Edge work best)
- Ensure HTTPS (required for camera on remote sites)
- localhost works without HTTPS

### ❌ "No gaze predictions"
**Solutions**:
- Click around screen to calibrate (5-10 clicks minimum)
- Check console: `webgazer.getCalibrationDataCount()`
- Make sure face is visible (green dots on face)
- Good lighting helps significantly

### ❌ "Predictions inaccurate"
**Solutions**:
- Add more calibration points (20-30)
- Stay at same distance from camera
- Look directly at cursor when clicking
- Clear and recalibrate: `webgazer.clearData()`

---

## API Cheat Sheet

### Essential Methods
```javascript
// Start/Stop
await webgazer.begin();
webgazer.pause();
await webgazer.resume();
webgazer.end();

// Configuration
webgazer.setTracker('TFFacemesh');        // Face tracking
webgazer.setRegression('ridge');          // Gaze prediction algorithm
webgazer.applyKalmanFilter(true);         // Smooth predictions

// Calibration
webgazer.addMouseEventListeners();        // Auto-calibration
webgazer.recordScreenPosition(x, y);      // Manual point
webgazer.getCalibrationDataCount();       // How many points?
await webgazer.clearData();               // Reset calibration

// Callbacks
webgazer.setGazeListener(function(data, time) {
    console.log(`Gaze: (${data.x}, ${data.y})`);
});

// Display
webgazer.showVideoPreview(true);          // Show camera feed
webgazer.showFaceOverlay(true);           // Show face landmarks
webgazer.showFaceFeedbackBox(true);       // Show calibration guide
webgazer.showPredictionPoints(true);      // Show gaze dot
```

### Data Management
```javascript
// Save calibration
webgazer.saveDataAcrossSessions(true);

// Get stored data
const [xPoints, yPoints] = webgazer.getStoredPoints();
console.log('Calibration points:', xPoints.length);

// Check status
const isReady = webgazer.isReady();
const state = webgazer.getState();
```

---

## Performance Tips

### For Best Performance
1. **Lighting**: Bright, even lighting (avoid backlighting)
2. **Distance**: 40-80cm from camera
3. **Position**: Face camera directly
4. **Calibration**: More points = better accuracy
5. **Environment**: Stable position, minimal head movement

### Reducing CPU Usage
```javascript
// Reduce video resolution
webgazer.setCameraConstraints({
    video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
    }
});

// Hide video preview
webgazer.showVideoPreview(false);
webgazer.showFaceOverlay(false);
```

---

## Next Steps

### Try the Examples
```
examples/minimal-example.html       - Simplest demo
examples/calibration-demo.html      - Full calibration UI
test-drop-in-replacement.html       - API compatibility test
index.html                          - Interactive demo
```

### Read the Docs
```
CALIBRATION_METHODOLOGY.md          - How calibration works
DROP_IN_REPLACEMENT_COMPLETE.md     - Migration guide
docs/API_COMPATIBILITY.md           - Full API reference
docs/CALIBRATION_GUIDE.md           - Calibration best practices
```

### Build from Source
```bash
npm install
npm run build
npm run dev    # Development server
```

---

## Quick Test

### Test File: `test-drop-in-replacement.html`

Open this file in your browser to verify everything works:

```bash
# If you have Python installed:
cd /path/to/WebGazer-3.4.0
python3 -m http.server 8080

# Then open:
http://localhost:8080/test-drop-in-replacement.html
```

Expected results:
- ✅ webgazer is available globally
- ✅ All API methods exist
- ✅ TensorFlow bundled (not global)
- ✅ LocalForage bundled (not global)
- ✅ Camera starts successfully
- ✅ Face detection works
- ✅ Gaze predictions appear
- ✅ Calibration counter increments

---

## Summary

### What You Get
- ✅ Single JavaScript file (no dependencies)
- ✅ 100% compatible with original webgazer.js
- ✅ Automatic calibration (clicks + mouse movements)
- ✅ 4D Kalman filter smoothing
- ✅ TypeScript definitions included
- ✅ Modern, maintainable codebase

### What You Need
1. One script tag
2. Camera permission
3. 5-10 clicks to calibrate
4. That's it!

### Bundle Size
- **Uncompressed**: 2.0 MB
- **Gzipped**: 385 KB
- **Comparison**: Same as original webgazer.js

---

**Ready to start? Copy `dist/webgazer-ts.umd.cjs` to your project and add a `<script>` tag!**

Questions? Check the docs or examples folder.
