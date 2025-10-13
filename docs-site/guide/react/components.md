# React Components

Pre-built React components for common eye tracking use cases.

## WebgazerProvider

Root provider component (required).

```tsx
import { WebgazerProvider } from '@webgazer-ts/react';

<WebgazerProvider
  config={{
    saveDataAcrossSessions: false,
    showVideo: true,
    showFaceOverlay: true
  }}
  autoStart={false}
>
  <App />
</WebgazerProvider>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `WebgazerConfig` | `{}` | Webgazer configuration |
| `autoStart` | `boolean` | `false` | Start tracking automatically |
| `children` | `ReactNode` | required | Child components |

## GazeCursor

Visual cursor that follows user's gaze.

```tsx
import { GazeCursor } from '@webgazer-ts/react';

<GazeCursor
  size={20}
  color="red"
  opacity={0.7}
  showTrail={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `10` | Cursor size (px) |
| `color` | `string` | `'red'` | Cursor color |
| `opacity` | `number` | `0.5` | Cursor opacity |
| `showTrail` | `boolean` | `false` | Show gaze trail |
| `trailLength` | `number` | `10` | Trail length (points) |

## CalibrationScreen

Full-screen calibration UI.

```tsx
import { CalibrationScreen } from '@webgazer-ts/react';

function App() {
  const [showCalibration, setShowCalibration] = useState(true);

  return (
    <>
      {showCalibration && (
        <CalibrationScreen
          pointCount={9}
          onComplete={(accuracy) => {
            console.log('Calibration done:', accuracy);
            setShowCalibration(false);
          }}
          onSkip={() => setShowCalibration(false)}
        />
      )}
      <YourApp />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pointCount` | `5 \| 9 \| 13` | `9` | Number of calibration points |
| `animated` | `boolean` | `true` | Animate calibration points |
| `validateAfter` | `boolean` | `true` | Validate accuracy after calibration |
| `onComplete` | `(accuracy: number) => void` | - | Called when calibration completes |
| `onSkip` | `() => void` | - | Called when user skips |

## GazeOverlay

Debug overlay showing gaze information.

```tsx
import { GazeOverlay } from '@webgazer-ts/react';

<GazeOverlay
  showCoordinates={true}
  showFPS={true}
  showAccuracy={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCoordinates` | `boolean` | `true` | Show gaze coordinates |
| `showFPS` | `boolean` | `true` | Show FPS |
| `showAccuracy` | `boolean` | `true` | Show accuracy |
| `showFaceStatus` | `boolean` | `true` | Show face detection status |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-left'` | Overlay position |

## Component Examples

### Simple Gaze-Aware Button

```tsx
import { useGazeElement } from '@webgazer-ts/react';

function GazeButton({ onClick, children }) {
  const { ref, isGazedAt } = useGazeElement({
    dwellThreshold: 1000,
    onDwell: onClick
  });

  return (
    <button
      ref={ref}
      className={isGazedAt ? 'gaze-active' : ''}
    >
      {children}
    </button>
  );
}
```

### Gaze-Controlled Carousel

```tsx
function GazeCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { ref: prevRef } = useGazeElement({
    dwellThreshold: 1500,
    onDwell: () => setCurrentIndex(i => Math.max(0, i - 1))
  });
  
  const { ref: nextRef } = useGazeElement({
    dwellThreshold: 1500,
    onDwell: () => setCurrentIndex(i => Math.min(items.length - 1, i + 1))
  });

  return (
    <div className="carousel">
      <button ref={prevRef}>←</button>
      <div>{items[currentIndex]}</div>
      <button ref={nextRef}>→</button>
    </div>
  );
}
```

### Gaze Heatmap Visualization

```tsx
import { useGazeHistory } from '@webgazer-ts/react';

function GazeHeatmap() {
  const points = useGazeHistory({ maxPoints: 500 });

  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={5}
          fill="red"
          opacity={0.1}
        />
      ))}
    </svg>
  );
}
```

### Auto-Scroll Based on Gaze

```tsx
function AutoScrollContent() {
  const { y } = useGazeTracking();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const scrollZoneHeight = 100;
    const windowHeight = window.innerHeight;

    if (y < scrollZoneHeight) {
      // Scroll up
      window.scrollBy(0, -5);
    } else if (y > windowHeight - scrollZoneHeight) {
      // Scroll down
      window.scrollBy(0, 5);
    }
  }, [y]);

  return <div ref={contentRef}>{/* Your content */}</div>;
}
```

## Styling Components

All components accept `className` and `style` props:

```tsx
<GazeCursor
  className="my-custom-cursor"
  style={{
    border: '2px solid white',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
  }}
/>
```

```css
.my-custom-cursor {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

## Next Steps

- [Best Practices](/guide/react/best-practices) - Optimization and patterns
- [Examples](/examples/react-basic) - Complete examples
- [API Reference](/api/react/) - Full component API
