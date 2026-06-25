/**
 * AI-Flux Design System — Modal / Dialog Component
 *
 * A fully-accessible, production-ready dialog and drawer component built on
 * the ARIA dialog pattern. Features:
 *   - Focus trap on open, focus restoration on close
 *   - ESC key to close
 *   - Backdrop click to close
 *   - Five dialog sizes + fullscreen
 *   - Drawer (side-panel) variant with four placements
 *   - Sub-components: ModalHeader, ModalBody, ModalFooter
 *   - Portal rendering via ReactDOM.createPortal
 *   - CSS animation with enter / exit states
 *   - Stacked z-index support
 *
 * @module @ai-flux/modal
 */

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import type {
  DrawerPlacement,
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
  ModalSize,
  ModalVariant,
} from './Modal.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ModalContextValue {
  onClose: () => void;
  titleId: string;
  size: ModalSize;
  variant: ModalVariant;
  drawerPlacement: DrawerPlacement;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('Modal sub-components must be used inside a <Modal> component.');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Focus Trap hook
// ---------------------------------------------------------------------------

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
  '[contenteditable]:not([contenteditable="false"])',
].join(', ');

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save focus target before the modal opens
  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [active]);

  // Move focus into the panel when it becomes active
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    const firstFocusable = focusable[0] ?? containerRef.current;

    // Defer to next tick so the element is fully painted
    const id = requestAnimationFrame(() => {
      firstFocusable.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(id);
  }, [active, containerRef]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!active) {
      const el = previousFocusRef.current;
      if (el && typeof el.focus === 'function') {
        requestAnimationFrame(() => el.focus({ preventScroll: true }));
      }
    }
  }, [active]);

  // Tab key trap handler — returns an onKeyDown handler
  const handleTabKey = useCallback(
    (event: React.KeyboardEvent) => {
      if (!active || !containerRef.current) return;
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      ).filter((el) => !el.closest('[aria-hidden="true"]'));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [active, containerRef],
  );

  return { handleTabKey };
}

// ---------------------------------------------------------------------------
// Scroll-lock hook
// ---------------------------------------------------------------------------

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [locked]);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cx(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}

function buildPanelClassNames(
  variant: ModalVariant,
  size: ModalSize,
  drawerPlacement: DrawerPlacement,
  animationState: 'enter' | 'exit',
  className?: string,
): string {
  const isDrawer = variant === 'drawer';

  return cx(
    'aif-modal',
    isDrawer ? 'aif-modal--drawer' : `aif-modal--${size}`,
    isDrawer && `aif-modal--drawer-${drawerPlacement}`,
    `aif-modal--${animationState}`,
    className,
  );
}

function buildBackdropClassNames(
  variant: ModalVariant,
  drawerPlacement: DrawerPlacement,
  animationState: 'enter' | 'exit',
  backdropClassName?: string,
): string {
  const isDrawer = variant === 'drawer';

  return cx(
    'aif-modal-backdrop',
    isDrawer && 'aif-modal-backdrop--drawer',
    isDrawer && `aif-modal-backdrop--drawer-${drawerPlacement}`,
    animationState === 'exit' && 'aif-modal-backdrop--exit',
    backdropClassName,
  );
}

// ---------------------------------------------------------------------------
// Modal (root)
// ---------------------------------------------------------------------------

