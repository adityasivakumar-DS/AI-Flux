# AI Flux 2.0 — Component Generation Prompts

## Standard Component Prompt Template

Copy and fill in the brackets:

```
You are a senior frontend engineer working on the AI Flux 2.0 Design System.

Generate a production-ready [COMPONENT_NAME] component following these exact specifications:

BRAND CONTEXT:
- Dark-first design system
- Primary brand color: #7C3AED (Flux Purple)
- Font: Space Grotesk (headings) + Inter (body)
- CSS tokens available via var(--token-name)

TECHNICAL REQUIREMENTS:
- React 18+ with TypeScript strict mode
- CSS Modules (filename: [ComponentName].module.css)
- All CSS values via CSS custom properties (var(--...))
- No inline styles, no Tailwind, no emotion/styled-components
- Forward refs where applicable
- ARIA attributes for accessibility (WCAG 2.1 AA)

COMPONENT SPECIFICATION:
- Variants: [LIST VARIANTS]
- Sizes: [sm | md | lg]
- States: default, hover, focus, active, disabled
- Props: [LIST KEY PROPS]

FILES TO GENERATE:
1. [ComponentName].tsx — main component
2. [ComponentName].module.css — CSS Module styles
3. [ComponentName].stories.tsx — Storybook stories (autodocs)
4. index.ts — barrel export
5. tokens/component/[name].json — W3C DTCG component tokens

TOKEN CSS VARIABLES AVAILABLE (sample):
--color-background-canvas, --color-background-primary, --color-background-secondary
--color-text-primary, --color-text-secondary, --color-text-muted
--color-border-default, --color-border-focus, --color-border-subtle
--color-interactive-primary-bg, --color-interactive-primary-text
--color-status-success-bg, --color-status-error-bg
--color-flux-purple, --color-flux-cyan, --color-flux-green
--font-family-primary, --font-family-secondary
--font-size-body, --font-size-small, --font-size-caption
--font-weight-regular, --font-weight-semibold, --font-weight-bold
--spacing-1 through --spacing-16 (4px increments)
--radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full
--shadow-sm, --shadow-md, --shadow-lg, --shadow-glow-purple, --shadow-glow-cyan
--duration-fast, --duration-normal, --duration-slow
--easing-ease-out, --easing-spring
```

## Figma-to-Code Prompt

```
Convert this Figma component to AI Flux 2.0 code.

Figma context: [PASTE FIGMA MCP GET_DESIGN_CONTEXT OUTPUT]

Requirements:
- Map all Figma colors to AI Flux design tokens
- Map all Figma type styles to typography tokens
- Generate CSS Module styles using var(--token-name)
- Preserve all interactive states visible in Figma
- Output: React TSX + CSS Module + Storybook story
```
