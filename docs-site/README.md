# Webgazer.ts Documentation

This directory contains the documentation website for Webgazer.ts, built with [VitePress](https://vitepress.dev/) and [TypeDoc](https://typedoc.org/).

## Structure

```
docs-site/
├── .vitepress/          # VitePress configuration
│   └── config.ts        # Site config, navigation, sidebar
├── api/                 # Auto-generated API documentation
│   ├── core/           # @webgazer-ts/core API docs
│   └── react/          # @webgazer-ts/react API docs
├── guide/              # User guides and tutorials
│   ├── core/          # Core library guides
│   ├── react/         # React integration guides
│   └── advanced/      # Advanced topics
├── examples/          # Code examples
├── public/            # Static assets (images, favicon, etc.)
├── index.md          # Homepage
└── typedoc.*.json    # TypeDoc configurations
```

## Development

### Prerequisites

- Node.js 16+
- pnpm 9+

### Commands

```bash
# Start dev server
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build
pnpm docs:preview

# Generate API docs only
pnpm docs:api
```

### Writing Documentation

#### Add a New Guide Page

1. Create a markdown file in `guide/`
2. Add it to the sidebar in `.vitepress/config.ts`

```typescript
sidebar: {
  '/guide/': [
    {
      text: 'My Category',
      items: [
        { text: 'My Page', link: '/guide/my-page' }
      ]
    }
  ]
}
```

#### Add a New Example

1. Create a markdown file in `examples/`
2. Add it to the sidebar in `.vitepress/config.ts`

#### Update API Documentation

API docs are auto-generated from TypeScript source code using TypeDoc.

To update:
1. Add JSDoc comments to source code
2. Run `pnpm docs:api`
3. API docs will be regenerated

### VitePress Features

#### Code Blocks

````markdown
```typescript
// TypeScript code with syntax highlighting
import webgazer from '@webgazer-ts/core';
```
````

#### Code Groups

````markdown
::: code-group
```typescript [Core]
import webgazer from '@webgazer-ts/core';
```

```tsx [React]
import { useWebgazer } from '@webgazer-ts/react';
```
:::
````

#### Custom Containers

```markdown
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger message
:::
```

## Deployment

### GitHub Pages

Documentation is automatically deployed to GitHub Pages when pushing to `main` branch.

**Setup:**
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch
4. GitHub Actions will build and deploy

**Workflow:** `.github/workflows/docs.yml`

### Manual Deployment

```bash
# Build the docs
pnpm docs:build

# Output is in: docs-site/.vitepress/dist

# Deploy to your hosting provider
# (Upload the dist folder)
```

## Customization

### Theme

Edit `.vitepress/config.ts`:

```typescript
export default defineConfig({
  themeConfig: {
    // Logo
    logo: '/logo.svg',
    
    // Colors (via CSS variables)
    // Add to .vitepress/theme/custom.css
    
    // Navigation
    nav: [...],
    
    // Sidebar
    sidebar: {...},
    
    // Footer
    footer: {
      message: 'Your message',
      copyright: 'Your copyright'
    }
  }
})
```

### Custom CSS

Create `.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand: #3eaf7c;
  --vp-c-brand-light: #4abf8a;
  --vp-c-brand-dark: #338a63;
}
```

### Custom Components

Create `.vitepress/theme/index.ts`:

```typescript
import DefaultTheme from 'vitepress/theme'
import MyComponent from './MyComponent.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}
```

## TypeDoc Configuration

Two TypeDoc configs for separate packages:

- `typedoc.core.json` - For @webgazer-ts/core
- `typedoc.react.json` - For @webgazer-ts/react

### Adding JSDoc Comments

```typescript
/**
 * Start eye tracking
 * 
 * @returns Promise that resolves when tracking starts
 * @example
 * ```typescript
 * await webgazer.begin();
 * ```
 */
async begin(): Promise<void> {
  // ...
}
```

## Contributing

When adding documentation:

1. **Keep it simple** - Clear, concise explanations
2. **Add examples** - Code examples for every concept
3. **Use TypeScript** - Show types in examples
4. **Link related content** - Use internal links
5. **Test locally** - Run `pnpm docs:dev` to preview

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [TypeDoc Documentation](https://typedoc.org/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Vue.js Documentation](https://vuejs.org/) (for custom components)

## License

Same as the main project: GPL-3.0-or-later
