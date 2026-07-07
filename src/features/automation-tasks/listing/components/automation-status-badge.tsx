import type { ComponentProps } from 'react'
import { Badge } from '@/components/ui/badge'
import type { AutomationTaskStatus } from '@/features/marketplace-searches/details/schemas/search-details-schema'

const statusPresentation: Record<
  AutomationTaskStatus,
  { label: string; variant: ComponentProps<typeof Badge>['variant'] }
> = {
  pending: {
    label: 'Pendente',
    variant: 'outline',
  },
  processing: {
    label: 'Processando',
    variant: 'secondary',
  },
  completed: {
    label: 'Concluída',
    variant: 'default',
  },
  partial: {
    label: 'Parcial',
    variant: 'secondary',
  },
  failed: {
    label: 'Falhou',
    variant: 'destructive',
  },
  manual_required: {
    label: 'Ação manual requerida',
    variant: 'outline',
  },
}

export function AutomationStatusBadge({
  status,
}: {
  status: AutomationTaskStatus
}) {
  const presentation = statusPresentation[status] || {
    label: status,
    variant: 'outline',
  }

  return <Badge variant={presentation.variant}>{presentation.label}</Badge>
}
