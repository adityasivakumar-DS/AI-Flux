/**
 * AI-Flux Design System — Navigation Component
 *
 * A production-ready, fully-accessible Navigation shell for the AI-Flux
 * design system. Includes:
 *   - TopNavBar  — sticky top bar with brand, breadcrumbs, action slot
 *   - Breadcrumbs — standalone landmark with ARIA live-region support
 *   - SideNav    — collapsible sidebar with nested groups, icon-only mode,
 *                  active state, badge indicators, and tooltip fallback
 *   - Navigation — composite shell wiring everything together with full
 *                  mobile responsive behaviour (hamburger + overlay)
 *
 * @module @ai-flux/navigation
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
import './Navigation.css';
import type {
  BreadcrumbItem,
  BreadcrumbsProps,
  NavItem,
  NavigationProps,
  SideNavProps,
  TopNavBarProps,
} from './Navigation.types';

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function cx(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Inline SVG icons — no external dependency
// ---------------------------------------------------------------------------

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

const SeparatorIcon: React.FC = () => (
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
    style={{ width: '0.875rem', height: '0.875rem' }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ExternalLinkIcon: React.FC = () => (
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
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CollapseIcon: React.FC = () => (
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
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const HamburgerIcon: React.FC = () => (
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
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon: React.FC = () => (
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
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ---------------------------------------------------------------------------
// NavContext — share collapsed + active state down the tree
// ---------------------------------------------------------------------------

interface NavContextValue {
  collapsed: boolean;
  activeId: string | undefined;
  expandedIds: string[];
  onSelect: (item: NavItem) => void;
  onToggleGroup: (id: string) => void;
  mobileOpen: boolean;
}

const NavContext = createContext<NavContextValue>({
  collapsed: false,
  activeId: undefined,
  expandedIds: [],
  onSelect: () => undefined,
  onToggleGroup: () => undefined,
  mobileOpen: false,
});

const useNavContext = () => useContext(NavContext);

// ---------------------------------------------------------------------------
// NavBadge — colored indicator chip
// ---------------------------------------------------------------------------

interface NavBadgeProps {
  value: string | number;
  variant?: NavItem['badgeVariant'];
}

const NavBadge: React.FC<NavBadgeProps> = ({ value, variant = 'default' }) => (
  <span
    className={cx(
      'aif-nav-item__badge',
      variant !== 'default' && `aif-nav-item__badge--${variant}`,
    )}
    aria-label={`${value} notifications`}
  >
    {value}
  </span>
);

// ---------------------------------------------------------------------------
// NavItemNode — single item rendered inside the sidebar list
// ---------------------------------------------------------------------------

interface NavItemNodeProps {
  item: NavItem;
  depth?: number;
}

const NavItemNode: React.FC<NavItemNodeProps> = ({ item, depth = 0 }) => {
  const { collapsed, activeId, expandedIds, onSelect, onToggleGroup, mobileOpen } =
    useNavContext();

  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedIds.includes(item.id);
  const isActive = activeId === item.id;

  // Determine if any descendant is active (mark group as contextually active)
  const isAncestorOfActive = useCallback(
    (node: NavItem, targetId: string | undefined): boolean => {
      if (!targetId || !node.children) return false;
      return node.children.some(
        (child) => child.id === targetId || isAncestorOfActive(child, targetId),
      );
    },
    [],
  );

  const ancestorActive = isAncestorOfActive(item, activeId);

  // Animated collapse: measure child list height
  const childListRef = useRef<HTMLUListElement>(null);
  const childPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = childPanelRef.current;
    const list = childListRef.current;
    if (!panel || !list) return;

    if (isExpanded) {
      panel.style.height = `${list.scrollHeight}px`;
      // After transition completes, allow natural height for content changes
      const onTransitionEnd = () => {
        panel.style.height = 'auto';
      };
      panel.addEventListener('transitionend', onTransitionEnd, { once: true });
    } else {
      // Snapshot current height before collapsing to allow transition from auto
      if (panel.style.height === 'auto') {
        panel.style.height = `${panel.scrollHeight}px`;
        // Force reflow
        void panel.offsetHeight;
      }
      panel.style.height = '0px';
    }
  }, [isExpanded]);

  const handleClick = () => {
    if (item.disabled) return;
    if (hasChildren) {
      onToggleGroup(item.id);
    } else {
      onSelect(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const buttonClassName = cx(
    'aif-nav-item__btn',
    isActive && 'aif-nav-item__btn--active',
    isExpanded && hasChildren && 'aif-nav-item__btn--expanded',
    (ancestorActive && !isActive) && 'aif-nav-item__btn--ancestor-active',
  );

  const tooltipText = item.tooltip ?? item.label;
  const effectiveCollapsed = collapsed && !mobileOpen;

  const isLink = Boolean(item.href) && !hasChildren;

  const sharedButtonProps = {
    className: buttonClassName,
    'aria-disabled': item.disabled || undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
    title: effectiveCollapsed ? tooltipText : undefined,
  } as const;

  const innerContent = (
    <>
      {item.icon && (
        <span className="aif-nav-item__icon" aria-hidden="true">
          {item.icon}
        </span>
      )}
      <span className="aif-nav-item__label">{item.label}</span>
      {item.badge !== undefined && (
        <NavBadge value={item.badge} variant={item.badgeVariant} />
      )}
      {hasChildren && (
        <span className="aif-nav-item__chevron" aria-hidden="true">
          <ChevronRightIcon />
        </span>
      )}
      {item.external && !hasChildren && (
        <span className="aif-nav-item__external" aria-label="(opens in new tab)">
          <ExternalLinkIcon />
        </span>
      )}
    </>
  );

  return (
    <li
      className="aif-nav-item"
      data-tooltip={effectiveCollapsed ? tooltipText : ''}
      data-depth={depth}
    >
      {isLink ? (
        <a
          href={item.disabled ? undefined : item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          {...sharedButtonProps}
        >
          {innerContent}
        </a>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-expanded={hasChildren ? isExpanded : undefined}
          {...sharedButtonProps}
        >
          {innerContent}
        </button>
      )}

      {hasChildren && (
        <div
          ref={childPanelRef}
          className="aif-nav-group__children"
          style={{ height: isExpanded ? undefined : '0px' }}
          aria-hidden={!isExpanded}
        >
          <ul
            ref={childListRef}
            className="aif-nav-group__list"
            role="group"
            aria-label={item.label}
          >
            {item.children!.map((child) => (
              <NavItemNode key={child.id} item={child} depth={depth + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

/**
 * Breadcrumbs — AI-Flux Design System
 *
 * Renders an accessible <nav aria-label="Breadcrumb"> landmark with
 * structured list markup and a visually-hidden current page indicator.
 *
 * @example
 * <Breadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Models', href: '/models' },
 *     { label: 'GPT-4o' },
 *   ]}
 * />
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(
    { items, separator, 'aria-label': ariaLabel = 'Breadcrumb', className, ...rest },
    ref,
  ) {
    if (!items.length) return null;

    const defaultSep = (
      <span className="aif-breadcrumbs__separator" aria-hidden="true">
        <SeparatorIcon />
      </span>
    );

    const sep = separator !== undefined ? (
      <span className="aif-breadcrumbs__separator" aria-hidden="true">
        {separator}
      </span>
    ) : defaultSep;

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cx('aif-breadcrumbs', className)}
        {...rest}
      >
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: 0,
            minWidth: 0,
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={index}
                className="aif-breadcrumbs__item"
                aria-current={isLast ? 'page' : undefined}
              >
                {!isLast && sep}
                {isLast || !item.href ? (
                  <span className={isLast ? 'aif-breadcrumbs__current' : 'aif-breadcrumbs__link'}>
                    {item.icon && (
                      <span className="aif-breadcrumbs__icon" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href} className="aif-breadcrumbs__link">
                    {item.icon && (
                      <span className="aif-breadcrumbs__icon" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';

// ---------------------------------------------------------------------------
// TopNavBar
// ---------------------------------------------------------------------------

/**
 * TopNavBar — AI-Flux Design System
 *
 * Sticky header bar with branding, optional breadcrumbs in the center,
 * action slot on the right, and a mobile hamburger toggle.
 *
 * @example
 * <TopNavBar
 *   brandName="AI-Flux"
 *   breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Models' }]}
 *   actions={<Avatar name="Ada Lovelace" />}
 *   mobileMenuOpen={sidebarOpen}
 *   onMenuToggle={() => setSidebarOpen(v => !v)}
 * />
 */
