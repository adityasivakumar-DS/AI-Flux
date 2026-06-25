# AI Flux 2.0 — Design System Governance

## Overview

AI Flux 2.0 is a **brand implementation** on top of the Enterprise Design System (Enterprise-DS).
All architectural decisions defer to Enterprise-DS. This document governs how AI Flux 2.0 is
maintained, extended, and kept Enterprise-DS compatible.

---

## Principles

1. **Never modify architecture** — folder structure, token hierarchy, component API shape
2. **Tokens only** — all brand expression via tokens; never raw values in components
3. **Semantic layer first** — components reference semantic tokens, never primitive tokens
4. **Backward compatible** — every change must be mergeable into Enterprise-DS without rework
5. **Accessibility non-negotiable** — WCAG 2.1 AA minimum; target AAA for body text

---

## Token Rules

| Rule | Description |
|---|---|
| **W3C DTCG format** | All token files use `$value`, `$type`, `$description` |
| **Reference chain** | Component → Semantic → Core (primitive). Never skip layers |
| **No raw values** | Never use hex/px directly in component CSS; always `var(--token-name)` |
| **Naming** | `kebab-case` throughout |

---

## Contribution Process

### Adding a Component

1. Create folder under `/components/<ComponentName>/`
2. Required files: `<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, `index.ts`
3. Add component tokens to `/tokens/component/<name>.json`
4. Reference only semantic tokens in CSS module
5. Write Storybook stories for all variants × states
6. Test accessibility with `@storybook/addon-a11y`
7. Update `/components/index.ts`

### Adding a Token

1. Determine layer: core (primitive) / semantic / brand / component
2. Add to the correct `tokens/<layer>/<category>.json`
3. Regenerate CSS: `npm run build:tokens`
4. Update Figma via: `npm run sync:figma`

### Modifying an Existing Token

1. Check all usages via `grep -r "var(--token-name)"` before changing
2. If renaming, maintain backwards-compatible alias for one major version
3. Document the change in CHANGELOG

---

## Versioning

AI Flux 2.0 follows **Semantic Versioning**:

| Change | Version bump |
|---|---|
| New token, new component | Minor (1.X.0) |
| Token rename / deprecation | Minor with deprecation notice |
| Breaking API change | Major (X.0.0) — requires Enterprise-DS team review |
| Bug fix, copy, doc | Patch (1.0.X) |

---

## Review Process

| PR type | Required reviewers |
|---|---|
| Token addition | 1 DS team member |
| Component addition | 2 DS team members + accessibility sign-off |
| Breaking change | DS lead + Enterprise-DS team |
| Governance change | DS lead |

---

## Enterprise-DS Compatibility Checklist

Before shipping any version, verify:

- [ ] Architecture matches Enterprise-DS exactly
- [ ] Folder structure unchanged
- [ ] All tokens W3C DTCG compliant
- [ ] No raw values in component CSS
- [ ] Figma variables synchronized
- [ ] Storybook builds without errors
- [ ] No accessibility violations (a11y addon clean)
- [ ] CHANGELOG updated
