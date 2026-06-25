/* ============================================================
   AI-Flux Design System — Table Component Tests
   ============================================================ */

import React, { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from './Table';
import type { TableColumn, TableSortState } from './Table';

// ─── Test fixtures ────────────────────────────────────────────────────────────

interface Row {
  id: number;
  name: string;
  score: number;
  status: string;
}

const COLUMNS: TableColumn<Row>[] = [
  { key: 'name',   header: 'Name',   sortable: true },
  { key: 'score',  header: 'Score',  sortable: true, align: 'right' },
  { key: 'status', header: 'Status', sortable: false },
];

const ROWS: Row[] = [
  { id: 1, name: 'Alpha',   score: 90, status: 'active' },
  { id: 2, name: 'Beta',    score: 75, status: 'preview' },
  { id: 3, name: 'Gamma',   score: 88, status: 'active' },
];

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Table — Rendering', () => {
  it('renders column headers', () => {
    render(<Table columns={COLUMNS} rows={ROWS} aria-label="Test table" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<Table columns={COLUMNS} rows={ROWS} aria-label="Test table" />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders the caption when provided', () => {
    render(<Table columns={COLUMNS} rows={ROWS} caption="My Caption" />);
    expect(screen.getByText('My Caption')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    const { container } = render(
      <Table columns={COLUMNS} rows={ROWS} variant="striped" aria-label="t" />
    );
    expect(container.querySelector('.aif-table--striped')).toBeInTheDocument();
  });

  it('applies the correct size class', () => {
    const { container } = render(
      <Table columns={COLUMNS} rows={ROWS} size="sm" aria-label="t" />
    );
    expect(container.querySelector('.aif-table--sm')).toBeInTheDocument();
  });

  it('applies sticky-header class when stickyHeader=true', () => {
    const { container } = render(
      <Table columns={COLUMNS} rows={ROWS} stickyHeader aria-label="t" />
    );
    expect(container.querySelector('.aif-table--sticky-header')).toBeInTheDocument();
    expect(container.querySelector('.aif-table-wrapper--sticky')).toBeInTheDocument();
  });
});

// ─── Empty & Loading ──────────────────────────────────────────────────────────

describe('Table — Empty & Loading', () => {
  it('renders the default empty message when rows is empty', () => {
    render(<Table columns={COLUMNS} rows={[]} aria-label="t" />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('renders custom emptyState', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={[]}
        emptyState={<span>Nothing here</span>}
        aria-label="t"
      />
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders skeleton rows when loading=true', () => {
    const { container } = render(
      <Table columns={COLUMNS} rows={[]} loading loadingRowCount={3} aria-label="t" />
    );
    // 3 skeleton rows — each has aria-hidden
    const skeletons = container.querySelectorAll('tr[aria-hidden="true"]');
    expect(skeletons).toHaveLength(3);
  });

  it('hides data rows while loading', () => {
    render(<Table columns={COLUMNS} rows={ROWS} loading aria-label="t" />);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });
});

// ─── Selection ────────────────────────────────────────────────────────────────

describe('Table — Selection', () => {
  it('renders a checkbox column when selectable=true', () => {
    render(<Table columns={COLUMNS} rows={ROWS} selectable aria-label="t" />);
    // 1 select-all + 3 row checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
  });

  it('checks individual rows and calls onSelectionChange', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        selectable
        onSelectionChange={onSelectionChange}
        aria-label="t"
      />
    );

    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1); // skip select-all
    await user.click(rowCheckboxes[0]);
    expect(onSelectionChange).toHaveBeenCalledWith(new Set([1]));
  });

  it('select-all checks all rows', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [sel, setSel] = useState<Set<string | number>>(new Set());
      return <Table columns={COLUMNS} rows={ROWS} selectable selectedIds={sel} onSelectionChange={setSel} aria-label="t" />;
    };
    render(<Controlled />);

    const selectAll = screen.getAllByRole('checkbox')[0];
    await user.click(selectAll);
    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    rowCheckboxes.forEach((cb) => expect(cb).toBeChecked());
  });

  it('select-all becomes indeterminate when some rows selected', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [sel, setSel] = useState<Set<string | number>>(new Set());
      return <Table columns={COLUMNS} rows={ROWS} selectable selectedIds={sel} onSelectionChange={setSel} aria-label="t" />;
    };
    render(<Controlled />);

    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    await user.click(rowCheckboxes[0]); // select first row
    const selectAll = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    expect(selectAll.indeterminate).toBe(true);
  });

  it('deselects all when select-all clicked while all selected', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [sel, setSel] = useState<Set<string | number>>(new Set([1, 2, 3]));
      return <Table columns={COLUMNS} rows={ROWS} selectable selectedIds={sel} onSelectionChange={setSel} aria-label="t" />;
    };
    render(<Controlled />);

    const selectAll = screen.getAllByRole('checkbox')[0];
    await user.click(selectAll);
    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    rowCheckboxes.forEach((cb) => expect(cb).not.toBeChecked());
  });

  it('applies row--selected class to selected rows', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        selectable
        selectedIds={new Set([2])}
        aria-label="t"
      />
    );
    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(rows[0]).not.toHaveClass('aif-table__row--selected');
    expect(rows[1]).toHaveClass('aif-table__row--selected');
    expect(rows[2]).not.toHaveClass('aif-table__row--selected');
  });
});

// ─── Sorting ──────────────────────────────────────────────────────────────────

