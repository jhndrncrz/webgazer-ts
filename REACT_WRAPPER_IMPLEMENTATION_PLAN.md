# WebGazer-TS React Wrapper - Implementation Plan

## Executive Summary

Create a React wrapper package (`@webgazer-ts/react`) that provides hooks, components, and utilities for seamless integration with React applications.

---

## 1. Architecture Decision: Monorepo vs Separate Repo

### ✅ **RECOMMENDED: Monorepo (Same Repository)**

**Reasons:**
- Shared code and types between core and React wrapper
- Easier version management and releases
- Single source of truth for issues/PRs
- Simplified CI/CD pipeline
- Better developer experience

**Structure:**
```
webgazer-ts/
├── packages/
│   ├── core/                    # Current WebGazer-TS
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json         # @webgazer-ts/core or webgazer-ts
│   │   └── tsconfig.json
│   │
│   └── react/                   # NEW: React wrapper
│       ├── src/
│       │   ├── hooks/
│       │   ├── components/
│       │   ├── context/
│       │   ├── types/
│       │   └── index.ts
│       ├── dist/
│       ├── package.json         # @webgazer-ts/react
│       ├── tsconfig.json
│       └── README.md
│
├── examples/
│   ├── vanilla/                 # Current examples
│   └── react/                   # NEW: React examples
│       ├── basic-demo/
│       ├── calibration-ui/
│       └── heatmap-visualization/
│
├── package.json                 # Root workspace config
├── turbo.json                   # Turborepo config (optional)
└── pnpm-workspace.yaml          # Workspace definition
```

### Alternative: Separate Repository

**Only if:**
- React wrapper becomes very large (>10k lines)
- Different release cycles needed
- Different maintainers/teams
- Legal/licensing requirements

**Not recommended for this project** - unnecessary complexity.

---

## 2. Package Structure

### Package Name Options

**Option A: Scoped Package (Recommended)**
```json
{
  "name": "@webgazer-ts/react",
  "version": "0.1.0"
}
```
- Professional appearance
- Clear namespace
- Room for future packages (`@webgazer-ts/vue`, `@webgazer-ts/angular`)

**Option B: Simple Name**
```json
{
  "name": "webgazer-react",
  "version": "0.1.0"
}
```
- Simpler to type
- No npm organization needed
- Good for solo projects

---

## 3. API Design

### 3.1 Hooks-Based API (Primary)

#### `useWebGazer()` - Main Hook
```typescript
import { useWebGazer } from '@webgazer-ts/react';

function App() {
  const {
    // State
    isInitialized,
    isRunning,
    isPaused,
    error,
    
    // Gaze data
    gazeData,
    calibrationCount,
    
    // Actions
    start,
    stop,
    pause,
    resume,
    calibrate,
    clearCalibration,
    
    // Configuration
    setTracker,
    setRegression,
    showVideo,
    showFaceOverlay,
    
    // Instance access
    instance
  } = useWebGazer({
    // Configuration
    autoStart: false,
    saveDataAcrossSessions: true,
    
    // Tracking config
    tracker: 'TFFacemesh',
    regression: 'ridge',
    
    // Display config
    showVideoPreview: true,
    showFaceOverlay: true,
    showGazeDot: true,
    applyKalmanFilter: true,
    
    // Callbacks
    onGaze: (data, timestamp) => {
      console.log('Gaze:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
    onCalibrationComplete: (count) => {
      console.log('Calibration done:', count);
    }
  });
  
  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      {gazeData && <p>Looking at: {gazeData.x}, {gazeData.y}</p>}
    </div>
  );
}
```

#### `useGazeTracking()` - Simplified Hook
```typescript
import { useGazeTracking } from '@webgazer-ts/react';

function GazeLogger() {
  const gaze = useGazeTracking();
  
  return gaze ? (
    <div>X: {gaze.x}, Y: {gaze.y}</div>
  ) : (
    <div>Waiting for gaze data...</div>
  );
}
```

#### `useCalibration()` - Calibration Hook
```typescript
import { useCalibration } from '@webgazer-ts/react';

function CalibrationUI() {
  const {
    calibrationPoints,
    currentPointIndex,
    isCalibrating,
    progress,
    startCalibration,
    stopCalibration,
    recordPoint
  } = useCalibration({
    pointCount: 9,
    autoAdvance: true
  });
  
  return (
    <div>
      {isCalibrating && (
        <CalibrationPoint 
          position={calibrationPoints[currentPointIndex]}
          onClick={recordPoint}
        />
      )}
      <div>Progress: {progress}%</div>
    </div>
  );
}
```

