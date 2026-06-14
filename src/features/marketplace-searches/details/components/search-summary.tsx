import { CalendarClock, PackageCheck, PackageSearch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className='space-y-4'>
      <Card>
        <CardHeader className='gap-3 sm:grid-cols-[1fr_auto]'>
          <div className='space-y-1'>
            <CardTitle>
              {marketplaceLabels[search.marketplace] ?? search.marketplace}
            </CardTitle>
            <p className='text-sm text-muted-foreground'>
              Categoria: {search.category ?? 'Não disponível'} · Limite
              solicitado: {search.requestedLimit}
            </p>
          </div>
          <AutomationStatusBadge status={status} />
        </CardHeader>
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

      <p className='text-sm text-muted-foreground'>
        Concluída em:{' '}
        {search.completedAt
          ? dateFormatter.format(new Date(search.completedAt))
          : 'Não disponível'}
      </p>
    </div>
  )
}
