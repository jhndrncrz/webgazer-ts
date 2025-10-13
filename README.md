# Webgazer.ts Monorepo

[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Documentation](https://img.shields.io/badge/docs-online-brightgreen.svg)](https://jhndrncrz.github.io/webgazer-ts/)

Modern TypeScript rewrite of Webgazer.js with React support.

## 📚 Documentation

**[View Full Documentation →](https://jhndrncrz.github.io/webgazer-ts/)**

- 📖 [Getting Started Guide](https://jhndrncrz.github.io/webgazer-ts/guide/getting-started)
- 🔧 [Core API Reference](https://jhndrncrz.github.io/webgazer-ts/api/core/)
- ⚛️ [React API Reference](https://jhndrncrz.github.io/webgazer-ts/api/react/)
- 📝 [Migration Guide](https://jhndrncrz.github.io/webgazer-ts/guide/migration)
- 💡 [Examples](https://jhndrncrz.github.io/webgazer-ts/examples/basic)

## 📦 Packages

This monorepo contains two packages:

- **[@webgazer-ts/core](./packages/core)** - Core eye tracking library (drop-in replacement for webgazer.js)
- **[@webgazer-ts/react](./packages/react)** - React hooks and components

## 🚀 Quick Start

### For Vanilla JS / Drop-in Replacement

```html
<!-- Single file, no external dependencies -->
<script src="webgazer-ts.umd.cjs"></script>
<script>
  window.webgazer
    .setRegression('ridge')
    .setTracker('TFFacemesh')
    .begin();

  webgazer.setGazeListener((data, timestamp) => {
    console.log('Gaze at:', data.x, data.y);
  });
</script>
```

### For React

```bash
npm install @webgazer-ts/react
```

```tsx
import { useWebgazer } from '@webgazer-ts/react';

function App() {
  const { gazeData, start, stop } = useWebgazer({
    autoStart: true,
  });

  return (
    <div>
      {gazeData && <p>Gaze: ({gazeData.x}, {gazeData.y})</p>}
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

## ⚠️ Academic Research Project

**This is developed primarily for academic research and NOT for production use.**

This TypeScript port was created to support modern development workflows and type-safe integration for research projects. **For production applications, consider the official [Webgazer.js](https://github.com/brownhci/Webgazer) library.**

## 📖 Documentation

- [Core Package README](./packages/core/README.md) - API documentation for vanilla JS
- [React Package README](./packages/react/README.md) - React hooks and components
- **[📚 Full Documentation Website](https://jhndrncrz.github.io/webgazer-ts/)** - Complete guides, API reference, and examples
- [CHANGELOG](./CHANGELOG.md) - Version history and release notes

## 🎯 Features

### Core Package
- ✅ 100% API compatible with original Webgazer.js
- ✅ Single file bundle (no external dependencies)
- ✅ Full TypeScript support
- ✅ Self-calibration from clicks and mouse movements
- ✅ Multiple regression models (ridge, ridgeThreaded, ridgeWeighted)
- ✅ TensorFlow.js face mesh tracking
- ✅ Kalman filter for smooth predictions

### React Package
- ✅ `useWebgazer()` - Main tracking hook
- ✅ `useGazeTracking()` - Simplified gaze data hook
- ✅ `<WebgazerProvider>` - Context provider
- ✅ Full TypeScript support
- ✅ Automatic lifecycle management
- ✅ Zero configuration needed

## 🛠️ Development

This is a pnpm workspace monorepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:react

# Development mode (watch)
pnpm dev          # Core package
pnpm dev:react    # React package
```

## 📁 Project Structure

```
webgazer-ts/
├── packages/
│   ├── core/              # @webgazer-ts/core
│   │   ├── src/           # Source code
│   │   ├── dist/          # Built files
│   │   └── package.json
│   └── react/             # @webgazer-ts/react
│       ├── src/           # React hooks and components
│       ├── dist/          # Built files
│       └── package.json
├── examples/              # Example demos
├── docs/                  # Documentation
└── pnpm-workspace.yaml    # Workspace configuration
```

## 🤝 Credits

Based on [Webgazer.js](https://webgazer.cs.brown.edu) by Brown HCI.

**Original Webgazer.js Team:**
- Alexandra Papoutsaki
- James Laskey
- Jeff Huang

## 📄 License

GPL-3.0-or-later

See [LICENSE.md](LICENSE.md) for details.

## 🔗 Links

- [Original Webgazer.js](https://webgazer.cs.brown.edu)
- [Webgazer.js Paper](http://www.cs.brown.edu/~jph/files/webgazer_ijcai2016.pdf)
- [TensorFlow.js](https://www.tensorflow.org/js)

---

Made with ❤️ for academic research
pnpm add webgazer-ts
```

### Basic Usage

#### ES Modules (Recommended)

```typescript
import webgazer from 'webgazer-ts';

// Initialize
await webgazer
  .setTracker('TFFacemesh')
  .setRegression('ridge')
  .begin();

// Enable calibration from mouse movements
webgazer.addMouseEventListeners();

// Get gaze predictions
webgazer.setGazeListener((data, timestamp) => {
  if (data) {
    console.log(`Gaze at (${data.x}, ${data.y})`);
  }
});
```

#### CommonJS

```javascript
const webgazer = require('webgazer-ts').default;

// Same API as above
```

#### Browser (UMD)

```html
<script src="node_modules/webgazer-ts/dist/webgazer-ts.umd.cjs"></script>
<script>
  // Available as global 'webgazer'
  webgazer.begin();
</script>
```

### TypeScript Support

Full TypeScript definitions are included:

```typescript
import webgazer, { 
  GazePrediction, 
  CalibrationResult,
  Point2D 
} from 'webgazer-ts';

// All types are available
webgazer.setGazeListener((data: GazePrediction | null, timestamp: number) => {
  if (data) {
    const point: Point2D = { x: data.x, y: data.y };
    console.log(point);
  }
});
```

### Development

For local development:

```bash
# Clone the repository
git clone <your-repo-url>
cd webgazer-ts

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## Browser Support

**Requirements:**
- HTTPS or localhost (required for camera access)
- Modern browser with WebRTC support
- User permission for webcam access

**Tested on:**
- Google Chrome (recommended)
- Microsoft Edge
- Mozilla Firefox
- Safari
- Opera

---

## Examples

The `/examples` directory contains:
- `minimal-example.html` - Basic setup
- `calibration-demo.html` - Interactive calibration
- `index.html` - Full-featured demo

---

## Project Structure

```
src/
├── core/              # Core Webgazer class
├── trackers/          # Face/eye tracking
├── regressors/        # Gaze prediction
├── rendering/         # Video and overlay rendering
├── calibration/       # Calibration system
├── events/            # Event handling
├── utils/             # Utilities
└── types/             # TypeScript definitions
```

---

## Credits

**This project is built upon the groundbreaking work of the Webgazer.js team at Brown University.**

### Original Webgazer.js
- **Website:** https://webgazer.cs.brown.edu
- **Repository:** https://github.com/brownhci/Webgazer
- **License:** GPL-3.0 (with LGPL-3.0 option for startups)

### Original Authors
- Alexandra Papoutsaki (creator)
- Aaron Gokaslan
- Jeff Huang (maintainer)
- James Tompkin
- And the entire [Brown HCI team](https://webgazer.cs.brown.edu)

**All credit for the core methodology and algorithms belongs to the original team.**

---

## Publications

Please cite the original Webgazer.js publications:

```bibtex
@inproceedings{papoutsaki2016webgazer,
  author     = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey and Nediyana Daskalova and Jeff Huang and James Hays},
  title      = {{Webgazer}: Scalable Webcam Eye Tracking Using User Interactions},
  booktitle  = {Proceedings of the 25th International Joint Conference on Artificial Intelligence (IJCAI)},
  pages      = {3839--3845},
  year       = {2016}
}
```

Full publication list: https://webgazer.cs.brown.edu/#publications

---

## License

**Webgazer-TS:** GPL-3.0-or-later  
**Original Webgazer.js:** GPL-3.0 (LGPL-3.0 for companies valued under $1M)

For commercial licensing of the original Webgazer.js: webgazer@lists.cs.brown.edu

---

## Disclaimer

This is an academic research project. While the regression mathematics have been verified against the original implementation, this code has not undergone the same testing as the production Webgazer.js library.

**Use at your own risk. For production use, choose the official [Webgazer.js](https://github.com/brownhci/Webgazer).**

---

**Built with respect for the original [Webgazer.js](https://webgazer.cs.brown.edu) team** ❤️