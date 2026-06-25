/**
 * AI-Flux Design System — Storybook 8 preview configuration
 *
 * Responsibilities:
 *  - Declare global parameters (backgrounds, layout, viewport presets)
 *  - Wire up the @storybook/addon-themes theme switcher for Light + Dark
 *  - Apply the AI-Flux dark CSS custom properties on the document root so
 *    every story renders against the correct surface tokens
 *  - Add a global decorator that injects the `dark` class on <html> when
 *    the dark theme is active (needed for Tailwind dark: variants used by
 *    Badge and Avatar)
 */

import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

// ---------------------------------------------------------------------------
// AI-Flux global CSS custom properties
// Injected once so components that rely on --aif-* tokens work in all stories
// regardless of whether the component's own CSS file is imported.
// ---------------------------------------------------------------------------

const AI_FLUX_LIGHT_TOKENS = `
  :root[data-theme="light"], .ai-flux-light {
    --aif-color-surface-base:    #f8f9fc;
    --aif-color-surface-raised:  #ffffff;
    --aif-color-surface-overlay: #f0f2f8;
    --aif-color-surface-subtle:  rgba(0, 0, 0, 0.03);

    --aif-color-border-default:  rgba(0, 0, 0, 0.08);
    --aif-color-border-strong:   rgba(0, 0, 0, 0.16);
    --aif-color-border-accent:   rgba(49, 130, 206, 0.50);

    --aif-color-accent-primary:  #3182ce;
    --aif-color-accent-glow:     rgba(49, 130, 206, 0.15);
    --aif-color-accent-dim:      rgba(49, 130, 206, 0.08);

    --aif-color-text-primary:    rgba(10, 12, 20, 0.92);
    --aif-color-text-secondary:  rgba(10, 12, 20, 0.56);
    --aif-color-text-disabled:   rgba(10, 12, 20, 0.30);

    --aif-shadow-xs: 0 1px 2px  rgba(0, 0, 0, 0.08);
    --aif-shadow-sm: 0 2px 8px  rgba(0, 0, 0, 0.10), 0 1px 2px rgba(0, 0, 0, 0.06);
    --aif-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
    --aif-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.10);
    --aif-shadow-glow: 0 0 0 1px var(--aif-color-border-accent),
                       0 4px 20px var(--aif-color-accent-glow);

    /* Navigation / Dashboard layout tokens */
    --aif-nav-sidebar-bg:  #ffffff;
    --aif-nav-topbar-bg:   rgba(248, 249, 252, 0.92);
    --aif-dash-sidebar-bg: #ffffff;
    --aif-dash-topbar-bg:  rgba(248, 249, 252, 0.92);
  }
`;

const AI_FLUX_DARK_TOKENS = `
  :root[data-theme="dark"], .ai-flux-dark, .dark {
    --aif-color-surface-base:    #0d0f14;
    --aif-color-surface-raised:  #141720;
    --aif-color-surface-overlay: #1a1e2a;
    --aif-color-surface-subtle:  rgba(255, 255, 255, 0.03);

    --aif-color-border-default:  rgba(255, 255, 255, 0.08);
    --aif-color-border-strong:   rgba(255, 255, 255, 0.16);
    --aif-color-border-accent:   rgba(99, 179, 237, 0.50);

    --aif-color-accent-primary:  #63b3ed;
    --aif-color-accent-glow:     rgba(99, 179, 237, 0.15);
    --aif-color-accent-dim:      rgba(99, 179, 237, 0.08);

    --aif-color-text-primary:    rgba(255, 255, 255, 0.92);
    --aif-color-text-secondary:  rgba(255, 255, 255, 0.56);
    --aif-color-text-disabled:   rgba(255, 255, 255, 0.24);

    --aif-shadow-xs: 0 1px 2px  rgba(0, 0, 0, 0.40);
    --aif-shadow-sm: 0 2px 8px  rgba(0, 0, 0, 0.50), 0 1px 2px rgba(0, 0, 0, 0.30);
    --aif-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.60), 0 2px 4px rgba(0, 0, 0, 0.40);
    --aif-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.70), 0 4px 8px rgba(0, 0, 0, 0.50);
    --aif-shadow-glow: 0 0 0 1px var(--aif-color-border-accent),
                       0 4px 20px var(--aif-color-accent-glow);

    /* Navigation / Dashboard layout tokens */
    --aif-nav-sidebar-bg:  #0d0f14;
    --aif-nav-topbar-bg:   rgba(13, 15, 20, 0.88);
    --aif-dash-sidebar-bg: #0d0f14;
    --aif-dash-topbar-bg:  rgba(13, 15, 20, 0.92);
  }
`;

