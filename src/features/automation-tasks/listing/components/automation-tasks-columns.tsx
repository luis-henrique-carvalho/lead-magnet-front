import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { AutomationStatusBadge } from './automation-status-badge'
import type { AutomationTaskListItem } from '../schemas/automation-tasks-schema'

const taskTypeLabels: Record<string, string> = {
  marketplace_product_search: 'Busca de produtos',
  fetch_rendered_html: 'Captura HTML',
  affiliate_link_capture: 'Captura de afiliado',
  content_generation: 'Geração de conteúdo',
  publication: 'Publicação',
}

const marketplaceLabels: Record<string, string> = {
  amazon: 'Amazon',
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const formatDateTime = (value: string | null) => {
  if (!value) return '-'
  try {
    return dateFormatter.format(new Date(value))
  } catch {
    return '-'
  }
}

export const automationTasksColumns: ColumnDef<AutomationTaskListItem>[] = [
  {
    id: 'task',
    accessorFn: (row) => row.type,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tarefa' />
    ),
    cell: ({ row }) => {
      const type = row.original.type
      const id = row.original.taskId
      const label = taskTypeLabels[type] || type
      return (
        <div className='flex flex-col items-start'>
          <span className='font-medium text-sm'>{label}</span>
          <span className='text-xs text-muted-foreground font-mono'>
            {id.slice(0, 8)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return <AutomationStatusBadge status={status} />
    },
  },
  {
    accessorKey: 'marketplace',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Marketplace' />
    ),
    cell: ({ row }) => {
      const marketplace = row.getValue('marketplace') as string | null
      if (!marketplace) return <span>-</span>
      return <span>{marketplaceLabels[marketplace] || marketplace}</span>
    },
  },
  {
    accessorKey: 'attempts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tentativas' />
    ),
    cell: ({ row }) => <span>{row.getValue('attempts')}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Criada em' />
    ),
    cell: ({ row }) => <span>{formatDateTime(row.getValue('createdAt'))}</span>,
  },
  {
    accessorKey: 'startedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Início' />
    ),
    cell: ({ row }) => <span>{formatDateTime(row.getValue('startedAt'))}</span>,
  },
  {
    accessorKey: 'finishedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Conclusão' />
    ),
    cell: ({ row }) => <span>{formatDateTime(row.getValue('finishedAt'))}</span>,
  },
  {
    accessorKey: 'error',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Erro' />
    ),
    cell: ({ row }) => {
      const error = row.getValue('error') as string | null
      if (!error) return <span>-</span>
      return (
        <span
          className='block max-w-[200px] truncate text-xs text-destructive'
          title={error}
        >
          {error}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const taskId = row.original.taskId
      const context = row.original.context

      const hasSearchId = Boolean(context?.searchId)
      const hasOriginUrl = Boolean(context?.originUrl)

      return (
        <div className='flex items-center gap-3'>
          <Link
            to='/automation-tasks/$taskId'
            params={{ taskId }}
            search={{ attemptPage: 1, attemptLimit: 20 }}
            className='text-sm font-medium text-primary hover:underline'
          >
            Diagnóstico
          </Link>

          {hasSearchId && context?.searchId && (
            <Link
              to='/marketplace-searches/$searchId'
              params={{ searchId: context.searchId }}
              search={{ page: 1, limit: 20, capturePage: 1, captureLimit: 20 }}
              className='flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline'
            >
              <span>Origem</span>
              <ExternalLink className='h-3 w-3' />
            </Link>
          )}

          {!hasSearchId && hasOriginUrl && context?.originUrl && (
            <a
              href={context.originUrl}
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline'
            >
              <span>Origem</span>
              <ExternalLink className='h-3 w-3' />
            </a>
          )}
        </div>
      )
    },
  },
]
