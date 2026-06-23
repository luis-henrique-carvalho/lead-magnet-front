import { isAxiosError } from 'axios'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AutomationConnectionStatus } from '@/features/automation-events/providers/automation-events-provider'
import { ProductsList } from './components/products-list'
import { SearchCapturesList } from './components/search-captures-list'
import { SearchDetailsDialogs } from './components/search-details-dialogs'
import { SearchDetailsError } from './components/search-details-error'
import { SearchDetailsNotFound } from './components/search-details-not-found'
import { SearchDetailsPrimaryButtons } from './components/search-details-primary-buttons'
import { SearchDetailsProvider } from './components/search-details-provider'
import { SearchDetailsSkeleton } from './components/search-details-skeleton'
import { SearchSummary } from './components/search-summary'
import { useCorrectProductsPage } from './hooks/use-correct-products-page'
import { useSearchDetails } from './hooks/use-search-details'

type SearchDetailsProps = {
  searchId: string
  page: number
  limit: number
  capturePage: number
  captureLimit: number
  onPaginationChange: (pagination: { page: number; limit: number }) => void
  onCapturesPaginationChange: (pagination: {
    capturePage: number
    captureLimit: number
  }) => void
}

export function SearchDetails({
  searchId,
  page,
  limit,
  capturePage,
  captureLimit,
  onPaginationChange,
  onCapturesPaginationChange,
}: SearchDetailsProps) {
  const { searchQuery, taskQuery, productsQuery, capturesQuery } =
    useSearchDetails(searchId, page, limit, capturePage, captureLimit)
  const isLoading =
    searchQuery.isPending || (searchQuery.isSuccess && taskQuery.isPending)
  const hasError = searchQuery.isError || taskQuery.isError
  const isNotFound =
    isAxiosError(searchQuery.error) &&
    searchQuery.error.response?.status === 404

  useCorrectProductsPage({
    page,
    limit,
    total: productsQuery.data?.total,
    onPaginationChange,
  })

  const handleRetry = () => {
    if (searchQuery.isError) void searchQuery.refetch()
    if (taskQuery.isError) void taskQuery.refetch()
  }

  return (
    <SearchDetailsProvider
      searchId={searchId}
      pagination={{ page, limit }}
      onPaginationChange={onPaginationChange}
    >
      <Header fixed>
        <Search className='me-auto' />
        <AutomationConnectionStatus />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {searchQuery.data?.query ?? 'Detalhes da busca'}
            </h2>
            <p className='text-muted-foreground'>
              Acompanhe a automação e os produtos descobertos.
            </p>
          </div>
          <SearchDetailsPrimaryButtons />
        </div>

        {isLoading ? <SearchDetailsSkeleton /> : null}
        {isNotFound ? <SearchDetailsNotFound /> : null}
        {hasError && !isNotFound ? (
          <SearchDetailsError onRetry={handleRetry} />
        ) : null}
        {searchQuery.data && taskQuery.data ? (
          <SearchSummary
            search={searchQuery.data}
            status={taskQuery.data.status}
          />
        ) : null}
        {!isNotFound ? (
          <ProductsList
            items={productsQuery.data?.items ?? []}
            isPending={productsQuery.isPending}
            isError={productsQuery.isError}
            onRetry={() => void productsQuery.refetch()}
            status={taskQuery.data?.status}
            page={page}
            limit={limit}
            total={productsQuery.data?.total ?? 0}
            onPaginationChange={onPaginationChange}
          />
        ) : null}
        {!isNotFound ? (
          <SearchCapturesList
            items={capturesQuery.data?.items ?? []}
            isPending={capturesQuery.isPending}
            isError={capturesQuery.isError}
            onRetry={() => void capturesQuery.refetch()}
            page={capturePage}
            limit={captureLimit}
            total={capturesQuery.data?.total ?? 0}
            onPaginationChange={({ page, limit }) =>
              onCapturesPaginationChange({
                capturePage: page,
                captureLimit: limit,
              })
            }
          />
        ) : null}
      </Main>

      <SearchDetailsDialogs />
    </SearchDetailsProvider>
  )
}
