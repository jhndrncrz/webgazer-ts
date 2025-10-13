# Calibration

Calibration is essential for accurate gaze tracking. This guide covers calibration strategies and best practices.

## Why Calibration?

Eye tracking accuracy depends on:
- Individual eye characteristics
- Screen distance and angle
- Lighting conditions
- Camera quality

Calibration personalizes the model for each user's unique setup.

## Basic Calibration

### Manual Click Calibration

The simplest approach - user clicks calibration points:

```typescript
import webgazer from '@webgazer-ts/core';

await webgazer.begin();

// Show calibration points
const points = [
  { x: 100, y: 100 },   // Top-left
  { x: window.innerWidth / 2, y: 100 }, // Top-center
  { x: window.innerWidth - 100, y: 100 }, // Top-right
  { x: 100, y: window.innerHeight / 2 }, // Middle-left
  { x: window.innerWidth / 2, y: window.innerHeight / 2 }, // Center
  { x: window.innerWidth - 100, y: window.innerHeight / 2 }, // Middle-right
  { x: 100, y: window.innerHeight - 100 }, // Bottom-left
  { x: window.innerWidth / 2, y: window.innerHeight - 100 }, // Bottom-center
  { x: window.innerWidth - 100, y: window.innerHeight - 100 } // Bottom-right
];

points.forEach((point, index) => {
  const dot = document.createElement('div');
  dot.className = 'calibration-point';
  dot.style.left = `${point.x}px`;
  dot.style.top = `${point.y}px`;
  
  dot.addEventListener('click', async (e) => {
    // Record calibration point
    await webgazer.recordScreenPosition(e.clientX, e.clientY);
    dot.classList.add('calibrated');
    
    // Remove after calibration
    setTimeout(() => dot.remove(), 200);
  });
  
  document.body.appendChild(dot);
});
```

```css
.calibration-point {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.2s;
  box-shadow: 0 0 0 5px rgba(255, 107, 107, 0.2);
}

.calibration-point:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.calibration-point.calibrated {
  background: #51cf66;
  transform: translate(-50%, -50%) scale(1.5);
}
```

## Advanced Calibration

### Animated Calibration

Guide user's attention with animations:

```typescript
async function animatedCalibration(points: Array<{x: number, y: number}>) {
  for (const point of points) {
    await showCalibrationPoint(point.x, point.y);
  }
}

function showCalibrationPoint(x: number, y: number): Promise<void> {
  return new Promise((resolve) => {
    const dot = document.createElement('div');
    dot.className = 'animated-calibration-point';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    
    document.body.appendChild(dot);
    
    // Animate in
    setTimeout(() => dot.classList.add('active'), 50);
    
    // Auto-record after animation
    setTimeout(async () => {
      await webgazer.recordScreenPosition(x, y);
      dot.classList.add('recorded');
      
      // Remove and continue
      setTimeout(() => {
        dot.remove();
        resolve();
      }, 300);
    }, 2000); // 2 seconds to look at point
  });
}
```

