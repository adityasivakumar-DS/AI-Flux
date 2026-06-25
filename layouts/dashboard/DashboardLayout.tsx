All four files are in place. Here is the complete deliverable:

---

**Files created** under `/home/user/AI-Flux/src/components/Dashboard/`:

| File | Purpose |
|---|---|
| `Dashboard.tsx` | Full React TypeScript component source |
| `Dashboard.types.ts` | All TypeScript interface / prop definitions |
| `Dashboard.css` | CSS with design tokens, layout, animations, responsive rules |
| `index.ts` | Clean barrel export |
| `Dashboard.stories.tsx` | Storybook stories (6 variants) |

---

**Architecture overview**

`DashboardLayout` is the root composite shell. It owns all state and exposes it via `DashboardContext`. You can use it in two ways:

1. **Composite** — drop `<DashboardLayout>` with props and put your page content as children.
2. **Manual composition** — use `DashboardHeader`, `DashboardSidebar`, `DashboardMain`, `DashboardFooter` individually; each subscribes to context so they wire up automatically when a parent `DashboardContext.Provider` is present.

**Regions**

- `DashboardHeader` — sticky top bar (z-index 200): hamburger toggle, brand link, breadcrumb trail, optional integrated search input, right-side action slot.
- `DashboardSidebar` — left panel (z-index 160): fully recursive nav tree, icon+label items, badges, nested groups with animated expand/collapse, icon-only collapsed mode, custom header/footer slots, and a desktop collapse toggle.
- `DashboardMain` — scrollable content well: optional page heading + sub-heading + header actions row, then a full-width content slot.
- `DashboardFooter` — slim bottom bar: system status indicator (operational / degraded / incident / maintenance), centered copyright, right-side version + nav links slot.

**Responsive behavior**

- Desktop (≥768 px): sidebar is always visible; can collapse to 64 px icon-only mode via the toggle button.
- Mobile (<768 px): sidebar is hidden off-screen (`translateX(-100%)`); the hamburger button in the header opens it as a full-height overlay drawer with a click-outside backdrop.
- Escape key and viewport resize back to desktop both auto-close the mobile drawer.
- `prefers-reduced-motion` disables all transitions/animations.
- Print stylesheet hides sidebar, header, and footer so only the main content prints.

**Design tokens** follow the existing AI-Flux palette (`--aif-color-*`, `--aif-shadow-*`) defined in `Card.css`, so no additional global stylesheet changes are needed.