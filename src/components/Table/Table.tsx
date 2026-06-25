/* ============================================================
   AI-Flux Design System — Table Component
   Brand: Intelligent · Precise · Futuristic
   ============================================================ */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  HTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  TableHTMLAttributes,
} from 'react';
import './Table.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TableVariant = 'simple' | 'striped' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';
export type SortDirection = 'asc' | 'desc' | 'none';

/** A single column definition */
export interface TableColumn<TRow = Record<string, unknown>> {
  /** Unique key — must match a key of TRow (or be any string for custom render) */
  key: string;
  /** Column header label */
  header: React.ReactNode;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom cell renderer; receives the full row and the cell value */
  render?: (value: unknown, row: TRow, rowIndex: number) => React.ReactNode;
  /** Text alignment for both header and cells */
  align?: 'left' | 'center' | 'right';
  /** Fixed pixel / rem width for the column */
  width?: string | number;
  /** ARIA label for the column header — useful when the label is an icon */
  'aria-label'?: string;
}

/** Pagination state passed into the Table */
export interface TablePaginationState {
  /** Current page (0-indexed) */
  page: number;
  /** Rows per page */
  pageSize: number;
  /** Total row count (across all pages) */
  total: number;
  /** Called when the user requests a page change */
  onPageChange: (page: number) => void;
  /** Called when the user requests a page-size change */
  onPageSizeChange?: (pageSize: number) => void;
  /** Available page-size options — defaults to [10, 25, 50, 100] */
  pageSizeOptions?: number[];
}

/** Current sort state */
export interface TableSortState {
  key: string;
  direction: SortDirection;
}