// Inject token stylesheets once
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.id = 'ai-flux-design-tokens';
  style.textContent = AI_FLUX_LIGHT_TOKENS + AI_FLUX_DARK_TOKENS;
  if (!document.getElementById('ai-flux-design-tokens')) {
    document.head.appendChild(style);
  }
}

// ---------------------------------------------------------------------------
// Global decorator — sync Tailwind `dark` class + --aif data-theme attribute
// ---------------------------------------------------------------------------

const withAIFluxTheme: Decorator = (Story, context) => {
  const themeName = context.globals['theme'] as string | undefined;
  const isDark = themeName === 'dark';

  React.useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  return <Story />;
};

// ---------------------------------------------------------------------------
// Preview export
// ---------------------------------------------------------------------------

const preview: Preview = {
  decorators: [
    // Theme class injection (must come before addon-themes decorator)
    withAIFluxTheme,
    // Storybook addon-themes: renders the className on the story wrapper
    withThemeByClassName({
      themes: {
        light: 'ai-flux-light',
        dark: 'ai-flux-dark dark',
      },
      defaultTheme: 'dark',
    }),
  ],

  parameters: {
    /**
     * Background swatches — complement the theme switcher.
     * Selecting a background does NOT change design tokens; use the theme
     * toolbar icon for that. These are provided for spot-checking contrast.
     */
    backgrounds: {
      default: 'AI-Flux Dark',
      values: [
        { name: 'AI-Flux Dark',        value: '#0d0f14' },
        { name: 'AI-Flux Surface',     value: '#141720' },
        { name: 'AI-Flux Overlay',     value: '#1a1e2a' },
        { name: 'AI-Flux Light',       value: '#f8f9fc' },
        { name: 'AI-Flux Light Card',  value: '#ffffff' },
      ],
    },

    /** Default canvas layout — individual stories can override. */
    layout: 'centered',

    /** Controls panel defaults */
    controls: {
      matchers: {
        color: /(background|color|bg|fill|stroke|border)$/i,
        date:  /date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },

    /** Accessibility addon — run audits automatically in the A11y panel */
    a11y: {
      config: {
        rules: [
          // Relax color-contrast for intentionally subtle ghost text in demos
          { id: 'color-contrast', reviewOnFail: true },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
        },
      },
    },

    /** Viewport presets for responsive testing */
    viewport: {
      viewports: {
        mobile:  { name: 'Mobile (375)',  styles: { width: '375px',  height: '812px'  } },
        tablet:  { name: 'Tablet (768)',  styles: { width: '768px',  height: '1024px' } },
        desktop: { name: 'Desktop (1280)', styles: { width: '1280px', height: '900px'  } },
        wide:    { name: 'Wide (1440)',   styles: { width: '1440px', height: '900px'  } },
      },
      defaultViewport: 'desktop',
    },

    /** Docs page customisation */
    docs: {
      theme: undefined, // use Storybook default; swap for a custom @storybook/theming object if desired
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h2, h3',
        title: 'On this page',
      },
    },

    /** Actions — automatically detect common event handler props */
    actions: { argTypesRegex: '^on[A-Z].*' },
  },

  /** Global toolbar — theme switcher managed by withThemeByClassName */
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'AI-Flux Light / Dark theme',
      defaultValue: 