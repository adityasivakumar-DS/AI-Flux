# AI-Flux Design Tokens

A complete reference for the AI-Flux token system — how tokens are structured, named, consumed, extended, and themed across light and dark environments.

---

## Table of Contents

- [W3C DTCG Token Format](#w3c-dtcg-token-format)
- [Token Hierarchy](#token-hierarchy)
  - [Primitive Tokens](#1-primitive-tokens)
  - [Semantic Tokens](#2-semantic-tokens)
  - [Brand Tokens](#3-brand-tokens)
  - [Component Tokens](#4-component-tokens)
- [Using Tokens in Components](#using-tokens-in-components)
- [Token Naming Conventions](#token-naming-conventions)
- [How to Add New Tokens](#how-to-add-new-tokens)
- [Light and Dark Mode Strategy](#light-and-dark-mode-strategy)

---

## W3C DTCG Token Format

AI-Flux follows the [W3C Design Token Community Group (DTCG)](https://www.w3.org/community/design-tokens/) specification for defining tokens in a tool-agnostic, interoperable format.

### What the DTCG format is

The DTCG format is a proposed standard for expressing design tokens as structured JSON. Each token is a named object carrying a `$value` (the raw value), a `$type` (the value category such as `color`, `dimension`, `duration`), and an optional `$description`.

```json
{
  "color": {
    "blue": {
      "500": {
        "$type": "color",
        "$value": "#63b3ed",
        "$description": "AI-Flux primary cyan-blue accent. Used as the brand accent in dark mode."
      }
    }
  }
}
```

### Why it matters

| Concern | Benefit |
|---|---|
| Tool portability | Figma, Style Dictionary, Theo, and future tooling can all parse the same source file |
| Type safety | The `$type` field tells parsers exactly how to transform a value (e.g., `rem` → `px`) |
| Documentation in the token itself | `$description` travels with the token through the pipeline |
| References | Tokens can reference other tokens using `{path.to.token}` syntax, enforcing the alias hierarchy |

### Reference syntax

DTCG tokens reference each other with curly-brace dot-notation paths:

```json
{
  "semantic": {
    "color": {
      "accent": {
        "primary": {
          "$type": "color",
          "$value": "{color.blue.500}",
          "$description": "Primary interactive accent; resolves to the blue-500 primitive."
        }
      }
    }
  }
}
```

At build time, Style Dictionary (or an equivalent transform pipeline) resolves references and emits platform-specific output — CSS custom properties for the web, Swift constants for iOS, XML resources for Android.

### Supported `$type` values used in AI-Flux

| Type | Example value | CSS output |
|---|---|---|
| `color` | `#63b3ed` | `--token: #63b3ed` |
| `dimension` | `0.5rem` | `--token: 0.5rem` |
| `duration` | `200ms` | `--token: 200ms` |
| `cubicBezier` | `[0.4, 0, 0.2, 1]` | `--token: cubic-bezier(0.4, 0, 0.2, 1)` |
| `shadow` | composite object | `--token: 0 4px 16px rgba(...)` |

---

## Token Hierarchy

AI-Flux uses a four-tier token hierarchy. Each tier builds on the tier below it, and only the two lowest tiers contain raw values. Upper tiers are aliases that give meaning and context to those values.

```
Primitive  ──►  Semantic  ──►  Brand  ──►  Component
(raw values)    (intent)        (identity)  (scoped overrides)
```

### 1. Primitive Tokens

Primitive tokens are the raw, unnamed constants of the design system. They carry no semantic meaning — they are simply values pulled from a defined palette and scale.

**Characteristics:**
- Named by attribute and scale step, not by intent
- Never consumed directly by components
- Act as the single source of truth for every color, size, and duration value in the system

**Color primitives — blue palette:**

```json
{
  "color": {
    "blue": {
      "100": { "$type": "color", "$value": "#ebf8ff" },
      "200": { "$type": "color", "$value": "#bee3f8" },
      "300": { "$type": "color", "$value": "#90cdf4" },
      "400": { "$type": "color", "$value": "#63b3ed" },
      "500": { "$type": "color", "$value": "#4299e1" },
      "600": { "$type": "color", "$value": "#3182ce" },
      "700": { "$type": "color", "$value": "#2b6cb0" },
      "800": { "$type": "color", "$value": "#2c5282" },
      "900": { "$type": "color", "$value": "#2a4365" }
    }
  }
}
```

**Color primitives — neutral / surface palette:**

```json
{
  "color": {
    "neutral": {
      "0":   { "$type": "color", "$value": "#ffffff" },
      "50":  { "$type": "color", "$value": "#f8fafc" },
      "100": { "$type": "color", "$value": "#f1f5f9" },
      "200": { "$type": "color", "$value": "#e2e8f0" },
      "800": { "$type": "color", "$value": "#1a1e2a" },
      "850": { "$type": "color", "$value": "#141720" },
      "900": { "$type": "color", "$value": "#0d0f14" },
      "950": { "$type": "color", "$value": "#080a0f" }
    }
  }
}
```

**Spacing primitives (4 px base grid):**

```json
{
  "space": {
    "1": { "$type": "dimension", "$value": "0.25rem", "$description": "4px" },
    "2": { "$type": "dimension", "$value": "0.5rem",  "$description": "8px" },
    "3": { "$type": "dimension", "$value": "0.75rem", "$description": "12px" },
    "4": { "$type": "dimension", "$value": "1rem",    "$description": "16px" },
    "5": { "$type": "dimension", "$value": "1.25rem", "$description": "20px" },
    "6": { "$type": "dimension", "$value": "1.5rem",  "$description": "24px" },
    "8": { "$type": "dimension", "$value": "2rem",    "$description": "32px" }
  }
}
```

**Radius primitives:**

```json
{
  "radius": {
    "none": { "$type": "dimension", "$value": "0" },
    "sm":   { "$type": "dimension", "$value": "0.25rem" },
    "md":   { "$type": "dimension", "$value": "0.5rem"  },
    "lg":   { "$type": "dimension", "$value": "0.75rem" },
    "xl":   { "$type": "dimension", "$value": "1rem"    }
  }
}
```

**Motion primitives:**

```json
{
  "duration": {
    "fast": { "$type": "duration", "$value": "120ms" },
    "base": { "$type": "duration", "$value": "200ms" },
    "slow": { "$type": "duration", "$value": "350ms" }
  },
  "easing": {
    "standard": {
      "$type": "cubicBezier",
      "$value": [0.4, 0, 0.2, 1],
      "$description": "Material Design standard easing. Used for most transitions."
    },
    "decelerate": {
      "$type": "cubicBezier",
      "$value": [0, 0, 0.2, 1],
      "$description": "Used for elements entering the screen."
    }
  }
}
```

---

### 2. Semantic Tokens

Semantic tokens give intent and meaning to primitive values. They answer the question "what is this for?" rather than "what color is this?". A semantic token is always an alias — it always resolves to a primitive token via reference.

**Characteristics:**
- Named by role and usage, not by raw value
- Swapped between themes (the same semantic name points to a different primitive in dark vs. light mode)
- Consumed by brand tokens and component tokens, never by component implementations directly

**Color semantic tokens:**

```json
{
  "semantic": {
    "color": {
      "surface": {
        "base":    { "$type": "color", "$value": "{color.neutral.900}", "$description": "Lowest surface layer. Page background." },
        "raised":  { "$type": "color", "$value": "{color.neutral.850}", "$description": "Cards, panels — one level above base." },
        "overlay": { "$type": "color", "$value": "{color.neutral.800}", "$description": "Modals, popovers — topmost surface layer." },
        "subtle":  { "$type": "color", "$value": "rgba(255,255,255,0.03)", "$description": "Hover tint on transparent interactive elements." }
      },
      "border": {
        "default": { "$type": "color", "$value": "rgba(255,255,255,0.08)", "$description": "Standard divider and outline stroke." },
        "strong":  { "$type": "color", "$value": "rgba(255,255,255,0.16)", "$description": "Emphasized border for focused or hover states." },
        "accent":  { "$type": "color", "$value": "rgba(99,179,237,0.50)", "$description": "Accent-colored border; used on focus rings and active cards." }
      },
      "text": {
        "primary":   { "$type": "color", "$value": "rgba(255,255,255,0.92)", "$description": "Headings, labels, primary body copy." },
        "secondary": { "$type": "color", "$value": "rgba(255,255,255,0.56)", "$description": "Supporting text, metadata, captions." },
        "disabled":  { "$type": "color", "$value": "rgba(255,255,255,0.24)", "$description": "Placeholder text, disabled form controls." }
      },
      "feedback": {
        "success": { "$type": "color", "$value": "#34d399" },
        "warning": { "$type": "color", "$value": "#fbbf24" },
        "error":   { "$type": "color", "$value": "#ef4444" },
        "info":    { "$type": "color", "$value": "#38bdf8" }
      }
    },
    "shadow": {
      "xs":   { "$type": "shadow", "$value": "0 1px 2px rgba(0,0,0,0.4)" },
      "sm":   { "$type": "shadow", "$value": "0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)" },
      "md":   { "$type": "shadow", "$value": "0 4px 16px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)" },
      "lg":   { "$type": "shadow", "$value": "0 8px 32px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.5)" },
      "glow": { "$type": "shadow", "$value": "0 0 0 1px {semantic.color.border.accent}, 0 4px 20px {semantic.color.accent.glow}" }
    }
  }
}
```

---

### 3. Brand Tokens

Brand tokens sit above semantic tokens and express AI-Flux's specific visual identity — the cyan-blue accent, glow effects, and scan-line aesthetic. They alias semantic tokens and act as the primary override point for white-labeling or sub-brand customization.

**Characteristics:**
- Named by brand concept, not by color value
- Override semantic tokens to apply the AI-Flux identity
- Replacing brand token values is how product teams apply a custom accent color across all components in a single change

**Brand accent tokens:**

```json
{
  "brand": {
    "color": {
      "accent": {
        "primary": {
          "$type": "color",
          "$value": "{color.blue.400}",
          "$description": "AI-Flux signature cyan-blue. Maps to #63b3ed in dark mode, #2563eb in light mode."
        },
        "glow": {
          "$type": "color",
          "$value": "rgba(99,179,237,0.15)",
          "$description": "Translucent glow halo used in box-shadow and gradient overlays."
        },
        "dim": {
          "$type": "color",
          "$value": "rgba(99,179,237,0.08)",
          "$description": "Very low-opacity accent fill for active nav items and hover states."
        }
      }
    }
  }
}
```

**CSS output (dark mode defaults):**

```css
:root {
  --aif-color-accent-primary: #63b3ed;
  --aif-color-accent-glow:    rgba(99, 179, 237, 0.15);
  --aif-color-accent-dim:     rgba(99, 179, 237, 0.08);
}
```

---

### 4. Component Tokens

Component tokens are scoped CSS custom properties that belong to a single component. They provide overridable knobs for consumers without exposing the full token graph.

**Characteristics:**
- Declared in the component's own CSS file, not at `:root` globally
- Default values always fall back to global semantic or brand tokens
- Named with a component-specific infix so they are unambiguous and tree-shakeable
- Safe for consumers to override on a parent selector without touching global tokens

**Card component tokens:**

```css
/* Declared in Card.css */
:root {
  --aif-card-image-height: 200px;   /* Override per usage to change image crop height */
  --aif-card-image-width:  120px;   /* Override per usage to change side-image width */
  --aif-card-padding-sm: var(--aif-space-3) var(--aif-space-4);
  --aif-card-padding-md: var(--aif-space-4) var(--aif-space-5);
  --aif-card-padding-lg: var(--aif-space-6) var(--aif-space-8);
}
```

**Modal component tokens:**

```css
/* Declared in Modal.css */
:root {
  --aif-modal-backdrop-bg:   rgba(0, 0, 0, 0.72);
  --aif-modal-backdrop-blur: blur(4px);
  --aif-modal-bg:            #141720;
  --aif-modal-border:        rgba(255, 255, 255, 0.1);
  --aif-modal-radius:        0.75rem;
  --aif-modal-width-sm:      24rem;
  --aif-modal-width-md:      32rem;
  --aif-modal-width-lg:      48rem;
  --aif-modal-width-xl:      64rem;
  --aif-drawer-width-right:  28rem;
  --aif-drawer-width-left:   28rem;
  --aif-drawer-height-bottom: 50vh;
  --aif-drawer-height-top:   50vh;
}
```

**Navigation component tokens:**

```css
/* Declared in Navigation.css */
:root {
  --aif-nav-topbar-height:          3.5rem;
  --aif-nav-sidebar-width:          15rem;
  --aif-nav-sidebar-collapsed-width: 4rem;
  --aif-nav-sidebar-bg:             #0d0f14;
  --aif-nav-topbar-bg:              rgba(13, 15, 20, 0.88);
  --aif-nav-item-height:            2.5rem;
  --aif-nav-group-indent:           1rem;
  --aif-nav-transition:             220ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Using Tokens in Components

All component styles in AI-Flux are authored using CSS custom properties. No hard-coded hex values are accepted in component CSS — every design value must reference a token.

### Basic consumption pattern

```css
/* Component CSS — consume global tokens via var() */
.aif-card {
  color:      var(--aif-color-text-primary);
  background: var(--aif-color-surface-raised);
  border:     1px solid var(--aif-color-border-default);
  box-shadow: var(--aif-shadow-xs);
  transition: box-shadow var(--aif-transition-base),
              border-color var(--aif-transition-base);
}
```

### Local alias pattern

Use a local custom property (prefixed with `--_`) when a value is used multiple times within a component and benefits from a single override point inside the component block:

```css
.aif-card {
  --_card-padding: var(--aif-card-padding-md);  /* local alias */
}

.aif-card--size-sm { --_card-padding: var(--aif-card-padding-sm); }
.aif-card--size-lg { --_card-padding: var(--aif-card-padding-lg); }

.aif-card__header { padding: var(--_card-padding); }
.aif-card__body   { padding: var(--_card-padding); }
.aif-card__footer { padding: var(--_card-padding); }
```

The `--_` prefix signals that this property is internal to the component and not intended for consumer override.

### Consumer override pattern

Consumers can override component tokens on any ancestor element. This does not require modifying source files:

```css
/* Override card image dimensions for a hero layout */
.my-hero-section .aif-card {
  --aif-card-image-height: 320px;
}

/* Override modal drawer width for a wide settings panel */
.my-settings-trigger {
  --aif-drawer-width-right: 36rem;
}

/* Override nav sidebar width for a dense dashboard */
.my-dashboard {
  --aif-nav-sidebar-width: 12rem;
}
```

### Applying tokens in React components

When writing component logic that requires inline styles or dynamic values, pull tokens from the CSS layer using JavaScript `getComputedStyle` if needed, but prefer CSS classes that reference tokens wherever possible:

```tsx
// Prefer: CSS class that references token
<div className="aif-card aif-card--elevated aif-card--radius-lg" />

// When dynamic: set component token on the element, not a hardcoded value
<div
  className="aif-card"
  style={{ '--aif-card-image-height': `${imageHeight}px` } as React.CSSProperties}
/>
```

### Focus ring pattern

All interactive elements use the accent primary token for their focus ring, ensuring a single override point for the focus indicator across every component:

```css
.aif-card--interactive:focus-visible {
  outline: 2px solid var(--aif-color-accent-primary);
  outline-offset: 3px;
}

/* Navigation uses box-shadow for focus to avoid layout shift */
.aif-nav-item__btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--aif-color-accent-primary);
}
```

---

## Token Naming Conventions

All AI-Flux CSS custom properties follow a strict naming pattern:

```
--aif-{namespace}-{category}-{variant}
  │     │           │          │
  │     │           │          └─ Optional qualifier: primary, secondary, sm, md, lg, etc.
  │     │           └─────────── Category within the namespace: surface, border, text, etc.
  │     └─────────────────────── Namespace: color, space, radius, shadow, transition, or component name
  └───────────────────────────── Package prefix. Always "aif" to prevent collisions.
```

### Namespace reference

| Namespace | Prefix | Examples |
|---|---|---|
| Color — surface | `--aif-color-surface-*` | `--aif-color-surface-base`, `--aif-color-surface-raised`, `--aif-color-surface-overlay`, `--aif-color-surface-subtle` |
| Color — border | `--aif-color-border-*` | `--aif-color-border-default`, `--aif-color-border-strong`, `--aif-color-border-accent` |
| Color — accent | `--aif-color-accent-*` | `--aif-color-accent-primary`, `--aif-color-accent-glow`, `--aif-color-accent-dim` |
| Color — text | `--aif-color-text-*` | `--aif-color-text-primary`, `--aif-color-text-secondary`, `--aif-color-text-disabled` |
| Shadow | `--aif-shadow-*` | `--aif-shadow-xs`, `--aif-shadow-sm`, `--aif-shadow-md`, `--aif-shadow-lg`, `--aif-shadow-glow` |
| Spacing | `--aif-space-*` | `--aif-space-1` … `--aif-space-8` |
| Radius | `--aif-radius-*` | `--aif-radius-none`, `--aif-radius-sm`, `--aif-radius-md`, `--aif-radius-lg`, `--aif-radius-xl` |
| Motion | `--aif-transition-*` | `--aif-transition-fast`, `--aif-transition-base`, `--aif-transition-slow` |
| Card | `--aif-card-*` | `--aif-card-padding-sm`, `--aif-card-image-height`, `--aif-card-image-width` |
| Modal | `--aif-modal-*` | `--aif-modal-bg`, `--aif-modal-radius`, `--aif-modal-width-md` |
| Drawer | `--aif-drawer-*` | `--aif-drawer-width-right`, `--aif-drawer-height-bottom` |
| Navigation | `--aif-nav-*` | `--aif-nav-topbar-height`, `--aif-nav-sidebar-width`, `--aif-nav-item-height` |

### Naming rules

1. **Always lowercase, always hyphen-separated.** No camelCase, no underscores.
2. **The `aif-` prefix is mandatory** for all global tokens. Omitting it risks collision with browser-native custom properties or third-party CSS.
3. **Semantic names over value names.** Use `--aif-color-surface-raised`, not `--aif-color-neutral-850`. Token names describe intent, not raw values.
4. **Size qualifiers follow a predictable ramp:** `xs` `sm` `md` `lg` `xl` `2xl`. Do not invent arbitrary step names.
5. **Component tokens include the component name as the second segment:** `--aif-card-*`, `--aif-modal-*`, `--aif-nav-*`. This makes the owning component unambiguous.
6. **Internal/local tokens use `--_` prefix:** `--_card-padding`. These are never part of the public API.

---

## How to Add New Tokens

Follow these steps when extending the token system. The order matters — always define tokens at the lowest tier first, then reference upward.

### Step 1 — Define a primitive (if needed)

If the new value does not map to an existing primitive, add it to the palette in the DTCG source JSON:

```json
{
  "color": {
    "violet": {
      "400": { "$type": "color", "$value": "#a78bfa", "$description": "Violet palette step 400." },
      "600": { "$type": "color", "$value": "#7c3aed", "$description": "Violet palette step 600." }
    }
  }
}
```

Rule: A primitive carries no meaning. It is just a named slot in a scale.

### Step 2 — Create a semantic alias

Alias the primitive to a semantic name that describes its intended role:

```json
{
  "semantic": {
    "color": {
      "accent": {
        "secondary": {
          "$type": "color",
          "$value": "{color.violet.400}",
          "$description": "Secondary interactive accent for a dual-brand product surface."
        }
      }
    }
  }
}
```

### Step 3 — Emit the CSS custom property

Run the token transform pipeline (Style Dictionary or equivalent) to regenerate the CSS output file, or add the property manually to the global `:root` block in `Card.css` (which owns the root token set):

```css
:root {
  /* Existing tokens ... */
  --aif-color-accent-secondary: #a78bfa;
}
```

The property name must follow the naming convention: `--aif-{namespace}-{category}-{variant}`.

### Step 4 — Document the light mode value

Every new color token must have a light mode override. Add the light-theme value to the `[data-theme="light"]` block (see [Light and Dark Mode Strategy](#light-and-dark-mode-strategy)):

```css
[data-theme="light"] {
  --aif-color-accent-secondary: #7c3aed;
}
```

### Step 5 — Add a component token (if component-scoped)

If the token is only meaningful within a single component, declare it in that component's CSS file rather than at `:root`. Default it via `var()` to a global token:

```css
/* In Tooltip.css */
:root {
  --aif-tooltip-bg:     var(--aif-color-surface-overlay);
  --aif-tooltip-radius: var(--aif-radius-sm);
  --aif-tooltip-shadow: var(--aif-shadow-md);
}
```

### Step 6 — Update the DTCG source JSON

Keep the DTCG JSON in sync with what is emitted. Token JSON is the canonical source — the CSS file is an output artifact.

### Step 7 — Write a Storybook story or visual test

New tokens should be exercised in at least one Storybook story so visual regressions are caught during review.

### Step 8 — Commit with the `tokens/` branch prefix

```bash
git checkout -b tokens/add-accent-secondary
git commit -m "tokens(accent): add --aif-color-accent-secondary violet secondary accent"
```

---

## Light and Dark Mode Strategy

AI-Flux is dark-first. The default token values at `:root` produce the deep navy / cyan-blue dark palette. Light mode is an opt-in override applied to any ancestor element — the entire page, a section, or even a single card.

### How theming works

The global token set is declared at `:root` with dark-mode defaults. To switch a subtree to light mode, override the color tokens on any ancestor element using a theme attribute or class. Because CSS custom properties cascade and inherit, every descendant automatically picks up the new values without any component code changes.

### Dark mode token values (default `:root`)

```css
:root {
  /* Surface */
  --aif-color-surface-base:    #0d0f14;
  --aif-color-surface-raised:  #141720;
  --aif-color-surface-overlay: #1a1e2a;
  --aif-color-surface-subtle:  rgba(255, 255, 255, 0.03);

  /* Border */
  --aif-color-border-default: rgba(255, 255, 255, 0.08);
  --aif-color-border-strong:  rgba(255, 255, 255, 0.16);
  --aif-color-border-accent:  rgba(99, 179, 237, 0.50);

  /* Accent */
  --aif-color-accent-primary: #63b3ed;
  --aif-color-accent-glow:    rgba(99, 179, 237, 0.15);
  --aif-color-accent-dim:     rgba(99, 179, 237, 0.08);

  /* Text */
  --aif-color-text-primary:   rgba(255, 255, 255, 0.92);
  --aif-color-text-secondary: rgba(255, 255, 255, 0.56);
  --aif-color-text-disabled:  rgba(255, 255, 255, 0.24);

  /* Shadow */
  --aif-shadow-xs:   0 1px 2px rgba(0, 0, 0, 0.40);
  --aif-shadow-sm:   0 2px 8px rgba(0, 0, 0, 0.50), 0 1px 2px rgba(0, 0, 0, 0.30);
  --aif-shadow-md:   0 4px 16px rgba(0, 0, 0, 0.60), 0 2px 4px rgba(0, 0, 0, 0.40);
  --aif-shadow-lg:   0 8px 32px rgba(0, 0, 0, 0.70), 0 4px 8px rgba(0, 0, 0, 0.50);
  --aif-shadow-glow: 0 0 0 1px var(--aif-color-border-accent), 0 4px 20px var(--aif-color-accent-glow);
}
```

### Light mode token overrides

Apply to `[data-theme="light"]` on the `<html>` or `<body>` element, or on any container element for scoped light-mode panels within a dark UI:

```css
[data-theme="light"],
.aif-theme-light {
  /* Surface */
  --aif-color-surface-base:    #f8fafc;
  --aif-color-surface-raised:  #ffffff;
  --aif-color-surface-overlay: #f1f5f9;
  --aif-color-surface-subtle:  rgba(0, 0, 0, 0.03);

  /* Border */
  --aif-color-border-default: rgba(0, 0, 0, 0.08);
  --aif-color-border-strong:  rgba(0, 0, 0, 0.16);
  --aif-color-border-accent:  rgba(37, 99, 235, 0.40);

  /* Accent — shifted from cyan-blue to royal blue for light legibility */
  --aif-color-accent-primary: #2563eb;
  --aif-color-accent-glow:    rgba(37, 99, 235, 0.12);
  --aif-color-accent-dim:     rgba(37, 99, 235, 0.06);

  /* Text */
  --aif-color-text-primary:   rgba(0, 0, 0, 0.88);
  --aif-color-text-secondary: rgba(0, 0, 0, 0.54);
  --aif-color-text-disabled:  rgba(0, 0, 0, 0.26);

  /* Shadow — lighter, less opaque than dark mode */
  --aif-shadow-xs:   0 1px 2px rgba(0, 0, 0, 0.06);
  --aif-shadow-sm:   0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  --aif-shadow-md:   0 4px 16px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06);
  --aif-shadow-lg:   0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
  --aif-shadow-glow: 0 0 0 1px var(--aif-color-border-accent), 0 4px 20px var(--aif-color-accent-glow);
}
```

### Applying the theme in React

```tsx
// Whole-page dark mode (default — no attribute needed)
<html>
  <body>
    <App />  {/* uses dark defaults */}
  </body>
</html>

// Whole-page light mode
<html data-theme="light">
  <body>
    <App />  {/* all tokens resolve to light overrides */}
  </body>
</html>

// Scoped light panel inside a dark shell
<div className="aif-theme-light">
  <Card variant="elevated">
    {/* this card and its children use light tokens */}
  </Card>
</div>
```

### System preference auto-detection

To automatically match the user's OS preference without requiring a data attribute, add the light overrides inside a `prefers-color-scheme: light` media query at `:root`:

```css
@media (prefers-color-scheme: light) {
  :root {
    --aif-color-surface-base:    #f8fafc;
    --aif-color-surface-raised:  #ffffff;
    --aif-color-surface-overlay: #f1f5f9;
    --aif-color-surface-subtle:  rgba(0, 0, 0, 0.03);
    --aif-color-border-default:  rgba(0, 0, 0, 0.08);
    --aif-color-border-strong:   rgba(0, 0, 0, 0.16);
    --aif-color-border-accent:   rgba(37, 99, 235, 0.40);
    --aif-color-accent-primary:  #2563eb;
    --aif-color-accent-glow:     rgba(37, 99, 235, 0.12);
    --aif-color-accent-dim:      rgba(37, 99, 235, 0.06);
    --aif-color-text-primary:    rgba(0, 0, 0, 0.88);
    --aif-color-text-secondary:  rgba(0, 0, 0, 0.54);
    --aif-color-text-disabled:   rgba(0, 0, 0, 0.26);
    --aif-shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.06);
    --aif-shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
    --aif-shadow-md:  0 4px 16px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06);
    --aif-shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
  }
}
```

Note: Explicit `data-theme="dark"` or `data-theme="light"` attributes on the `<html>` element take precedence over the media query in typical implementations because the attribute selector has higher specificity. Structure your CSS so the media query is declared first and the attribute selectors appear after.

### Custom brand accent — single-line rebrand

Because all component accent usage flows through three tokens, a full accent color swap requires overriding only three values:

```css
/* Purple brand variant */
:root {
  --aif-color-accent-primary: #a78bfa;
  --aif-color-accent-glow:    rgba(167, 139, 250, 0.15);
  --aif-color-border-accent:  rgba(167, 139, 250, 0.40);
}
```

Every component — Card hover glow, Navigation active indicator, Modal accent edge, focus rings — immediately reflects the new accent without any per-component changes.

### Reduced motion

All transitions and transform animations in AI-Flux are wrapped in `@media (prefers-reduced-motion: reduce)` overrides at the bottom of each component's CSS file. This is not controlled by a token — it is always enforced at the CSS layer, independent of theme. No consumer action is required.

```css
@media (prefers-reduced-motion: reduce) {
  .aif-card,
  .aif-card__image {
    transition: none;
  }

  .aif-card--interactive:hover:not(.aif-card--disabled) {
    transform: none;
  }
}
```

---

## Quick Reference

### All global token names

```
Surface
  --aif-color-surface-base
  --aif-color-surface-raised
  --aif-color-surface-overlay
  --aif-color-surface-subtle

Border
  --aif-color-border-default
  --aif-color-border-strong
  --aif-color-border-accent

Accent
  --aif-color-accent-primary
  --aif-color-accent-glow
  --aif-color-accent-dim

Text
  --aif-color-text-primary
  --aif-color-text-secondary
  --aif-color-text-disabled

Shadow
  --aif-shadow-xs
  --aif-shadow-sm
  --aif-shadow-md
  --aif-shadow-lg
  --aif-shadow-glow

Spacing (4px base grid)
  --aif-space-1   (4px)
  --aif-space-2   (8px)
  --aif-space-3   (12px)
  --aif-space-4   (16px)
  --aif-space-5   (20px)
  --aif-space-6   (24px)
  --aif-space-8   (32px)

Radius
  --aif-radius-none
  --aif-radius-sm
  --aif-radius-md
  --aif-radius-lg
  --aif-radius-xl

Motion
  --aif-transition-fast   (120ms)
  --aif-transition-base   (200ms)
  --aif-transition-slow   (350ms)
```

### Component token names

```
Card
  --aif-card-padding-sm
  --aif-card-padding-md
  --aif-card-padding-lg
  --aif-card-image-height
  --aif-card-image-width

Modal / Drawer
  --aif-modal-backdrop-bg
  --aif-modal-backdrop-blur
  --aif-modal-bg
  --aif-modal-border
  --aif-modal-shadow
  --aif-modal-radius
  --aif-modal-width-sm
  --aif-modal-width-md
  --aif-modal-width-lg
  --aif-modal-width-xl
  --aif-modal-max-height
  --aif-modal-padding-sm
  --aif-modal-padding-md
  --aif-modal-padding-lg
  --aif-modal-duration
  --aif-drawer-width-right
  --aif-drawer-width-left
  --aif-drawer-height-bottom
  --aif-drawer-height-top

Navigation
  --aif-nav-topbar-height
  --aif-nav-sidebar-width
  --aif-nav-sidebar-collapsed-width
  --aif-nav-sidebar-bg
  --aif-nav-topbar-bg
  --aif-nav-item-height
  --aif-nav-group-indent
  --aif-nav-transition
  --aif-nav-mobile-overlay-bg
  --aif-nav-badge-min-width
  --aif-nav-focus-ring
```