#### `useGazeElement()` - Element Tracking
```typescript
import { useGazeElement } from '@webgazer-ts/react';

function InteractiveButton() {
  const { ref, isLooking, dwellTime } = useGazeElement({
    threshold: 50,
    minDwellTime: 1000
  });
  
  return (
    <button 
      ref={ref}
      style={{
        background: isLooking ? 'green' : 'gray',
        transform: `scale(${dwellTime > 500 ? 1.2 : 1})`
      }}
    >
      Look at me! {dwellTime > 0 && `(${dwellTime}ms)`}
    </button>
  );
}
```

#### `useGazeHeatmap()` - Heatmap Hook
```typescript
import { useGazeHeatmap } from '@webgazer-ts/react';

function HeatmapVisualization() {
  const { canvasRef, points, clear, export: exportData } = useGazeHeatmap({
    width: window.innerWidth,
    height: window.innerHeight,
    radius: 30,
    maxOpacity: 0.8
  });
  
  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={clear}>Clear</button>
      <button onClick={exportData}>Export Data</button>
      <p>Points tracked: {points.length}</p>
    </div>
  );
}
```

### 3.2 Component-Based API (Alternative)

#### `<WebGazerProvider>` - Context Provider
```typescript
import { WebGazerProvider } from '@webgazer-ts/react';

function App() {
  return (
    <WebGazerProvider
      config={{
        tracker: 'TFFacemesh',
        regression: 'ridge',
        saveDataAcrossSessions: true
      }}
      autoStart={true}
    >
      <YourApp />
    </WebGazerProvider>
  );
}
```

#### `<GazeTracker>` - Tracker Component
```typescript
import { GazeTracker } from '@webgazer-ts/react';

function App() {
  return (
    <GazeTracker
      onGaze={(data) => console.log(data)}
      showVideo={true}
      showFaceOverlay={true}
    >
      <YourContent />
    </GazeTracker>
  );
}
```

#### `<CalibrationScreen>` - Full-Screen Calibration
```typescript
import { CalibrationScreen } from '@webgazer-ts/react';

function App() {
  const [showCalibration, setShowCalibration] = useState(true);
  
  return showCalibration ? (
    <CalibrationScreen
      pointCount={9}
      onComplete={(result) => {
        console.log('Calibration complete:', result);
        setShowCalibration(false);
      }}
      onCancel={() => setShowCalibration(false)}
    />
  ) : (
    <YourApp />
  );
}
```

#### `<GazeElement>` - Interactive Element
```typescript
import { GazeElement } from '@webgazer-ts/react';

function Menu() {
  return (
    <div>
      <GazeElement
        threshold={50}
        onLookStart={() => console.log('Looking')}
        onLookEnd={() => console.log('Stopped looking')}
        onDwell={(time) => console.log('Dwelled:', time)}
      >
        <button>Gaze to activate</button>
      </GazeElement>
    </div>
  );
}
```

### 3.3 Utility Hooks

```typescript
// useGazePosition() - Raw gaze position
const { x, y, timestamp } = useGazePosition();

// useGazeVelocity() - Movement speed
const { vx, vy, speed } = useGazeVelocity();

// useGazeHistory() - Historical data
const history = useGazeHistory({ maxPoints: 100 });

// useGazeRegion() - Region detection
const region = useGazeRegion(['top-left', 'center', 'bottom-right']);

// useGazeScroll() - Auto-scroll based on gaze
useGazeScroll({ 
  scrollSpeed: 2,
  edgeThreshold: 100 
});

// useGazeRecording() - Record gaze sessions
const { 
  isRecording, 
  start, 
  stop, 
  data, 
  export: exportCSV 
} = useGazeRecording();
```

---

## 4. Implementation Phases

### Phase 1: Core Setup (Week 1)

**Tasks:**
1. ✅ Convert to monorepo structure
   - Set up pnpm workspaces (or npm/yarn)
   - Create `packages/core` and `packages/react`
   - Configure tsconfig references

2. ✅ Set up React package
   - Initialize package with TypeScript
   - Configure build (Vite or tsup)
   - Set up peer dependencies (react, react-dom)

3. ✅ Implement base structure
   - Context provider
   - Basic type definitions
   - WebGazer instance management

**Deliverables:**
- Monorepo structure
- `@webgazer-ts/react` package skeleton
- Build pipeline working

