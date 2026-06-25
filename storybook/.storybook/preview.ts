import type { Preview } from '@storybook/react';
import '../../tokens/css/tokens.dark.css';
import '../../tokens/css/tokens.light.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0D0E1A' },
        { name: 'surface', value: '#0F172A' },
        { name: 'light', value: '#F8FAFC' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: undefined,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['dark', 'light'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
