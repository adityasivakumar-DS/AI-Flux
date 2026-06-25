# AI Flux 2.0 Design System — Documentation

> **Version:** 2.0.0 | **Status:** Active | **Theme:** Dark + Light

## Quick Start

```bash
npm install @ai-flux/design-system
```

```tsx
import { Button, Card, Input, Badge } from '@ai-flux/design-system';
import '@ai-flux/design-system/tokens/css/tokens.dark.css';

function App() {
  return (
    <Card variant="elevated" padding="lg">
      <Input label="Model Name" placeholder="Enter model name..." />
      <Button variant="primary" size="lg">Deploy Model</Button>
    </Card>
  );
}
```

## Contents

- [Getting Started](./getting-started.md)
- [Design Tokens](./tokens.md)
- [Components](./components.md)
- [Patterns](./patterns.md)
- [Accessibility](./accessibility.md)
- [Theming](./theming.md)

## Repository Structure

```
/foundations          Brand foundations & design decisions
/tokens
  /core               Primitive tokens (W3C DTCG)
  /semantic           Semantic tokens (dark & light modes)
  /brand              Brand-specific aliases
  /component          Component-level tokens
/components           React components
/patterns             Composed UI patterns
/layouts              Page layout components
/docs                 Documentation
/storybook            Storybook configuration
/assets               Logo, icons, illustrations
/scripts              Build & transform scripts
/governance           Contribution guidelines
/ai                   AI prompts & MCP config
```

## Architecture

AI Flux 2.0 inherits from and is fully compatible with **Enterprise-DS** (the Golden Repository).

**Token hierarchy:**

```
Component tokens
      ↓ references
Semantic tokens  (dark / light modes)
      ↓ references
Core / Primitive tokens
```

Components **never** reference primitive tokens directly — always semantic.