### Phase 2: Core Hooks (Week 2)

**Tasks:**
1. ✅ Implement `useWebGazer()` hook
   - Initialize/cleanup WebGazer instance
   - Manage lifecycle (start/stop/pause/resume)
   - State management (isRunning, error, etc.)

2. ✅ Implement `useGazeTracking()` hook
   - Subscribe to gaze updates
   - Return current gaze position
   - Handle cleanup

3. ✅ Implement `useCalibration()` hook
   - Manage calibration state
   - Generate calibration points
   - Record clicks/data

**Deliverables:**
- Working core hooks
- Basic examples
- Unit tests

### Phase 3: Advanced Hooks (Week 3)

**Tasks:**
1. ✅ Implement `useGazeElement()`
   - Track if looking at specific element
   - Calculate dwell time
   - Trigger callbacks

2. ✅ Implement `useGazeHeatmap()`
   - Canvas rendering
   - Point accumulation
   - Data export

3. ✅ Implement utility hooks
   - `useGazePosition()`
   - `useGazeVelocity()`
   - `useGazeHistory()`

**Deliverables:**
- Advanced hooks
- More examples
- Integration tests

### Phase 4: Components (Week 4)

**Tasks:**
1. ✅ Implement `<WebGazerProvider>`
   - Context setup
   - Configuration management
   - Child components

2. ✅ Implement `<CalibrationScreen>`
   - Full-screen calibration UI
   - Point visualization
   - Progress tracking

3. ✅ Implement `<GazeElement>`
   - Wrapper component
   - Event handling
   - Visual feedback

**Deliverables:**
- Component library
- Storybook demos (optional)
- Component tests

### Phase 5: Polish & Documentation (Week 5)

**Tasks:**
1. ✅ Documentation
   - README with examples
   - API reference
   - Migration guide
   - Best practices

2. ✅ Examples
   - Basic demo
   - Calibration UI
   - Heatmap visualization
   - Interactive elements
   - Dashboard example

3. ✅ Testing
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

**Deliverables:**
- Complete documentation
- Example applications
- Test coverage >80%

---

## 5. Technical Specifications

### 5.1 Dependencies

**Core Package (`packages/core`)**
```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.11.0",
    "@tensorflow-models/face-landmarks-detection": "^1.0.2",
    "localforage": "^1.10.0"
  }
}
```

**React Package (`packages/react`)**
```json
{
  "dependencies": {
    "@webgazer-ts/core": "workspace:*"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/react-hooks": "^8.0.0"
  }
}
```

### 5.2 Build Configuration

**Vite Config (`packages/react/vite.config.ts`)**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'WebGazerReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@webgazer-ts/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@webgazer-ts/core': 'WebGazer',
        },
      },
    },
  },
});
```

### 5.3 TypeScript Configuration

**Root `tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "composite": true
  }
}
```

**React Package `tsconfig.json`**
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "references": [
    { "path": "../core" }
  ]
}
```

### 5.4 Testing Setup

**Vitest Config**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

---

## 6. Example Usage Scenarios

### 6.1 Simple Gaze Logger
```typescript
import { useWebGazer } from '@webgazer-ts/react';

function GazeLogger() {
  const { gazeData, start, isInitialized } = useWebGazer({
    autoStart: true,
  });
  
  useEffect(() => {
    if (!isInitialized) start();
  }, []);
  
  return (
    <div>
      {gazeData ? (
        <p>Looking at: ({gazeData.x}, {gazeData.y})</p>
      ) : (
        <p>Initializing...</p>
      )}
    </div>
  );
}
```

### 6.2 Interactive Dashboard
```typescript
import { WebGazerProvider, useGazeElement } from '@webgazer-ts/react';

function DashboardCard({ title, children }) {
  const { ref, isLooking, dwellTime } = useGazeElement({
    minDwellTime: 2000,
    onDwell: () => console.log('User interested in:', title),
  });
  
  return (
    <div
      ref={ref}
      style={{
        border: isLooking ? '2px solid blue' : '1px solid gray',
        opacity: dwellTime > 1000 ? 1 : 0.7,
      }}
    >
      <h3>{title}</h3>
      {children}
      {dwellTime > 0 && <span>{Math.round(dwellTime / 1000)}s</span>}
    </div>
  );
}

function Dashboard() {
  return (
    <WebGazerProvider autoStart>
      <div className="dashboard">
        <DashboardCard title="Sales">...</DashboardCard>
        <DashboardCard title="Users">...</DashboardCard>
        <DashboardCard title="Revenue">...</DashboardCard>
      </div>
    </WebGazerProvider>
  );
}
```

