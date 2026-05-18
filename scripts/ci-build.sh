#!/usr/bin/env bash

set -euo pipefail

(
  cd packages/core
  node_modules/.bin/vite build
  node_modules/.bin/tsc --declaration --emitDeclarationOnly --outDir dist
)

(
  cd packages/react
  node_modules/.bin/vite build
)

(
  cd packages/webgazer-ts
  node -e "process.stdout.write('webgazer-ts facade ready\\n')"
)

(
  cd examples/react-demo
  node_modules/.bin/tsc
  node_modules/.bin/vite build
)

node_modules/.bin/typedoc --options docs-site/typedoc.core.json
node_modules/.bin/typedoc --options docs-site/typedoc.react.json
node_modules/.bin/vitepress build docs-site
