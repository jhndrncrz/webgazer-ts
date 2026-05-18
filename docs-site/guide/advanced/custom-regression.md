# Custom Regression

Create your own gaze prediction algorithm and register it as a first-class regression module.

## When to Use a Custom Regressor

The built-in `ridge`, `weightedRidge`, and `threadedRidge` regressors cover the majority of use cases. Consider a custom regressor when you need:

- A completely different algorithm (e.g. neural network, SVR, polynomial regression)
- Domain-specific feature engineering beyond eye patches
- Specialized weighting or regularization strategies
- Research into alternative gaze estimation methods

## The `IRegressor` Interface

Every regressor must satisfy the `IRegressor` interface, exported from `@webgazer-ts/core`:

```typescript
import type { IRegressor, EyeFeatures, GazePrediction, Point2D } from '@webgazer-ts/core';

interface IRegressor {
  /** Called once when the regressor is first set. Perform initialization here. */
  initialize(): void;

  /** 
   * Predict gaze from current eye features.
   * Called every animation frame while tracking is active.
   * @returns null if insufficient data to predict
   */
  predict(eyeFeatures: EyeFeatures): GazePrediction | null;

  /**
   * Store a calibration data point.
   * Called automatically on every click (and optionally mousemove).
   */
  addData(eyeFeatures: EyeFeatures, screenPos: Point2D, type: 'click' | 'move'): void;

  /** Serialize internal training data for persistence. */
  getData(): unknown;

  /** Restore serialized training data (called on page load if saveDataAcrossSessions is on). */
  setData(data: unknown): void;
}
```

## Minimal Example

This regressor always predicts the center of the screen — useful as a skeleton to build on:

```typescript
import type { IRegressor, EyeFeatures, GazePrediction, Point2D } from '@webgazer-ts/core';

class CenterRegressor implements IRegressor {
  initialize(): void {
    // Nothing to set up
  }

  predict(_eyeFeatures: EyeFeatures): GazePrediction | null {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  addData(_eyes: EyeFeatures, _screen: Point2D, _type: string): void {
    // Not using calibration data
  }

  getData(): unknown { return null; }
  setData(_data: unknown): void {}
}

// Register and activate
webgazer.addRegressionModule('center', CenterRegressor);
webgazer.setRegression('center');
```

## Full Example — Moving Average Regressor

This regressor collects calibration clicks and predicts gaze as the weighted average of
the most recent click positions (no actual eye features used — purely for demonstration):

```typescript
import webgazer from '@webgazer-ts/core';
import type { IRegressor, EyeFeatures, GazePrediction, Point2D } from '@webgazer-ts/core';

interface ClickRecord {
  x: number;
  y: number;
  timestamp: number;
}

class MovingAverageRegressor implements IRegressor {
  private clicks: ClickRecord[] = [];
  private readonly windowMs = 5000; // Use last 5 seconds of clicks

  initialize(): void {
    this.clicks = [];
  }

  predict(_eyeFeatures: EyeFeatures): GazePrediction | null {
    if (this.clicks.length === 0) return null;

    const now = Date.now();
    const recent = this.clicks.filter(c => now - c.timestamp < this.windowMs);

    if (recent.length === 0) return null;

    const x = recent.reduce((sum, c) => sum + c.x, 0) / recent.length;
    const y = recent.reduce((sum, c) => sum + c.y, 0) / recent.length;

    return { x: Math.round(x), y: Math.round(y) };
  }

  addData(_eyes: EyeFeatures, screen: Point2D, type: string): void {
    if (type === 'click') {
      this.clicks.push({ x: screen.x, y: screen.y, timestamp: Date.now() });
      // Keep last 200 clicks
      if (this.clicks.length > 200) {
        this.clicks.shift();
      }
    }
  }

  getData(): unknown {
    return { clicks: this.clicks };
  }

  setData(data: unknown): void {
    const d = data as { clicks?: ClickRecord[] };
    this.clicks = d?.clicks ?? [];
  }
}

// Register globally (available for all setRegression calls)
webgazer.addRegressionModule('movingAverage', MovingAverageRegressor);

// Activate
await webgazer
  .setRegression('movingAverage')
  .begin();
```

## Using the Built-in `Regressor` Base Class

For regressors that do use eye features, extend the abstract `Regressor` base class.
It provides the `DataWindow` circular buffers, Kalman filter wiring, and `getData`/`setData`
already implemented:

```typescript
import { Regressor } from '@webgazer-ts/core/regressors/base/Regressor';
import type { EyeFeatures, GazePrediction } from '@webgazer-ts/core';

class MyRidgeRegressor extends Regressor {
  public readonly name = 'myRidge';

  constructor() {
    super({
      ridgeParameter: 1e-5,
      dataWindowSize: 500,
      trailDataWindowSize: 20,
      trailTimeWindow: 1000,
      useKalmanFilter: true,
    });
  }

  public initialize(): void {
    // Set up your Kalman filter here
    this.setState(RegressorState.Ready);
  }

  public predict(eyeFeatures: EyeFeatures): GazePrediction | null {
    // Use this.eyeFeaturesClicks, this.screenXClicksArray, this.screenYClicksArray
    // Run your algorithm here
    // Call this.applyKalmanFilter(prediction) for smoothing
    return null;
  }
}
```

> **Tip:** The `Regressor` base class is exported as a deep import. This API may evolve — pin your package version if using internal classes.

## Registering as a Static Module

For library authors, you can add modules before any instance is created:

```typescript
import { Webgazer } from '@webgazer-ts/core';

// Static registration — no instance needed
Webgazer.addRegressionModule('myRidge', MyRidgeRegressor);
```

For end users or runtime registration, the instance method is equivalent:

```typescript
import webgazer from '@webgazer-ts/core';

webgazer.addRegressionModule('myRidge', MyRidgeRegressor);
webgazer.setRegression('myRidge');
```

## Switching Regressors at Runtime

You can switch regressors even while tracking is active. The new regressor will be initialized
immediately and will start collecting its own training data from subsequent clicks:

```typescript
await webgazer.begin(); // Starts with 'ridge' by default

// After some calibration...
webgazer.setRegression('weightedRidge'); // Switch mid-session
```

> **Note:** When switching regressors, the new regressor starts without the previous one's
> training data. Call `webgazer.clearData()` first if you want a clean slate, or implement
> your own `getData()`/`setData()` to transfer state.

## Tips for Better Accuracy

1. **Bias toward click events** — `addData` is called for both `'click'` and `'move'` events. Click events are more intentional; many regressors weight them higher.
2. **Keep the data window small** — Too many old data points can hurt accuracy as the user's position shifts. A window of 300–500 is a good starting point.
3. **Normalize features** — Eye patch pixel values can vary widely with lighting. Normalize to zero mean and unit variance before regression.
4. **Add a Kalman filter** — Raw regression output is noisy. The `KalmanFilter` and `KalmanFilter4D` classes are exported from `@webgazer-ts/core` for you to use directly.

## See Also

- [Kalman Filter Guide](/guide/advanced/kalman-filter)
- [Performance Optimization](/guide/advanced/performance)
- [Architecture](/guide/architecture)
- [API Reference — IRegressor](/api/core/)
