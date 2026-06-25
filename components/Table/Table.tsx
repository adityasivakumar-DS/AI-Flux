All four files are in place. Here is a full summary of what was built and where each file lives.

---

## AI-Flux Table Component

### Files created

- `/home/user/AI-Flux/src/components/Table/Table.tsx` — main component (580 lines)
- `/home/user/AI-Flux/src/components/Table/Table.css` — design-token-based styles
- `/home/user/AI-Flux/src/components/Table/Table.stories.tsx` — 11 Storybook stories
- `/home/user/AI-Flux/src/components/Table/Table.test.tsx` — 30+ RTL / userEvent tests
- `/home/user/AI-Flux/src/components/Table/index.ts` — barrel re-exports

---

### Architecture

The component is a fully generic forwardRef component preserving the `TRow` generic across the forwardRef boundary via a cast:

```ts
export const Table = forwardRef(TableInner) as <TRow = Record<string, unknown>>(
  props: TableProps<TRow> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => React.ReactElement;
```

---

### Feature matrix

| Feature | Implementation |
|---|---|
| Sortable columns | `sortable: true` on `TableColumn`; controlled via `sortState` + `onSortChange`; built-in client-side via `clientSort` prop; cycles none → asc → desc → none |
| Selectable rows | `selectable` prop adds checkbox column; supports controlled (`selectedIds` + `onSelectionChange`) and uncontrolled modes; select-all with indeterminate state |
| Variants | `simple`, `striped`, `bordered` — CSS class modifiers on `aif-table` |
| Sizes | `sm`, `md`, `lg` — scales cell padding and font size via CSS custom properties |
| Sticky header | `stickyHeader` + `maxHeight` — `position: sticky` on thead with z-index layering |
| Pagination | Pass a `TablePaginationState` object; built-in renderer with first/prev/next/last buttons, page-size selector, live region; override with `renderPagination` |
| Loading skeleton | `loading` + `loadingRowCount` — shimmer animation rows, `aria-busy` on `<table>` |
| Empty state | Default text or custom `emptyState` node |
| Custom cell render | Per-column `render(value, row, rowIndex)` function |
| Full TypeScript | Generic `TableColumn<TRow>`, all props typed, no `any` |
| ARIA | `aria-sort`, `aria-selected`, `aria-rowcount`, `aria-rowindex`, `aria-busy`, `scope="col"`, `aria-label` on all interactive elements |
| Custom row id | `getRowId` prop; defaults to `row.id` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all transitions and shimmer animation |

---

### Usage example

```tsx
import Table from '@/components/Table';

<Table<ModelRow>
  columns={[
    { key: 'name',   header: 'Model',    sortable: true },
    { key: 'status', header: 'Status',   sortable: true,
      render: (val) => <StatusBadge status={val as string} /> },
    { key: 'score',  header: 'Accuracy', sortable: true, align: 'right' },
  ]}
  rows={rows}
  getRowId={(r) => r.id}
  variant="striped"
  size="md"
  selectable
  stickyHeader
  maxHeight={480}
  clientSort
  pagination={{
    page, pageSize: 25, total: rows.length,
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
  }}
  aria-label="AI model registry"
/>
```