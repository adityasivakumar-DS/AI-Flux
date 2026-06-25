/**
 * AI-Flux Design System — Dashboard Layout Shell
 *
 * A complete, production-ready dashboard layout combining:
 *   - Sidebar navigation (collapsible on desktop, drawer on mobile)
 *   - Top header bar with brand, breadcrumbs, search, and user actions
 *   - Main scrollable content area with slot for page content
 *   - Footer with status info and copyright
 *
 * Responsive behaviour:
 *   - Desktop (>=768px): sidebar is visible and can be collapsed to icon-only
 *   - Mobile (<768px): sidebar slides in as an overlay drawer via hamburger toggle
 *
 * @module @ai-flux/dashboard
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
import './Dashboard.css';
import type {
  DashboardContextValue,
  DashboardFooterProps,
  DashboardHeaderProps,
  DashboardLayoutProps,
  DashboardMainProps,
  DashboardNavItem,
  DashboardSidebarProps,
} from './Dashboard.types';

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function cx(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Inline SVG icons — zero external dependencies
// ---------------------------------------------------------------------------

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CircleStatusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 8"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <circle cx="4" cy="4" r="3" />
  </svg>
);

const ExternalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ---------------------------------------------------------------------------
// DashboardContext
// ---------------------------------------------------------------------------

const DashboardContext = createContext<DashboardContextValue>({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => undefined,
  mobileOpen: false,
  setMobileOpen: () => undefined,
  activeNavId: undefined,
  setActiveNavId: () => undefined,
});

export const useDashboard = () => useContext(DashboardContext);

// ---------------------------------------------------------------------------
// NavItemRow — single row inside the sidebar list
// ---------------------------------------------------------------------------

interface NavItemRowProps {
  item: DashboardNavItem;
  depth?: number;
  onSelect?: (item: DashboardNavItem) => void;
}

const NavItemRow: React.FC<NavItemRowProps> = ({ item, depth = 0, onSelect }) => {
  const { sidebarCollapsed, mobileOpen, activeNavId } = useDashboard();
  const effectiveCollapsed = sidebarCollapsed && !mobileOpen;

  const hasChildren = Boolean(item.children?.length);
  const [expanded, setExpanded] = useState(false);
  const isActive = activeNavId === item.id;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasChildren) {
      setExpanded((v) => !v);
    } else {
      onSelect?.(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const buttonCls = cx(
    'aif-dash-nav-item__btn',
    isActive && 'aif-dash-nav-item__btn--active',
    item.disabled && 'aif-dash-nav-item__btn--disabled',
  );

  const sharedProps = {
    className: buttonCls,
    'aria-disabled': item.disabled || undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
    title: effectiveCollapsed ? (item.tooltip ?? item.label) : undefined,
    style: depth > 0 ? { paddingLeft: `${0.75 + depth * 0.875}rem` } : undefined,
  } as const;

  const inner = (
    <>
      {item.icon && (
        <span className="aif-dash-nav-item__icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="aif-dash-nav-item__label">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={cx(
            'aif-dash-nav-item__badge',
            item.badgeVariant && `aif-dash-nav-item__badge--${item.badgeVariant}`,
          )}
          aria-label={`${item.badge} notifications`}
        >
          {item.badge}
        </span>
      )}
      {hasChildren && (
        <span
          className={cx(
            'aif-dash-nav-item__chevron',
            expanded && 'aif-dash-nav-item__chevron--open',
          )}
          aria-hidden="true"
        >
          <ChevronRightIcon />
        </span>
      )}
      {item.external && !hasChildren && (
        <span className="aif-dash-nav-item__ext" aria-label="(opens in new tab)">
          <ExternalIcon />
        </span>
      )}
    </>
  );

  const isLink = Boolean(item.href) && !hasChildren;

  return (
    <li className="aif-dash-nav-item" data-depth={depth}>
      {isLink ? (
        <a
          href={item.disabled ? undefined : item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          onClick={() => !item.disabled && onSelect?.(item)}
          {...sharedProps}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-expanded={hasChildren ? expanded : undefined}
          {...sharedProps}
        >
          {inner}
        </button>
      )}

      {hasChildren && expanded && (
        <ul className="aif-dash-nav-group__list" role="group" aria-label={item.label}>
          {item.children!.map((child) => (
            <NavItemRow key={child.id} item={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
};

// ---------------------------------------------------------------------------
// DashboardSidebar
// ---------------------------------------------------------------------------

/**
 * DashboardSidebar — AI-Flux Design System
 *
 * Sidebar navigation panel. Collapses to icon-only mode on desktop and slides
 * in as a full-height drawer on mobile.
 *
 * @example
 * <DashboardSidebar
 *   items={NAV_ITEMS}
 *   onSelect={(item) => navigate(item.href!)}
 *   sidebarHeader={<AppLogo />}
 *   sidebarFooter={<UserProfile />}
 * />
 */
