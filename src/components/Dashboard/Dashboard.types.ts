/**
 * AI-Flux Design System — Dashboard Layout Types
 *
 * @module @ai-flux/dashboard
 */

import type React from 'react';

// ---------------------------------------------------------------------------
// Navigation item
// ---------------------------------------------------------------------------

/** A single item in the sidebar navigation tree */
export interface DashboardNavItem {
  /** Unique identifier — used for active state tracking */
  id: string;
  /** Display label */
  label: string;
  /** Optional route path or href */
  href?: string;
  /** Icon rendered before the label (any React node: SVG, component, etc.) */
  icon?: React.ReactNode;
  /** Badge value rendered after the label */
  badge?: string | number;
  /** Controls the badge color */
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Nested child items — makes this item a collapsible group */
  children?: DashboardNavItem[];
  /** Prevents interaction while keeping the item visible */
  disabled?: boolean;
  /** Marks as external link — adds target="_blank" and rel="noopener noreferrer" */
  external?: boolean;
  /** Tooltip text shown in collapsed icon-only mode */
  tooltip?: string;
  /** Section divider label rendered above this item */
  sectionLabel?: string;
}

/** A breadcrumb segment */
export interface DashboardBreadcrumb {
  /** Display text */
  label: string;
  /** Optional navigation href */
  href?: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
}

/** A footer navigation link */
export interface DashboardFooterLink {
  label: string;
  href: string;
  external?: boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface DashboardContextValue {
  /** Whether the desktop sidebar is in icon-only collapsed mode */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Whether the mobile sidebar drawer is open */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  /** The currently active nav item id */
  activeNavId: string | undefined;
  setActiveNavId: (id: string | undefined) => void;
}

// ---------------------------------------------------------------------------
// Sub-component props
// ---------------------------------------------------------------------------

export interface DashboardSidebarProps {
  /** Navigation tree */
  items: DashboardNavItem[];
  /** Fired when a leaf item is selected */
  onSelect?: (item: DashboardNavItem) => void;
  /** Slot rendered above the nav list */
  sidebarHeader?: React.ReactNode;
  /** Slot rendered below the nav list (above the collapse toggle) */
  sidebarFooter?: React.ReactNode;
  /** Show or hide the desktop collapse toggle button */
  showCollapseToggle?: boolean;
  /** Override aria-label for the sidebar nav landmark */
  'aria-label'?: string;
  /** Additional CSS class names */
  className?: string;
}

export interface DashboardHeaderProps {
  /** Brand logo or wordmark element */
  logo?: React.ReactNode;
  /** Brand name displayed next to the logo */
  brandName?: string;
  /** Breadcrumb trail */
  breadcrumbs?: DashboardBreadcrumb[];
  /** Right-side action slot (user avatar, notifications, etc.) */
  actions?: React.ReactNode;
  /** Show integrated search input */
  showSearch?: boolean;
  /** Fired when the search input value changes */
  onSearch?: (query: string) => void;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Hide the hamburger menu toggle */
  hideMenuToggle?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export interface DashboardMainProps {
  /** Page-level heading rendered above the content slot */
  heading?: React.ReactNode;
  /** Secondary heading or description line */
  subheading?: React.ReactNode;
  /** Actions rendered alongside the page heading (buttons, filters, etc.) */
  headerActions?: React.ReactNode;
  /** Remove default content padding */
  noPadding?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Page content */
  children?: React.ReactNode;
}

export interface DashboardFooterProps {
  /** System status indicator */
  status?: 'operational' | 'degraded' | 'incident' | 'maintenance';
  /** Override the auto-derived status label */
  statusLabel?: string;
  /** Brand / company name in the copyright notice */
  copyright?: string;
  /** Copyright year — defaults to current year */
  year?: number;
  /** Version string (e.g. "v2.4.1") */
  version?: string;
  /** Footer nav links */
  links?: DashboardFooterLink[];
  /** Additional right-side slot content */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Root layout props
// ---------------------------------------------------------------------------

export interface DashboardLayoutProps {
  // --- Navigation ---
  /** The full sidebar navigation tree */
  navItems?: DashboardNavItem[];
  /**
   * Initial active nav item id (uncontrolled).
   * Use `activeNavId` + `onNavSelect` for controlled behaviour.
   */
  defaultActiveNavId?: string;
  /** Controlled active nav item id */
  activeNavId?: string;
  /** Fired whenever a nav item is selected */
  onNavSelect?: (item: DashboardNavItem) => void;

  // --- Sidebar ---
  /** Initial collapsed state (uncontrolled) */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Fired when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show the desktop sidebar collapse toggle button */
  showCollapseToggle?: boolean;
  /** Custom content rendered at the top of the sidebar */
  sidebarHeader?: React.ReactNode;
  /** Custom content rendered at the bottom of the sidebar */
  sidebarFooter?: React.ReactNode;

  // --- Header ---
  /** Brand logo element */
  logo?: React.ReactNode;
  /** Brand name */
  brandName?: string;
  /** Breadcrumb trail rendered in the header */
  breadcrumbs?: DashboardBreadcrumb[];
  /** Right-side header action slot */
  topBarActions?: React.ReactNode;
  /** Show integrated search */
  showSearch?: boolean;
  /** Fired when search query changes */
  onSearch?: (query: string) => void;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Hide hamburger toggle */
  hideMenuToggle?: boolean;

  // --- Main ---
  /** Page-level heading */
  pageHeading?: React.ReactNode;
  /** Page sub-heading / description */
  pageSubheading?: React.ReactNode;
  /** Actions rendered alongside the page heading */
  pageHeaderActions?: React.ReactNode;
  /** Remove default main content padding */
  mainNoPadding?: boolean;

  // --- Footer ---
  /** System status indicator */
  footerStatus?: DashboardFooterProps['status'];
  /** Override auto-derived status label */
  footerStatusLabel?: string;
  /** Copyright entity name */
  footerCopyright?: string;
  /** Copyright year */
  footerYear?: number;
  /** Version string */
  footerVersion?: string;
  /** Footer nav links */
  footerLinks?: DashboardFooterLink[];
  /** Custom footer right-side slot */
  footerContent?: React.ReactNode;
  /** Mount the footer. Defaults to true. */
  showFooter?: boolean;

  // --- Layout ---
  /** Additional class names for the root wrapper */
  className?: string;
  /** Page content rendered inside the main content area */
  children?: React.ReactNode;
}
