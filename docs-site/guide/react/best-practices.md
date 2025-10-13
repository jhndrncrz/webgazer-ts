# React Best Practices

Optimization tips and patterns for using Webgazer.ts with React.

## Performance Optimization

### 1. Throttle Gaze Updates

Prevent excessive re-renders:

```tsx
import { useGazeTracking } from '@webgazer-ts/react';

function OptimizedComponent() {
  const { x, y } = useGazeTracking({
    throttleMs: 100 // Update only every 100ms
  });

  // Component only re-renders 10 times per second max
  return <div>Gaze: ({x}, {y})</div>;
}
```

### 2. Memoize Expensive Calculations

```tsx
import { useMemo } from 'react';
import { useGazeTracking } from '@webgazer-ts/react';

function HeatmapComponent() {
  const points = useGazeHistory({ maxPoints: 1000 });

  const heatmapData = useMemo(() => {
    // Expensive heatmap calculation
    return generateHeatmap(points);
  }, [points]);

  return <HeatmapVisualization data={heatmapData} />;
}
```

### 3. Conditional Tracking

Only track when needed:

```tsx
function ConditionalTracking() {
  const [needsTracking, setNeedsTracking] = useState(false);

  const { x, y } = useGazeTracking({
    enabled: needsTracking // Only track when enabled
  });

  return (
    <div>
      <button onClick={() => setNeedsTracking(!needsTracking)}>
        {needsTracking ? 'Stop' : 'Start'} Tracking
      </button>
      {needsTracking && <GazeCursor />}
    </div>
  );
}
```

## State Management

### Lift State Up

Share Webgazer state across components:

```tsx
function App() {
  const webgazer = useWebgazer();

  return (
    <div>
      <Header webgazer={webgazer} />
      <Content webgazer={webgazer} />
      <Footer webgazer={webgazer} />
    </div>
  );
}
```

### Use Context for Global State

```tsx
import { createContext, useContext } from 'react';

const GazeContext = createContext(null);

function GazeProvider({ children }) {
  const gaze = useGazeTracking();

  return (
    <GazeContext.Provider value={gaze}>
      {children}
    </GazeContext.Provider>
  );
}

function useGaze() {
  return useContext(GazeContext);
}

// Usage
function MyComponent() {
  const { x, y } = useGaze();
  return <div>Gaze: ({x}, {y})</div>;
}
```

## Error Handling

### Graceful Degradation

```tsx
function RobustGazeComponent() {
  const [error, setError] = useState<string | null>(null);
  const { begin, isReady } = useWebgazer();

  const handleStart = async () => {
    try {
      await begin();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found');
      } else {
        setError('Failed to start eye tracking');
      }
    }
  };

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return (
    <button onClick={handleStart} disabled={isReady}>
      Start Tracking
    </button>
  );
}
```

### Fallback UI

```tsx
function GazeAwareUI() {
  const { isReady } = useWebgazer();

  if (!isReady) {
    // Fallback to click-based interaction
    return <ClickableUI />;
  }

  return <GazeControlledUI />;
}
```

## Lifecycle Management

### Cleanup on Unmount

```tsx
function ComponentWithCleanup() {
  const { end } = useWebgazer();

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      end();
    };
  }, [end]);

  return <div>Tracking active</div>;
}
```

### Pause/Resume on Visibility

```tsx
function VisibilityAwareTracking() {
  const { pause, resume } = useWebgazer();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pause();
      } else {
        resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pause, resume]);

  return <div>Pauses when tab is hidden</div>;
}
```

## Testing

### Mock Webgazer in Tests

```tsx
// __mocks__/@webgazer-ts/react.ts
export const useWebgazer = () => ({
  webgazer: {},
  isReady: true,
  begin: jest.fn(),
  end: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn()
});

export const useGazeTracking = () => ({
  x: 500,
  y: 300,
  isTracking: true
});

export const WebgazerProvider = ({ children }) => children;
```

### Test Component with Mock

```tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@webgazer-ts/react');

test('renders gaze coordinates', () => {
  render(<GazeDisplay />);
  expect(screen.getByText(/Gaze: \(500, 300\)/)).toBeInTheDocument();
});
```

## TypeScript Patterns

### Typed Props

```tsx
import type { GazePrediction } from '@webgazer-ts/core';

interface GazeDisplayProps {
  showCoordinates?: boolean;
  onGazeUpdate?: (prediction: GazePrediction) => void;
}

function GazeDisplay({ showCoordinates = true, onGazeUpdate }: GazeDisplayProps) {
  const { x, y } = useGazeTracking();

  useEffect(() => {
    if (x !== null && y !== null && onGazeUpdate) {
      onGazeUpdate({ x, y, eyeFeatures: null });
    }
  }, [x, y, onGazeUpdate]);

  if (!showCoordinates) return null;

  return <div>Gaze: ({x}, {y})</div>;
}
```

### Generic Gaze Component

```tsx
interface GazeElementProps<T extends HTMLElement = HTMLDivElement> {
  children: React.ReactNode;
  onGazeEnter?: () => void;
  onGazeLeave?: () => void;
  className?: string;
}

function GazeElement<T extends HTMLElement>({
  children,
  onGazeEnter,
  onGazeLeave,
  className
}: GazeElementProps<T>) {
  const { ref, isGazedAt } = useGazeElement({
    onGazeEnter,
    onGazeLeave
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

## Accessibility

### Keyboard Fallback

```tsx
function AccessibleGazeButton({ onClick, children }) {
  const { ref, isGazedAt } = useGazeElement({
    dwellThreshold: 1500,
    onDwell: onClick
  });

  return (
    <button
      ref={ref}
      onClick={onClick} // Keyboard/mouse fallback
      className={isGazedAt ? 'gaze-active' : ''}
      aria-pressed={isGazedAt}
    >
      {children}
      {isGazedAt && <span className="sr-only">Looking</span>}
    </button>
  );
}
```

### Screen Reader Announcements

```tsx
function GazeStatus() {
  const { isReady, isFaceDetected } = useWebgazerState();

  return (
    <div role="status" aria-live="polite">
      {isReady && !isFaceDetected && (
        <span className="sr-only">
          Face not detected. Please position yourself in front of the camera.
        </span>
      )}
    </div>
  );
}
```

## Common Patterns

### Loading State

```tsx
function App() {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const { isReady, begin } = useWebgazer();

  const handleInit = async () => {
    await begin();
    setIsCalibrating(true);
  };

  if (!isReady && !isCalibrating) {
    return <LoadingScreen onStart={handleInit} />;
  }

  if (isCalibrating) {
    return (
      <CalibrationScreen
        onComplete={() => setIsCalibrating(false)}
      />
    );
  }

  return <MainApp />;
}
```

### Gaze-Based Navigation

```tsx
import { useRouter } from 'next/router';

function GazeNav() {
  const router = useRouter();

  const { ref: homeRef } = useGazeElement({
    dwellThreshold: 2000,
    onDwell: () => router.push('/')
  });

  const { ref: aboutRef } = useGazeElement({
    dwellThreshold: 2000,
    onDwell: () => router.push('/about')
  });

  return (
    <nav>
      <a ref={homeRef} href="/">Home</a>
      <a ref={aboutRef} href="/about">About</a>
    </nav>
  );
}
```

## Next Steps

- [Examples](/examples/react-basic) - See complete examples
- [Advanced Guide](/guide/advanced/performance) - Deep optimization
- [API Reference](/api/react/) - Full API documentation
