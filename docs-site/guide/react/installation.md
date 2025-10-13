# React Installation

Install and set up the React integration for Webgazer.ts.

## Installation

::: code-group

```bash [npm]
npm install @webgazer-ts/react @webgazer-ts/core
```

```bash [pnpm]
pnpm add @webgazer-ts/react @webgazer-ts/core
```

```bash [yarn]
yarn add @webgazer-ts/react @webgazer-ts/core
```

:::

::: tip
Both packages are required. The React package depends on the core package.
:::

## Setup

### 1. Wrap Your App

Add the `WebgazerProvider` at the root of your app:

```tsx
import { WebgazerProvider } from '@webgazer-ts/react';

function App() {
  return (
    <WebgazerProvider>
      <YourApp />
    </WebgazerProvider>
  );
}
```

### 2. Configure (Optional)

Pass configuration to the provider:

```tsx
<WebgazerProvider
  config={{
    saveDataAcrossSessions: false,
    showVideo: true,
    showFaceOverlay: true
  }}
  autoStart={false} // Don't start automatically
>
  <YourApp />
</WebgazerProvider>
```

## TypeScript

Full TypeScript support is included:

```tsx
import type { GazePrediction, WebgazerConfig } from '@webgazer-ts/core';
import { useWebgazer, useGazeTracking } from '@webgazer-ts/react';

// All types are automatically inferred
const { isReady, begin } = useWebgazer();
```

## Next Steps

- [Quick Start](/guide/react/quick-start) - Build your first component
- [Hooks](/guide/react/hooks) - Learn all available hooks
- [Components](/guide/react/components) - Use built-in components
