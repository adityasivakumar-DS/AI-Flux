/**
 * AI-Flux Design System — Navigation Component Tests
 *
 * @module @ai-flux/navigation/test
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation, { Breadcrumbs, SideNav, TopNavBar } from './Navigation';
import type { NavItem, BreadcrumbItem } from './Navigation.types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const IconStub = () => <svg data-testid="icon" aria-hidden="true" />;

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <IconStub />,
  },
  {
    id: 'models',
    label: 'Models',
    icon: <IconStub />,
    children: [
      { id: 'model-gallery', label: 'Gallery', href: '/models/gallery' },
      { id: 'model-deploy', label: 'Deployments', href: '/models/deploy' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    badge: 3,
    badgeVariant: 'primary',
  },
  {
    id: 'disabled-item',
    label: 'Disabled',
    href: '/disabled',
    disabled: true,
  },
  {
    id: 'docs',
    label: 'Documentation',
    href: 'https://docs.example.com',
    external: true,
  },
];

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Models', href: '/models' },
  { label: 'Gallery' },
];

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

describe('Breadcrumbs', () => {
  it('renders a nav landmark with aria-label', () => {
    render(<Breadcrumbs items={BREADCRUMBS} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders all breadcrumb labels', () => {
    render(<Breadcrumbs items={BREADCRUMBS} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Models')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  it('marks last item with aria-current="page"', () => {
    render(<Breadcrumbs items={BREADCRUMBS} />);
    const items = screen.getAllByRole('listitem');
    expect(items[items.length - 1]).toHaveAttribute('aria-current', 'page');
  });

  it('renders links for items with href', () => {
    render(<Breadcrumbs items={BREADCRUMBS} />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('does not render a link for the last item', () => {
    render(<Breadcrumbs items={BREADCRUMBS} />);
    // "Gallery" is the last item with no href — it should not be a link
    const galleryEl = screen.getByText('Gallery');
    expect(galleryEl.tagName).not.toBe('A');
  });

  it('returns null when items is empty', () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('accepts a custom separator', () => {
    render(<Breadcrumbs items={BREADCRUMBS} separator="/" />);
    const separators = screen.getAllByText('/');
    // Should have n-1 separators (2 for 3 items)
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// TopNavBar
// ---------------------------------------------------------------------------

describe('TopNavBar', () => {
  it('renders a banner landmark', () => {
    render(<TopNavBar brandName="AI-Flux" />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders brand name', () => {
    render(<TopNavBar brandName="AI-Flux" />);
    expect(screen.getByText('AI-Flux')).toBeInTheDocument();
  });

  it('renders breadcrumbs when provided', () => {
    render(<TopNavBar brandName="AI-Flux" breadcrumbs={BREADCRUMBS} />);
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(<TopNavBar brandName="AI-Flux" actions={<button>Action</button>} />);
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('shows hamburger toggle on mobile when onMenuToggle provided', () => {
    render(
      <TopNavBar
        brandName="AI-Flux"
        onMenuToggle={() => undefined}
        mobileMenuOpen={false}
      />,
    );
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('fires onMenuToggle when hamburger is clicked', async () => {
    const onToggle = jest.fn();
    render(
      <TopNavBar
        brandName="AI-Flux"
        onMenuToggle={onToggle}
        mobileMenuOpen={false}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows close icon when mobileMenuOpen is true', () => {
    render(
      <TopNavBar
        brandName="AI-Flux"
        onMenuToggle={() => undefined}
        mobileMenuOpen={true}
      />,
    );
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SideNav
// ---------------------------------------------------------------------------

describe('SideNav', () => {
  it('renders a navigation landmark', () => {
    render(<SideNav items={NAV_ITEMS} />);
    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();
  });

  it('renders all top-level items', () => {
    render(<SideNav items={NAV_ITEMS} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Models')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('marks active item with aria-current="page"', () => {
    render(<SideNav items={NAV_ITEMS} activeId="dashboard" />);
    const activeLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders badge on items with badge prop', () => {
    render(<SideNav items={NAV_ITEMS} />);
    expect(screen.getByLabelText('3 notifications')).toBeInTheDocument();
  });

  it('expands a group when its trigger is clicked', async () => {
    render(<SideNav items={NAV_ITEMS} />);
    const modelsBtn = screen.getByRole('button', { name: /models/i });
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(modelsBtn);
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });

  it('collapses an expanded group when clicked again', async () => {
    render(<SideNav items={NAV_ITEMS} expandedIds={['models']} />);
    const modelsBtn = screen.getByRole('button', { name: /models/i });
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(modelsBtn);
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('fires onSelect when a leaf item is clicked', async () => {
    const onSelect = jest.fn();
    render(<SideNav items={NAV_ITEMS} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'dashboard' }));
  });

  it('disables items with disabled=true', () => {
    render(<SideNav items={NAV_ITEMS} />);
    const disabledBtn = screen.getByText('Disabled').closest('[aria-disabled="true"]');
    expect(disabledBtn).toBeInTheDocument();
  });

  it('renders external link with correct rel and target', () => {
    render(<SideNav items={NAV_ITEMS} />);
    const externalLink = screen.getByRole('link', { name: /documentation/i });
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies collapsed class when collapsed=true', () => {
    render(<SideNav items={NAV_ITEMS} collapsed />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('aif-sidenav--collapsed');
  });

  it('fires onCollapsedChange when collapse toggle is clicked', async () => {
    const onCollapsedChange = jest.fn();
    render(
      <SideNav
        items={NAV_ITEMS}
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
        showCollapseToggle
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it('auto-expands ancestors of the active item', () => {
    render(<SideNav items={NAV_ITEMS} activeId="model-gallery" />);
    const modelsBtn = screen.getByRole('button', { name: /models/i });
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders header and footer slots', () => {
    render(
      <SideNav
        items={[]}
        header={<div>HEADER</div>}
        footer={<div>FOOTER</div>}
        showCollapseToggle={false}
      />,
    );
    expect(screen.getByText('HEADER')).toBeInTheDocument();
    expect(screen.getByText('FOOTER')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Navigation (composite shell)
// ---------------------------------------------------------------------------

describe('Navigation', () => {
  it('renders a banner and sidebar navigation landmark', () => {
    render(<Navigation items={NAV_ITEMS} brandName="AI-Flux" />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();
  });

  it('renders children in main content area', () => {
    render(
      <Navigation items={NAV_ITEMS} brandName="AI-Flux">
        <p>Hello Content</p>
      </Navigation>,
    );
    expect(screen.getByText('Hello Content')).toBeInTheDocument();
  });

  it('fires onSelect when a leaf item is selected', async () => {
    const onSelect = jest.fn();
    render(
      <Navigation items={NAV_ITEMS} onSelect={onSelect} brandName="AI-Flux" />,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'dashboard' }));
  });

  it('opens mobile sidebar when hamburger is clicked on narrow viewport', async () => {
    // Simulate mobile viewport width
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <Navigation items={NAV_ITEMS} brandName="AI-Flux" />,
    );

    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    await userEvent.click(toggle);

    const sidebar = screen.getByRole('navigation', { name: 'Sidebar navigation' });
    expect(sidebar).toHaveClass('aif-sidenav--mobile-open');
  });

  it('passes collapsed state to sidebar', () => {
    render(
      <Navigation items={NAV_ITEMS} brandName="AI-Flux" collapsed={true} />,
    );
    const sidebar = screen.getByRole('navigation', { name: 'Sidebar navigation' });
    expect(sidebar).toHaveClass('aif-sidenav--collapsed');
  });

  it('renders breadcrumbs in top bar when provided', () => {
    render(
      <Navigation items={NAV_ITEMS} brandName="AI-Flux" breadcrumbs={BREADCRUMBS} />,
    );
    expect(screen.getByText('Gallery')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Accessibility: keyboard navigation
// ---------------------------------------------------------------------------

describe('Keyboard navigation', () => {
  it('activates group toggle with Enter key', async () => {
    render(<SideNav items={NAV_ITEMS} />);
    const modelsBtn = screen.getByRole('button', { name: /models/i });
    modelsBtn.focus();
    await userEvent.keyboard('{Enter}');
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('activates group toggle with Space key', async () => {
    render(<SideNav items={NAV_ITEMS} />);
    const modelsBtn = screen.getByRole('button', { name: /models/i });
    modelsBtn.focus();
    await userEvent.keyboard(' ');
    expect(modelsBtn).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapse toggle button is focusable', () => {
    render(
      <SideNav
        items={NAV_ITEMS}
        collapsed={false}
        onCollapsedChange={() => undefined}
        showCollapseToggle
      />,
    );
    const btn = screen.getByRole('button', { name: /collapse sidebar/i });
    expect(btn).not.toHaveAttribute('tabindex', '-1');
  });
});
