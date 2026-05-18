# Gaze-Driven UI Example

Build interactive UI elements that respond to where the user is looking — without any mouse
or touch input.

## Prerequisites

Make sure eye tracking is active and calibrated before rendering gaze UI:

```tsx
<WebgazerProvider autoStart saveDataAcrossSessions>
  <App />
</WebgazerProvider>
```

## Gaze Cursor

A simple floating dot that follows the user's gaze:

```tsx
import { useGazeTracking } from '@webgazer-ts/react';

export function GazeCursor({ color = '#6366f1', size = 16 }) {
  const { x, y, isTracking } = useGazeTracking();

  if (!isTracking || x === null || y === null) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: size,
        height: size,
        background: `${color}33`,
        border: `2px solid ${color}`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'left 60ms linear, top 60ms linear',
      }}
    />
  );
}
```

## Gaze Button — Dwell to Click

A button that activates after the user looks at it for a configurable duration:

```tsx
import { useRef } from 'react';
import { useGazeElement } from '@webgazer-ts/react';

interface GazeButtonProps {
  label: string;
  onActivate: () => void;
  dwellMs?: number;
}

export function GazeButton({ label, onActivate, dwellMs = 1500 }: GazeButtonProps) {
  const activated = useRef(false);

  const { ref, isLooking, dwellTime } = useGazeElement<HTMLButtonElement>({
    threshold: 40,
    minDwellTime: dwellMs,
    onDwell: () => {
      if (!activated.current) {
        activated.current = true;
        onActivate();
        // Reset after 1 second to allow re-activation
        setTimeout(() => { activated.current = false; }, 1000);
      }
    },
  });

  const progress = Math.min(dwellTime / dwellMs, 1);
  const isActivating = isLooking && progress > 0;

  return (
    <button
      ref={ref}
      style={{
        position: 'relative',
        padding: '14px 28px',
        fontSize: 16,
        border: `2px solid ${isLooking ? '#6366f1' : '#374151'}`,
        borderRadius: 10,
        background: isLooking ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: '#e2e8f0',
        cursor: 'default',
        overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      {label}
      {isActivating && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          transition: 'width 0.1s linear',
        }} />
      )}
    </button>
  );
}

// Usage:
<GazeButton label="Confirm" onActivate={() => alert('Confirmed!')} dwellMs={1200} />
```

## Gaze-Highlighted Card

Cards that visually highlight when looked at:

```tsx
import { useGazeElement } from '@webgazer-ts/react';

function GazeCard({ title, description }: { title: string; description: string }) {
  const { ref, isLooking, dwellTime } = useGazeElement({
    threshold: 20,
    onEnter: () => console.log(`Looking at: ${title}`),
    onLeave: () => console.log(`Left: ${title}`),
  });

  return (
    <div
      ref={ref}
      style={{
        padding: 24,
        borderRadius: 12,
        border: `1px solid ${isLooking ? '#6366f1' : '#2d3152'}`,
        background: isLooking ? 'rgba(99,102,241,0.08)' : '#1a1d27',
        transform: isLooking ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        boxShadow: isLooking ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      <p style={{ margin: 0, color: '#94a3b8' }}>{description}</p>
      {isLooking && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#6366f1' }}>
          Looking for {Math.round(dwellTime / 100) / 10}s
        </div>
      )}
    </div>
  );
}

// Gallery:
function GazeGallery() {
  const items = [
    { title: 'Feature A', description: 'Look at me to highlight.' },
    { title: 'Feature B', description: 'And look here for this one.' },
    { title: 'Feature C', description: 'Gaze-responsive UI!' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {items.map(item => <GazeCard key={item.title} {...item} />)}
    </div>
  );
}
```

## Gaze-Controlled Slider

A slider that moves based on where the user looks horizontally:

```tsx
import { useGazeTracking } from '@webgazer-ts/react';

export function GazeSlider({ min = 0, max = 100, onChange }: {
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}) {
  const { x, isTracking } = useGazeTracking({ throttle: 50 });

  const value = isTracking && x !== null
    ? Math.round(Math.max(min, Math.min(max, (x / window.innerWidth) * (max - min) + min)))
    : min;

  // Fire callback on change
  useEffect(() => {
    onChange?.(value);
  }, [value]);

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{
        width: '100%',
        height: 8,
        background: '#2d3152',
        borderRadius: 99,
        position: 'relative',
      }}>
        <div style={{
          width: `${((value - min) / (max - min)) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: 99,
          transition: 'width 0.05s linear',
        }} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#94a3b8' }}>
        {value}
      </div>
    </div>
  );
}
```

## Gaze-Based Page Scroll

Scroll the page based on vertical gaze position:

```tsx
import { useEffect } from 'react';
import { useGazeTracking } from '@webgazer-ts/react';

export function GazeScroller({ deadZone = 0.15, speed = 8 }) {
  const { y, isTracking } = useGazeTracking({ throttle: 50 });

  useEffect(() => {
    if (!isTracking || y === null) return;

    const normalizedY = y / window.innerHeight; // 0 = top, 1 = bottom
    const deadTop = deadZone;
    const deadBottom = 1 - deadZone;

    let scrollSpeed = 0;
    if (normalizedY < deadTop) {
      // Looking at top → scroll up
      scrollSpeed = -speed * (1 - normalizedY / deadTop);
    } else if (normalizedY > deadBottom) {
      // Looking at bottom → scroll down
      scrollSpeed = speed * ((normalizedY - deadBottom) / deadZone);
    }

    if (scrollSpeed !== 0) {
      window.scrollBy({ top: scrollSpeed, behavior: 'instant' });
    }
  }, [y, isTracking, speed, deadZone]);

  return null; // No UI — this is a pure behavior component
}
```

## Attention Zone Tracker

Track which section of a page the user is focusing on:

```tsx
import { useRef, useState } from 'react';
import { useGazeTracking } from '@webgazer-ts/react';

function useAttentionZone(zoneId: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [gazeTime, setGazeTime] = useState(0);
  const { x, y } = useGazeTracking({ throttle: 100 });
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current || x === null || y === null) return;
    const rect = ref.current.getBoundingClientRect();
    const inZone = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (inZone) {
      startRef.current ??= Date.now();
      setGazeTime(Date.now() - startRef.current);
    } else {
      startRef.current = null;
    }
  }, [x, y]);

  return { ref, gazeTime };
}

function TrackedSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { ref, gazeTime } = useAttentionZone(title);

  return (
    <section ref={ref} style={{ padding: 20, marginBottom: 16 }}>
      <h2>{title} — {(gazeTime / 1000).toFixed(1)}s of attention</h2>
      {children}
    </section>
  );
}
```

## See Also

- [useGazeElement Hook](/guide/react/hooks)
- [useGazeTracking Hook](/guide/react/hooks)
- [Best Practices](/guide/react/best-practices)
- [Full App Example](/examples/react-full-app)
