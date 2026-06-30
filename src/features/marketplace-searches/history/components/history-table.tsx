import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
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
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { historyColumns as columns } from './history-columns'
import { type SearchHistoryItem } from '../schemas/search-history-schema'

type DataTableProps = {
  data: SearchHistoryItem[]
  total: number
  page: number
  limit: number
  query?: string
  marketplace?: string
  status?: string
  navigate: any
}

const marketplaces = [
  { label: 'Mercado Livre', value: 'mercado_livre' },
  { label: 'Amazon', value: 'amazon' },
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

export function HistoryTable({
  data,
  total,
  page,
  limit,
  query,
  marketplace,
  status,
  navigate,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const searchRecord = useMemo(
    () => ({
      page,
      limit,
      query,
      marketplace,
      status,
    }),
    [page, limit, query, marketplace, status]
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
    pagination: { defaultPage: 1, defaultPageSize: 20, pageKey: 'page', pageSizeKey: 'limit' },
    globalFilter: { enabled: true, key: 'query' },
    columnFilters: [
      {
        columnId: 'marketplace',
        searchKey: 'marketplace',
        type: 'array',
        serialize: (val: any) => (Array.isArray(val) ? val[0] : val),
        deserialize: (val: any) => (val ? [val] : []),
      },
      {
        columnId: 'status',
        searchKey: 'status',
        type: 'array',
        serialize: (val: any) => (Array.isArray(val) ? val[0] : val),
        deserialize: (val: any) => (val ? [val] : []),
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

  return (
    <div className={cn('flex flex-1 flex-col gap-4')}>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filtrar por palavra-chave...'
        filters={[
          {
            columnId: 'marketplace',
            title: 'Marketplace',
            options: marketplaces,
          },
          {
            columnId: 'status',
            title: 'Status',
            options: statuses,
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table className='min-w-xl'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
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
                  )
                })}
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
                  Nenhum histórico encontrado.
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
