# Webgazer React Demo

A minimal React application demonstrating Webgazer.ts eye tracking with automatic calibration.

## Features

- ✨ **Automatic Calibration** - No manual setup required
- 🎯 **Real-time Gaze Tracking** - See where you're looking
- 📊 **Live Statistics** - Track calibration points and gaze position
- 🎨 **Modern UI** - Beautiful gradient design with glassmorphism effects
- 🔄 **Continuous Learning** - Model improves with every click

## Getting Started

### Prerequisites

- Node.js 18+ (or compatible runtime)
- pnpm (or npm/yarn)

### Installation

From the repository root:

```bash
# Install dependencies for the entire monorepo
pnpm install
```

### Running the Demo

```bash
# From the examples/react-demo directory
cd examples/react-demo
pnpm dev

# Or from the repository root
pnpm --filter webgazer-react-demo dev
```

The demo will open at `http://localhost:3000`

### Building for Production

```bash
# Build the demo
pnpm build

# Preview the production build
pnpm preview
```

## How It Works

### Automatic Calibration

This demo showcases Webgazer's **automatic calibration** feature:

```typescript
// That's all you need!
const { gazeData, isRunning, start, stop } = useWebgazer({
  autoStart: false
});

// When you call start(), calibration begins automatically
await start();

// Now every click trains the model - no manual setup!
```

### Key Concepts

1. **Calibration starts automatically** - When `begin()` is called, `addMouseEventListeners()` is automatically invoked (matches original Webgazer API)

2. **Continuous learning** - Every click throughout the session improves the model

3. **No "calibration complete"** - The model learns forever, getting more accurate over time

4. **Natural interaction** - Users don't need special calibration screens - just normal clicking works!

## Code Structure

```
react-demo/
├── src/
│   ├── App.tsx          # Main demo component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite configuration
```

## Using Webgazer in Your React App

### Basic Usage

```typescript
import { useWebgazer } from '@webgazer-ts/react';

function MyComponent() {
  const { gazeData, isRunning, start, stop } = useWebgazer();

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      {gazeData && (
        <p>Looking at: ({gazeData.x}, {gazeData.y})</p>
      )}
    </div>
  );
}
```

### With Calibration Count

```typescript
const { calibrationCount } = useWebgazer();

// calibrationCount automatically updates as user clicks
<p>Calibration points: {calibrationCount}</p>
```

### Configuration Options

```typescript
const { ... } = useWebgazer({
  autoStart: true,              // Start automatically on mount
  saveDataAcrossSessions: true, // Persist calibration data
  showVideo: true,              // Show webcam preview
  showFaceOverlay: true,        // Show face mesh overlay
  showGazeDot: false,          // Show gaze position dot
});
```

## Learn More

- **Core Library**: `../../packages/core/README.md`
- **React Package**: `../../packages/react/README.md`
- **Calibration Guide**: `../../CALIBRATION_EXPLAINED.md`
- **API Compatibility**: `../../API_COMPATIBILITY.md`

## Troubleshooting

### Camera Permission Denied

Make sure to allow camera access when prompted by the browser. If denied, check your browser settings.

### Build Errors

```bash
# Clean and reinstall dependencies
pnpm clean
pnpm install
```

### Module Not Found

Make sure you've built the core and react packages first:

```bash
# From repository root
pnpm -r build
```

## License

Same as the main Webgazer.ts project - see root LICENSE.md