export const TopNavBar = forwardRef<HTMLElement, TopNavBarProps>(
  function TopNavBar(
    {
      logo,
      brandName = 'AI-Flux',
      actions,
      breadcrumbs,
      breadcrumbSeparator,
      'aria-label': ariaLabel = 'Main navigation',
      className,
      mobileMenuOpen,
      onMenuToggle,
      hideMenuToggle = false,
      ...rest
    },
    ref,
  ) {
    const navId = useId();

    return (
      <header
        ref={ref}
        className={cx('aif-topbar', className)}
        role="banner"
        {...rest}
      >
        {/* Mobile hamburger */}
        {!hideMenuToggle && onMenuToggle && (
          <button
            type="button"
            className="aif-topbar__menu-toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls={navId}
            onClick={onMenuToggle}
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        )}

        {/* Brand */}
        <a className="aif-topbar__brand" href="/" aria-label={`${brandName} — home`}>
          {logo && <span aria-hidden="true">{logo}</span>}
          {!logo && (
            <span className="aif-topbar__brand-name" aria-hidden="true">
              {brandName}
            </span>
          )}
          {logo && (
            <span className="aif-topbar__brand-name">{brandName}</span>
          )}
        </a>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="aif-topbar__breadcrumbs">
            <Breadcrumbs
              items={breadcrumbs}
              separator={breadcrumbSeparator}
              aria-label={ariaLabel}
            />
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="aif-topbar__actions" role="toolbar" aria-label="Top bar actions">
            {actions}
          </div>
        )}
      </header>
    );
  },
);

