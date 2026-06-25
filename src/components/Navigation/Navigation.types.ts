/**
 * AI-Flux Design System — Navigation Component Types
 *
 * @module @ai-flux/navigation
 */

import type React from 'react';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** A single navigation item — leaf node or group parent */
export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Route path or href */
  href?: string;
  /**
   * Icon rendered before the label.
   * Pass any React node — e.g. an SVG element or icon component.
   */
  icon?: React.ReactNode;
  /** Badge / count indicator rendered after the label */
  badge?: string | number;
  /** Semantic badge variant controls indicator color */
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Children make this item a collapsible group */
  children?: NavItem[];
  /** Prevent interaction without removing from the tree */
  disabled?: boolean;
  /** Mark item as external link — adds rel="noopener noreferrer" + target="_blank" */
  external?: boolean;
  /** Tooltip / title for the collapsed sidebar icon-only state */
  tooltip?: string;
}

/** Breadcrumb segment */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Optional href — last segment is typically not a link */
  href?: string;
  /** Optional icon */
  icon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// TopNavBar
// ---------------------------------------------------------------------------

export interface TopNavBarProps {
  /** Brand logo or wordmark element */
  logo?: React.ReactNode;
  /** Brand name — used as aria-label fallback and screen-reader text */
  brandName?: string;
  /** Slot for actions on the right side (search, avatar, buttons…) */
  actions?: React.ReactNode;
  /** Breadcrumb segments rendered in the top-bar center region */
  breadcrumbs?: BreadcrumbItem[];
  /** Custom separator between breadcrumb items */
  breadcrumbSeparator?: React.ReactNode;
  /** Override aria-label for the top navigation landmark */
  'aria-label'?: string;
  /** Additional class names */
  className?: string;
  /** Controlled open state of the mobile sidebar — required when onMenuToggle is provided */
  mobileMenuOpen?: boolean;
  /** Callback fired when the hamburger button is pressed */
  onMenuToggle?: () => void;
  /** Hide the hamburger toggle on mobile (e.g. when sidebar is always visible) */
  hideMenuToggle?: boolean;
}

// ---------------------------------------------------------------------------
// Breadcrumbs (standalone)
// ---------------------------------------------------------------------------

export interface BreadcrumbsProps {
  /** Breadcrumb segments */
  items: BreadcrumbItem[];
  /** Custom separator — defaults to a chevron SVG */
  separator?: React.ReactNode;
  /** Override aria-label for the breadcrumb landmark */
  'aria-label'?: string;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// SideNav
// ---------------------------------------------------------------------------

export interface SideNavProps {
  /** Navigation tree */
  items: NavItem[];
  /** Currently active item id */
  activeId?: string;
  /** Callback fired when a leaf item is selected */
  onSelect?: (item: NavItem) => void;
  /**
   * Collapsed mode — sidebar shows icons only.
   * Consumer controls width via CSS; the component adjusts inner layout.
   */
  collapsed?: boolean;
  /** Callback fired when collapsed state should change */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show a toggle button at the bottom of the sidebar */
  showCollapseToggle?: boolean;
  /** Override aria-label for the sidebar navigation landmark */
  'aria-label'?: string;
  /** Additional class names */
  className?: string;
  /** Header slot — rendered above the item list */
  header?: React.ReactNode;
  /** Footer slot — rendered below the item list (above collapse toggle) */
  footer?: React.ReactNode;
  /** Controlled set of expanded group ids */
  expandedIds?: string[];
  /** Callback fired when group expand/collapse state changes */
  onExpandedChange?: (ids: string[]) => void;
}

// ---------------------------------------------------------------------------
// Navigation (composite shell)
// ---------------------------------------------------------------------------

export interface NavigationProps {
  /** Navigation tree */
  items: NavItem[];
  /** Currently active item id */
  activeId?: string;
  /** Fires when any leaf nav item is selected */
  onSelect?: (item: NavItem) => void;
  /** Brand logo element */
  logo?: React.ReactNode;
  /** Brand name */
  brandName?: string;
  /** Right-side action slot for the top bar */
  topBarActions?: React.ReactNode;
  /** Breadcrumb segments */
  breadcrumbs?: BreadcrumbItem[];
  /** Initial collapsed state of the sidebar */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback fired on sidebar collapse toggle */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Controlled set of initially expanded group ids */
  defaultExpandedIds?: string[];
  /** Override sidebar aria-label */
  sideNavAriaLabel?: string;
  /** Override top bar aria-label */
  topBarAriaLabel?: string;
  /** Additional class names for the root wrapper */
  className?: string;
  /** Content area rendered to the right of the sidebar */
  children?: React.ReactNode;
}
