# AI Flux 2.0 — Icon Library

## Style

- **Style:** Linear, Rounded, Minimal
- **Stroke:** 2px consistent
- **Grid:** 24×24px (standard), 16×16px (compact)
- **Corner radius:** 2px on corners where applicable

## Core Icon Set

| Icon | File | Use |
|---|---|---|
| AI / Brain | `ai-brain.svg` | AI features, model intelligence |
| Analytics | `analytics.svg` | Data, metrics, reports |
| Automation | `automation.svg` | Workflows, pipelines |
| Security | `security.svg` | Auth, permissions, shield |
| Cloud | `cloud.svg` | Cloud services, sync |
| Data | `data.svg` | Datasets, layers |
| Connect | `connect.svg` | Integrations, APIs |
| Workflow | `workflow.svg` | Automation flows |
| Spark | `spark.svg` | AI generation, magic actions |
| User | `user.svg` | Users, accounts, profiles |

## Usage

Icons are implemented as React components or SVG sprites.
Always provide an accessible label via `aria-label` or `aria-hidden + adjacent text`.

```tsx
import { BrainIcon } from '@ai-flux/icons';

// With label (standalone icon)
<BrainIcon aria-label="AI Intelligence" />

// Decorative (adjacent text label)
<span>
  <BrainIcon aria-hidden="true" />
  AI Models
</span>
```
