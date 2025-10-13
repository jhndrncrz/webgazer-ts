# Installation

## Package Manager

Install the core Webgazer.ts package using your preferred package manager:

::: code-group

```bash [npm]
npm install @webgazer-ts/core
```

```bash [pnpm]
pnpm add @webgazer-ts/core
```

```bash [yarn]
yarn add @webgazer-ts/core
```

:::

## CDN Usage

For quick prototyping or no-build setups, use the CDN version:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Webgazer.ts CDN Example</title>
</head>
<body>
  <h1>Eye Tracking Demo</h1>
  <div id="gaze-dot" style="position: absolute; width: 10px; height: 10px; background: red; border-radius: 50%;"></div>

  <!-- Load from CDN -->
  <script type="module">
    import webgazer from 'https://cdn.jsdelivr.net/npm/@webgazer-ts/core@latest/dist/webgazer-ts.js';

    // Start tracking
    await webgazer.begin();

    // Show gaze position
    webgazer.setGazeListener((data) => {
      if (data) {
        const dot = document.getElementById('gaze-dot');
        dot.style.left = `${data.x}px`;
        dot.style.top = `${data.y}px`;
      }
    });
  </script>
</body>
</html>
```

## TypeScript Setup

Webgazer.ts is written in TypeScript and includes full type definitions:

```typescript
import webgazer from '@webgazer-ts/core';
import type { GazePrediction, CalibrationResult } from '@webgazer-ts/core';

// TypeScript knows all types automatically
const prediction: GazePrediction | null = await webgazer.getCurrentPrediction();
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true
  }
}
```

## Browser Support

Webgazer.ts requires modern browser features:

| Feature | Required | Fallback |
|---------|----------|----------|
| **getUserMedia** | ✅ Yes | None |
| **WebGL** | ✅ Yes | None |
| **Web Workers** | ⚠️ Optional | Synchronous mode |
| **IndexedDB** | ⚠️ Optional | In-memory only |

### Supported Browsers

- ✅ **Chrome/Edge** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14.1+
- ✅ **Opera** 76+
- ❌ Internet Explorer (not supported)

## Verification

Test that installation worked:

```typescript
import webgazer from '@webgazer-ts/core';

console.log('Webgazer.ts loaded:', webgazer);

// Check browser compatibility
const isCompatible = webgazer.detectCompatibility();
console.log('Browser compatible:', isCompatible);

if (!isCompatible) {
  const warnings = webgazer.getCompatibilityWarnings();
  console.warn('Compatibility issues:', warnings);
}
```

## Next Steps

- [Basic Usage](/guide/core/basic-usage) - Learn how to use Webgazer.ts
- [Configuration](/guide/core/configuration) - Customize settings
- [Calibration](/guide/core/calibration) - Improve accuracy

## Troubleshooting

### Module Resolution Error

If you get `Cannot find module '@webgazer-ts/core'`:

1. Verify installation: `npm list @webgazer-ts/core`
2. Clear cache: `rm -rf node_modules && npm install`
3. Check `package.json` dependencies

### TypeScript Errors

If you get type errors:

1. Ensure TypeScript 4.9+ is installed
2. Add to `tsconfig.json`: `"skipLibCheck": true`
3. Check that `node_modules/@webgazer-ts/core/dist/index.d.ts` exists

### Browser Compatibility

Check compatibility in your app:

```typescript
if (!webgazer.detectCompatibility()) {
  alert('Your browser does not support eye tracking');
}
```
