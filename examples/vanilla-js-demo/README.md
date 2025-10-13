# Webgazer Vanilla JavaScript Demo

A minimal vanilla JavaScript demo of Webgazer.ts with automatic calibration.

## Features

- 🚀 **No Build Tools Required** - Just open in your browser!
- ✨ **Automatic Calibration** - Starts when you begin tracking
- 🎯 **Real-time Gaze Tracking** - See predictions live
- 📊 **Live Statistics** - Track calibration progress
- 🎨 **Modern UI** - Gradient design with glassmorphism
- 👁️ **Optional Gaze Dot** - Visual feedback overlay

## Quick Start

### Option 1: Direct Browser Open

Simply open `index.html` in your browser:

```bash
open index.html
```

### Option 2: Local Server (Recommended)

Use a local server for better CORS handling:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## How to Use

1. **Click "Start Tracking"** - Grants camera access and starts eye tracking
2. **Calibration starts automatically!** - No manual setup needed
3. **Click around naturally** - Use the target boxes or anywhere on the page
4. **Watch accuracy improve** - The model learns from every click
5. **Optional:** Toggle the gaze dot to see real-time predictions

## How It Works

### Automatic Calibration

```javascript
// This is all you need!
await webgazer.begin();

// Calibration now active - begin() automatically calls addMouseEventListeners()
// Every click trains the model - matches original Webgazer API
```

### Manual Calibration Control (Optional)

```javascript
// Pause calibration
webgazer.removeMouseEventListeners();

// Resume calibration
webgazer.addMouseEventListeners();
```

## Code Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Styles embedded -->
  </head>
  <body>
    <!-- UI elements -->
    
    <script type="module">
      // ES modules - no bundler needed!
      import webgazer from '../../packages/core/dist/webgazer-ts.js';
      
      // Your code here
    </script>
  </body>
</html>
```

## Key Concepts

### Continuous Learning

- ❌ There is NO "calibration complete" state
- ✅ The model learns continuously from every click
- ✅ More clicks = better accuracy
- ✅ Natural interaction is all you need

### Automatic Setup

- ❌ You don't need to call `addMouseEventListeners()` manually
- ✅ It's called automatically by `begin()`
- ✅ Matches original Webgazer.js API behavior
- ✅ Only call it manually if you want to resume after pausing

## Browser Compatibility

Tested and working on:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requirements:**
- Webcam access
- Modern browser with getUserMedia API
- ES module support

## Customization

### Change Video Preview Size

```javascript
webgazer.setVideoViewerSize(320, 240);
```

### Toggle UI Elements

```javascript
webgazer.showVideo(false);        // Hide webcam preview
webgazer.showFaceOverlay(true);   // Show face mesh
webgazer.showPredictionPoints(true); // Show gaze dot
```

### Clear Calibration Data

```javascript
await webgazer.clearData();
```

## Troubleshooting

### Camera Not Working

1. Check browser permissions
2. Ensure HTTPS or localhost
3. Try a different browser

### Module Import Errors

Make sure the relative path to the core package is correct:

```javascript
// Adjust based on your folder structure
import webgazer from '../../packages/core/dist/webgazer-ts.js';
```

### CORS Errors

Use a local server instead of opening the file directly:

```bash
python3 -m http.server 8000
```

## Learn More

- **Core Library**: `../../packages/core/README.md`
- **Calibration Guide**: `../../CALIBRATION_EXPLAINED.md`
- **API Compatibility**: `../../API_COMPATIBILITY.md`
- **React Demo**: `../react-demo/README.md`

## Integration into Your Project

### Download Method

1. Download the built `webgazer-ts.js` from releases
2. Include in your HTML:

```html
<script type="module">
  import webgazer from './webgazer-ts.js';
  
  await webgazer.begin();
  webgazer.setGazeListener((data) => {
    if (data) {
      console.log(data.x, data.y);
    }
  });
</script>
```

### NPM Method

```bash
npm install @webgazer-ts/core
```

```javascript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();
```

## Performance Tips

1. **Minimize video size** for better performance:
   ```javascript
   webgazer.setVideoViewerSize(320, 240);
   ```

2. **Hide unnecessary UI** elements:
   ```javascript
   webgazer.showVideo(false);
   webgazer.showFaceOverlay(false);
   ```

3. **Throttle gaze listener** if processing is heavy:
   ```javascript
   let lastProcessed = 0;
   webgazer.setGazeListener((data) => {
     const now = Date.now();
     if (now - lastProcessed > 100) { // 10fps
       // Process data
       lastProcessed = now;
     }
   });
   ```

## License

Same as the main Webgazer.ts project - see root LICENSE.md
