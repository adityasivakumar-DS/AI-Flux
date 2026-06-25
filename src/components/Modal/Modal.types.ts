/**
 * AI-Flux Design System — Modal / Dialog Types
 *
 * @module @ai-flux/modal
 */

import React from 'react';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export type ModalVariant = 'modal' | 'drawer';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

// ---------------------------------------------------------------------------
// Root Modal props
// ---------------------------------------------------------------------------

export interface ModalProps {
  /** Controls open / closed state */
  open: boolean;
  /** Fired when the modal requests to close (ESC, backdrop click, close button) */
  onClose: () => void;
  /**
   * Size of the dialog panel.
   * Ignored when variant="drawer" and a placement is set.
   * @default 'md'
   */
  size?: ModalSize;
  /**
   * Render as a centered dialog or a side-panel drawer.
   * @default 'modal'
   */
  variant?: ModalVariant;
  /**
   * Which edge the drawer slides in from.
   * Only meaningful when variant="drawer".
   * @default 'right'
   */
  drawerPlacement?: DrawerPlacement;
  /** Close when clicking the backdrop overlay */
  closeOnBackdropClick?: boolean;
  /** Close on ESC key */
  closeOnEsc?: boolean;
  /** Accessible label for the dialog — used when no ModalHeader is present */
  'aria-label'?: string;
  /** ID of the element that labels the dialog (usually ModalHeader's title) */
  'aria-labelledby'?: string;
  /** ID of the element that describes the dialog */
  'aria-describedby'?: string;
  /** Keep the modal in the DOM but hidden (useful for animations) */
  keepMounted?: boolean;
  /** Additional class names for the dialog panel */
  className?: string;
  /** Additional class names for the backdrop overlay */
  backdropClassName?: string;
  /** Inline styles for the dialog panel */
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** z-index base for the portal stack — defaults to 1000 */
  zIndex?: number;
}

// ---------------------------------------------------------------------------
// Sub-component props
// ---------------------------------------------------------------------------

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Renders a built-in close (×) button in the trailing slot.
   * The button calls onClose from context, so it only works inside a Modal.
   */
  showCloseButton?: boolean;
  /** Override the accessible label of the close button */
  closeButtonLabel?: string;
  /** Icon or element in the leading slot (e.g. brand icon, status badge) */
  leading?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Remove default padding — useful for full-bleed content */
  noPadding?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alignment of footer children */
  align?: 'start' | 'center' | 'end' | 'spread';
  /** Render a divider above the footer */
  divider?: boolean;
  className?: string;
  children?: React.ReactNode;
}
