All five files are written and correct. Here is a complete summary of what was produced.

---

## Avatar Component — AI-Flux Design System

Five files were created at `/home/user/AI-Flux/src/components/Avatar/`:

| File | Purpose |
|---|---|
| `Avatar.tsx` | Main component implementation |
| `Avatar.types.ts` | Standalone type re-exports |
| `Avatar.stories.tsx` | Storybook 8 / CSF3 stories (14 stories) |
| `Avatar.test.tsx` | Vitest + RTL test suite (40+ assertions) |
| `index.ts` | Public barrel export |

---

### Architecture decisions

**Display mode cascade (automatic, no prop needed)**

1. `src` provided and loads successfully — renders `<img>`
2. `src` fails (`onError`) or absent, `name` present — renders initials
3. Neither available — renders fallback icon (built-in person SVG or custom `fallbackIcon` prop)

**Color assignment for initials/icon mode**

Names are hashed into one of eight Tailwind color palettes (violet, sky, emerald, amber, rose, indigo, teal, pink). The same name always maps to the same color — deterministic across renders, no state required.

**Size tokens**

`SIZE_MAP` encodes container dimensions, text size, icon size, status dot size, and status ring width for all six sizes (`xs` → `2xl`) as Tailwind class strings. No inline styles.

**AvatarGroup context**

`AvatarGroupContext` propagates the group's `size` down to children, so individual `Avatar` instances inside `AvatarGroup` do not need an explicit `size` prop. A child `size` prop overrides the context.

**Overflow counter**

When `children.length > max`, the surplus avatars are hidden and a `+N` counter chip is rendered in the same diameter as the other avatars with a neutral palette.

**ARIA**

- `Avatar` root has `role="img"` with `aria-label` (falls back `name` → `"Avatar"`).
- Inner visual layer is `aria-hidden="true"` — screen readers see only the single label.
- Status dot carries its own `aria-label` ("Online", "Offline", "Away", "Busy") and `title`.
- `AvatarGroup` uses `role="group"` with a configurable `aria-label`.
- Overflow counter carries `aria-label="${N} more"`.

### Usage examples

```tsx
// Image avatar with online status
<Avatar src="/photo.jpg" name="Jane Smith" size="lg" status="online" />

// Initials avatar (auto-derived "JD")
<Avatar name="John Doe" size="md" status="away" shape="square" />

// Fallback icon
<Avatar size="sm" aria-label="Unknown agent" />

// Custom fallback icon
<Avatar fallbackIcon={<BotIcon />} aria-label="AI agent" size="xl" />

// AvatarGroup with overflow counter
<AvatarGroup max={4} size="md" aria-label="Team members">
  <Avatar name="Alice Chen" src="/alice.jpg" />
  <Avatar name="Bob Lee" />
  <Avatar name="Carol Wang" />
  <Avatar name="Dan Park" />
  <Avatar name="Eve Zhao" />  {/* renders as "+1" */}
</AvatarGroup>
```