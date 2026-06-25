Now I have a thorough understanding of all AI-Flux components. Let me generate the complete Dashboard pattern.

```tsx
/**
 * AI-Flux Design System — Dashboard Pattern
 * Brand: AI-Flux | Personality: Intelligent · Precise · Futuristic
 *
 * Includes:
 *   - Stats cards with trend indicators
 *   - Chart placeholders (line, bar, donut)
 *   - Recent activity table
 *   - Quick actions panel
 */

import React, { useState } from 'react';

// ── AI-Flux component imports ─────────────────────────────────────────────────
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from './components/Card/Card';
import { Badge } from './components/Badge/Badge';
import { Avatar, AvatarGroup } from './components/Avatar/Avatar';
import { Table } from './components/Table/Table';
import type { TableColumn } from './components/Table/Table';
import { Tabs, TabList, TabTrigger, TabPanels, TabPanel } from './components/Tabs/Tabs';
import { Navigation } from './components/Navigation/Navigation';
import type { NavItem } from './components/Navigation/Navigation.types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatCard {
  id: string;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  icon: React.ReactNode;
  accent: string;
}

interface ActivityRow {
  id: string;
  event: string;
  actor: string;
  actorAvatar?: string;
  model: string;
  status: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  tokens: number;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outlined';
}

// ── Inline SVG Icons ──────────────────────────────────────────────────────────

const IconCpu: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="2" x2="9" y2="4" />
    <line x1="15" y1="2" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="22" />
    <line x1="15" y1="20" x2="15" y2="22" />
    <line x1="20" y1="9" x2="22" y2="9" />
    <line x1="20" y1="14" x2="22" y2="14" />
    <line x1="2" y1="9" x2="4" y2="9" />
    <line x1="2" y1="14" x2="4" y2="14" />
  </svg>
);

const IconZap: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconDatabase: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
);

const IconActivity: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconTrendUp: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconTrendDown: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const IconPlay: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconPlus: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconUpload: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconSettings: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
  </svg>
);

const IconGrid: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconLayers: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconBell: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ── Static Data ───────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  {
    id: 'inference-requests',
    label: 'Inference Requests',
    value: '2.47M',
    delta: 12.4,
    deltaLabel: 'vs last week',
    icon: <IconCpu size={22} />,
    accent: '#63b3ed',
  },
  {
    id: 'avg-latency',
    label: 'Avg. Latency',
    value: '148ms',
    delta: -8.2,
    deltaLabel: 'vs last week',
    icon: <IconZap size={22} />,
    accent: '#68d391',
  },
  {
    id: 'tokens-processed',
    label: 'Tokens Processed',
    value: '18.9B',
    delta: 31.7,
    deltaLabel: 'vs last week',
    icon: <IconDatabase size={22} />,
    accent: '#b794f4',
  },
  {
    id: 'model-uptime',
    label: 'Model Uptime',
    value: '99.97%',
    delta: 0.03,
    deltaLabel: 'SLA target: 99.9%',
    icon: <IconActivity size={22} />,
    accent: '#f6ad55',
  },
];

const ACTIVITY_ROWS: ActivityRow[] = [
  {
    id: '1',
    event: 'Batch inference job completed',
    actor: 'Aria Nakamura',
    model: 'flux-ultrafast-v3',
    status: 'success',
    timestamp: '2026-06-25 14:32',
    tokens: 4_200_000,
  },
  {
    id: '2',
    event: 'Model fin