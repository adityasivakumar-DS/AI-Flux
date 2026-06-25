/**
 * AI-Flux Design System — Navigation Stories
 *
 * Storybook stories demonstrating all Navigation component variants.
 *
 * @module @ai-flux/navigation/stories
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Navigation, { Breadcrumbs, SideNav, TopNavBar } from './Navigation';
import type { NavItem, BreadcrumbItem } from './Navigation.types';

// ---------------------------------------------------------------------------
// Sample icons — inline SVGs for zero-dependency demo
// ---------------------------------------------------------------------------

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.44A3 3 0 0 1 4.5 9.5a2.5 2.5 0 0 1 5-5Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.44A3 3 0 0 0 19.5 9.5a2.5 2.5 0 0 0-5-5Z" />
  </svg>
);

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <HomeIcon />,
    tooltip: 'Dashboard',
  },
  {
    id: 'models',
    label: 'Models',
    icon: <BrainIcon />,
    badge: 4,
    badgeVariant: 'primary',
    tooltip: 'Models',
    children: [
      { id: 'model-gallery', label: 'Gallery', href: '/models/gallery' },
      { id: 'model-fine-tune', label: 'Fine-tuning', href: '/models/fine-tune' },
      { id: 'model-deploy', label: 'Deployments', href: '/models/deploy', badge: 2, badgeVariant: 'success' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChartIcon />,
    tooltip: 'Analytics',
    children: [
      { id: 'analytics-usage', label: 'Usage', href: '/analytics/usage' },
      { id: 'analytics-cost', label: 'Cost', href: '/analytics/cost' },
      { id: 'analytics-latency', label: 'Latency', href: '/analytics/latency' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    href: '/data',
    icon: <DatabaseIcon />,
    tooltip: 'Data',
  },
  {
    id: 'pipelines',
    label: 'Pipelines',
    href: '/pipelines',
    icon: <ZapIcon />,
    badge: 'New',
    badgeVariant: 'info',
    tooltip: 'Pipelines',
  },
  {
    id: 'team',
    label: 'Team',
    href: '/team',
    icon: <UsersIcon />,
    tooltip: 'Team',
  },
  {
    id: 'docs',
    label: 'Documentation',
    href: 'https://docs.ai-flux.io',
    icon: <BookIcon />,
    external: true,
    tooltip: 'Docs',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    tooltip: 'Settings',
    children: [
      { id: 'settings-general', label: 'General', href: '/settings/general' },
      { id: 'settings-api', label: 'API Keys', href: '/settings/api' },
      { id: 'settings-billing', label: 'Billing', href: '/settings/billing' },
      { id: 'settings-security', label: 'Security', href: '/settings/security', disabled: true },
    ],
  },
];

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Models', href: '/models' },
  { label: 'Fine-tuning' },
];

// ---------------------------------------------------------------------------
// AI-Flux brand mark
// ---------------------------------------------------------------------------

const AIFluxLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="28" height="28" rx="6" fill="#63b3ed" fillOpacity="0.15" />
    <path d="M7 21L14 7L21 21" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 16.5H18.5" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta<typeof Navigation> = {
  title: 'AI-Flux / Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page navigation shell for the AI-Flux design system. Combines a sticky TopNavBar, collapsible SideNav with icon support, breadcrumbs, active state, and mobile-responsive behavior.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

// ─── Full Shell ──────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('model-fine-tune');

    return (
      <Navigation
        brandName="AI-Flux"
        logo={<AIFluxLogo />}
        items={NAV_ITEMS}
        activeId={activeId}
        breadcrumbs={BREADCRUMBS}
        onSelect={(item) => item.href && setActiveId(item.id)}
        topBarActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #63b3ed 0%, #9f7aea 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#0d0f14',
              }}
            >
              AL
            </div>
          </div>
        }
      >
        <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.8)' }}>
          <h1 style={{ color: '#63b3ed', marginTop: 0 }}>Fine-tuning</h1>
          <p style={{ color: 'rgba(255,255,255,0.56)', lineHeight: 1.7 }}>
            Content area — the navigation shell renders any children here.
          </p>
        </div>
      </Navigation>
    );
  },
};

// ─── Collapsed Sidebar ───────────────────────────────────────────────────────

export const CollapsedSidebar: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('analytics-usage');
    const [collapsed, setCollapsed] = useState(true);

    return (
      <Navigation
        brandName="AI-Flux"
        logo={<AIFluxLogo />}
        items={NAV_ITEMS}
        activeId={activeId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        breadcrumbs={[{ label: 'Analytics', href: '/analytics' }, { label: 'Usage' }]}
        onSelect={(item) => item.href && setActiveId(item.id)}
      >
        <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.8)' }}>
          <h1 style={{ color: '#63b3ed', marginTop: 0 }}>Usage Analytics</h1>
          <p style={{ color: 'rgba(255,255,255,0.56)' }}>
            Sidebar is collapsed — hover over icons to see tooltips.
          </p>
        </div>
      </Navigation>
    );
  },
};

// ─── TopNavBar standalone ────────────────────────────────────────────────────

export const TopBarOnly: Story = {
  render: () => (
    <div style={{ background: '#0d0f14', minHeight: '100vh' }}>
      <TopNavBar
        logo={<AIFluxLogo />}
        brandName="AI-Flux"
        breadcrumbs={BREADCRUMBS}
        actions={
          <button
            type="button"
            style={{
              padding: '0.375rem 0.875rem',
              background: 'rgba(99,179,237,0.12)',
              border: '1px solid rgba(99,179,237,0.4)',
              borderRadius: '0.375rem',
              color: '#63b3ed',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Deploy Model
          </button>
        }
        onMenuToggle={() => alert('Toggle!')}
        mobileMenuOpen={false}
      />
    </div>
  ),
};

// ─── Breadcrumbs standalone ──────────────────────────────────────────────────

export const BreadcrumbsOnly: Story = {
  render: () => (
    <div style={{ background: '#0d0f14', padding: '2rem', minHeight: '100vh' }}>
      <Breadcrumbs items={BREADCRUMBS} />
      <br />
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
        separator="/"
      />
      <br />
      <Breadcrumbs
        items={[
          { label: 'AI-Flux', href: '/', icon: <HomeIcon /> },
          { label: 'Pipelines', href: '/pipelines' },
          { label: 'Run #47' },
        ]}
      />
    </div>
  ),
};

// ─── SideNav standalone ──────────────────────────────────────────────────────

export const SidebarOnly: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0d0f14' }}>
        <SideNav
          items={NAV_ITEMS}
          activeId={activeId}
          onSelect={(item) => setActiveId(item.id)}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          showCollapseToggle
          style={{ height: '100%' }}
        />
        <div style={{ flex: 1, padding: '2rem', color: 'rgba(255,255,255,0.8)' }}>
          Active: <code style={{ color: '#63b3ed' }}>{activeId}</code>
        </div>
      </div>
    );
  },
};

// ─── Disabled items ──────────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  render: () => {
    const disabledItems: NavItem[] = [
      ...NAV_ITEMS.slice(0, 3),
      {
        id: 'coming-soon',
        label: 'Coming Soon',
        href: '/coming-soon',
        icon: <ZapIcon />,
        disabled: true,
        tooltip: 'Coming soon',
      },
      ...NAV_ITEMS.slice(3),
    ];

    const [activeId, setActiveId] = useState('dashboard');

    return (
      <Navigation
        brandName="AI-Flux"
        logo={<AIFluxLogo />}
        items={disabledItems}
        activeId={activeId}
        onSelect={(item) => setActiveId(item.id)}
      >
        <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.56)' }}>
          The "Coming Soon" item is disabled.
        </div>
      </Navigation>
    );
  },
};
