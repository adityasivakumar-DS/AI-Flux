/**
 * AI-Flux Design System — Dashboard Layout Stories
 *
 * Demonstrates the full DashboardLayout shell and each sub-component in
 * isolation. Designed for Storybook 7+.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DashboardLayout,
  DashboardHeader,
  DashboardSidebar,
  DashboardMain,
  DashboardFooter,
  useDashboard,
  BellIcon,
  SettingsIcon,
  SearchIcon,
} from './index';
import type { DashboardNavItem } from './Dashboard.types';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const LayoutIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ActivityIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const CpuIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const DatabaseIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const UsersIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const KeyIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const BookIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const NAV_ITEMS: DashboardNavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/overview',
    icon: <LayoutIcon />,
  },
  {
    id: 'models',
    label: 'Models',
    icon: <CpuIcon />,
    badge: 3,
    badgeVariant: 'primary',
    children: [
      { id: 'models-deployed', label: 'Deployed', href: '/models/deployed' },
      { id: 'models-training', label: 'Training', href: '/models/training', badge: '2', badgeVariant: 'warning' },
      { id: 'models-registry', label: 'Registry', href: '/models/registry' },
    ],
  },
  {
    id: 'pipelines',
    label: 'Pipelines',
    href: '/pipelines',
    icon: <ActivityIcon />,
    badge: 1,
    badgeVariant: 'error',
  },
  {
    id: 'datasets',
    label: 'Datasets',
    href: '/datasets',
    icon: <DatabaseIcon />,
  },
  {
    id: 'team',
    label: 'Team',
    href: '/team',
    icon: <UsersIcon />,
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    href: '/api-keys',
    icon: <KeyIcon />,
  },
  {
    id: 'docs',
    label: 'Documentation',
    href: 'https://docs.ai-flux.io',
    icon: <BookIcon />,
    external: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon />,
  },
];

// Minimal icon-button for the header actions area
const IconButton: React.FC<{ label: string; badge?: number; children: React.ReactNode }> = ({
  label,
  badge,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2.25rem',
      height: '2.25rem',
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '0.375rem',
      color: 'rgba(255,255,255,0.56)',
      cursor: 'pointer',
    }}
  >
    <span style={{ width: '1.125rem', height: '1.125rem', display: 'flex' }}>{children}</span>
    {badge !== undefined && (
      <span
        aria-label={`${badge} unread`}
        style={{
          position: 'absolute',
          top: '0.25rem',
          right: '0.25rem',
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          background: '#ef4444',
          border: '1.5px solid #0d0f14',
        }}
      />
    )}
  </button>
);

// Minimal user avatar chip for the header actions
const UserChip: React.FC = () => (
  <button
    type="button"
    aria-label="User menu"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '9999px',
      padding: '0.25rem 0.625rem 0.25rem 0.25rem',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.92)',
    }}
  >
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.75rem',
        height: '1.75rem',
        borderRadius: '50%',
        background: 'rgba(99,179,237,0.2)',
        color: '#63b3ed',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      AK
    </span>
    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Ada K.</span>
  </button>
);

const HEADER_ACTIONS = (
  <>
    <IconButton label="Notifications — 4 unread" badge={4}><BellIcon /></IconButton>
    <IconButton label="Settings"><SettingsIcon /></IconButton>
    <UserChip />
  </>
);

// Sample KPI card rendered inside the main content area
const KpiCard: React.FC<{ title: string; value: string; delta?: string; up?: boolean }> = ({
  title,
  value,
  delta,
  up,
}) => (
  <div
    style={{
      background: '#141720',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '0.5rem',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
    }}
  >
    <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.56)' }}>{title}</span>
    <span style={{ fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</span>
    {delta && (
      <span style={{ fontSize: '0.75rem', color: up ? '#34d399' : '#ef4444' }}>
        {up ? '▲' : '▼'} {delta}
      </span>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof DashboardLayout> = {
  title: 'AI-Flux / Layout / Dashboard',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page dashboard shell for the AI-Flux design system. Combines a sticky header, collapsible sidebar, scrollable main content area, and footer into a single composable layout.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Default full layout with all slots populated */
