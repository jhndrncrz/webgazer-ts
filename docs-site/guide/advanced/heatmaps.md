# Heatmaps

Generate heatmap visualizations from gaze data.

## Quick Example

```typescript
import { useGazeHistory } from '@webgazer-ts/react';

function Heatmap() {
  const points = useGazeHistory({ maxPoints: 1000 });
  
  // Render points as heatmap
  return (
    <svg>
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5} fill="red" opacity={0.1} />
      ))}
    </svg>
  );
}
```

## Detailed Guide

Coming soon! Check [Examples](/examples/react-heatmap) for complete heatmap implementations.
