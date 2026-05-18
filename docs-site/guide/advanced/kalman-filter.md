# Kalman Filter

Understanding, configuring, and tuning the Kalman filter for gaze predictions.

## Why a Kalman Filter?

Raw gaze predictions from ridge regression are noisy — they jump around by tens of pixels
even when your eyes are perfectly still. This happens because:

1. **Measurement noise** — camera resolution and TensorFlow.js landmark precision have limits
2. **Prediction noise** — regression estimates from a small dataset have inherent variance
3. **Biological jitter** — eyes naturally make tiny movements (microsaccades) even during fixation

A Kalman filter is the optimal linear estimator for this kind of noisy signal. It maintains
an internal *belief* about the current gaze position and blends new measurements with that
belief using a mathematically optimal weighting.

## How It Works

Webgazer-TS uses two Kalman filter implementations:

### `KalmanFilter` (2D, per-axis)

A simple 1D filter applied independently to X and Y. Each axis runs this update cycle every frame:

```
Prediction step:
  x̂(k|k-1) = x̂(k-1|k-1)          [state stays the same — no motion model]
  P(k|k-1)  = P(k-1|k-1) + Q       [uncertainty grows with process noise Q]

Update step:
  K(k) = P(k|k-1) / (P(k|k-1) + R) [Kalman gain — how much to trust measurement]
  x̂(k) = x̂(k|k-1) + K(k) * (z - x̂(k|k-1))  [blend estimate with measurement]
  P(k) = (1 - K(k)) * P(k|k-1)                [update uncertainty]
```

Where **Q** is process noise, **R** is measurement noise, and **K** is the Kalman gain (0–1).

### `KalmanFilter4D` (state space: x, y, ẋ, ẏ)

A constant-velocity Kalman filter that models gaze as having both position *and* velocity.
This is what the built-in ridge regressors use internally — it handles fast eye movements
more gracefully by predicting where the gaze is heading.

## Enabling / Disabling

```typescript
// Enable (default: true)
webgazer.applyKalmanFilter(true);

// Disable — use raw regression output
webgazer.applyKalmanFilter(false);
```

In React:
```tsx
const { applyKalmanFilter } = useWebgazer();

// Toggle
applyKalmanFilter(true);
```

Via options:
```tsx
const webgazer = useWebgazer({ applyKalmanFilter: true });
```

## Tuning Parameters

The `KalmanFilter` constructor accepts a config object:

```typescript
import { KalmanFilter } from '@webgazer-ts/core/utils/filters/KalmanFilter';

const filter = new KalmanFilter({
  processNoise: 1,         // Q — how much the true state can change per frame
  measurementNoise: 25,    // R — how noisy the raw measurement is
  errorCovariance: 100,    // P₀ — initial uncertainty (higher = faster to first lock)
});
```

### Understanding the Parameters

| Parameter | Symbol | Default | Effect of increasing |
|-----------|--------|---------|---------------------|
| `processNoise` | Q | `1` | Filter trusts motion more → less lag, but more jitter |
| `measurementNoise` | R | `25` | Filter trusts measurement less → smoother, but more lag |
| `errorCovariance` | P₀ | `100` | Higher initial uncertainty → faster convergence at start |

### Practical Tuning Guide

**More responsive (less lag, more jitter):**
```typescript
{ processNoise: 5, measurementNoise: 10 }
```

**Smoother (more lag, less jitter):**
```typescript
{ processNoise: 0.5, measurementNoise: 50 }
```

**Balanced (default):**
```typescript
{ processNoise: 1, measurementNoise: 25 }
```

> **Rule of thumb:** The Kalman gain `K = Q / (Q + R)`. When `Q >> R`, K → 1 (trust measurements fully). When `R >> Q`, K → 0 (mostly ignore new measurements).

## The Internal `KalmanFilter4D`

The ridge regressors use `KalmanFilter4D` internally with these defaults:

```typescript
{
  measurementNoise: 25.0,         // How noisy the regression prediction is
  initialErrorCovariance: 0.0001, // Very tight initial uncertainty
  deltaTime: 0.1,                 // Assumed ~10 frames/s prediction rate
}
```

You cannot currently configure `KalmanFilter4D` through the public API — it is wired
internally in each regressor's `initialize()` method. To use custom parameters, write
a [custom regressor](/guide/advanced/custom-regression) that calls `KalmanFilter4D` directly.

## Using `KalmanFilter` Directly

You can use the filter independently of Webgazer, for example to smooth data from another source:

```typescript
import { KalmanFilter } from '@webgazer-ts/core/utils/filters/KalmanFilter';

const filter = new KalmanFilter({ processNoise: 1, measurementNoise: 25 });

function onRawGaze(rawX: number, rawY: number) {
  const [smoothX, smoothY] = filter.update([rawX, rawY]);
  console.log(`Smoothed: (${smoothX.toFixed(1)}, ${smoothY.toFixed(1)})`);
}

// Inspect filter state
const state = filter.getState();
console.log(state.x.estimate, state.x.errorCovariance);

// Reset if the user moves significantly
filter.reset();
```

## When to Disable the Filter

- **Accuracy measurement** — when computing ground-truth error against known targets, disable
  the filter so you're measuring regression accuracy, not filter lag.
- **Very slow eye movements** — if your app only tracks deliberate, slow gaze shifts (e.g. reading a menu), the filter's lag cost is low and benefit is high.
- **Custom smoothing** — if you implement your own temporal smoothing (e.g. exponential moving average), disable the built-in filter to avoid double-smoothing.

## See Also

- [Performance Optimization](/guide/advanced/performance)
- [Custom Regression](/guide/advanced/custom-regression)
- [Configuration Reference](/guide/core/configuration)
- [API Reference — KalmanFilter](/api/core/)
