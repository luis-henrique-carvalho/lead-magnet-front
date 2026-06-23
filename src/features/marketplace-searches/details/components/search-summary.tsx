import { CalendarClock, PackageCheck, PackageSearch } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type {
  AutomationTaskStatus,
  MarketplaceSearchDetail,
} from '../schemas/search-details-schema'
import { AutomationStatusBadge } from './automation-status-badge'

const marketplaceLabels: Record<string, string> = {
  amazon: 'Amazon',
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function SummaryMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: typeof PackageSearch
}) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between gap-3'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {label}
        </CardTitle>
        <Icon className='size-4 text-muted-foreground' aria-hidden='true' />
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-bold'>{value}</p>
      </CardContent>
    </Card>
  )
}

export function SearchSummary({
  search,
  status,
}: {
  search: MarketplaceSearchDetail
  status: AutomationTaskStatus
}) {
  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>
            {marketplaceLabels[search.marketplace] ?? search.marketplace}
          </CardTitle>
          <CardDescription>
            Categoria: {search.category ?? 'Não disponível'} · Limite
            solicitado: {search.requestedLimit}
          </CardDescription>
          <CardAction>
            <AutomationStatusBadge status={status} />
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Concluída em:{' '}
            {search.completedAt
              ? dateFormatter.format(new Date(search.completedAt))
              : 'Não disponível'}
          </p>
        </CardContent>
      </Card>

      <div className='grid gap-4 sm:grid-cols-3'>
        <SummaryMetric
          label='Produtos encontrados'
          value={search.foundCount}
          icon={PackageSearch}
        />
        <SummaryMetric
          label='Produtos salvos'
          value={search.savedCount}
          icon={PackageCheck}
        />
        <SummaryMetric
          label='Criada em'
          value={dateFormatter.format(new Date(search.createdAt))}
          icon={CalendarClock}
        />
      </div>
    </div>
  )
}
