# Frequently Asked Questions

Common questions and answers about Webgazer.ts.

## General Questions

### What is Webgazer.ts?

Webgazer.ts is a modern TypeScript rewrite of [Webgazer.js](https://webgazer.cs.brown.edu), providing eye tracking directly in the browser using machine learning and computer vision. It tracks where users are looking on the screen using only their webcam.

### How is it different from Webgazer.js?

Webgazer.ts is a complete rewrite with:
- **TypeScript** - Full type safety and better DX
- **Modern Architecture** - Modular, tree-shakeable code
- **React Integration** - Official hooks and components
- **Better Defaults** - Privacy-first (no auto-save)
- **ES Modules** - Native ESM support
- **Smaller Bundle** - Better tree-shaking

See the [Migration Guide](./migration.md) for details.

### Is it free?

Yes! Webgazer.ts is open source under GPL-3.0-or-later license, just like the original Webgazer.js.

### Can I use it commercially?

Yes, under the GPL-3.0 license terms. If you need a different license, please contact the maintainers.

## Browser & Compatibility

### Which browsers are supported?

| Browser | Minimum Version | Status |
|---------|----------------|---------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Fully Supported |

Mobile browsers have limited support due to webcam API restrictions.

### Does it work on mobile?

Mobile support is limited:
- **iOS Safari** - Camera access restricted, limited functionality
- **Android Chrome** - Works but accuracy is lower
- **Recommendation** - Use desktop browsers for best results

### Why doesn't it work in my browser?

Check browser compatibility:

```typescript
import webgazer from '@webgazer-ts/core';

const isCompatible = webgazer.detectCompatibility();
if (!isCompatible) {
  const warnings = webgazer.getCompatibilityWarnings();
  console.warn(warnings);
}
```

Common issues:
- **No WebRTC** - Browser doesn't support `getUserMedia()`
- **No WebGL** - TensorFlow.js needs WebGL for ML
- **Insecure context** - Must use HTTPS (except localhost)

### Does it work offline?

Yes! Once loaded, Webgazer.ts works completely offline. All processing happens locally in the browser.

## Accuracy & Performance

### How accurate is eye tracking?

Typical accuracy:
- **After calibration:** 100-150 pixels error
- **Without calibration:** Poor/unusable

Factors affecting accuracy:
- **Calibration quality** - More points = better accuracy
- **User distance** - 50-80cm from screen is optimal
- **Lighting** - Good lighting on face improves accuracy
- **Screen size** - Larger screens make calibration easier
- **User stability** - Moving around reduces accuracy

### Why is accuracy poor?

Common reasons:
1. **No calibration** - Calibration is **required** for accuracy
2. **Few calibration points** - Use 9-12 points minimum
3. **Poor lighting** - Face should be well-lit
4. **Too close/far** - Stay 50-80cm from webcam
5. **Moving around** - Keep head relatively still
6. **Glasses/contacts** - May affect accuracy

### How can I improve accuracy?

Best practices:
1. **Calibrate thoroughly** - 9-12 points across the screen
2. **Good lighting** - Face should be evenly lit
3. **Optimal distance** - 50-80cm from screen
4. **Stable position** - Encourage users to stay still
5. **Use Kalman filtering** - Smooths out noise
6. **Recalibrate periodically** - Every few minutes

```typescript
// Use weighted regression for better recent accuracy
webgazer.setRegression('weightedRidge');

// Or use Kalman filtering
import { KalmanFilter } from '@webgazer-ts/core';

const filter = new KalmanFilter();
webgazer.setGazeListener((data) => {
  if (!data) return;
  const smoothed = filter.update(data.x, data.y);
  // Use smoothed.x, smoothed.y
});
```

### Is it fast enough for real-time applications?

Yes! Webgazer.ts typically runs at:
- **30-60 FPS** on modern hardware
- **20-30 FPS** on older devices

Performance tips:
- Use `threadedRidge` regression for better performance
- Reduce video resolution if needed
- Throttle gaze updates if you don't need 60 FPS

## Privacy & Security

### Does it send data anywhere?

**No!** All processing happens locally in your browser. No data is sent to any server unless you explicitly implement that.

### Is webcam data stored?

No. Webgazer processes video frames in real-time and discards them immediately. Only calibration data is stored (if enabled).

### What about calibration data?

By default (v0.2.0+), calibration data is **NOT** saved across sessions. You must explicitly opt-in:

```typescript
webgazer.saveDataAcrossSessions(true).begin();
```

This is a privacy-first change from v0.1.0.

### How do I clear stored data?

```typescript
// Clear all calibration data
webgazer.clearData();

// Also clears from localStorage
```

### Is it GDPR compliant?

Webgazer.ts itself doesn't collect any data, but you must:
1. **Get consent** before accessing the camera
2. **Disclose usage** - Tell users you're tracking their gaze
3. **Provide opt-out** - Let users disable tracking
4. **Clear data on logout** - Call `webgazer.clearData()`

Example consent:

```typescript
async function startWithConsent() {
  const consent = confirm(
    'This app uses eye tracking to improve your experience. ' +
    'We need camera access. No data leaves your device. ' +
    'Allow camera access?'
  );
  
  if (consent) {
    await webgazer.begin();
  }
}
```

## Technical Questions

### Why does it need camera access?

Eye tracking requires analyzing your eyes in real-time through the webcam. The camera feed is processed locally and never sent anywhere.

### Can I use my own ML models?

Yes! You can create custom trackers or regressors:

```typescript
import { Webgazer } from '@webgazer-ts/core';
import type { ITracker, IRegressor } from '@webgazer-ts/core';

class MyCustomRegressor implements IRegressor {
  // Implement the interface
}

Webgazer.addRegressionModule('myRegressor', MyCustomRegressor);
webgazer.setRegression('myRegressor');
```

See [Custom Regression Guide](./advanced/custom-regression.md).

### What ML models does it use?

- **Face Detection:** TensorFlow.js MediaPipe FaceMesh
- **Gaze Prediction:** Ridge Regression (configurable)
- **Filtering:** Optional Kalman filtering

### How big is the bundle?

| Package | Size (gzipped) |
|---------|---------------|
| Core (ESM) | ~460 KB* |
| React | ~5 KB |

*Includes TensorFlow.js and face detection models. All bundled for drop-in replacement.

### Can I tree-shake it?

The core package bundles TensorFlow.js for drop-in replacement. The React package is fully tree-shakeable.

## Development

### How do I debug issues?

Enable debug visualization:

```typescript
// Show webcam feed
webgazer.showVideo(true);

// Show detected face landmarks
webgazer.showFaceOverlay(true);

// Show face detection box
webgazer.showFaceFeedbackBox(true);
```

Check the console for warnings:

```typescript
const warnings = webgazer.getCompatibilityWarnings();
console.log(warnings);
```

### Why isn't the camera starting?

Common reasons:
1. **Permission denied** - User blocked camera access
2. **Already in use** - Another app/tab is using the camera
3. **No camera found** - No webcam connected
4. **Insecure context** - Not HTTPS (required except on localhost)

```typescript
try {
  await webgazer.begin();
} catch (error) {
  console.error('Camera error:', error.name, error.message);
}
```

### How do I test locally?

```bash
# Install dependencies
npm install @webgazer-ts/core

# Run a development server (must be HTTPS or localhost)
npm install -g http-server
http-server -p 8080
```

Or use our examples:

```bash
git clone https://github.com/jhndrncrz/webgazer-ts
cd webgazer-ts/examples/vanilla-js-demo
npm install
npm run dev
```

### How do I contribute?

See the [Contributing Guide](./contributing.md).

## Integration

### How do I use with React?

Install the React package:

```bash
npm install @webgazer-ts/react
```

See [React Quick Start](./react/quick-start.md).

### Can I use with Vue/Angular/Svelte?

Yes! The core package works with any framework. Use the vanilla JavaScript API.

### How do I integrate with my backend?

Send calibration data or gaze recordings to your server:

```typescript
webgazer.setGazeListener(async (data, time) => {
  if (!data) return;
  
  // Send to your backend
  await fetch('/api/gaze', {
    method: 'POST',
    body: JSON.stringify({ x: data.x, y: data.y, time })
  });
});
```

## Troubleshooting

### The gaze point is way off

1. **Run calibration** - This is required!
2. **Use more calibration points** - 9-12 minimum
3. **Check lighting** - Face should be well-lit
4. **Check distance** - Stay 50-80cm from webcam

### It's too slow/laggy

1. **Check CPU usage** - TensorFlow.js is CPU-intensive
2. **Use threadedRidge** - Offloads work to Web Workers
3. **Lower frame rate** - Throttle updates if you don't need 60 FPS
4. **Reduce video resolution** - Configure lower webcam resolution

### No face detected

1. **Check lighting** - Face should be visible and lit
2. **Check camera angle** - Face should be centered
3. **Check distance** - Stay 50-80cm from webcam
4. **Enable debug view** - See what the model sees:

```typescript
webgazer.showVideo(true);
webgazer.showFaceOverlay(true);
```

### Calibration data not saving

In v0.2.0+, data persistence is opt-in:

```typescript
// Enable persistence
webgazer.saveDataAcrossSessions(true);
```

## Support

### Where can I get help?

- **GitHub Issues:** [Report bugs or request features](https://github.com/jhndrncrz/webgazer-ts/issues)
- **Documentation:** You're reading it! 📖
- **Examples:** Check the [examples directory](https://github.com/jhndrncrz/webgazer-ts/tree/main/examples)

### How do I report a bug?

[Open an issue](https://github.com/jhndrncrz/webgazer-ts/issues/new) with:
1. Browser and version
2. Code snippet to reproduce
3. Expected vs actual behavior
4. Console errors (if any)

### Can I request a feature?

Yes! [Open a feature request](https://github.com/jhndrncrz/webgazer-ts/issues/new) describing:
1. What you want to achieve
2. Why it would be useful
3. Proposed API (if you have ideas)

---

**Still have questions?** [Open a discussion on GitHub](https://github.com/jhndrncrz/webgazer-ts/discussions)