/**
 * Modal / Dialog — AI-Flux Design System
 *
 * @example
 * // Basic centered dialog
 * <Modal open={open} onClose={() => setOpen(false)} size="md">
 *   <ModalHeader showCloseButton>Confirm Action</ModalHeader>
 *   <ModalBody>Are you sure you want to proceed?</ModalBody>
 *   <ModalFooter align="end">
 *     <button onClick={() => setOpen(false)}>Cancel</button>
 *     <button onClick={handleConfirm}>Confirm</button>
 *   </ModalFooter>
 * </Modal>
 *
 * @example
 * // Right-side drawer
 * <Modal open={open} onClose={() => setOpen(false)} variant="drawer" drawerPlacement="right">
 *   <ModalHeader showCloseButton>Settings</ModalHeader>
 *   <ModalBody>…</ModalBody>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'md',
  variant = 'modal',
  drawerPlacement = 'right',
  closeOnBackdropClick = true,
  closeOnEsc = true,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  keepMounted = false,
  className,
  backdropClassName,
  style,
  children,
  zIndex = 1000,
}) => {
  // Animation state: we need to keep rendering during exit animation
  const [mounted, setMounted] = useState(open);
  const [animationState, setAnimationState] = useState<'enter' | 'exit'>('enter');

  const panelRef = useRef<HTMLDivElement>(null);
  const generatedTitleId = useId();
  const titleId = ariaLabelledBy ?? `aif-modal-title-${generatedTitleId.replace(/:/g, '')}`;

  // Sync mount / unmount with open state + animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      setAnimationState('enter');
    } else {
      setAnimationState('exit');
      // Keep in DOM during exit animation (CSS --aif-modal-duration ≈ 220ms)
      const timer = setTimeout(() => {
        if (!keepMounted) setMounted(false);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [open, keepMounted]);

  const { handleTabKey } = useFocusTrap(panelRef, open);
  useScrollLock(open);

  // ESC key handler — attached to backdrop to capture all key events in the panel
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.stopPropagation();
        onClose();
      }
      handleTabKey(event);
    },
    [closeOnEsc, onClose, handleTabKey],
  );

  // Backdrop click — only close when the click target is the backdrop itself
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  if (!mounted) return null;

  const contextValue: ModalContextValue = {
    onClose,
    titleId,
    size,
    variant,
    drawerPlacement,
  };

  const backdropClass = buildBackdropClassNames(
    variant,
    drawerPlacement,
    animationState,
    backdropClassName,
  );

  const panelClass = buildPanelClassNames(
    variant,
    size,
    drawerPlacement,
    animationState,
    className,
  );

  const panel = (
    <ModalContext.Provider value={contextValue}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={backdropClass}
        style={{ '--aif-modal-z-index': zIndex } as React.CSSProperties}
        onClick={handleBackdropClick}
        aria-hidden="true"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : titleId}
          aria-describedby={ariaDescribedBy}
          className={panelClass}
          style={style}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          aria-hidden={!open}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );

  // Render into a portal at the document body
  return createPortal(panel, document.body);
};

Modal.displayName = 'Modal';

// ---------------------------------------------------------------------------
// ModalHeader
// ---------------------------------------------------------------------------

/**
 * ModalHeader — title bar with optional leading slot and built-in close button.
 *
 * The first `<h2>` or `<p>` child is automatically referenced by the dialog's
 * aria-labelledby. For full control, pass a custom `id` matching the Modal's
 * `aria-labelledby` prop.
 */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
  {
    showCloseButton = false,
    closeButtonLabel = 'Close dialog',
    leading,
    className,
    children,
    ...rest
  },
  ref,
) {
  const { onClose, titleId } = useModalContext();

  return (
    <div
      ref={ref}
      className={cx('aif-modal__header', className)}
      {...rest}
    >
      {leading && (
        <div className="aif-modal__header-leading" aria-hidden="true">
          {leading}
        </div>
      )}

      <div className="aif-modal__header-content">
        {/*
         * Wrap plain string children in a titled <h2> so the dialog's
         * aria-labelledby reference resolves correctly. React nodes
         * (e.g. custom headings) are rendered as-is.
         */}
        {typeof children === 'string' ? (
          <h2 id={titleId} className="aif-modal__header-title">
            {children}
          </h2>
        ) : (
          <div id={titleId}>{children}</div>
        )}
      </div>

      {showCloseButton && (
        <button
          type="button"
          aria-label={closeButtonLabel}
          className="aif-modal__header-close"
          onClick={onClose}
        >
          {/* X icon — inline SVG avoids external icon dependency */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

// ---------------------------------------------------------------------------
// ModalBody
// ---------------------------------------------------------------------------

/**
 * ModalBody — scrollable content area.
 */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { noPadding = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('aif-modal__body', noPadding && 'aif-modal__body--no-padding', className)}
      {...rest}
    >
      {children}
    </div>
  );
});

ModalBody.displayName = 'ModalBody';

// ---------------------------------------------------------------------------
// ModalFooter
// ---------------------------------------------------------------------------

/**
 * ModalFooter — action bar, typically housing CTA buttons.
 */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { align = 'end', divider = true, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        'aif-modal__footer',
        `aif-modal__footer--align-${align}`,
        divider && 'aif-modal__footer--divider',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

// ---------------------------------------------------------------------------
// Convenience compound export
// ---------------------------------------------------------------------------

export default Object.assign(Modal, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
