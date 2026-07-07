import { Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { AutomationConnectionStatus } from '@/features/automation-events/components/automation-connection-status'
import { useAutomationTasks } from './hooks/use-automation-tasks'
import { AutomationTasksSummaryCards } from './components/automation-tasks-summary-cards'
import { AutomationTasksTable } from './components/automation-tasks-table'

type AutomationTaskListScreenProps = {
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

export function AutomationTaskListScreen({
  page,
  limit,
  query,
  status,
  type,
  marketplace,
  createdFrom,
  createdTo,
  navigate,
}: AutomationTaskListScreenProps) {
  const { data, isLoading, isError, error, refetch } = useAutomationTasks({
    page,
    limit,
    query: query || undefined,
    status: status || undefined,
    type: type || undefined,
    marketplace: marketplace || undefined,
    createdFrom: createdFrom || undefined,
    createdTo: createdTo || undefined,
  })

  const hasActiveFilters = Boolean(
    query || status || type || marketplace || createdFrom || createdTo
  )

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Tarefas de Automação
            </h2>
            <p className='text-muted-foreground'>
              Acompanhe as automações executadas pelo Lead Magnet.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <AutomationConnectionStatus />
          </div>
        </div>

        {isLoading && (
          <div className='space-y-4' data-testid='loading-skeleton'>
            <Skeleton className='h-10 w-full' />
            <div className='space-y-3 rounded-md border p-4'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
            </div>
          </div>
        )}

        {isError && (
          <Alert variant='destructive' data-testid='error-alert'>
            <AlertTitle>Erro ao carregar tarefas</AlertTitle>
            <AlertDescription className='flex flex-col items-start gap-3'>
              <span>
                {error instanceof Error
                  ? error.message
                  : 'Ocorreu um erro ao obter os dados das tarefas.'}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => void refetch()}
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data && (
          <>
            <AutomationTasksSummaryCards summary={data.summary} />

            {data.total === 0 && !hasActiveFilters ? (
              <Card className='mt-6' data-testid='empty-state-no-tasks'>
                <CardHeader className='text-center'>
                  <Info className='mx-auto mb-3 h-12 w-12 text-muted-foreground' />
                  <CardTitle>Nenhuma tarefa registrada</CardTitle>
                  <CardDescription>
                    Ainda não há tarefas de automação no sistema.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <AutomationTasksTable
                data={data.items}
                total={data.total}
                page={page}
                limit={limit}
                query={query}
                status={status}
                type={type}
                marketplace={marketplace}
                createdFrom={createdFrom}
                createdTo={createdTo}
                navigate={navigate}
              />
            )}
          </>
        )}
      </Main>
    </>
  )
}