### 6.3 Full Calibration Flow
```typescript
import { 
  useWebGazer, 
  CalibrationScreen 
} from '@webgazer-ts/react';

function App() {
  const [needsCalibration, setNeedsCalibration] = useState(true);
  const { calibrationCount } = useWebGazer();
  
  useEffect(() => {
    if (calibrationCount >= 9) {
      setNeedsCalibration(false);
    }
  }, [calibrationCount]);
  
  if (needsCalibration) {
    return (
      <CalibrationScreen
        pointCount={9}
        onComplete={() => setNeedsCalibration(false)}
      />
    );
  }
  
  return <MainApp />;
}
```

### 6.4 Heatmap Analytics
```typescript
import { useGazeHeatmap, useGazeRecording } from '@webgazer-ts/react';

function Analytics() {
  const { canvasRef, points, clear } = useGazeHeatmap();
  const { isRecording, start, stop, exportCSV } = useGazeRecording();
  
  return (
    <div>
      <canvas ref={canvasRef} />
      <div className="controls">
        <button onClick={isRecording ? stop : start}>
          {isRecording ? 'Stop' : 'Start'} Recording
        </button>
        <button onClick={clear}>Clear Heatmap</button>
        <button onClick={exportCSV}>Export Data</button>
        <p>Points: {points.length}</p>
      </div>
    </div>
  );
}
```

---

## 7. File Structure

```
packages/react/
├── src/
│   ├── index.ts                     # Main export
│   │
│   ├── hooks/
│   │   ├── useWebGazer.ts           # Main hook
│   │   ├── useGazeTracking.ts       # Gaze position hook
│   │   ├── useCalibration.ts        # Calibration hook
│   │   ├── useGazeElement.ts        # Element tracking hook
│   │   ├── useGazeHeatmap.ts        # Heatmap hook
│   │   ├── useGazePosition.ts       # Position utility
│   │   ├── useGazeVelocity.ts       # Velocity utility
│   │   ├── useGazeHistory.ts        # History utility
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── WebGazerProvider.tsx     # Context provider
│   │   ├── GazeTracker.tsx          # Tracker component
│   │   ├── CalibrationScreen.tsx    # Calibration UI
│   │   ├── GazeElement.tsx          # Interactive element
│   │   ├── GazeDot.tsx              # Visual feedback
│   │   └── index.ts
│   │
│   ├── context/
│   │   ├── WebGazerContext.tsx      # React context
│   │   ├── types.ts                 # Context types
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── hooks.ts                 # Hook types
│   │   ├── components.ts            # Component types
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── elementTracking.ts       # Element intersection
│   │   ├── heatmapRenderer.ts       # Canvas rendering
│   │   ├── dataExport.ts            # CSV/JSON export
│   │   └── index.ts
│   │
│   └── test/
│       ├── setup.ts                 # Test setup
│       ├── hooks/                   # Hook tests
│       ├── components/              # Component tests
│       └── utils/                   # Utility tests
│
├── examples/
│   ├── basic-demo/
│   ├── calibration-ui/
│   ├── heatmap-visualization/
│   ├── interactive-elements/
│   └── dashboard/
│
├── dist/                            # Build output
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

---

## 8. Migration Path

### For Existing Users

**Before (Vanilla JS)**
```javascript
webgazer
  .setRegression('ridge')
  .setTracker('TFFacemesh')
  .begin();

webgazer.setGazeListener((data) => {
  console.log(data);
});
```

**After (React)**
```typescript
import { useWebGazer } from '@webgazer-ts/react';

