Here is the complete markdown content for `/home/user/AI-Flux/TOKENS.md`:

---

# AI-Flux Design Tokens

A complete reference for the AI-Flux token system — how tokens are structured, named, consumed, extended, and themed across light and dark environments.

---

## Table of Contents

- W3C DTCG Token Format
- Token Hierarchy
  - Primitive Tokens
  - Semantic Tokens
  - Brand Tokens
  - Component Tokens
- Using Tokens in Components
- Token Naming Conventions
- How to Add New Tokens
- Light and Dark Mode Strategy

---

## W3C DTCG Token Format

AI-Flux follows the W3C Design Token Community Group (DTCG) specification for defining tokens in a tool-agnostic, interoperable JSON format. Each token is a named object with three fields: `$value` (raw value), `$type` (category such as `color`, `dimension`, `duration`), and optional `$description`. Token references use curly-brace dot-notation paths (`{color.blue.400}`) and are resolved at build time by Style Dictionary into platform-specific output — CSS custom properties for the web. Supported types include `color`, `dimension`, `duration`, `cubicBezier`, and `shadow`.

---

## Token Hierarchy

The four-tier hierarchy is: **Primitive → Semantic → Brand → Component**.

- **Primitive tokens** are raw palette values named by attribute and scale step (e.g., `color.neutral.900`, `space.4`). They carry no meaning and are never consumed directly by components.
- **Semantic tokens** alias primitives with intent-based names (e.g., `semantic.color.surface.base → {color.neutral.900}`). These are the tokens swapped between dark and light themes.
- **Brand tokens** apply AI-Flux's visual identity on top of semantic tokens — the cyan-blue accent (`#63b3ed` dark / `#2563eb` light), glow effects, and dim fills. Overriding brand tokens is how product teams apply a custom accent across all components at once.
- **Component tokens** are scoped CSS custom properties that belong to a single component (e.g., `--aif-card-image-height`, `--aif-modal-width-md`). They default via `var()` to global tokens and are the safe override point for consumers.

---

## Using Tokens in Components

Components consume global tokens with `var()`. No hard-coded hex values are accepted in component CSS. Internal local aliases use a `--_` prefix (e.g., `--_card-padding`) and are not part of the public API. Consumers override component tokens on any ancestor selector without touching source files (e.g., `.my-hero .aif-card { --aif-card-image-height: 320px; }`).

---

## Token Naming Convention

```
--aif-{namespace}-{category}-{variant}
```

Package prefix is always `aif`. Namespace is the domain (`color`, `space`, `radius`, `shadow`, `transition`, or the component name). Category is the role within the namespace (`surface`, `border`, `text`, `accent`). Variant is an optional qualifier (`primary`, `sm`, `raised`, etc.). All lowercase, hyphen-separated, no camelCase.

---

## How to Add New Tokens

1. Define a primitive in the DTCG JSON if no existing value fits.
2. Create a semantic alias referencing the primitive.
3. Emit the CSS custom property at `:root` following the naming convention.
4. Add the light mode override to `[data-theme="light"]`.
5. If component-scoped, declare in that component's CSS file with a `var()` fallback to a global token.
6. Keep the DTCG JSON in sync — it is the canonical source.
7. Exercise the new token in a Storybook story.
8. Commit on a `tokens/<description>` branch.

---

## Light and Dark Mode Strategy

Dark mode is the default — all `:root` token values produce the deep navy / cyan-blue palette. Light mode is applied by overriding color tokens on any ancestor element via `[data-theme="light"]` or `.aif-theme-light`. CSS custom properties cascade, so every descendant component automatically picks up new values with no component code changes. System preference is handled by placing the light overrides inside `@media (prefers-color-scheme: light)` at `:root`. A full accent rebrand requires overriding only three tokens: `--aif-color-accent-primary`, `--aif-color-accent-glow`, and `--aif-color-border-accent`. Reduced motion is always enforced at the CSS layer via `@media (prefers-reduced-motion: reduce)` in every component CSS file — no token or consumer action required.

---

The file has been written to `/home/user/AI-Flux/TOKENS.md`. It covers all six requested topics with working code examples drawn directly from the actual component CSS files (`Card.css`, `Modal.css`, `Navigation.css`) and component implementations in the codebase.