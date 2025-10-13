# Examples Directory Structure

This document explains the organization of Webgazer example projects.

## Directory Structure

```
examples/
├── README.md                    # Main examples documentation
├── vanilla-js-demo/             # Standalone vanilla JS demo
│   ├── index.html              # Complete demo (no build tools)
│   └── README.md               # Setup and usage instructions
├── react-demo/                  # Full React project
│   ├── src/
│   │   ├── App.tsx            # Main demo component
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite build config
│   └── README.md              # Setup and usage instructions
├── minimal-react-demo.html     # CDN-based React demo (no build)
├── MinimalReactDemo.tsx        # Legacy component file
├── minimal-demo.html           # Legacy standalone demo
└── typescript-example.ts       # Legacy TypeScript example
```

## Choosing the Right Example

### For Learning Webgazer

**Start here:** `vanilla-js-demo/`
- Simplest setup
- No framework complexity
- Clear, commented code
- See how Webgazer works directly

### For React Integration

**Two options:**

1. **Quick prototype:** `minimal-react-demo.html`
   - No build tools needed
   - React via CDN
   - Good for learning React integration

2. **Production app:** `react-demo/`
   - Full TypeScript setup
   - Modern tooling (Vite)
   - Best practices
   - Ready for real projects

### For Other Frameworks

Use `vanilla-js-demo/` as a reference and adapt to your framework:

```javascript
// The core pattern works everywhere
import webgazer from '@webgazer-ts/core';

await webgazer.begin();  // Calibration starts automatically!

webgazer.setGazeListener((data) => {
  if (data) {
    // Update your framework's state
    myFramework.setState({ x: data.x, y: data.y });
  }
});
```

## Migration from Legacy Files

### If you were using `minimal-demo.html`

Move to `vanilla-js-demo/`:
```bash
cd vanilla-js-demo
python3 -m http.server 8000
```

### If you were using `MinimalReactDemo.tsx`

Use the new `react-demo/` project:
```bash
cd react-demo
pnpm install
pnpm dev
```

### If you need CDN React

Use `minimal-react-demo.html` (no changes needed)

## Development Workflow

### Working on Vanilla JS Demo

```bash
# No installation needed!
cd vanilla-js-demo
python3 -m http.server 8000
# Edit index.html and refresh browser
```

### Working on React Demo

```bash
# First time setup
cd react-demo
pnpm install

# Development
pnpm dev          # Hot reload at localhost:3000

# Production build
pnpm build        # Output to dist/
pnpm preview      # Preview production build
```

### Testing Changes Across All Demos

```bash
# From repository root

# 1. Build core and react packages
pnpm -r build

# 2. Test vanilla JS demo
cd examples/vanilla-js-demo
python3 -m http.server 8000

# 3. Test React demo
cd ../react-demo
pnpm dev
```

## File Descriptions

### Active Projects

| File/Folder | Purpose | Build Tools | Best For |
|-------------|---------|-------------|----------|
| `vanilla-js-demo/` | Complete vanilla JS demo | None | Learning, prototyping |
| `react-demo/` | Full React project | Vite + TypeScript | Production React apps |
| `minimal-react-demo.html` | CDN React demo | None (Babel CDN) | Quick React prototypes |

### Legacy Files (Kept for Reference)

| File | Status | Replacement |
|------|--------|-------------|
| `minimal-demo.html` | Superseded | `vanilla-js-demo/index.html` |
| `MinimalReactDemo.tsx` | Superseded | `react-demo/src/App.tsx` |
| `typescript-example.ts` | Reference only | Use organized demos |

## Adding a New Example

### For a New Framework

1. Create a new directory:
   ```bash
   mkdir examples/my-framework-demo
   ```

2. Add a README.md:
   ```bash
   cp react-demo/README.md my-framework-demo/
   # Edit to match your framework
   ```

3. Create your demo files

4. Update `examples/README.md` with your example

### For a New React Variant

Add to existing `react-demo/src/`:
```bash
cd react-demo/src
touch AdvancedDemo.tsx
# Implement and export
```

## Common Tasks

### Update Webgazer Version

```bash
# From repository root
cd packages/core
pnpm version patch  # or minor, major
pnpm build

cd ../react
pnpm version patch
pnpm build

# Update examples
cd ../../examples/react-demo
pnpm install  # Gets latest workspace versions
```

### Share a Demo

**Vanilla JS:**
```bash
cd vanilla-js-demo
zip -r vanilla-js-demo.zip index.html README.md
# Share the zip
```

**React:**
```bash
cd react-demo
pnpm build
# Share the dist/ folder
# Or deploy to Vercel/Netlify
```

### Debug Integration Issues

1. Check Webgazer is built:
   ```bash
   ls -lh ../../packages/core/dist/webgazer-ts.js
   ```

2. Check imports:
   ```javascript
   // Vanilla: relative path
   import webgazer from '../../packages/core/dist/webgazer-ts.js';
   
   // React: workspace dependency
   import { useWebgazer } from '@webgazer-ts/react';
   ```

3. Check browser console for errors

## Best Practices

### Documentation

- Each demo folder has its own README.md
- READMEs include: setup, usage, troubleshooting
- Code comments explain key concepts

### Code Organization

- Keep demos simple and focused
- One concept per example
- Avoid over-engineering

### Consistency

- All demos use automatic calibration
- All demos show real-time feedback
- All demos include explanatory text

## Resources

- **Core API Docs**: `../../packages/core/README.md`
- **React Hooks Docs**: `../../packages/react/README.md`
- **Calibration Guide**: `../../CALIBRATION_EXPLAINED.md`
- **API Compatibility**: `../../API_COMPATIBILITY.md`

## Questions?

Open an issue on GitHub or check the main project README.