export interface TableProps<TRow = Record<string, unknown>>
  extends Omit<TableHTMLAttributes<HTMLTableElement>, 'onChange'> {
  // ── Data ──────────────────────────────────────────────────────────────────
  /** Column definitions */
  columns: TableColumn<TRow>[];
  /** Row data — each row must have a stable `id` property, or supply `getRowId` */
  rows: TRow[];
  /** Extract a unique id from a row (defaults to `row.id`) */
  getRowId?: (row: TRow) => string | number;

  // ── Appearance ────────────────────────────────────────────────────────────
  /** Visual variant */
  variant?: TableVariant;
  /** Density scale */
  size?: TableSize;
  /** Pin the thead while the tbody scrolls */
  stickyHeader?: boolean;
  /** Fixed height for the scrollable wrapper (required for stickyHeader) */
  maxHeight?: string | number;

  // ── Selection ─────────────────────────────────────────────────────────────
  /** Enable checkbox selection */
  selectable?: boolean;
  /** Currently-selected row ids */
  selectedIds?: Set<string | number>;
  /** Fired when selection changes */
  onSelectionChange?: (ids: Set<string | number>) => void;

  // ── Sorting ───────────────────────────────────────────────────────────────
  /** Controlled sort state */
  sortState?: TableSortState;
  /** Fired when the user clicks a sortable column header */
  onSortChange?: (sort: TableSortState) => void;
  /** Built-in client-side sort (ignored when `onSortChange` is supplied) */
  clientSort?: boolean;

  // ── Pagination ────────────────────────────────────────────────────────────
  /** Pass a pagination state object to render the pagination slot */
  pagination?: TablePaginationState;
  /** Custom pagination renderer — overrides the built-in one */
  renderPagination?: (state: TablePaginationState) => React.ReactNode;

  // ── State ─────────────────────────────────────────────────────────────────
  /** Show skeleton loading rows */
  loading?: boolean;
  /** Number of skeleton rows shown while loading */
  loadingRowCount?: number;
  /** Node rendered when rows is empty */
  emptyState?: React.ReactNode;

  // ── Accessibility ─────────────────────────────────────────────────────────
  /** ARIA label for the table (used when there's no visible caption) */
  'aria-label'?: string;
  /** ID of an external element that labels the table */
  'aria-labelledby'?: string;
  /** Visible caption rendered inside the <table> element */
  caption?: React.ReactNode;

  // ── Layout ────────────────────────────────────────────────────────────────
  className?: string;
  /** Additional class on the outer wrapper div */
  wrapperClassName?: string;
  style?: React.CSSProperties;
  /** Style applied to the outer wrapper */
  wrapperStyle?: React.CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultRowId(row: Record<string, unknown>): string | number {
  const id = row['id'];
  if (typeof id === 'string' || typeof id === 'number') return id;
  throw new Error(
    '[AI-Flux Table] Each row must have an `id` property, or supply a `getRowId` prop.'
  );
}

function nextSortDirection(current: SortDirection): SortDirection {
  if (current === 'none') return 'asc';
  if (current === 'asc') return 'desc';
  return 'none';
}

function clientSortRows<TRow>(
  rows: TRow[],
  sort: TableSortState
): TRow[] {
  if (sort.direction === 'none') return rows;
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sort.key];
    const bv = (b as Record<string, unknown>)[sort.key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
    return sort.direction === 'desc' ? -cmp : cmp;
  });
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <span className="aif-table__sort-icon" aria-hidden="true">
      {direction === 'asc' ? (
        // Arrow up
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : direction === 'desc' ? (
        // Arrow down
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2.5V9.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        // Up-down (unsorted)
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 1.5L6 4.5M6 4.5L4 2.5M6 4.5L8 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10.5L6 7.5M6 7.5L4 9.5M6 7.5L8 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

// ─── Built-in Pagination ──────────────────────────────────────────────────────

function DefaultPagination({ state }: { state: TablePaginationState }) {
  const {
    page,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
  } = state;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <div className="aif-table-pagination" role="navigation" aria-label="Table pagination">
      <span className="aif-table-pagination__info">
        {total === 0
          ? 'No results'
          : `${start}–${end} of ${total.toLocaleString()}`}
      </span>

      <div className="aif-table-pagination__controls">
        {onPageSizeChange && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginRight: '0.75rem', fontSize: 'inherit', color: 'inherit' }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Rows per page"
              style={{
                background: 'var(--aif-color-surface-overlay)',
                color: 'var(--aif-color-text-primary)',
                border: '1px solid var(--aif-color-border-default)',
                borderRadius: 'var(--aif-radius-sm)',
                padding: '0.125rem 0.375rem',
                fontSize: 'inherit',
                cursor: 'pointer',
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        )}

        <PaginationButton
          label="First page"
          disabled={page === 0}
          onClick={() => onPageChange(0)}
        >
          {/* Double chevron left */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4L5 7l3 3M5 4L2 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PaginationButton>

        <PaginationButton
          label="Previous page"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          {/* Chevron left */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 4L5 7l4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PaginationButton>

        <span
          aria-live="polite"
          aria-atomic="true"
          style={{ padding: '0 0.5rem', whiteSpace: 'nowrap' }}
        >
          Page {page + 1} of {totalPages}
        </span>

        <PaginationButton
          label="Next page"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          {/* Chevron right */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PaginationButton>

        <PaginationButton
          label="Last page"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
        >
          {/* Double chevron right */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4l3 3-3 3M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </PaginationButton>
      </div>
    </div>
  );
}

function PaginationButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.875rem',
        height: '1.875rem',
        border: '1px solid var(--aif-color-border-default)',
        borderRadius: 'var(--aif-radius-sm)',
        background: 'transparent',
        color: disabled ? 'var(--aif-color-text-disabled)' : 'var(--aif-color-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
        padding: 0,
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--aif-color-surface-hover)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--aif-color-text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = disabled
          ? 'var(--aif-color-text-disabled)'
          : 'var(--aif-color-text-secondary)';
      }}
    >
      {children}
    </button>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow({
  columns,
  selectable,
  index,
}: {
  columns: TableColumn[];
  selectable: boolean;
  index: number;
}) {
  return (
    <tr aria-hidden="true">
      {selectable && (
        <td className="aif-table__td aif-table__td--checkbox aif-table__skeleton-cell">
          <div className="aif-table__skeleton-bar" style={{ width: '1rem', height: '1rem', borderRadius: '0.25rem', margin: '0 auto' }} />
        </td>
      )}
      {columns.map((col, ci) => (
        <td key={col.key} className="aif-table__skeleton-cell">
          <div
            className="aif-table__skeleton-bar"
            style={{
              width: `${55 + ((index * 13 + ci * 7) % 35)}%`,
              animationDelay: `${(index * columns.length + ci) * 60}ms`,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Table Component ──────────────────────────────────────────────────────────

function TableInner<TRow = Record<string, unknown>>(
  props: TableProps<TRow>,
  ref: React.ForwardedRef<HTMLTableElement>
) {
  const {
    columns,
    rows,
    getRowId,
    variant = 'simple',
    size = 'md',
    stickyHeader = false,
    maxHeight,
    selectable = false,
    selectedIds: controlledSelectedIds,
    onSelectionChange,
    sortState: controlledSortState,
    onSortChange,
    clientSort = false,
    pagination,
    renderPagination,
    loading = false,
    loadingRowCount = 5,
    emptyState,
    caption,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    className,
    wrapperClassName,
    style,
    wrapperStyle,
    ...tableRest
  } = props;

  const uid = useId();
  const captionId = `aif-table-caption-${uid}`;
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // ── Internal selection state (uncontrolled fallback) ────────────────────
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string | number>>(
    () => new Set()
  );
  const isSelectionControlled = controlledSelectedIds !== undefined;
  const selectedIds = isSelectionControlled ? controlledSelectedIds : internalSelectedIds;

  const handleSelectionChange = useCallback(
    (next: Set<string | number>) => {
      if (!isSelectionControlled) setInternalSelectedIds(next);
      onSelectionChange?.(next);
    },
    [isSelectionControlled, onSelectionChange]
  );

  // ── Internal sort state (uncontrolled fallback) ──────────────────────────
  const [internalSortState, setInternalSortState] = useState<TableSortState>({
    key: '',
    direction: 'none',
  });
  const isSortControlled = controlledSortState !== undefined;
  const sortState = isSortControlled ? controlledSortState : internalSortState;

  const handleSortChange = useCallback(
    (key: string) => {
      const current = sortState.key === key ? sortState.direction : 'none';
      const direction = nextSortDirection(current);
      const next: TableSortState = { key, direction };
      if (!isSortControlled) setInternalSortState(next);
      onSortChange?.(next);
    },
    [sortState, isSortControlled, onSortChange]
  );

  // ── Derived rows (client sort) ───────────────────────────────────────────
  const displayRows =
    clientSort && !onSortChange ? clientSortRows(rows, sortState) : rows;

  // ── Row id resolution ────────────────────────────────────────────────────
  const resolveId = useCallback(
    (row: TRow): string | number =>
      getRowId ? getRowId(row) : getDefaultRowId(row as Record<string, unknown>),
    [getRowId]
  );

  // ── Select-all indeterminate sync ────────────────────────────────────────
  const allIds = displayRows.map(resolveId);
  const selectedCount = allIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = allIds.length > 0 && selectedCount === allIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  // ── Select all handler ───────────────────────────────────────────────────
  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      const next = new Set(selectedIds);
      allIds.forEach((id) => next.delete(id));
      handleSelectionChange(next);
    } else {
      const next = new Set(selectedIds);
      allIds.forEach((id) => next.add(id));
      handleSelectionChange(next);
    }
  }, [allSelected, allIds, selectedIds, handleSelectionChange]);

  // ── Select row handler ───────────────────────────────────────────────────
  const handleSelectRow = useCallback(
    (id: string | number) => {
      const next = new Set(selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      handleSelectionChange(next);
    },
    [selectedIds, handleSelectionChange]
  );

  // ── Class names ──────────────────────────────────────────────────────────
  const tableClasses = [
    'aif-table',
    `aif-table--${variant}`,
    `aif-table--${size}`,
    stickyHeader && 'aif-table--sticky-header',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClasses = [
    'aif-table-wrapper',
    stickyHeader && 'aif-table-wrapper--sticky',
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperStyles: React.CSSProperties = {
    ...(maxHeight !== undefined
      ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
      : {}),
    ...wrapperStyle,
  };

  // ── Effective aria-labelledby ────────────────────────────────────────────
  const effectiveLabelledby = caption
    ? [captionId, ariaLabelledby].filter(Boolean).join(' ')
    : ariaLabelledby;

  // ── Content rendering ────────────────────────────────────────────────────
  const isEmpty = !loading && displayRows.length === 0;

  return (
    <div className={wrapperClasses} style={wrapperStyles} role="region" aria-label={ariaLabel ?? (caption ? undefined : 'Data table')}>
      <table
        ref={ref}
        className={tableClasses}
        aria-label={effectiveLabelledby ? undefined : (ariaLabel ?? undefined)}
        aria-labelledby={effectiveLabelledby ?? undefined}
        aria-rowcount={pagination ? pagination.total : displayRows.length}
        aria-busy={loading}
        style={style}
        {...tableRest}
      >
        {caption && (
          <caption id={captionId} className="aif-table__caption">
            {caption}
          </caption>
        )}

        {/* ── THEAD ─────────────────────────────────────────────────── */}
        <thead className="aif-table__thead" role="rowgroup">
          <tr role="row">
            {/* Select-all checkbox */}
            {selectable && (
              <th
                scope="col"
                className="aif-table__th aif-table__th--checkbox"
                aria-label="Select all rows"
              >
                <span className="aif-table__checkbox-wrapper">
                  <input
                    ref={selectAllCheckboxRef}
                    type="checkbox"
                    className="aif-table__checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    aria-label={
                      allSelected ? 'Deselect all rows' : someSelected ? 'Select all rows (some selected)' : 'Select all rows'
                    }
                    aria-checked={someSelected ? 'mixed' : allSelected}
                  />
                </span>
              </th>
            )}

            {/* Column headers */}
            {columns.map((col) => {
              const isSortedAsc = sortState.key === col.key && sortState.direction === 'asc';
              const isSortedDesc = sortState.key === col.key && sortState.direction === 'desc';
              const isSorted = isSortedAsc || isSortedDesc;
              const currentDirection = sortState.key === col.key ? sortState.direction : 'none';

              const thClasses = [
                'aif-table__th',
                col.sortable && 'aif-table__th--sortable',
                isSortedAsc && 'aif-table__th--sorted-asc',
                isSortedDesc && 'aif-table__th--sorted-desc',
              ]
                .filter(Boolean)
                .join(' ');

              const alignStyle: React.CSSProperties = col.align
                ? { textAlign: col.align }
                : {};

              const widthStyle: React.CSSProperties =
                col.width !== undefined
                  ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width }
                  : {};

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={thClasses}
                  style={{ ...alignStyle, ...widthStyle }}
                  aria-label={col['aria-label']}
                  aria-sort={
                    col.sortable
                      ? isSortedAsc
                        ? 'ascending'
                        : isSortedDesc
                        ? 'descending'
                        : 'none'
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                  onClick={col.sortable ? () => handleSortChange(col.key) : undefined}
                  onKeyDown={
                    col.sortable
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSortChange(col.key);
                          }
                        }
                      : undefined
                  }
                >
                  <span className="aif-table__th-inner">
                    {col.header}
                    {col.sortable && (
                      <SortIcon direction={isSorted ? currentDirection : 'none'} />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* ── TBODY ─────────────────────────────────────────────────── */}
        <tbody role="rowgroup">
          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: loadingRowCount }, (_, i) => (
              <SkeletonRow
                key={`skeleton-${i}`}
                columns={columns}
                selectable={selectable}
                index={i}
              />
            ))}

          {/* Empty state */}
          {isEmpty && (
            <tr role="row" className="aif-table__empty">
              <td
                className="aif-table__empty-cell"
                colSpan={selectable ? columns.length + 1 : columns.length}
                role="cell"
              >
                {emptyState ?? 'No data available.'}
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading &&
            displayRows.map((row, rowIndex) => {
              const id = resolveId(row);
              const isSelected = selectedIds.has(id);
              const rowAriaIndex = pagination
                ? pagination.page * pagination.pageSize + rowIndex + 1
                : rowIndex + 1;

              const rowClasses = [
                'aif-table__row',
                isSelected && 'aif-table__row--selected',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <tr
                  key={id}
                  role="row"
                  className={rowClasses}
                  aria-selected={selectable ? isSelected : undefined}
                  aria-rowindex={rowAriaIndex}
                >
                  {/* Row checkbox */}
                  {selectable && (
                    <td className="aif-table__td aif-table__td--checkbox" role="cell">
                      <span className="aif-table__checkbox-wrapper">
                        <input
                          type="checkbox"
                          className="aif-table__checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                          aria-label={`Select row ${rowAriaIndex}`}
                        />
                      </span>
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((col) => {
                    const rawValue = (row as Record<string, unknown>)[col.key];
                    const cellContent = col.render
                      ? col.render(rawValue, row, rowIndex)
                      : rawValue != null
                      ? String(rawValue)
                      : null;

                    const cellStyle: React.CSSProperties = col.align
                      ? { textAlign: col.align }
                      : {};

                    return (
                      <td
                        key={col.key}
                        role="cell"
                        className="aif-table__td"
                        style={cellStyle}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* ── Pagination slot ─────────────────────────────────────────── */}
      {pagination && (
        renderPagination
          ? renderPagination(pagination)
          : <DefaultPagination state={pagination} />
      )}
    </div>
  );
}

// ─── forwardRef wrapper preserving generics ───────────────────────────────────

/**
 * AI-Flux Table component.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'status', header: 'Status', sortable: true },
 *   ]}
 *   rows={data}
 *   variant="striped"
 *   size="md"
 *   selectable
 *   stickyHeader
 *   maxHeight={480}
 *   clientSort
 * />
 * ```
 */
export const Table = forwardRef(TableInner) as <TRow = Record<string, unknown>>(
  props: TableProps<TRow> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => React.ReactElement;

(Table as React.FC).displayName = 'Table';

// ─── Sub-component exports (convenience) ─────────────────────────────────────

export { DefaultPagination as TablePagination };
export default Table;
