# Examples Organization Summary

## What Changed

The examples directory has been reorganized into properly structured projects for better maintainability and ease of use.

## New Structure

### Before
```
examples/
├── minimal-demo.html              # Standalone file
├── minimal-react-demo.html        # Standalone file
├── MinimalReactDemo.tsx           # Orphan component file
└── typescript-example.ts          # Legacy example
```

### After
```
examples/
├── vanilla-js-demo/               # ✨ NEW: Full project
│   ├── index.html                # Organized demo
│   └── README.md                 # Complete docs
├── react-demo/                    # ✨ NEW: Full React project
│   ├── src/
│   │   ├── App.tsx              # Main component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Styles
│   ├── package.json             # Dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── vite.config.ts           # Build config
│   └── README.md                # Complete docs
├── minimal-react-demo.html        # Kept: CDN version
├── minimal-demo.html              # Kept: Legacy reference
├── MinimalReactDemo.tsx           # Kept: Legacy reference
├── typescript-example.ts          # Kept: Legacy reference
├── README.md                      # Updated: Main docs
└── STRUCTURE.md                   # ✨ NEW: Organization guide
```

## Benefits

### 1. Vanilla JS Demo (`vanilla-js-demo/`)
- ✅ Self-contained project
- ✅ Complete documentation
- ✅ No build tools needed
- ✅ Easy to share and deploy

### 2. React Demo (`react-demo/`)
- ✅ Full TypeScript + Vite setup
- ✅ Proper project structure
- ✅ Development server with hot reload
- ✅ Production build support
- ✅ Workspace dependencies linked
- ✅ Ready for real-world use

### 3. Better Documentation
- Each demo has its own README
- Clear setup instructions
- Troubleshooting guides
- Code structure explained

## Quick Start

### Vanilla JS Demo
```bash
cd examples/vanilla-js-demo
python3 -m http.server 8000
# Visit http://localhost:8000
```

### React Demo
```bash
cd examples/react-demo
pnpm install  # Already done if you ran pnpm install from root
pnpm dev
# Visit http://localhost:3000
```

### CDN React Demo (No Setup)
```bash
open examples/minimal-react-demo.html
```

## Key Features

Both organized demos showcase:

✨ **Automatic Calibration**
- Calibration starts automatically when you call `begin()`
- No need to manually call `addMouseEventListeners()`
- Matches original Webgazer.js API behavior

🎯 **Real-time Feedback**
- Live gaze position display
- Calibration point counter
- Tracking status indicator

📊 **Interactive Elements**
- 3×3 grid of click targets
- Status bar with live updates
- Optional gaze dot overlay

## Workspace Integration

The react-demo is now part of the pnpm workspace:

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'examples/react-demo'  # ✨ Added
```

This means:
- Automatic dependency linking
- Consistent versioning
- Shared development experience

## Migration Guide

### If You Were Using `minimal-demo.html`

**Option 1:** Use the organized version
```bash
cd examples/vanilla-js-demo
python3 -m http.server 8000
```

**Option 2:** Keep using the original (still works)
```bash
open examples/minimal-demo.html
```

### If You Were Using `MinimalReactDemo.tsx`

**Use the full React project:**
```bash
cd examples/react-demo
pnpm dev
```

The component is now `src/App.tsx` with full project context.

## Development Workflow

### Working on Examples

1. **Make changes to core/react packages**
   ```bash
   cd packages/core
   # Make changes
   pnpm build
   ```

2. **Test in vanilla JS demo**
   ```bash
   cd ../../examples/vanilla-js-demo
   python3 -m http.server 8000
   # Refresh browser to see changes
   ```

3. **Test in React demo**
   ```bash
   cd ../react-demo
   pnpm dev
   # Hot reload automatically shows changes
   ```

### Adding New Examples

See `examples/STRUCTURE.md` for detailed guidelines on:
- Creating new example projects
- Naming conventions
- Documentation requirements
- Integration with workspace

## Files Reference

| File/Folder | Purpose | Status |
|-------------|---------|--------|
| `vanilla-js-demo/` | Vanilla JS project | ✨ New, primary |
| `react-demo/` | React project | ✨ New, primary |
| `minimal-react-demo.html` | CDN React demo | Kept, useful |
| `minimal-demo.html` | Legacy demo | Kept, reference |
| `MinimalReactDemo.tsx` | Legacy component | Kept, reference |
| `typescript-example.ts` | Legacy example | Kept, reference |
| `README.md` | Main documentation | ✅ Updated |
| `STRUCTURE.md` | Organization guide | ✨ New |

## What Didn't Change

✅ **API Compatibility** - All examples use the same Webgazer API
✅ **Automatic Calibration** - Behavior is consistent across all demos
✅ **Legacy Files** - Old files still work, just marked as legacy
✅ **CDN Demo** - `minimal-react-demo.html` unchanged and still useful

## Next Steps

1. **Try the organized demos:**
   ```bash
   # Vanilla JS
   cd examples/vanilla-js-demo
   python3 -m http.server 8000
   
   # React
   cd examples/react-demo
   pnpm dev
   ```

2. **Read the documentation:**
   - `examples/README.md` - Overview of all demos
   - `examples/vanilla-js-demo/README.md` - Vanilla JS details
   - `examples/react-demo/README.md` - React details
   - `examples/STRUCTURE.md` - Organization guide

3. **Build your own:**
   - Use the organized demos as templates
   - Copy and adapt to your needs
   - Follow the same structure for consistency

## Questions?

- Check `examples/STRUCTURE.md` for detailed documentation
- See individual README files for each demo
- Open an issue on GitHub for help

## Summary

The examples are now properly organized into self-contained projects with:
- ✅ Complete documentation
- ✅ Proper project structure
- ✅ Development tooling (where appropriate)
- ✅ Easy to run and share
- ✅ Production-ready patterns

No breaking changes - legacy files still work, but the new organized structure is recommended for new projects!
