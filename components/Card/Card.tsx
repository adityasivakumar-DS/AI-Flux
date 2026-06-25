Here is the complete production-ready Card component for AI-Flux. The files are at:

- `/home/user/AI-Flux/src/components/Card/Card.tsx` — component implementation
- `/home/user/AI-Flux/src/components/Card/Card.css` — design tokens + all styles
- `/home/user/AI-Flux/src/components/Card/index.ts` — public barrel export
- `/home/user/AI-Flux/src/components/Card/Card.stories.tsx` — Storybook stories
- `/home/user/AI-Flux/src/components/Card/Card.test.tsx` — full test suite

---

**Architecture decisions and what was built:**

**Design tokens (`Card.css` `:root`)**
All visual decisions are CSS custom properties — colors, shadows, spacing scale, radius scale, motion curves, and image sizing. Dark-first palette matches the AI-Flux brand (deep navy `#0d0f14` base, electric-blue `#63b3ed` accent). A repeating scanline `::before` texture adds the futuristic micro-detail without JS.

**Variants**
`default` — raised surface with subtle border and xs shadow.
`outlined` — transparent fill, strong border, no shadow.
`elevated` — deeper background with `md` shadow.
`ghost` — fully transparent, border and shadow removed, scanline texture hidden.

Each variant has its own hover treatment in interactive mode (glow ring for default/elevated, fill tint for outlined, surface reveal for ghost).

**Sub-components**
`CardHeader` — flex row with optional `leading` (avatar/icon) and `action` (icon button/badge) slots, auto-stretches the content area.
`CardBody` — grows to fill remaining space, `noPadding` prop for full-bleed content, removes top padding when directly after a header.
`CardFooter` — four alignment modes (`start`, `center`, `end`, `spread`), optional `divider` top border, wraps on overflow.
`CardImage` — four positions (`top`, `bottom`, `left`, `right`), four `fit` modes, custom `height`/`width` via CSS vars, optional gradient `overlay` with animated scale on interactive-card hover.

**Interactive / keyboard**
When `interactive` is set (or `onClick`/`href` provided), the card gets `role="button"`, `tabIndex=0`, and a `keyDown` handler activating on `Enter`/`Space`. The `href` mode renders a wrapping `<a>` instead, with automatic `rel="noopener noreferrer"` for `target="_blank"`. Disabled state uses `pointer-events: none` + `aria-disabled` + strips `href`.

**TypeScript**
All props are explicitly typed with exported interfaces. `forwardRef` is used on every sub-component. The `Card` default export is augmented with `.Header`, `.Body`, `.Footer`, `.Image` for dot-notation usage (`<Card.Header />`).

**ARIA**
`aria-label` / `aria-labelledby` pass through natively. `leading` and overlay `div` carry `aria-hidden="true"`. `aria-disabled` is set (not just `disabled`) so screen readers announce state on the focusable element. Focus ring uses `focus-visible` to avoid visible outlines on mouse click.

**Motion**
`prefers-reduced-motion` media query disables all transforms and transitions globally for the component.