```css
.animated-calibration-point {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff6b6b 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease-out;
  pointer-events: none;
  animation: pulse 1.5s infinite;
}

.animated-calibration-point.active {
  transform: translate(-50%, -50%) scale(1);
}

.animated-calibration-point.recorded {
  background: radial-gradient(circle, #51cf66 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(1.5);
  opacity: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Validation After Calibration

Check calibration accuracy:

```typescript
async function validateCalibration() {
  const validationPoints = [
    { x: window.innerWidth * 0.25, y: window.innerHeight * 0.25 },
    { x: window.innerWidth * 0.75, y: window.innerHeight * 0.25 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
    { x: window.innerWidth * 0.25, y: window.innerHeight * 0.75 },
    { x: window.innerWidth * 0.75, y: window.innerHeight * 0.75 }
  ];
  
  let totalError = 0;
  let samples = 0;
  
  for (const point of validationPoints) {
    // Show validation point
    const dot = showValidationPoint(point.x, point.y);
    
    // Collect predictions while user looks at point
    await new Promise(resolve => {
      const collectStart = Date.now();
      const duration = 2000; // 2 seconds
      
      const listener = (data: GazePrediction | null) => {
        if (data && Date.now() - collectStart < duration) {
          const error = Math.sqrt(
            Math.pow(data.x - point.x, 2) + 
            Math.pow(data.y - point.y, 2)
          );
          totalError += error;
          samples++;
        }
        
        if (Date.now() - collectStart >= duration) {
          webgazer.removeGazeListener(listener);
          dot.remove();
          resolve(null);
        }
      };
      
      webgazer.setGazeListener(listener);
    });
  }
  
  const avgError = samples > 0 ? totalError / samples : 0;
  return avgError;
}

async function checkCalibrationQuality() {
  const error = await validateCalibration();
  
  if (error < 50) {
    console.log('✅ Excellent calibration!');
  } else if (error < 100) {
    console.log('⚠️ Good calibration, but could be better');
  } else {
    console.log('❌ Poor calibration - please recalibrate');
  }
  
  return error;
}
```

## Calibration Strategies

### 9-Point Grid (Recommended)

```typescript
function get9PointGrid(): Array<{x: number, y: number}> {
  const margin = 100;
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  return [
    { x: margin, y: margin },
    { x: w / 2, y: margin },
    { x: w - margin, y: margin },
    { x: margin, y: h / 2 },
    { x: w / 2, y: h / 2 },
    { x: w - margin, y: h / 2 },
    { x: margin, y: h - margin },
    { x: w / 2, y: h - margin },
    { x: w - margin, y: h - margin }
  ];
}
```

### 5-Point Quick Calibration

```typescript
function get5PointGrid(): Array<{x: number, y: number}> {
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  return [
    { x: w * 0.1, y: h * 0.1 },
    { x: w * 0.9, y: h * 0.1 },
    { x: w * 0.5, y: h * 0.5 },
    { x: w * 0.1, y: h * 0.9 },
    { x: w * 0.9, y: h * 0.9 }
  ];
}
```

### 13-Point High Accuracy

```typescript
function get13PointGrid(): Array<{x: number, y: number}> {
  // Add more points for better accuracy
  const basic9 = get9PointGrid();
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  return [
    ...basic9,
    { x: w * 0.25, y: h * 0.25 },
    { x: w * 0.75, y: h * 0.25 },
    { x: w * 0.25, y: h * 0.75 },
    { x: w * 0.75, y: h * 0.75 }
  ];
}
```

## Best Practices

### 1. Clear Instructions

```typescript
function showCalibrationInstructions() {
  const instructions = `
    <div class="calibration-instructions">
      <h2>Calibration</h2>
      <p>Please follow these steps:</p>
      <ol>
        <li>Sit comfortably at your usual distance from the screen</li>
        <li>Look at each red dot as it appears</li>
        <li>Click each dot when you're looking at it</li>
        <li>Keep your head still during calibration</li>
      </ol>
      <button id="start-calibration">Start Calibration</button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', instructions);
  
  document.getElementById('start-calibration')?.addEventListener('click', async () => {
    document.querySelector('.calibration-instructions')?.remove();
    await runCalibration();
  });
}
```

### 2. Progress Indicator

```typescript
function showCalibrationProgress(current: number, total: number) {
  const progress = (current / total) * 100;
  const bar = document.getElementById('calibration-progress');
  
  if (bar) {
    bar.style.width = `${progress}%`;
    bar.textContent = `${current} / ${total}`;
  }
}
```

### 3. Recalibration

Allow users to recalibrate:

```typescript
// Clear existing calibration
webgazer.clearData();

// Start fresh calibration
await runCalibration();
```

### 4. Partial Recalibration

Add more calibration points without clearing:

```typescript
// Add calibration points to existing model
async function addCalibrationPoints(points: Array<{x: number, y: number}>) {
  for (const point of points) {
    await webgazer.recordScreenPosition(point.x, point.y);
  }
}

// Recalibrate problematic areas
addCalibrationPoints([
  { x: window.innerWidth / 2, y: window.innerHeight / 2 } // Recalibrate center
]);
```

## Complete Calibration Component

```typescript
class CalibrationManager {
  private points: Array<{x: number, y: number}> = [];
  private currentIndex = 0;
  
  async start(pointCount: number = 9) {
    this.points = this.generatePoints(pointCount);
    this.currentIndex = 0;
    
    await this.showNextPoint();
  }
  
  private generatePoints(count: number): Array<{x: number, y: number}> {
    if (count === 5) return get5PointGrid();
    if (count === 9) return get9PointGrid();
    if (count === 13) return get13PointGrid();
    return get9PointGrid();
  }
  
  private async showNextPoint() {
    if (this.currentIndex >= this.points.length) {
      await this.finish();
      return;
    }
    
    const point = this.points[this.currentIndex];
    await showCalibrationPoint(point.x, point.y);
    
    this.currentIndex++;
    await this.showNextPoint();
  }
  
  private async finish() {
    const accuracy = await validateCalibration();
    
    if (accuracy < 100) {
      alert(`Calibration complete! Average error: ${accuracy.toFixed(0)}px`);
    } else {
      const retry = confirm(`Calibration accuracy is low (${accuracy.toFixed(0)}px). Retry?`);
      if (retry) {
        webgazer.clearData();
        await this.start();
      }
    }
  }
}

// Usage
const calibration = new CalibrationManager();
await calibration.start(9);
```

## Troubleshooting

### Low Accuracy

1. **Increase calibration points** - Use 13-point grid
2. **Better lighting** - Ensure face is well-lit
3. **Stable head position** - Use head rest or maintain position
4. **Screen distance** - 50-70cm is optimal

### Drift Over Time

```typescript
// Periodic recalibration
setInterval(async () => {
  const shouldRecalibrate = confirm('Recalibrate for better accuracy?');
  if (shouldRecalibrate) {
    await calibration.start(5); // Quick 5-point recalibration
  }
}, 5 * 60 * 1000); // Every 5 minutes
```

## Next Steps

- [Data Persistence](/guide/core/data-persistence) - Save calibration data
- [Configuration](/guide/core/configuration) - Optimize settings
- [Examples](/examples/calibration) - See complete examples
- [API Reference](/api/core/) - Calibration API details