function App() {
  const { gazeData } = useWebGazer({
    autoStart: true,
    tracker: 'TFFacemesh',
    regression: 'ridge',
    onGaze: (data) => console.log(data),
  });
  
  return <div>Gaze: {gazeData?.x}, {gazeData?.y}</div>;
}
```

---

## 9. Publishing Strategy

### NPM Packages

**Option 1: Separate Packages**
```bash
npm publish @webgazer-ts/core
npm publish @webgazer-ts/react
```

**Option 2: Bundled**
```bash
npm publish webgazer-ts  # Includes core + react
```

### Versioning

Use **independent versioning**:
- `@webgazer-ts/core` v1.0.0
- `@webgazer-ts/react` v1.0.0

Or **synchronized versioning**:
- Both at v1.0.0

### Release Process

1. Update changelog
2. Bump versions (Changesets recommended)
3. Build packages
4. Run tests
5. Publish to npm
6. Create GitHub release
7. Update documentation

---

## 10. Timeline & Effort

### Estimated Time: 5-6 Weeks

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Setup | 1 week | 20 hours |
| Phase 2: Core Hooks | 1 week | 30 hours |
| Phase 3: Advanced Hooks | 1 week | 30 hours |
| Phase 4: Components | 1 week | 25 hours |
| Phase 5: Polish & Docs | 1-2 weeks | 35 hours |
| **Total** | **5-6 weeks** | **140 hours** |

### Minimum Viable Product (MVP): 2 Weeks

Focus on:
- `useWebGazer()` hook
- `useGazeTracking()` hook
- Basic `<WebGazerProvider>`
- One example app
- Basic documentation

---

## 11. Success Metrics

### Technical Metrics
- ✅ Build passes (TypeScript, tests)
- ✅ Test coverage >80%
- ✅ Bundle size <50KB (React wrapper only)
- ✅ Zero peer dependency warnings
- ✅ Works with React 17 & 18

### User Experience Metrics
- ✅ Simple 3-line setup
- ✅ Clear documentation
- ✅ Working examples
- ✅ Type-safe API
- ✅ Intuitive hook names

### Adoption Metrics
- Downloads per week
- GitHub stars
- Issue/PR activity
- Community contributions
- Integration in real projects

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking core API changes | High | Use stable core API, version carefully |
| React version compatibility | Medium | Test with React 17 & 18, use peer deps |
| Bundle size bloat | Medium | Tree-shaking, lazy loading, code splitting |
| Memory leaks | High | Proper cleanup in useEffect, ref management |
| Performance issues | Medium | Throttling, requestAnimationFrame, workers |
| Poor adoption | Low | Good docs, examples, marketing |

---

## 13. Alternatives Considered

### Alternative 1: Vue Wrapper
- **Pros**: Another popular framework
- **Cons**: Smaller audience than React
- **Decision**: Start with React, add Vue later if demand exists

### Alternative 2: Framework-Agnostic
- **Pros**: Works everywhere
- **Cons**: Less ergonomic, no framework-specific features
- **Decision**: Core is already framework-agnostic, add React layer

### Alternative 3: Web Components
- **Pros**: Framework-agnostic
- **Cons**: Less developer-friendly, limited ecosystem
- **Decision**: Not as good for React developers

---

## 14. Recommendation

### ✅ **Proceed with Monorepo Approach**

**Phase 1 (Immediate):**
1. Restructure current repo as monorepo
2. Move current code to `packages/core`
3. Create `packages/react` skeleton
4. Set up build pipeline

**Phase 2 (Next 2 weeks):**
1. Implement `useWebGazer()` hook (MVP)
2. Implement `useGazeTracking()` hook
3. Create one example app
4. Write basic documentation

**Phase 3 (After MVP):**
1. Add advanced hooks
2. Add components
3. Add more examples
4. Publish to npm

---

## 15. Next Steps

### Immediate Actions

1. **Create monorepo structure**
   ```bash
   mkdir -p packages/core packages/react
   git mv src packages/core/
   ```

2. **Set up workspace**
   ```bash
   npm init -w packages/react
   # or
   pnpm init
   ```

3. **Create React package skeleton**
   - package.json
   - tsconfig.json
   - vite.config.ts
   - src/index.ts

4. **Implement first hook** (`useWebGazer`)

5. **Create first example**

### Questions to Answer

1. **Package name**: `@webgazer-ts/react` or `webgazer-react`?
2. **Workspace tool**: npm workspaces, pnpm, or yarn?
3. **Build tool**: Vite, tsup, or Rollup?
4. **Test framework**: Vitest or Jest?
5. **Documentation**: Separate docs site or README?

---

## Conclusion

Creating a React wrapper for WebGazer-TS is:
- ✅ **Feasible** - Clear architecture and API design
- ✅ **Valuable** - Huge React ecosystem, better DX
- ✅ **Manageable** - 5-6 weeks for full implementation, 2 weeks for MVP
- ✅ **Maintainable** - Monorepo keeps everything together

**Recommendation**: Start with monorepo structure, implement MVP in 2 weeks, then expand based on feedback.

**Next**: Would you like me to start implementing the monorepo structure and create the first hook?
