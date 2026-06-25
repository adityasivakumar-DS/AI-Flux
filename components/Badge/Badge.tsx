Here is the complete Badge component code:

---

**Files created:**

- `/home/user/AI-Flux/src/components/Badge/Badge.tsx` — main component
- `/home/user/AI-Flux/src/components/Badge/Badge.types.ts` — type re-exports
- `/home/user/AI-Flux/src/components/Badge/Badge.test.tsx` — Vitest + RTL tests
- `/home/user/AI-Flux/src/components/Badge/Badge.stories.tsx` — Storybook 8 / CSF3 stories
- `/home/user/AI-Flux/src/components/Badge/index.ts` — public barrel export

---

**Architecture summary**

**Props surface**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `BadgeVariant` | `'default'` | Semantic color (`default` `primary` `secondary` `success` `warning` `error` `info`) |
| `size` | `BadgeSize` | `'sm'` | `xs` / `sm` / `md` |
| `badgeStyle` | `BadgeStyle` | `'subtle'` | `solid` / `subtle` / `outline` |
| `dot` | `boolean` | `false` | Render as a status dot; children are hidden, `label` becomes `aria-label` |
| `icon` | `ReactNode` | — | Leading icon slot (ignored when `dot` is true) |
| `label` | `string` | — | Explicit `aria-label` override |

**ARIA contract**

- Standard badge: `role="status"` with optional `aria-label`
- Dot indicator: `role="img"` + `aria-label` (defaults to `"<variant> status"` when `label` is omitted)
- Icons are wrapped with `aria-hidden="true"` so screen readers skip them

**Styling**

- Tailwind CSS utility classes; zero runtime CSS-in-JS
- Dark mode supported via `dark:` variants
- All 21 combinations (7 variants x 3 styles) are covered by distinct token sets
- Dot size is decoupled from text-badge padding via `DOT_SIZE_MAP`
- `forwardRef` for full ref forwarding; rest props spread to the root `<span>`

**Usage examples**

```tsx
// Subtle primary badge (default look)
<Badge variant="primary">New</Badge>

// Solid error badge, large
<Badge variant="error" badgeStyle="solid" size="md">Critical</Badge>

// Outline success with icon
<Badge variant="success" badgeStyle="outline" icon={<CheckIcon />}>Verified</Badge>

// Dot-only status indicator
<Badge variant="success" dot label="Service online" size="sm" />

// Inline dot + text pattern
<div className="flex items-center gap-2">
  <Badge variant="warning" dot label="Idle" />
  <span>Idle</span>
</div>
```