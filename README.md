# AI Flux 2.0 Design System

> **Flowing Intelligence. Endless Possibilities.**

[![Version](https://img.shields.io/badge/version-2.0.0-7C3AED.svg)]()
[![Enterprise-DS](https://img.shields.io/badge/built%20on-Enterprise--DS-2563EB.svg)]()
[![WCAG](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-00C896.svg)]()
[![W3C DTCG](https://img.shields.io/badge/tokens-W3C%20DTCG-00E5FF.svg)]()

---

## Overview

AI Flux 2.0 is a **brand implementation** of the [Enterprise Design System](https://github.com/adityasivakumar-DS/Enterprise-DS).
It provides a complete, production-ready design system for the AI Flux platform — including
design tokens, React components, experience patterns, and Storybook documentation.

## Quick Start

```bash
npm install @ai-flux/design-system
```

```tsx
import { Button, Card, Input } from '@ai-flux/design-system';
import '@ai-flux/design-system/tokens/css/tokens.dark.css';

function App() {
  return (
    <Card variant="elevated">
      <Input label="Prompt" placeholder="Ask AI Flux anything..." />
      <Button variant="primary">Generate</Button>
    </Card>
  );
}
```

## Brand

| Attribute | Value |
|---|---|
| **Brand** | AI Flux 2.0 |
| **Tagline** | Flowing Intelligence. Endless Possibilities. |
| **Primary Color** | `#7C3AED` Flux Purple |
| **Primary Font** | Space Grotesk |
| **Secondary Font** | Inter |
| **Tokens** | W3C DTCG compliant |
| **Theme** | Dark (primary) + Light |

## Repository Structure

```
/foundations    Brand foundations & design decisions
/tokens         W3C DTCG design tokens (core/semantic/brand/component)
/components     React components (Button, Input, Card, Badge, Avatar, ...)
/patterns       Composed patterns (forms, navigation, data-display)
/layouts        Page layouts (Dashboard, Auth)
/docs           Documentation
/storybook      Storybook configuration & theme
/assets         Logo, icons, illustrations
/scripts        Build & transform scripts
/governance     Contribution guidelines & versioning
/ai             AI prompts & MCP configuration
```

## Development

```bash
npm run dev             # Dev server
npm run storybook       # Storybook (port 6006)
npm run build:tokens    # Build CSS from tokens
npm run sync:figma      # Export Figma variables JSON
npm run test            # Run tests
npm run typecheck       # TypeScript check
```

## Figma

Design file: [AI Flux 2.0 Figma](https://www.figma.com/design/IxEIVqynEGiO2Q4LzB75dW/Ai-Flux-2.0)

Variables are kept in sync via the Figma MCP Server.
Run `npm run sync:figma` then use the Figma MCP to push variables.

## Golden Repository

This brand implementation is derived from and fully compatible with:

**[Enterprise-DS](https://github.com/adityasivakumar-DS/Enterprise-DS)** — the Golden Repository.

Architecture, folder structure, token hierarchy, and component architecture match Enterprise-DS exactly.
This brand can be merged back into Enterprise-DS without architectural changes.

## License

Proprietary — AI Flux 2.0 / Enterprise Design System
