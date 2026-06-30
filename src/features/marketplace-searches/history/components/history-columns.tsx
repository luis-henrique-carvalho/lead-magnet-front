import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { AutomationStatusBadge } from '../../details/components/automation-status-badge'
import { type SearchHistoryItem } from '../schemas/search-history-schema'

const marketplaceLabels: Record<string, string> = {
  amazon: 'Amazon',
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export const historyColumns: ColumnDef<SearchHistoryItem>[] = [
  {
    accessorKey: 'marketplace',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Marketplace' />
    ),
    cell: ({ row }) => {
      const marketplace = row.getValue('marketplace') as string
      return <span>{marketplaceLabels[marketplace] || marketplace}</span>
    },
  },
  {
    accessorKey: 'query',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Palavra-chave' />
    ),
    cell: ({ row }) => {
      const query = row.getValue('query') as string | null
      return <span className='font-medium'>{query || '-'}</span>
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Categoria' />
    ),
    cell: ({ row }) => {
      const category = row.getValue('category') as string | null
      return <span>{category || '-'}</span>
    },
  },
  {
    accessorKey: 'requestedLimit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Limite' />
    ),
    cell: ({ row }) => <span>{row.getValue('requestedLimit')}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.task.status
      return (
        <div className='flex flex-col items-start gap-1'>
          <AutomationStatusBadge status={status} />
        </div>
      )
    },
  },
  {
    accessorKey: 'foundCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Encontrados' />
    ),
    cell: ({ row }) => <span>{row.getValue('foundCount')}</span>,
  },
  {
    accessorKey: 'savedCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Salvos' />
    ),
    cell: ({ row }) => <span>{row.getValue('savedCount')}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Criação' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string)
      return <span>{dateFormatter.format(date)}</span>
    },
  },
  {
    accessorKey: 'completedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Conclusão' />
    ),
    cell: ({ row }) => {
      const val = row.getValue('completedAt') as string | null
      if (!val) return <span>-</span>
      const date = new Date(val)
      return <span>{dateFormatter.format(date)}</span>
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const searchId = row.original.searchId
      const taskId = row.original.taskId
      return (
        <div className='flex items-center gap-3'>
          <Link
            to='/marketplace-searches/$searchId'
            params={{ searchId }}
            search={{ page: 1, limit: 20, capturePage: 1, captureLimit: 20 }}
            className='text-sm font-medium text-primary hover:underline'
          >
            Detalhes
          </Link>
          <Link
            to='/automation-tasks/$taskId'
            params={{ taskId }}
            search={{ attemptPage: 1, attemptLimit: 20 }}
            className='flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline'
            title={`Diagnóstico da task ${taskId}`}
          >
            <span>{taskId.slice(0, 8)}</span>
            <ExternalLink className='h-3.5 w-3.5' />
          </Link>
        </div>
      )
    },
  },
]
