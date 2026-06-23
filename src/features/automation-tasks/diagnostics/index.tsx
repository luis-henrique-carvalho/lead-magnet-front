import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AutomationStatusBadge } from '@/features/marketplace-searches/details/components/automation-status-badge'
import { ProductsPagination } from '@/features/marketplace-searches/details/components/products-pagination'
import { useAutomationTaskDiagnostics } from './hooks/use-automation-task-diagnostics'
import type {
  AutomationTaskAttempt,
  AutomationTaskDependency,
  AutomationTaskDiagnosticsData,
  PendingAutomationTaskDependency,
} from './schemas/automation-task-diagnostics-schema'

type AutomationTaskDiagnosticsProps = {
  taskId: string
  attemptPage: number
  attemptLimit: number
  onAttemptsPaginationChange: (pagination: {
    attemptPage: number
    attemptLimit: number
  }) => void
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const marketplaceLabels: Record<string, string> = {
  amazon: 'Amazon',
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
}

const taskTypeLabels: Record<string, string> = {
  marketplace_product_search: 'Busca de produtos',
  fetch_rendered_html: 'Captura de HTML',
  affiliate_link_capture: 'Captura de afiliado',
  content_generation: 'Geração de conteúdo',
  publication: 'Publicação',
}

const errorTypeLabels: Record<string, string> = {
  timeout: 'Timeout',
  upstream_error: 'Erro externo',
  validation_error: 'Erro de validação',
  internal_error: 'Erro interno',
  auth_error: 'Erro de autenticação',
  throttling: 'Limite de requisições',
  session_invalid: 'Sessão inválida',
  layout_changed: 'Layout alterado',
  captcha_required: 'Captcha requerido',
  manual_required: 'Ação manual requerida',
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Não disponível'
  return dateFormatter.format(new Date(value))
}

function labelFromMap(
  value: string | null | undefined,
  labels: Record<string, string>
) {
  if (!value) return 'Não disponível'
  return labels[value] ?? value
}

function getOriginLink(task: AutomationTaskDiagnosticsData) {
  const result = task.result
  if (!result || typeof result !== 'object') return null

  const searchId = (result as Record<string, unknown>).searchId
  if (typeof searchId === 'string' && searchId.length > 0) {
    return {
      href: `/marketplace-searches/${searchId}`,
      label: 'Voltar para a busca de origem',
    }
  }

  return null
}

function SummaryCard({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className='text-xl'>{value}</CardTitle>
      </CardHeader>
      {detail ? (
        <CardContent className='pt-0 text-sm text-muted-foreground'>
          {detail}
        </CardContent>
      ) : null}
    </Card>
  )
}

function TaskSummary({ task }: { task: AutomationTaskDiagnosticsData }) {
  const origin = getOriginLink(task)

  return (
    <section className='flex flex-col gap-4' aria-labelledby='task-summary'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 id='task-summary' className='text-xl font-semibold'>
            Resumo técnico
          </h2>
          <p className='text-sm break-all text-muted-foreground'>
            Task {task.id}
          </p>
        </div>
        {origin ? (
          <Button asChild variant='outline'>
            <a href={origin.href} aria-label={origin.label}>
              <ArrowLeft data-icon='inline-start' aria-hidden='true' />
              {origin.label}
            </a>
          </Button>
        ) : (
          <Button asChild variant='outline'>
            <a href='/marketplace-searches'>
              <ArrowLeft data-icon='inline-start' aria-hidden='true' />
              Voltar para buscas
            </a>
          </Button>
        )}
      </div>

      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <SummaryCard
          title='Tipo'
          value={labelFromMap(task.type, taskTypeLabels)}
          detail={task.type}
        />
        <SummaryCard
          title='Marketplace'
          value={labelFromMap(task.marketplace, marketplaceLabels)}
        />
        <Card>
          <CardHeader>
            <CardDescription>Estado</CardDescription>
            <CardTitle>
              <AutomationStatusBadge status={task.status} />
            </CardTitle>
          </CardHeader>
        </Card>
        <SummaryCard
          title='Retries'
          value={`${task.attempts} ${
            task.attempts === 1 ? 'tentativa' : 'tentativas'
          }`}
          detail={`Atualizada: ${formatDate(task.updatedAt)}`}
        />
      </div>

      <dl className='grid gap-3 text-sm md:grid-cols-3'>
        <div>
          <dt className='text-muted-foreground'>Criada</dt>
          <dd>{formatDate(task.createdAt)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>Iniciada</dt>
          <dd>{formatDate(task.startedAt)}</dd>
        </div>
        <div>
          <dt className='text-muted-foreground'>Finalizada</dt>
          <dd>{formatDate(task.finishedAt)}</dd>
        </div>
      </dl>

      {task.error ? (
        <Alert variant='destructive'>
          <AlertTitle>{task.error}</AlertTitle>
          <AlertDescription>
            {labelFromMap(task.errorType, errorTypeLabels)}
          </AlertDescription>
        </Alert>
      ) : null}
    </section>
  )
}

function AttemptsTable({
  items,
  page,
  limit,
  total,
  onPaginationChange,
}: {
  items: AutomationTaskAttempt[]
  page: number
  limit: number
  total: number
  onPaginationChange: (pagination: { page: number; limit: number }) => void
}) {
  return (
    <section className='flex flex-col gap-4' aria-labelledby='attempts-heading'>
      <div>
        <h2 id='attempts-heading' className='text-xl font-semibold'>
          Tentativas
        </h2>
        <p className='text-sm text-muted-foreground'>
          Histórico paginado de execuções da automação.
        </p>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Erro</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((attempt) => (
                <TableRow key={`${attempt.number}-${attempt.jobId}`}>
                  <TableCell>{attempt.number}</TableCell>
                  <TableCell>{attempt.jobId}</TableCell>
                  <TableCell>
                    <AutomationStatusBadge status={attempt.status} />
                  </TableCell>
                  <TableCell>
                    {attempt.error ? (
                      <span>
                        {attempt.error} (
                        {labelFromMap(attempt.errorType, errorTypeLabels)})
                      </span>
                    ) : (
                      'Sem erro'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(attempt.startedAt)}</TableCell>
                  <TableCell>{formatDate(attempt.finishedAt)}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    Nenhuma tentativa registrada.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {total > 0 ? (
        <ProductsPagination
          page={page}
          limit={limit}
          total={total}
          onChange={onPaginationChange}
        />
      ) : null}
    </section>
  )
}

function DependencyCard({ item }: { item: AutomationTaskDependency }) {
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div>
            <CardTitle className='text-base'>
              <a
                href={`/automation-tasks/${item.taskId}`}
                className='break-all underline-offset-4 hover:underline'
              >
                {item.taskId}
              </a>
            </CardTitle>
            <CardDescription>
              {labelFromMap(item.type, taskTypeLabels)}
            </CardDescription>
          </div>
          <div className='flex flex-wrap gap-2'>
            <AutomationStatusBadge status={item.status} />
            <Badge variant={item.required ? 'default' : 'outline'}>
              {item.required ? 'Obrigatória' : 'Opcional'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className='text-sm text-muted-foreground'>
        Criada em {formatDate(item.createdAt)}
      </CardContent>
    </Card>
  )
}

function DependencySection({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: AutomationTaskDependency[]
}) {
  return (
    <section className='flex flex-col gap-3' aria-labelledby={title}>
      <div>
        <h2 id={title} className='text-xl font-semibold'>
          {title}
        </h2>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>
      {items.length > 0 ? (
        <div className='grid gap-3 lg:grid-cols-2'>
          {items.map((item) => (
            <DependencyCard key={`${title}-${item.taskId}`} item={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='py-8 text-sm text-muted-foreground'>
            Nenhuma task relacionada.
          </CardContent>
        </Card>
      )}
    </section>
  )
}

function PendingDependencies({
  items,
}: {
  items: PendingAutomationTaskDependency[]
}) {
  return (
    <section className='flex flex-col gap-3' aria-labelledby='pending-heading'>
      <div>
        <h2 id='pending-heading' className='text-xl font-semibold'>
          Bloqueios pendentes
        </h2>
        <p className='text-sm text-muted-foreground'>
          Dependências obrigatórias que ainda bloqueiam a execução.
        </p>
      </div>
      {items.length > 0 ? (
        <Card>
          <CardContent className='flex flex-wrap gap-2'>
            {items.map((item) => (
              <Button
                key={item.predecessorId}
                asChild
                variant='outline'
                size='sm'
              >
                <a href={`/automation-tasks/${item.predecessorId}`}>
                  {item.predecessorId}
                  <ExternalLink data-icon='inline-end' aria-hidden='true' />
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className='py-8 text-sm text-muted-foreground'>
            Nenhuma predecessora obrigatória pendente.
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export function AutomationTaskDiagnostics({
  taskId,
  attemptPage,
  attemptLimit,
  onAttemptsPaginationChange,
}: AutomationTaskDiagnosticsProps) {
  const {
    taskQuery,
    attemptsQuery,
    dependenciesQuery,
    dependentsQuery,
    pendingDependenciesQuery,
  } = useAutomationTaskDiagnostics(taskId, attemptPage, attemptLimit)
  const isPending =
    taskQuery.isPending ||
    attemptsQuery.isPending ||
    dependenciesQuery.isPending ||
    dependentsQuery.isPending ||
    pendingDependenciesQuery.isPending
  const isError =
    taskQuery.isError ||
    attemptsQuery.isError ||
    dependenciesQuery.isError ||
    dependentsQuery.isError ||
    pendingDependenciesQuery.isError
  const handleRetry = () => {
    if (taskQuery.isError) void taskQuery.refetch()
    if (attemptsQuery.isError) void attemptsQuery.refetch()
    if (dependenciesQuery.isError) void dependenciesQuery.refetch()
    if (dependentsQuery.isError) void dependentsQuery.refetch()
    if (pendingDependenciesQuery.isError) {
      void pendingDependenciesQuery.refetch()
    }
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Diagnóstico da automação
          </h1>
          <p className='text-muted-foreground'>
            Estado técnico, tentativas e dependências da task.
          </p>
        </div>

        {isPending ? (
          <div className='grid gap-3'>
            <Skeleton className='h-44' />
            <Skeleton className='h-64' />
          </div>
        ) : null}

        {isError ? (
          <Alert variant='destructive'>
            <AlertTitle>Não foi possível carregar o diagnóstico.</AlertTitle>
            <AlertDescription>
              <Button type='button' variant='outline' onClick={handleRetry}>
                <RefreshCw data-icon='inline-start' aria-hidden='true' />
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        {!isPending && !isError && taskQuery.data ? (
          <>
            <TaskSummary task={taskQuery.data} />
            <AttemptsTable
              items={attemptsQuery.data?.items ?? []}
              page={attemptPage}
              limit={attemptLimit}
              total={attemptsQuery.data?.total ?? 0}
              onPaginationChange={({ page, limit }) =>
                onAttemptsPaginationChange({
                  attemptPage: page,
                  attemptLimit: limit,
                })
              }
            />
            <DependencySection
              title='Predecessoras'
              description='Tasks que esta automação aguarda ou referencia.'
              items={dependenciesQuery.data ?? []}
            />
            <PendingDependencies items={pendingDependenciesQuery.data ?? []} />
            <DependencySection
              title='Sucessoras'
              description='Tasks que dependem desta automação.'
              items={dependentsQuery.data ?? []}
            />
          </>
        ) : null}
      </Main>
    </>
  )
}
