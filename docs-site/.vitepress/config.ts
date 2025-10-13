import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Webgazer.ts",
  description: "Eye tracking for JavaScript and React - TypeScript rewrite of Webgazer.js",
  base: '/webgazer-ts/',
  
  ignoreDeadLinks: true,  // Temporarily ignore dead links while building docs
  
  head: [
    ['link', { rel: 'icon', href: '/webgazer-ts/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { 
        text: 'API Reference',
        items: [
          { text: 'Core API', link: '/api/core/' },
          { text: 'React API', link: '/api/react/' }
        ]
      },
      { text: 'Examples', link: '/examples/basic' },
      {
        text: 'v0.2.0',
        items: [
          { text: 'Changelog', link: 'https://github.com/jhndrncrz/webgazer-ts/releases' },
          { text: 'Contributing', link: '/guide/contributing' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Webgazer.ts?', link: '/guide/what-is-webgazer' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Migration from Webgazer.js', link: '/guide/migration' }
          ]
        },
        {
          text: 'Core Library',
          items: [
            { text: 'Installation', link: '/guide/core/installation' },
            { text: 'Basic Usage', link: '/guide/core/basic-usage' },
            { text: 'Configuration', link: '/guide/core/configuration' },
            { text: 'Calibration', link: '/guide/core/calibration' },
            { text: 'Data Persistence', link: '/guide/core/data-persistence' }
          ]
        },
        {
          text: 'React Integration',
          items: [
            { text: 'Installation', link: '/guide/react/installation' },
            { text: 'Quick Start', link: '/guide/react/quick-start' },
            { text: 'Hooks', link: '/guide/react/hooks' },
            { text: 'Components', link: '/guide/react/components' },
            { text: 'Best Practices', link: '/guide/react/best-practices' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Custom Regression', link: '/guide/advanced/custom-regression' },
            { text: 'Performance Optimization', link: '/guide/advanced/performance' },
            { text: 'Kalman Filter', link: '/guide/advanced/kalman-filter' },
            { text: 'Heatmaps', link: '/guide/advanced/heatmaps' }
          ]
        },
        {
          text: 'Resources',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Contributing', link: '/guide/contributing' },
            { text: 'FAQ', link: '/guide/faq' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Core Examples',
          items: [
            { text: 'Basic Setup', link: '/examples/basic' },
            { text: 'With Calibration', link: '/examples/calibration' },
            { text: 'Custom Regression', link: '/examples/custom-regression' },
            { text: 'Data Recording', link: '/examples/recording' }
          ]
        },
        {
          text: 'React Examples',
          items: [
            { text: 'Simple Tracker', link: '/examples/react-basic' },
            { text: 'Gaze-Aware UI', link: '/examples/react-gaze-ui' },
            { text: 'Heatmap Visualization', link: '/examples/react-heatmap' },
            { text: 'Session Recording', link: '/examples/react-recording' },
            { text: 'Full Application', link: '/examples/react-full-app' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jhndrncrz/webgazer-ts' }
    ],

    footer: {
      message: 'Based on <a href="https://webgazer.cs.brown.edu">Webgazer.js</a> by Brown HCI',
      copyright: 'Licensed under GPL-3.0-or-later'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/jhndrncrz/webgazer-ts/edit/main/docs-site/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
