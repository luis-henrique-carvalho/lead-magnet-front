import { useEffect, useMemo, useState } from 'react'
import { parseISO, format as formatDate } from 'date-fns'
import { Cross2Icon } from '@radix-ui/react-icons'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { DatePicker } from '@/components/date-picker'
import type { AutomationTaskListItem } from '../schemas/automation-tasks-schema'
import { automationTasksColumns as columns } from './automation-tasks-columns'

type DataTableProps = {
  data: AutomationTaskListItem[]
  total: number
  page: number
  limit: number
  query?: string
  status?: string
  type?: string
  marketplace?: string
  createdFrom?: string
  createdTo?: string
  navigate: NavigateFn
}

const marketplaces = [
  { label: 'Amazon', value: 'amazon' },
  { label: 'Mercado Livre', value: 'mercado_livre' },
  { label: 'Shopee', value: 'shopee' },
]

const statuses = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Processando', value: 'processing' },
  { label: 'Concluída', value: 'completed' },
  { label: 'Parcial', value: 'partial' },
  { label: 'Falhou', value: 'failed' },
  { label: 'Ação manual requerida', value: 'manual_required' },
]

const types = [
  { label: 'Busca de produtos', value: 'marketplace_product_search' },
  { label: 'Captura HTML', value: 'fetch_rendered_html' },
  { label: 'Captura de afiliado', value: 'affiliate_link_capture' },
  { label: 'Geração de conteúdo', value: 'content_generation' },
  { label: 'Publicação', value: 'publication' },
]

export function AutomationTasksTable({
  data,
  total,
  page,
  limit,
  query,
  status,
  type,
  marketplace,
  createdFrom,
  createdTo,
  navigate,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    startedAt: false,
    finishedAt: false,
  })

  const searchRecord = useMemo(
    () => ({
      page,
      limit,
      query,
      status,
      type,
      marketplace,
    }),
    [page, limit, query, status, type, marketplace]
  )

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: searchRecord,
    navigate,
    pagination: {
      defaultPage: 1,
      defaultPageSize: 20,
      pageKey: 'page',
      pageSizeKey: 'limit',
    },
    globalFilter: { enabled: true, key: 'query' },
    columnFilters: [
      {
        columnId: 'marketplace',
        searchKey: 'marketplace',
        type: 'array',
        serialize: (val: unknown) => (Array.isArray(val) ? val[0] : val),
        deserialize: (val: unknown) => (val ? [val] : []),
      },
      {
        columnId: 'status',
        searchKey: 'status',
        type: 'array',
        serialize: (val: unknown) => (Array.isArray(val) ? val[0] : val),
        deserialize: (val: unknown) => (val ? [val] : []),
      },
      {
        columnId: 'task',
        searchKey: 'type',
        type: 'array',
        serialize: (val: unknown) => (Array.isArray(val) ? val[0] : val),
        deserialize: (val: unknown) => (val ? [val] : []),
      },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    manualPagination: true,
    rowCount: total,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  const pageCount = table.getPageCount()

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  const parsedFromDate = useMemo(
    () => (createdFrom ? parseISO(createdFrom) : undefined),
    [createdFrom]
  )
  const parsedToDate = useMemo(
    () => (createdTo ? parseISO(createdTo) : undefined),
    [createdTo]
  )

  const handleFromDateChange = (date: Date | undefined) => {
    const formatted = date ? formatDate(date, 'yyyy-MM-dd') : undefined
    void navigate({
      search: (prev) => {
        const next = { ...prev, createdFrom: formatted, page: 1 }
        if (!formatted) {
          delete next.createdFrom
        }
        return next
      },
    })
  }

  const handleToDateChange = (date: Date | undefined) => {
    const formatted = date ? formatDate(date, 'yyyy-MM-dd') : undefined
    void navigate({
      search: (prev) => {
        const next = { ...prev, createdTo: formatted, page: 1 }
        if (!formatted) {
          delete next.createdTo
        }
        return next
      },
    })
  }

  const handleResetFilters = () => {
    table.resetColumnFilters()
    table.setGlobalFilter('')
    void navigate({
      search: (prev) => {
        const next = { ...prev, page: 1 }
        delete next.query
        delete next.status
        delete next.type
        delete next.marketplace
        delete next.createdFrom
        delete next.createdTo
        return next
      },
    })
  }

  const hasDateFilters = Boolean(createdFrom || createdTo)
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter) ||
    hasDateFilters

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <DataTableToolbar
          table={table}
          searchPlaceholder='Filtrar por palavra-chave...'
          filters={[
            {
              columnId: 'marketplace',
              title: 'Marketplace',
              options: marketplaces,
              showCounts: false,
            },
            {
              columnId: 'status',
              title: 'Status',
              options: statuses,
              showCounts: false,
            },
            {
              columnId: 'task',
              title: 'Tipo',
              options: types,
              showCounts: false,
            },
          ]}
        />
        <div className='flex items-center gap-2'>
          <DatePicker
            selected={parsedFromDate}
            onSelect={handleFromDateChange}
            placeholder='Data de início'
          />
          <ArrowRight className='h-4 w-4 shrink-0 text-muted-foreground' />
          <DatePicker
            selected={parsedToDate}
            onSelect={handleToDateChange}
            placeholder='Data de fim'
          />
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className='inline-flex h-8 items-center justify-center rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 lg:px-3'
            >
              Resetar
              <Cross2Icon className='ms-2 h-4 w-4' />
            </button>
          )}
        </div>
      </div>

      <div className='overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm'>
        <Table className='min-w-xl'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Nenhuma tarefa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
