import { getRouteApi, Link } from '@tanstack/react-router'
import { Info, Plus } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { HistoryPrimaryButtons } from './components/history-primary-buttons'
import { HistoryTable } from './components/history-table'
import { useSearchHistory } from './hooks/use-search-history'

type HistoryScreenProps = {
  page: number
  limit: number
  query?: string
  marketplace?: string
  status?: string
  navigate: any
}

export function HistoryScreen({
  page,
  limit,
  query,
  marketplace,
  status,
  navigate,
}: HistoryScreenProps) {
  const { data, isLoading, isError, error, refetch } = useSearchHistory({
    page,
    limit,
    query: query || undefined,
    marketplace: marketplace || undefined,
    status: status || undefined,
  })

  const hasActiveFilters = Boolean(query || marketplace || status)

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
            <h2 className='text-2xl font-bold tracking-tight'>Histórico de Buscas</h2>
            <p className='text-muted-foreground'>
              Veja e gerencie o histórico de buscas de produtos realizadas na plataforma.
            </p>
          </div>
          <HistoryPrimaryButtons />
        </div>

        {isLoading && (
          <div className='space-y-4' data-testid='loading-skeleton'>
            <Skeleton className='h-10 w-full' />
            <div className='rounded-md border p-4 space-y-3'>
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
            <AlertTitle>Erro ao carregar histórico</AlertTitle>
            <AlertDescription className='flex flex-col gap-3 items-start'>
              <span>
                {error instanceof Error ? error.message : 'Ocorreu um erro ao obter os dados do histórico.'}
              </span>
              <Button variant='outline' size='sm' onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data && (
          <>
            {data.total === 0 && !hasActiveFilters ? (
              <Card className='mt-6' data-testid='empty-state-no-searches'>
                <CardHeader className='text-center'>
                  <Info className='mx-auto h-12 w-12 text-muted-foreground mb-3' />
                  <CardTitle>Nenhuma busca cadastrada</CardTitle>
                  <CardDescription>
                    Você ainda não realizou nenhuma busca de produtos no marketplace.
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex justify-center'>
                  <Button asChild>
                    <Link to='/marketplace-searches/new'>
                      <Plus className='me-2 h-4 w-4' />
                      Iniciar Nova Busca
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <HistoryTable
                data={data.items}
                total={data.total}
                page={page}
                limit={limit}
                query={query}
                marketplace={marketplace}
                status={status}
                navigate={navigate}
              />
            )}
          </>
        )}
      </Main>
    </>
  )
}
