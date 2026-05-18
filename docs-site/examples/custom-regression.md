# Custom Regression Example

Register a custom gaze prediction algorithm and use it alongside the built-in regressors.

## Simple Custom Regressor — Last-N-Clicks Average

This regressor ignores eye features entirely and predicts gaze as the average of the last N
click positions. It's useful as a baseline or for understanding the registration API:

```typescript
import webgazer from '@webgazer-ts/core';
import type { IRegressor, EyeFeatures, GazePrediction, Point2D } from '@webgazer-ts/core';

class LastNClicksRegressor implements IRegressor {
  private clicks: { x: number; y: number }[] = [];
  private readonly n: number;

  constructor(n = 5) {
    this.n = n;
  }

  initialize(): void {
    this.clicks = [];
  }

  predict(_eyeFeatures: EyeFeatures): GazePrediction | null {
    if (this.clicks.length === 0) return null;
    const recent = this.clicks.slice(-this.n);
    return {
      x: Math.round(recent.reduce((s, c) => s + c.x, 0) / recent.length),
      y: Math.round(recent.reduce((s, c) => s + c.y, 0) / recent.length),
    };
  }

  addData(_eyes: EyeFeatures, screen: Point2D, type: string): void {
    if (type === 'click') {
      this.clicks.push({ x: screen.x, y: screen.y });
    }
  }

  getData() { return { clicks: this.clicks }; }
  setData(d: unknown) {
    this.clicks = (d as any)?.clicks ?? [];
  }
}

// Register and activate
webgazer.addRegressionModule('lastN', LastNClicksRegressor);

await webgazer
  .setRegression('lastN')
  .begin();
```

## Switching Between Regressors

```typescript
// Start with default ridge
await webgazer.setRegression('ridge').begin();

// Register custom one in parallel
webgazer.addRegressionModule('lastN', LastNClicksRegressor);

// Compare — switch at runtime without restarting
document.getElementById('switch-btn')?.addEventListener('click', () => {
  webgazer.setRegression('lastN');
});
```

## Running Multiple Regressors

Use `addRegression` (not `setRegression`) to run multiple regressors simultaneously.
The predictions are averaged:

```typescript
webgazer
  .setRegression('ridge')     // Resets to only ridge
  .addRegression('weightedRidge');  // Adds weightedRidge alongside ridge

// Predictions now = average of ridge and weightedRidge outputs
```

## Custom Regressor with Kalman Smoothing

```typescript
import { KalmanFilter } from '@webgazer-ts/core/utils/filters/KalmanFilter';
import type { IRegressor, EyeFeatures, GazePrediction, Point2D } from '@webgazer-ts/core';

class SmoothedClickRegressor implements IRegressor {
  private clicks: { x: number; y: number; t: number }[] = [];
  private kalman = new KalmanFilter({ processNoise: 2, measurementNoise: 30 });

  initialize(): void {
    this.clicks = [];
    this.kalman.reset();
  }

  predict(_eyes: EyeFeatures): GazePrediction | null {
    const recent = this.clicks.filter(c => Date.now() - c.t < 3000);
    if (recent.length === 0) return null;

    const rawX = recent.reduce((s, c) => s + c.x, 0) / recent.length;
    const rawY = recent.reduce((s, c) => s + c.y, 0) / recent.length;

    const [x, y] = this.kalman.update([rawX, rawY]);
    return { x: Math.round(x), y: Math.round(y) };
  }

  addData(_eyes: EyeFeatures, screen: Point2D, type: string): void {
    if (type === 'click') {
      this.clicks.push({ x: screen.x, y: screen.y, t: Date.now() });
      if (this.clicks.length > 200) this.clicks.shift();
    }
  }

  getData() { return { clicks: this.clicks }; }
  setData(d: unknown) { this.clicks = (d as any)?.clicks ?? []; }
}

webgazer.addRegressionModule('smoothedClick', SmoothedClickRegressor);
webgazer.setRegression('smoothedClick');
```

## In React

```tsx
import { useEffect } from 'react';
import { WebgazerProvider, useWebgazer } from '@webgazer-ts/react';
import type { IRegressor, EyeFeatures, GazePrediction, Point2D } from '@webgazer-ts/core';

class MyRegressor implements IRegressor {
  /* ... implementation ... */
}

function App() {
  const { webgazer, start } = useWebgazer({ regression: 'myReg' });

  useEffect(() => {
    // Register before first start
    webgazer?.addRegressionModule('myReg', MyRegressor);
  }, [webgazer]);

  return <button onClick={start}>Start with Custom Regressor</button>;
}

export default function Root() {
  return (
    <WebgazerProvider>
      <App />
    </WebgazerProvider>
  );
}
```

## See Also

- [Custom Regression Guide](/guide/advanced/custom-regression)
- [Architecture — Regressors](/guide/architecture)
- [Advanced Module Demo](https://github.com/jhndrncrz/webgazer-ts/blob/main/examples/advanced-demo/index.html)
