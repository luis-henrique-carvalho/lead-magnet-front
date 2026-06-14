import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { AutomationTaskStatus } from '../schemas/search-details-schema'

const statusPresentation: Record<
  AutomationTaskStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pendente',
    className:
      'border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  },
  processing: {
    label: 'Processando',
    className:
      'border-blue-300 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  completed: {
    label: 'Concluída',
    className:
      'border-emerald-300 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  partial: {
    label: 'Parcial',
    className:
      'border-amber-300 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  failed: {
    label: 'Falhou',
    className:
      'border-red-300 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
  manual_required: {
    label: 'Ação manual requerida',
    className:
      'border-orange-300 bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  },
}

export function AutomationStatusBadge({
  status,
}: {
  status: AutomationTaskStatus
}) {
  const presentation = statusPresentation[status]

  return (
    <Badge
      variant='outline'
      className={cn('font-semibold', presentation.className)}
    >
      {presentation.label}
    </Badge>
  )
}