describe('Table — Sorting', () => {
  it('sortable column headers are keyboard-focusable', () => {
    render(<Table columns={COLUMNS} rows={ROWS} aria-label="t" />);
    const nameHeader = screen.getByText('Name').closest('th')!;
    expect(nameHeader).toHaveAttribute('tabindex', '0');
  });

  it('non-sortable column headers are not focusable', () => {
    render(<Table columns={COLUMNS} rows={ROWS} aria-label="t" />);
    const statusHeader = screen.getByText('Status').closest('th')!;
    expect(statusHeader).not.toHaveAttribute('tabindex');
  });

  it('fires onSortChange with correct key and direction on click', () => {
    const onSortChange = jest.fn();
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        sortState={{ key: '', direction: 'none' }}
        onSortChange={onSortChange}
        aria-label="t"
      />
    );
    fireEvent.click(screen.getByText('Name').closest('th')!);
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('cycles asc → desc → none on repeated clicks', () => {
    const onSortChange = jest.fn();
    const Controlled = () => {
      const [sort, setSort] = useState<TableSortState>({ key: '', direction: 'none' });
      return (
        <Table
          columns={COLUMNS}
          rows={ROWS}
          sortState={sort}
          onSortChange={(s) => { setSort(s); onSortChange(s); }}
          aria-label="t"
        />
      );
    };
    render(<Controlled />);
    const nameHeader = screen.getByText('Name').closest('th')!;
    fireEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'asc' });
    fireEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    fireEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'none' });
  });

  it('applies aria-sort correctly', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        sortState={{ key: 'name', direction: 'asc' }}
        onSortChange={() => {}}
        aria-label="t"
      />
    );
    expect(screen.getByText('Name').closest('th')).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByText('Score').closest('th')).toHaveAttribute('aria-sort', 'none');
  });

  it('sorts rows client-side when clientSort=true', () => {
    render(
      <Table columns={COLUMNS} rows={ROWS} clientSort aria-label="t" />
    );
    // Click name header once → asc
    fireEvent.click(screen.getByText('Name').closest('th')!);
    const cells = screen.getAllByRole('cell').filter((_, i) => i % 3 === 0); // name column
    expect(cells[0]).toHaveTextContent('Alpha');
    expect(cells[1]).toHaveTextContent('Beta');
    expect(cells[2]).toHaveTextContent('Gamma');
  });

  it('triggers sort via keyboard Enter', () => {
    const onSortChange = jest.fn();
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        sortState={{ key: '', direction: 'none' }}
        onSortChange={onSortChange}
        aria-label="t"
      />
    );
    const nameHeader = screen.getByText('Name').closest('th')!;
    fireEvent.keyDown(nameHeader, { key: 'Enter' });
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });
});

// ─── Custom render ────────────────────────────────────────────────────────────

describe('Table — Custom render', () => {
  it('uses the render function when provided', () => {
    const customCols: TableColumn<Row>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (val) => <strong data-testid="custom">{val as string}</strong>,
      },
    ];
    render(<Table columns={customCols} rows={ROWS} aria-label="t" />);
    const customs = screen.getAllByTestId('custom');
    expect(customs).toHaveLength(3);
    expect(customs[0]).toHaveTextContent('Alpha');
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('Table — Pagination', () => {
  it('renders pagination slot when pagination prop is provided', () => {
    const pag = { page: 0, pageSize: 2, total: 3, onPageChange: jest.fn() };
    render(<Table columns={COLUMNS} rows={ROWS.slice(0, 2)} pagination={pag} aria-label="t" />);
    expect(screen.getByRole('navigation', { name: 'Table pagination' })).toBeInTheDocument();
  });

  it('displays correct page info', () => {
    const pag = { page: 0, pageSize: 2, total: 3, onPageChange: jest.fn() };
    render(<Table columns={COLUMNS} rows={ROWS.slice(0, 2)} pagination={pag} aria-label="t" />);
    expect(screen.getByText('1–2 of 3')).toBeInTheDocument();
  });

  it('calls onPageChange when next page is clicked', async () => {
    const onPageChange = jest.fn();
    const user = userEvent.setup();
    const pag = { page: 0, pageSize: 2, total: 3, onPageChange };
    render(<Table columns={COLUMNS} rows={ROWS.slice(0, 2)} pagination={pag} aria-label="t" />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables previous page button on first page', () => {
    const pag = { page: 0, pageSize: 2, total: 3, onPageChange: jest.fn() };
    render(<Table columns={COLUMNS} rows={ROWS.slice(0, 2)} pagination={pag} aria-label="t" />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('renders custom renderPagination', () => {
    const pag = { page: 0, pageSize: 2, total: 3, onPageChange: jest.fn() };
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS.slice(0, 2)}
        pagination={pag}
        renderPagination={() => <div data-testid="custom-pag">Custom Pagination</div>}
        aria-label="t"
      />
    );
    expect(screen.getByTestId('custom-pag')).toBeInTheDocument();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('Table — Accessibility', () => {
  it('sets aria-label on the table', () => {
    render(<Table columns={COLUMNS} rows={ROWS} aria-label="My Table" />);
    // The wrapper region has the aria-label
    expect(screen.getByRole('region', { name: 'My Table' })).toBeInTheDocument();
  });

  it('sets aria-busy=true when loading', () => {
    const { container } = render(<Table columns={COLUMNS} rows={[]} loading aria-label="t" />);
    const table = container.querySelector('table');
    expect(table).toHaveAttribute('aria-busy', 'true');
  });

  it('sets aria-rowcount from total rows', () => {
    const { container } = render(<Table columns={COLUMNS} rows={ROWS} aria-label="t" />);
    const table = container.querySelector('table');
    expect(table).toHaveAttribute('aria-rowcount', '3');
  });

  it('column headers have scope="col"', () => {
    render(<Table columns={COLUMNS} rows={ROWS} aria-label="t" />);
    const ths = screen.getAllByRole('columnheader');
    ths.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
  });
});
