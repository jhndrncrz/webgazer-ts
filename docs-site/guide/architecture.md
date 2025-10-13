# Architecture

Overview of Webgazer.ts architecture and design decisions.

## Core Components

- **Trackers** - Face and eye feature detection (TensorFlow.js FaceMesh)
- **Regressors** - Gaze prediction algorithms (Ridge regression variants)
- **Filters** - Smoothing and noise reduction (Kalman filters)
- **Storage** - Data persistence (IndexedDB/localStorage)
- **Events** - Event system for lifecycle management

## Design Principles

1. **TypeScript-first** - Full type safety
2. **Modular** - Pluggable trackers and regressors
3. **Privacy-focused** - Opt-in data storage
4. **Performance** - Web Workers, efficient algorithms
5. **Developer experience** - Clear APIs, good documentation

## More Details

Coming soon! See the [source code](https://github.com/jhndrncrz/webgazer-ts) for implementation details.
