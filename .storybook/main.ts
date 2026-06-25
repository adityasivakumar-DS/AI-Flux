import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  /**
   * AI-Flux Design System — Storybook 8 main configuration
   *
   * - Framework: @storybook/react-vite (zero-webpack, fast HMR)
   * - Addons: a11y, controls, actions, backgrounds, viewport, docs
   * - Story glob covers every component directory and the pages directory
   */
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    '../src/**/*.mdx',
  ],

  addons: [
    '@storybook/addon-essentials',        // docs, controls, actions, backgrounds, viewport, toolbars
    '@storybook/addon-a11y',              // accessibility audit panel + violations overlay
    '@storybook/addon-interactions',      // play-function step debugger
    '@storybook/addon-themes',            // light / dark theme switcher toolbar icon
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {
    autodocs: 'tag',                      // generate docs page for stories tagged 'autodocs'
    defaultName: 'Documentation',
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  staticDirs: ['../public'],

  viteFinal: async (config) => {
    // Ensure CSS custom properties and Tailwind (if used) are processed correctly
    return config;
  },
};

export default config;
