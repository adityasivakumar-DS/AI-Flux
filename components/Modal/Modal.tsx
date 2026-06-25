All files are in place. Here is the complete implementation delivered across 6 files:

---

## AI-Flux Modal / Dialog Component

### Files created

| File | Purpose |
|---|---|
| `/home/user/AI-Flux/src/components/Modal/Modal.types.ts` | All TypeScript interfaces and type aliases |
| `/home/user/AI-Flux/src/components/Modal/Modal.tsx` | Component implementation |
| `/home/user/AI-Flux/src/components/Modal/Modal.css` | Scoped CSS with AI-Flux design tokens |
| `/home/user/AI-Flux/src/components/Modal/Modal.stories.tsx` | Storybook stories (8 stories) |
| `/home/user/AI-Flux/src/components/Modal/Modal.test.tsx` | RTL + userEvent test suite (30+ cases) |
| `/home/user/AI-Flux/src/components/Modal/index.ts` | Barrel export |

---

### Architecture decisions

**Focus trap** (`useFocusTrap` hook)
- Queries all `FOCUSABLE_SELECTORS` on every Tab/Shift+Tab keystroke — no stale list on DOM changes.
- Focus moved into the panel via `requestAnimationFrame` to guarantee the element is painted.
- Saves `document.activeElement` before open and restores it (also via rAF) after close.

**Scroll lock** (`useScrollLock` hook)
- Measures the scrollbar width before locking and compensates with `paddingRight` to prevent layout shift.
- Cleans up the original values on unmount, safe for nested modals.

**Exit animation lifecycle**
- `open` goes `false` → `animationState` flips to `exit` → the panel stays mounted for 240ms (slightly longer than the 220ms CSS duration) → then unmounts.
- `keepMounted` skips the unmount step entirely for scenarios that need to preserve internal state.

**Backdrop click**
- `onClick` on the backdrop checks `event.target === event.currentTarget`, so clicks originating inside the panel bubble up but do not trigger close.

**ESC key**
- Handled on the dialog `div`'s `onKeyDown` alongside Tab-trap logic.
- `event.stopPropagation()` prevents ESC from bubbling to outer modals when stacked.

**Portal**
- Rendered into `document.body` via `createPortal`; `z-index` is configurable via the `zIndex` prop and forwarded as a CSS custom property (`--aif-modal-z-index`).

**Compound pattern**
```tsx
// Named exports
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

// Compound dot-notation (matches Card pattern)
import Modal from './Modal';
<Modal ...>
  <Modal.Header showCloseButton>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer align="end">…</Modal.Footer>
</Modal>
```

**Drawer variant**
Four placements (`left | right | top | bottom`) each get their own slide-in/out `@keyframes` and edge-anchored CSS. The `::after` accent line rotates 90 degrees on left/right drawers to run vertically.

**ARIA compliance**
- `role="dialog"`, `aria-modal="true"` on the panel.
- `aria-labelledby` auto-wired to the `<h2>` inside `ModalHeader` via a generated stable `useId` ID.
- `aria-label` overrides `aria-labelledby` for modals without a visible header.
- `aria-describedby` pass-through for long descriptions.
- Close button carries `aria-label="Close dialog"` (customizable via `closeButtonLabel`).
- Backdrop is `aria-hidden="true"`; the panel is `aria-hidden={!open}` during exit animation.