export const Default: Story = {
  args: {
    brandName: 'AI-Flux',
    navItems: NAV_ITEMS,
    defaultActiveNavId: 'overview',
    breadcrumbs: [
      { label: 'AI-Flux', href: '/' },
      { label: 'Overview' },
    ],
    topBarActions: HEADER_ACTIONS,
    showSearch: true,
    searchPlaceholder: 'Search models, pipelines…',
    pageHeading: 'Overview',
    pageSubheading: 'Real-time platform health and model performance.',
    footerStatus: 'operational',
    footerVersion: 'v2.4.1',
    footerCopyright: 'AI-Flux Platform',
    footerLinks: [
      { label: 'Status', href: 'https://status.ai-flux.io', external: true },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
    children: (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
          gap: '1rem',
        }}
      >
        <KpiCard title="Active Models" value="24" delta="3 this week" up />
        <KpiCard title="Inference / sec" value="12,840" delta="2.1%" up />
        <KpiCard title="Avg Latency" value="42 ms" delta="8 ms slower" up={false} />
        <KpiCard title="Token Budget Used" value="68%" delta="12% remaining" up={false} />
      </div>
    ),
  },
};

/** Sidebar starts collapsed (icon-only mode) */
export const CollapsedSidebar: Story = {
  args: {
    ...Default.args,
    defaultCollapsed: true,
    pageHeading: 'Collapsed sidebar',
    pageSubheading: 'The sidebar is in icon-only mode on desktop.',
  },
};

/** No footer */
export const NoFooter: Story = {
  args: {
    ...Default.args,
    showFooter: false,
    pageHeading: 'No footer',
    pageSubheading: 'showFooter={false} hides the footer bar.',
  },
};

/** Incident status in the footer */
export const IncidentStatus: Story = {
  args: {
    ...Default.args,
    footerStatus: 'incident',
    footerStatusLabel: 'Partial outage — inference API degraded',
    pageHeading: 'Incident active',
  },
};

/** Full content area padding removed — for full-bleed content */
export const FullBleed: Story = {
  args: {
    ...Default.args,
    mainNoPadding: true,
    pageHeading: undefined,
    pageSubheading: undefined,
    children: (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(99,179,237,0.08) 0%, transparent 60%)',
          color: 'rgba(255,255,255,0.32)',
          fontSize: '0.875rem',
        }}
      >
        Full-bleed content area — no padding applied
      </div>
    ),
  },
};

/** Controlled active nav item with interactive story */
export const ControlledNavigation: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState('overview');
    const [log, setLog] = useState<string[]>([]);

    return (
      <DashboardLayout
        {...args}
        activeNavId={activeId}
        onNavSelect={(item) => {
          setActiveId(item.id);
          setLog((prev) => [`Selected: ${item.label} (${item.id})`, ...prev.slice(0, 9)]);
        }}
        pageHeading="Controlled navigation"
        pageSubheading="Active item and selection events are managed externally."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '1rem',
              background: '#141720',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.56)',
            }}
          >
            <strong style={{ color: 'rgba(255,255,255,0.92)' }}>Active nav id:</strong>{' '}
            <code
              style={{
                background: 'rgba(99,179,237,0.12)',
                color: '#63b3ed',
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
                fontSize: '0.8125rem',
              }}
            >
              {activeId}
            </code>
          </div>

          <div
            style={{
              padding: '1rem',
              background: '#141720',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.5rem',
            }}
          >
            <p
              style={{
                margin: '0 0 0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.56)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Selection log
            </p>
            {log.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.24)' }}>
                Click a nav item to see events here.
              </p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {log.map((entry, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.8125rem',
                      color: i === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.4)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  },
  args: {
    brandName: 'AI-Flux',
    navItems: NAV_ITEMS,
    breadcrumbs: [{ label: 'AI-Flux', href: '/' }, { label: 'Demo' }],
    topBarActions: HEADER_ACTIONS,
    showSearch: true,
    footerStatus: 'operational',
    footerVersion: 'v2.4.1',
  },
};

/** Sub-components used individually without the composite shell */
export const SubcomponentsComposed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeNavId, setActiveNavId] = useState<string | undefined>('datasets');

    return (
      /* Provide context manually when not using DashboardLayout */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0d0f14', color: 'rgba(255,255,255,0.92)', fontFamily: 'system-ui, sans-serif' }}>
        <DashboardHeader
          brandName="AI-Flux"
          breadcrumbs={[{ label: 'Datasets' }]}
          actions={HEADER_ACTIONS}
          showSearch
        />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <DashboardSidebar
            items={NAV_ITEMS}
            onSelect={(item) => setActiveNavId(item.id)}
          />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <DashboardMain heading="Datasets" subheading="Manage your training and evaluation datasets.">
              <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '0.9375rem' }}>
                Sub-components composed manually — DashboardContext is provided automatically by
                each component. Use DashboardLayout for the simplest integration.
              </p>
            </DashboardMain>
            <DashboardFooter
              status="operational"
              version="v2.4.1"
              copyright="AI-Flux Platform"
            />
          </div>
        </div>
      </div>
    );
  },
};