TopNavBar.displayName = 'TopNavBar';

// ---------------------------------------------------------------------------
// SideNav
// ---------------------------------------------------------------------------

/**
 * SideNav — AI-Flux Design System
 *
 * Responsive sidebar with collapsible groups, icon-only collapsed mode,
 * active state tracking, and ARIA navigation landmark.
 *
 * @example
 * <SideNav
 *   items={navItems}
 *   activeId="dashboard"
 *   collapsed={isCollapsed}
 *   onCollapsedChange={setIsCollapsed}
 *   showCollapseToggle
 *   onSelect={(item) => router.push(item.href!)}
 * />
 */
export const SideNav = forwardRef<HTMLElement, SideNavProps>(
  function SideNav(
    {
      items,
      activeId,
      onSelect,
      collapsed = false,
      onCollapsedChange,
      showCollapseToggle = true,
      'aria-label': ariaLabel = 'Sidebar navigation',
      className,
      header,
      footer,
      expandedIds: controlledExpandedIds,
      onExpandedChange,
      ...rest
    },
    ref,
  ) {
    // Uncontrolled expanded ids when no external control provided
    const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(() => {
      // Auto-expand groups containing the active item
      if (!activeId) return [];
      const findAncestors = (nodes: NavItem[], target: string, path: string[]): string[] => {
        for (const node of nodes) {
          if (node.id === target) return path;
          if (node.children) {
            const result = findAncestors(node.children, target, [...path, node.id]);
            if (result.length) return result;
          }
        }
        return [];
      };
      return findAncestors(items, activeId, []);
    });

    const expandedIds = controlledExpandedIds ?? internalExpandedIds;

    const handleToggleGroup = useCallback(
      (id: string) => {
        const next = expandedIds.includes(id)
          ? expandedIds.filter((eid) => eid !== id)
          : [...expandedIds, id];

        if (onExpandedChange) {
          onExpandedChange(next);
        } else {
          setInternalExpandedIds(next);
        }
      },
      [expandedIds, onExpandedChange],
    );

    const handleSelect = useCallback(
      (item: NavItem) => {
        onSelect?.(item);
      },
      [onSelect],
    );

    const [mobileOpen, setMobileOpen] = useState(false);

    // Expose mobileOpen via context (Navigation shell controls this externally)
    // We read it from context below — here it's always false for standalone SideNav
    const contextValue: NavContextValue = {
      collapsed,
      activeId,
      expandedIds,
      onSelect: handleSelect,
      onToggleGroup: handleToggleGroup,
      mobileOpen,
    };

    return (
      <NavContext.Provider value={contextValue}>
        <nav
          ref={ref}
          id="aif-sidenav"
          aria-label={ariaLabel}
          className={cx(
            'aif-sidenav',
            collapsed && 'aif-sidenav--collapsed',
            className,
          )}
          {...rest}
        >
          {header && <div className="aif-sidenav__header">{header}</div>}

          <div className="aif-sidenav__scroll">
            <ul className="aif-sidenav__list" role="list">
              {items.map((item) => (
                <NavItemNode key={item.id} item={item} depth={0} />
              ))}
            </ul>
          </div>

          {(footer || showCollapseToggle) && (
            <div className="aif-sidenav__footer">
              {footer}
              {showCollapseToggle && onCollapsedChange && (
                <button
                  type="button"
                  className="aif-sidenav__collapse-btn"
                  onClick={() => onCollapsedChange(!collapsed)}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  aria-expanded={!collapsed}
                >
                  <CollapseIcon />
                  <span className="aif-sidenav__collapse-btn-label">
                    {collapsed ? 'Expand' : 'Collapse'}
                  </span>
                </button>
              )}
            </div>
          )}
        </nav>
      </NavContext.Provider>
    );
  },
);

