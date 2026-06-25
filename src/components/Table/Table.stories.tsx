/* ============================================================
   AI-Flux Design System — Table Stories (Storybook 7+)
   ============================================================ */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import type { TableColumn, TableSortState, TablePaginationState } from './Table';

// ─── Sample data ──────────────────────────────────────────────────────────────

interface ModelRow {
  id: number;
  name: string;
  provider: string;
  params: string;
  contextWindow: number;
  status: 'active' | 'deprecated' | 'preview';
  accuracy: number;
}

const SAMPLE_ROWS: ModelRow[] = [
  { id: 1,  name: 'Nexus-7B',        provider: 'AI-Flux',     params: '7B',   contextWindow: 128_000, status: 'active',     accuracy: 94.2 },
  { id: 2,  name: 'Nexus-13B',       provider: 'AI-Flux',     params: '13B',  contextWindow: 200_000, status: 'active',     accuracy: 96.1 },
  { id: 3,  name: 'Quasar-70B',      provider: 'Stellar AI',  params: '70B',  contextWindow: 32_000,  status: 'active',     accuracy: 97.8 },
  { id: 4,  name: 'Helios-1B',       provider: 'AI-Flux',     params: '1B',   contextWindow: 16_000,  status: 'preview',    accuracy: 81.4 },
  { id: 5,  name: 'PulsarX',         provider: 'NovaTech',    params: '34B',  contextWindow: 64_000,  status: 'active',     accuracy: 95.3 },
  { id: 6,  name: 'Aurora-3B',       provider: 'CelestialML', params: '3B',   contextWindow: 32_000,  status: 'deprecated', accuracy: 72.0 },
  { id: 7,  name: 'Catalyst-Micro',  provider: 'AI-Flux',     params: '500M', contextWindow: 8_000,   status: 'preview',    accuracy: 78.6 },
  { id: 8,  name: 'Vega-22B',        provider: 'NovaTech',    params: '22B',  contextWindow: 100_000, status: 'active',     accuracy: 96.9 },
];

// ─── Shared columns ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<ModelRow['status'], string> = {
  active:     '#4ade80',
  deprecated: '#f87171',
  preview:    '#facc15',
};

const COLUMNS: TableColumn<ModelRow>[] = [
  {
    key: 'name',
    header: 'Model',
    sortable: true,
    render: (_, row) => (
      <span style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>{row.name}</span>
    ),
  },
  { key: 'provider',      header: 'Provider',        sortable: true },
  { key: 'params',        header: 'Parameters',      sortable: false, align: 'right' },
  {
    key: 'contextWindow',
    header: 'Context',
    sortable: true,
    align: 'right',
    render: (val) => `${((val as number) / 1000).toFixed(0)}K`,
  },
  {
    key: 'accuracy',
    header: 'Accuracy',
    sortable: true,
    align: 'right',
    render: (val) => (
      <span style={{ color: (val as number) >= 95 ? '#4ade80' : (val as number) >= 85 ? '#facc15' : '#f87171' }}>
        {(val as number).toFixed(1)}%
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (val) => {
      const s = val as ModelRow['status'];
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: STATUS_COLORS[s],
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[s], flexShrink: 0 }} />
          {s}
        </span>
      );
    },
  },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Table> = {
  title: 'AI-Flux / Table',
  component: Table,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#0d0f14' }] },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Simple: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={SAMPLE_ROWS}
      variant="simple"
      size="md"
      clientSort
      aria-label="AI model comparison — simple variant"
    />
  ),
};

export const Striped: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={SAMPLE_ROWS}
      variant="striped"
      size="md"
      clientSort
      aria-label="AI model comparison — striped variant"
    />
  ),
};

export const Bordered: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={SAMPLE_ROWS}
      variant="bordered"
      size="md"
      clientSort
      aria-label="AI model comparison — bordered variant"
    />
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={SAMPLE_ROWS}
      variant="striped"
      size="sm"
      clientSort
      aria-label="Small density table"
    />
  ),
};

export const LargeSize: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={SAMPLE_ROWS}
      variant="simple"
      size="lg"
      clientSort
      aria-label="Large density table"
    />
  ),
};

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number>>(new Set([2, 5]));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Table<ModelRow>
          columns={COLUMNS}
          rows={SAMPLE_ROWS}
          variant="striped"
          size="md"
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          clientSort
          aria-label="Selectable AI model table"
        />
        <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '0.8125rem', margin: 0 }}>
          Selected IDs: {[...selected].join(', ') || 'none'}
        </p>
      </div>
    );
  },
};

export const StickyHeader: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={[...SAMPLE_ROWS, ...SAMPLE_ROWS.map((r) => ({ ...r, id: r.id + 100 }))]}
      variant="striped"
      size="md"
      stickyHeader
      maxHeight={320}
      selectable
      clientSort
      aria-label="Sticky-header table"
    />
  ),
};

export const ControlledSort: Story = {
  render: () => {
    const [sort, setSort] = useState<TableSortState>({ key: 'accuracy', direction: 'desc' });
    const sorted = [...SAMPLE_ROWS].sort((a, b) => {
      const av = a[sort.key as keyof ModelRow] as number | string;
      const bv = b[sort.key as keyof ModelRow] as number | string;
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sort.direction === 'desc' ? -cmp : cmp;
    });

    return (
      <Table<ModelRow>
        columns={COLUMNS}
        rows={sorted}
        variant="simple"
        size="md"
        sortState={sort}
        onSortChange={setSort}
        aria-label="Controlled-sort table"
      />
    );
  },
};

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const allRows = [...SAMPLE_ROWS, ...SAMPLE_ROWS.map((r) => ({ ...r, id: r.id + 100, name: r.name + ' v2' }))];
    const pagedRows = allRows.slice(page * pageSize, (page + 1) * pageSize);

    const paginationState: TablePaginationState = {
      page,
      pageSize,
      total: allRows.length,
      onPageChange: setPage,
      onPageSizeChange: (ps) => { setPageSize(ps); setPage(0); },
      pageSizeOptions: [3, 5, 8],
    };

    return (
      <Table<ModelRow>
        columns={COLUMNS}
        rows={pagedRows}
        variant="striped"
        size="md"
        pagination={paginationState}
        selectable
        clientSort
        aria-label="Paginated AI model table"
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={[]}
      variant="striped"
      size="md"
      loading
      loadingRowCount={6}
      aria-label="Loading table"
    />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Table<ModelRow>
      columns={COLUMNS}
      rows={[]}
      variant="bordered"
      size="md"
      emptyState={
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
            <path d="M11 16h10M16 11v10" stroke="rgba(255,255,255,0.24)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>No models found</span>
          <span style={{ color: 'rgba(255,255,255,0.24)', fontSize: '0.75rem' }}>Try adjusting your filters</span>
        </span>
      }
      aria-label="Empty state table"
    />
  ),
};

export const FullFeatured: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    const [page, setPage] = useState(0);
    const pageSize = 4;

    const allRows = [...SAMPLE_ROWS, ...SAMPLE_ROWS.map((r) => ({ ...r, id: r.id + 100, name: r.name + ' Pro' }))];
    const pagedRows = allRows.slice(page * pageSize, (page + 1) * pageSize);

    return (
      <Table<ModelRow>
        columns={COLUMNS}
        rows={pagedRows}
        getRowId={(r) => r.id}
        variant="striped"
        size="md"
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        stickyHeader
        maxHeight={400}
        clientSort
        caption="AI model registry — Q2 2026"
        pagination={{
          page,
          pageSize,
          total: allRows.length,
          onPageChange: setPage,
        }}
      />
    );
  },
};