export const DashboardSidebar = forwardRef<HTMLElement, DashboardSidebarProps>(
  function DashboardSidebar(
    {
      items,
      onSelect,
      sidebarHeader,
      sidebarFooter,
      'aria-label': ariaLabel = 'Sidebar navigation',
      className,
      showCollapseToggle = true,
      ...rest
    },
    ref,
  ) {
    const { sidebarCollapsed, setSidebarCollapsed, mobileOpen, setMobileOpen } =
      useDashboard();

    const handleOverlayClick = () => setMobileOpen(false);

    return (
      <>
        {/* Mobile overlay backdrop */}
        {mobileOpen && (
          <div
            className="aif-dash-overlay"
            role="presentation"
            aria-hidden="true"
            onClick={handleOverlayClick}
          />
        )}

        <nav
          ref={ref}
          id="aif-dashboard-sidebar"
          aria-label={ariaLabel}
          className={cx(
            'aif-dash-sidebar',
            sidebarCollapsed && 'aif-dash-sidebar--collapsed',
            mobileOpen && 'aif-dash-sidebar--mobile-open',
            className,
          )}
          {...rest}
        >
          {/* Sidebar header slot */}
          {sidebarHeader && (
            <div className="aif-dash-sidebar__header">{sidebarHeader}</div>
          )}

          {/* Nav list */}
          <div className="aif-dash-sidebar__scroll">
            <ul className="aif-dash-sidebar__list" role="list">
              {items.map((item) => (
                <NavItemRow key={item.id} item={item} onSelect={onSelect} />
              ))}
            </ul>
          </div>

          {/* Sidebar footer slot + collapse toggle */}
          <div className="aif-dash-sidebar__footer">
            {sidebarFooter && (
              <div className="aif-dash-sidebar__footer-slot">{sidebarFooter}</div>
            )}

            {showCollapseToggle && (
              <button
                type="button"
                className="aif-dash-sidebar__collapse-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!sidebarCollapsed}
              >
                {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                <span className="aif-dash-sidebar__collapse-label">
                  {sidebarCollapsed ? 'Expand' : 'Collapse'}
                </span>
              </button>
            )}
          </div>
        </nav>
      </>
    );
  },
);

DashboardSidebar.displayName = 'DashboardSidebar';

// ---------------------------------------------------------------------------
// DashboardHeader
// ---------------------------------------------------------------------------

/**
 * DashboardHeader — AI-Flux Design System
 *
 * Sticky top bar containing the hamburger toggle, brand name, optional
 * breadcrumbs, search input, and right-side action slot.
 *
 * @example
 * <DashboardHeader
 *   brandName="AI-Flux"
 *   breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Overview' }]}
 *   actions={<UserMenu />}
 * />
 */
export const DashboardHeader = forwardRef<HTMLElement, DashboardHeaderProps>(
  function DashboardHeader(
    {
      logo,
      brandName = 'AI-Flux',
      breadcrumbs,
      actions,
      showSearch = false,
      onSearch,
      searchPlaceholder = 'Search…',
      className,
      hideMenuToggle = false,
      ...rest
    },
    ref,
  ) {
    const { mobileOpen, setMobileOpen } = useDashboard();
    const searchId = useId();

    return (
      <header
        ref={ref}
        className={cx('aif-dash-header', className)}
        role="banner"
        {...rest}
      >
        {/* Hamburger toggle (mobile) */}
        {!hideMenuToggle && (
          <button
            type="button"
            className="aif-dash-header__menu-btn"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="aif-dashboard-sidebar"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        )}

        {/* Brand */}
        <a
          className="aif-dash-header__brand"
          href="/"
          aria-label={`${brandName} — home`}
        >
          {logo && <span className="aif-dash-header__brand-logo" aria-hidden="true">{logo}</span>}
          <span className={cx('aif-dash-header__brand-name', logo && 'aif-dash-header__brand-name--with-logo')}>
            {brandName}
          </span>
        </a>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className="aif-dash-header__breadcrumbs"
            aria-label="Breadcrumb"
          >
            <ol className="aif-dash-breadcrumbs">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li
                    key={idx}
                    className="aif-dash-breadcrumb__item"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {idx > 0 && (
                      <span className="aif-dash-breadcrumb__sep" aria-hidden="true">
                        <ChevronRightIcon />
                      </span>
                    )}
                    {isLast || !crumb.href ? (
                      <span
                        className={cx(
                          isLast
                            ? 'aif-dash-breadcrumb__current'
                            : 'aif-dash-breadcrumb__link',
                        )}
                      >
                        {crumb.icon && (
                          <span className="aif-dash-breadcrumb__icon" aria-hidden="true">
                            {crumb.icon}
                          </span>
                        )}
                        {crumb.label}
                      </span>
                    ) : (
                      <a href={crumb.href} className="aif-dash-breadcrumb__link">
                        {crumb.icon && (
                          <span className="aif-dash-breadcrumb__icon" aria-hidden="true">
                            {crumb.icon}
                          </span>
                        )}
                        {crumb.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Search */}
        {showSearch && (
          <div className="aif-dash-header__search">
            <label htmlFor={searchId} className="aif-dash-sr-only">
              {searchPlaceholder}
            </label>
            <span className="aif-dash-header__search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              id={searchId}
              type="search"
              className="aif-dash-header__search-input"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              aria-label={searchPlaceholder}
            />
          </div>
        )}

        {/* Right-side actions */}
        {actions && (
          <div className="aif-dash-header__actions" role="toolbar" aria-label="Header actions">
            {actions}
          </div>
        )}
      </header>
    );
  },
);

DashboardHeader.displayName = 'DashboardHeader';

// ---------------------------------------------------------------------------
// DashboardMain
// ---------------------------------------------------------------------------

/**
 * DashboardMain — AI-Flux Design System
 *
 * Scrollable main content area rendered to the right of the sidebar.
 * Accepts an optional page heading and renders children in the content well.
 *
 * @example
 * <DashboardMain heading="Overview" subheading="Last updated 2 minutes ago">
 *   <MetricsGrid />
 *   <ActivityFeed />
 * </DashboardMain>
 */
export const DashboardMain = forwardRef<HTMLElement, DashboardMainProps>(
  function DashboardMain(
    { heading, subheading, headerActions, children, className, noPadding = false, ...rest },
    ref,
  ) {
    return (
      <main
        ref={ref}
        id="aif-dashboard-main"
        tabIndex={-1}
        className={cx('aif-dash-main', className)}
        {...rest}
      >
        {(heading || subheading || headerActions) && (
          <div className="aif-dash-main__page-header">
            <div className="aif-dash-main__page-header-text">
              {heading && <h1 className="aif-dash-main__heading">{heading}</h1>}
              {subheading && (
                <p className="aif-dash-main__subheading">{subheading}</p>
              )}
            </div>
            {headerActions && (
              <div className="aif-dash-main__header-actions">{headerActions}</div>
            )}
          </div>
        )}

        <div className={cx('aif-dash-main__content', noPadding && 'aif-dash-main__content--no-padding')}>
          {children}
        </div>
      </main>
    );
  },
);

DashboardMain.displayName = 'DashboardMain';

// ---------------------------------------------------------------------------
// DashboardFooter
// ---------------------------------------------------------------------------

/**
 * DashboardFooter — AI-Flux Design System
 *
 * Footer bar spanning the full width below the content area. Includes a
 * left-side status indicator, center copyright text, and a right-side
 * version / build info slot.
 *
 * @example
 * <DashboardFooter
 *   status="operational"
 *   statusLabel="All systems operational"
 *   copyright="AI-Flux Platform"
 *   version="v2.4.1"
 * />
 */
export const DashboardFooter = forwardRef<HTMLElement, DashboardFooterProps>(
  function DashboardFooter(
    {
      status = 'operational',
      statusLabel,
      copyright = 'AI-Flux',
      year,
      version,
      links,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const displayYear = year ?? new Date().getFullYear();

    const statusConfig: Record<
      NonNullable<DashboardFooterProps['status']>,
      { label: string; cls: string }
    > = {
      operational: { label: 'Operational', cls: 'aif-dash-footer__status--operational' },
      degraded: { label: 'Degraded', cls: 'aif-dash-footer__status--degraded' },
      incident: { label: 'Incident', cls: 'aif-dash-footer__status--incident' },
      maintenance: { label: 'Maintenance', cls: 'aif-dash-footer__status--maintenance' },
    };

    const cfg = statusConfig[status];

    return (
      <footer
        ref={ref}
        className={cx('aif-dash-footer', className)}
        role="contentinfo"
        {...rest}
      >
        {/* Left — system status */}
        <div className="aif-dash-footer__left">
          <span className={cx('aif-dash-footer__status', cfg.cls)} aria-label={`System status: ${statusLabel ?? cfg.label}`}>
            <CircleStatusIcon className="aif-dash-footer__status-dot" />
            <span className="aif-dash-footer__status-label">{statusLabel ?? cfg.label}</span>
          </span>
        </div>

        {/* Center — copyright */}
        <div className="aif-dash-footer__center">
          <span className="aif-dash-footer__copyright">
            &copy; {displayYear} {copyright}. All rights reserved.
          </span>
        </div>

        {/* Right — version, links, or custom slot */}
        <div className="aif-dash-footer__right">
          {children}
          {links && links.length > 0 && (
            <nav aria-label="Footer links" className="aif-dash-footer__links">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="aif-dash-footer__link"
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
          {version && (
            <span className="aif-dash-footer__version" title={`Build version ${version}`}>
              {version}
            </span>
          )}
        </div>
      </footer>
    );
  },
);

DashboardFooter.displayName = 'DashboardFooter';

// ---------------------------------------------------------------------------
// DashboardLayout — root composite shell
// ---------------------------------------------------------------------------

/**
 * DashboardLayout — AI-Flux Design System
 *
 * Full-page dashboard shell that wires together the header, sidebar, main
 * content area, and footer into a single coherent layout.
 *
 * The layout manages:
 *   - Sidebar collapsed/expanded state (desktop icon-only mode)
 *   - Mobile sidebar open/close (overlay drawer)
 *   - Active navigation item tracking
 *   - Responsive breakpoint listener that auto-closes the mobile drawer
 *
 * All slots (header, sidebar, main, footer) are optional — you can render only
 * the sub-components you need, or use DashboardLayout as a pure context
 * provider and compose the sub-components yourself.
 *
 * @example
 * <DashboardLayout
 *   navItems={NAV_ITEMS}
 *   brandName="AI-Flux"
 *   defaultActiveNavId="dashboard"
 *   breadcrumbs={[{ label: 'Dashboard' }]}
 *   topBarActions={<UserMenu />}
 *   footerStatus="operational"
 *   footerVersion="v1.0.0"
 * >
 *   <MetricsGrid />
 *   <RecentActivity />
 * </DashboardLayout>
 */
export const DashboardLayout = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  function DashboardLayout(
    {
      // Navigation
      navItems = [],
      defaultActiveNavId,
      activeNavId: controlledActiveNavId,
      onNavSelect,
      // Sidebar
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      showCollapseToggle = true,
      sidebarHeader,
      sidebarFooter,
      // Header
      logo,
      brandName = 'AI-Flux',
      breadcrumbs,
      topBarActions,
      showSearch = false,
      onSearch,
      searchPlaceholder,
      hideMenuToggle = false,
      // Main
      pageHeading,
      pageSubheading,
      pageHeaderActions,
      mainNoPadding = false,
      // Footer
      footerStatus = 'operational',
      footerStatusLabel,
      footerCopyright,
      footerYear,
      footerVersion,
      footerLinks,
      footerContent,
      showFooter = true,
      // Layout
      className,
      children,
      ...rest
    },
    ref,
  ) {
    // Sidebar collapsed state — controlled or uncontrolled
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const sidebarCollapsed = controlledCollapsed ?? internalCollapsed;

    const setSidebarCollapsed = useCallback(
      (next: boolean) => {
        if (controlledCollapsed === undefined) setInternalCollapsed(next);
        onCollapsedChange?.(next);
      },
      [controlledCollapsed, onCollapsedChange],
    );

    // Mobile drawer state
    const [mobileOpen, setMobileOpen] = useState(false);

    // Active nav item — controlled or uncontrolled
    const [internalActiveNavId, setInternalActiveNavId] = useState(
      defaultActiveNavId,
    );
    const activeNavId = controlledActiveNavId ?? internalActiveNavId;

    const setActiveNavId = useCallback(
      (id: string | undefined) => {
        if (controlledActiveNavId === undefined) setInternalActiveNavId(id);
      },
      [controlledActiveNavId],
    );

    // Close mobile drawer on desktop breakpoint
    useEffect(() => {
      const mq = window.matchMedia('(min-width: 768px)');
      const onBreakpoint = (e: MediaQueryListEvent) => {
        if (e.matches) setMobileOpen(false);
      };
      mq.addEventListener('change', onBreakpoint);
      return () => mq.removeEventListener('change', onBreakpoint);
    }, []);

    // Close mobile drawer on Escape
    useEffect(() => {
      if (!mobileOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileOpen(false);
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [mobileOpen]);

    // Handle nav item selection
    const handleNavSelect = useCallback(
      (item: DashboardNavItem) => {
        setActiveNavId(item.id);
        onNavSelect?.(item);
        // Auto-close mobile drawer after selection
        setMobileOpen(false);
      },
      [setActiveNavId, onNavSelect],
    );

    const contextValue: DashboardContextValue = {
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileOpen,
      setMobileOpen,
      activeNavId,
      setActiveNavId,
    };

    return (
      <DashboardContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cx('aif-dashboard', className)}
          {...rest}
        >
          {/* Skip-to-content link for keyboard / screen-reader users */}
          <a href="#aif-dashboard-main" className="aif-dash-skip-link">
            Skip to main content
          </a>

          {/* Top header */}
          <DashboardHeader
            logo={logo}
            brandName={brandName}
            breadcrumbs={breadcrumbs}
            actions={topBarActions}
            showSearch={showSearch}
            onSearch={onSearch}
            searchPlaceholder={searchPlaceholder}
            hideMenuToggle={hideMenuToggle}
          />

          {/* Body row: sidebar + content */}
          <div className="aif-dashboard__body">
            {/* Sidebar */}
            <DashboardSidebar
              items={navItems}
              onSelect={handleNavSelect}
              sidebarHeader={sidebarHeader}
              sidebarFooter={sidebarFooter}
              showCollapseToggle={showCollapseToggle}
            />

            {/* Content column: main + footer */}
            <div className="aif-dashboard__content-col">
              <DashboardMain
                heading={pageHeading}
                subheading={pageSubheading}
                headerActions={pageHeaderActions}
                noPadding={mainNoPadding}
              >
                {children}
              </DashboardMain>

              {showFooter && (
                <DashboardFooter
                  status={footerStatus}
                  statusLabel={footerStatusLabel}
                  copyright={footerCopyright}
                  year={footerYear}
                  version={footerVersion}
                  links={footerLinks}
                >
                  {footerContent}
                </DashboardFooter>
              )}
            </div>
          </div>
        </div>
      </DashboardContext.Provider>
    );
  },
);

DashboardLayout.displayName = 'DashboardLayout';

// ---------------------------------------------------------------------------
// Default icons for demo / story use
// ---------------------------------------------------------------------------

export {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
};

// ---------------------------------------------------------------------------
// Convenience compound export
// ---------------------------------------------------------------------------

export default Object.assign(DashboardLayout, {
  Header: DashboardHeader,
  Sidebar: DashboardSidebar,
  Main: DashboardMain,
  Footer: DashboardFooter,
  useContext: useDashboard,
});

export type {
  DashboardContextValue,
  DashboardFooterProps,
  DashboardHeaderProps,
  DashboardLayoutProps,
  DashboardMainProps,
  DashboardNavItem,
  DashboardSidebarProps,
} from './Dashboard.types';
