#!/usr/bin/env bash

set -euo pipefail

packages/core/node_modules/.bin/tsc --declaration --emitDeclarationOnly --outDir packages/core/dist -p packages/core/tsconfig.json
packages/react/node_modules/.bin/tsc -p packages/react/tsconfig.build.json

packages/core/node_modules/.bin/tsc --noEmit -p packages/core/tsconfig.json
packages/react/node_modules/.bin/tsc --noEmit -p packages/react/tsconfig.json
packages/core/node_modules/.bin/tsc --noEmit -p packages/webgazer-ts/tsconfig.json
examples/react-demo/node_modules/.bin/tsc --noEmit -p examples/react-demo/tsconfig.json

(cd packages/core && node_modules/.bin/vitest run --coverage)
(cd packages/react && node_modules/.bin/vitest run --coverage)
