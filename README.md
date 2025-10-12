# WebGazer-TS

> A modern TypeScript rewrite of [WebGazer.js](https://webgazer.cs.brown.edu) for academic research purposes.

[![Original Project](https://img.shields.io/badge/Original-WebGazer.js-blue)](https://github.com/brownhci/WebGazer)
[![License](https://img.shields.io/badge/License-GPL--3.0-green.svg)](LICENSE.md)

---

## ⚠️ Academic Research Project

**This is developed primarily for our thesis project and NOT for production use.**

This TypeScript port was created to support modern development workflows and type-safe integration for our thesis project. **For production applications, use the official [WebGazer.js](https://github.com/brownhci/WebGazer) library.**

---

## About

WebGazer-TS is a webcam-based eye tracking library that predicts where users are looking on a web page in real-time. It self-calibrates by learning from user interactions without requiring special hardware.

**Key Features:**
- Real-time gaze prediction using webcam
- Self-calibration from clicks and cursor movements
- No video data sent to servers (runs entirely in browser)
- Full TypeScript type safety
- 100% API compatible with original WebGazer.js

---

## Quick Start

### Installation

```bash
npm install webgazer-ts
```

Or with yarn:
```bash
yarn add webgazer-ts
```

Or with pnpm:
```bash
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
├── core/              # Core WebGazer class
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

**This project is built upon the groundbreaking work of the WebGazer.js team at Brown University.**

### Original WebGazer.js
- **Website:** https://webgazer.cs.brown.edu
- **Repository:** https://github.com/brownhci/WebGazer
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

Please cite the original WebGazer.js publications:

```bibtex
@inproceedings{papoutsaki2016webgazer,
  author     = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey and Nediyana Daskalova and Jeff Huang and James Hays},
  title      = {{WebGazer}: Scalable Webcam Eye Tracking Using User Interactions},
  booktitle  = {Proceedings of the 25th International Joint Conference on Artificial Intelligence (IJCAI)},
  pages      = {3839--3845},
  year       = {2016}
}
```

Full publication list: https://webgazer.cs.brown.edu/#publications

---

## License

**WebGazer-TS:** GPL-3.0-or-later  
**Original WebGazer.js:** GPL-3.0 (LGPL-3.0 for companies valued under $1M)

For commercial licensing of the original WebGazer.js: webgazer@lists.cs.brown.edu

---

## Disclaimer

This is an academic research project. While the regression mathematics have been verified against the original implementation, this code has not undergone the same testing as the production WebGazer.js library.

**Use at your own risk. For production use, choose the official [WebGazer.js](https://github.com/brownhci/WebGazer).**

---

**Built with respect for the original [WebGazer.js](https://webgazer.cs.brown.edu) team** ❤️