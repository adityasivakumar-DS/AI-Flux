# Design Tokens

AI Flux 2.0 uses **W3C Design Token Community Group (DTCG)** format.

## Token Format

```json
{
  "color": {
    "flux-purple": {
      "$value": "#7C3AED",
      "$type": "color",
      "$description": "Primary brand accent — identity, CTAs"
    }
  }
}
```

## Token Layers

| Layer | Path | Purpose |
|---|---|---|
| Core | `/tokens/core/` | Primitive values — raw colors, sizes, etc. |
| Semantic | `/tokens/semantic/` | Contextual mappings — background, text, border |
| Brand | `/tokens/brand/` | Brand expression — gradients, identity aliases |
| Component | `/tokens/component/` | Component-specific — button, input, card, etc. |

## Core Tokens

### Color (`tokens/core/color.json`)

| Token | Value | Description |
|---|---|---|
| `color.flux-navy` | `#0D0E1A` | Canvas background |
| `color.flux-purple` | `#7C3AED` | Primary accent |
| `color.flux-blue` | `#2563EB` | Trust accent |
| `color.flux-cyan` | `#00E5FF` | Flow / motion accent |
| `color.flux-green` | `#00C896` | Success |
| `color.neutral-dark` | `#0F172A` | Dark surface |
| `color.neutral-slate` | `#1E293B` | Card surface |
| `color.neutral-gray` | `#334155` | Borders |
| `color.neutral-cool-gray` | `#64748B` | Muted text |

### Typography (`tokens/core/typography.json`)

| Token | Value |
|---|---|
| `font.family.primary` | Space Grotesk, sans-serif |
| `font.family.secondary` | Inter, sans-serif |
| `font.size.display-1` | 48px |
| `font.size.body` | 14px |

### Spacing (`tokens/core/spacing.json`)

4px grid. Tokens: `spacing.1` = 4px, `spacing.2` = 8px … `spacing.16` = 64px.

## Semantic Tokens (Dark Mode)

| Token | CSS Variable | Description |
|---|---|---|
| Background canvas | `--color-background-canvas` | Page background |
| Background primary | `--color-background-primary` | Main surfaces |
| Text primary | `--color-text-primary` | Default text |
| Text muted | `--color-text-muted` | Placeholders, metadata |
| Border default | `--color-border-default` | Standard border |
| Border focus | `--color-border-focus` | Focus ring color |
| Interactive primary | `--color-interactive-primary-bg` | CTA background |

## Building Tokens

```bash
npm run build:tokens
```

Outputs:
- `tokens/css/tokens.dark.css` — CSS custom properties (dark mode)
- `tokens/css/tokens.light.css` — CSS custom properties (light mode)
- `tokens/js/tokens.dark.js` — JS constants
- `tokens/js/tokens.dark.d.ts` — TypeScript declarations
- `tokens/figma/figma-variables.json` — Figma Variable import format