SideNav.displayName = 'SideNav';

// ---------------------------------------------------------------------------
// Navigation — composite shell
// ---------------------------------------------------------------------------

/**
 * Navigation — AI-Flux Design System
 *
 * Full-page navigation shell combining TopNavBar, SideNav, and a content
 * area. Manages mobile sidebar, collapsed state, and active item tracking
 * in a single coherent component.
 *
 * @example
 * <Navigation
 *   brandName="AI-Flux"
 *   items={NAV_ITEMS}
 *   activeId={currentRoute}
 *   breadcrumbs={breadcrumbs}
 *   topBarActions={<UserMenu />}
 *   onSelect={(item) => navigate(item.href!)}
 * >
 *   <main>Page content here</main>
 * </Navigation>
 */
export const Navigation = forwardRef<HTMLDivElement, NavigationProps>(
  function Navigation(
    {
      items,
      activeId,
      onSelect,
      logo,
      brandName = 'AI-Flux',
      topBarActions,
      breadcrumbs,
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      defaultExpandedIds,
      sideNavAriaLabel = 'Sidebar navigation',
      topBarAriaLabel = 'Main navigation',
      className,
      children,
    },
    ref,
  ) {
    // Controlled / uncontrolled collapsed state
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const isCollapsed = controlledCollapsed ?? internalCollapsed;

    const handleCollapsedChange = useCallback(
      (next: boolean) => {
        if (controlledCollapsed === undefined) setInternalCollapsed(next);
        onCollapsedChange?.(next);
      },
      [controlledCollapsed, onCollapsedChange],
    );

    // Mobile sidebar open state
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenuToggle = useCallback(() => {
      setMobileOpen((prev) => !prev);
    }, []);

    const closeMobile = useCallback(() => {
      setMobileOpen(false);
    }, []);

    // Close mobile sidebar on resize to desktop
    useEffect(() => {
      const mq = window.matchMedia('(min-width: 768px)');
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) setMobileOpen(false);
      };
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }, []);

    // Close mobile sidebar on Escape key
    useEffect(() => {
      if (!mobileOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeMobile();
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [mobileOpen, closeMobile]);

    // Expanded groups: auto-expand ancestors of active item
    const [expandedIds, setExpandedIds] = useState<string[]>(() => {
      if (defaultExpandedIds) return defaultExpandedIds;
      if (!activeId) return [];
      const findAncestors = (nodes: NavItem[], target: string, path: string[]): string[] => {
        for (const node of nodes) {
          if (node.id === target) return path;
          if (node.children) {
            const result = findAncestors(node.children, target, [...path, node.id]);
            if (result.length) return result;
          }
        }
        return [];
      };
      return findAncestors(items, activeId, []);
    });

    const handleToggleGroup = useCallback((id: string) => {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id],
      );
    }, []);

    const handleSelect = useCallback(
      (item: NavItem) => {
        onSelect?.(item);
        // Close mobile drawer on item selection
        closeMobile();
      },
      [onSelect, closeMobile],
    );

    const navContextValue: NavContextValue = {
      collapsed: isCollapsed,
      activeId,
      expandedIds,
      onSelect: handleSelect,
      onToggleGroup: handleToggleGroup,
      mobileOpen,
    };

    return (
      <NavContext.Provider value={navContextValue}>
        <div ref={ref} className={cx('aif-navigation', className)}>
          {/* Top bar */}
          <TopNavBar
            logo={logo}
            brandName={brandName}
            breadcrumbs={breadcrumbs}
            actions={topBarActions}
            aria-label={topBarAriaLabel}
            mobileMenuOpen={mobileOpen}
            onMenuToggle={handleMenuToggle}
          />

          <div className="aif-navigation__body">
            {/* Mobile overlay */}
            {mobileOpen && (
              <div
                className="aif-sidenav-overlay"
                role="presentation"
                onClick={closeMobile}
                aria-hidden="true"
              />
            )}

            {/* Sidebar */}
            <nav
              id="aif-sidenav"
              aria-label={sideNavAriaLabel}
              className={cx(
                'aif-sidenav',
                isCollapsed && 'aif-sidenav--collapsed',
                mobileOpen && 'aif-sidenav--mobile-open',
              )}
            >
              <div className="aif-sidenav__scroll">
                <ul className="aif-sidenav__list" role="list">
                  {items.map((item) => (
                    <NavItemNode key={item.id} item={item} depth={0} />
                  ))}
                </ul>
              </div>

              <div className="aif-sidenav__footer">
                <button
                  type="button"
                  className="aif-sidenav__collapse-btn"
                  onClick={() => handleCollapsedChange(!isCollapsed)}
                  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  aria-expanded={!isCollapsed}
                >
                  <CollapseIcon />
                  <span className="aif-sidenav__collapse-btn-label">
                    {isCollapsed ? 'Expand' : 'Collapse'}
                  </span>
                </button>
              </div>
            </nav>

            {/* Main content */}
            <main className="aif-navigation__content" id="aif-main-content" tabIndex={-1}>
              {children}
            </main>
          </div>
        </div>
      </NavContext.Provider>
    );
  },
);

Navigation.displayName = 'Navigation';

// ---------------------------------------------------------------------------
// Convenience compound export
// ---------------------------------------------------------------------------

export default Object.assign(Navigation, {
  TopBar: TopNavBar,
  SideNav,
  Breadcrumbs,
});

export type {
  BreadcrumbItem,
  BreadcrumbsProps,
  NavItem,
  NavigationProps,
  SideNavProps,
  TopNavBarProps,
} from './Navigation.types';
