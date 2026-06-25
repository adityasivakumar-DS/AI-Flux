import { create } from '@storybook/theming/create';

export const aiFluxTheme = create({
  base: 'dark',

  brandTitle: 'AI Flux 2.0 Design System',
  brandUrl: 'https://ai-flux.io',

  colorPrimary: '#7C3AED',
  colorSecondary: '#00E5FF',

  appBg: '#0F172A',
  appContentBg: '#0D0E1A',
  appPreviewBg: '#0D0E1A',
  appBorderColor: '#1E293B',
  appBorderRadius: 8,

  textColor: '#F8FAFC',
  textInverseColor: '#0F172A',
  textMutedColor: '#64748B',

  barTextColor: '#E2EBF0',
  barHoverColor: '#F8FAFC',
  barSelectedColor: '#7C3AED',
  barBg: '#0F172A',

  inputBg: '#1E293B',
  inputBorder: '#334155',
  inputTextColor: '#F8FAFC',
  inputBorderRadius: 8,

  fontBase: "'Inter', sans-serif",
  fontCode: "'JetBrains Mono', monospace",
});
