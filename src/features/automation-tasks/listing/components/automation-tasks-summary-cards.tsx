import {
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AutomationTaskSummary } from '../schemas/automation-tasks-schema'

type SummaryCardsProps = {
  summary: AutomationTaskSummary
}

export function AutomationTasksSummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Pendente',
      value: summary.pending,
      icon: Clock,
      color: 'text-muted-foreground',
    },
    {
      title: 'Processando',
      value: summary.processing,
      icon: Loader2,
      color: 'text-blue-500 animate-spin',
    },
    {
      title: 'Concluída',
      value: summary.completed,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Parcial',
      value: summary.partial,
      icon: AlertTriangle,
      color: 'text-yellow-500',
    },
    {
      title: 'Falhou',
      value: summary.failed,
      icon: XCircle,
      color: 'text-red-500',
    },
    {
      title: 'Ação Manual',
      value: summary.manualRequired,
      icon: UserCheck,
      color: 'text-purple-500',
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-6'>
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className='relative overflow-hidden'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-medium tracking-tight text-muted-foreground'>
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
