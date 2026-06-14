import { PackageOpen } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { AutomationTaskStatus } from '../schemas/search-details-schema'
import type { MarketplaceSearchProduct } from '../schemas/search-products-schema'
import { ProductCard } from './product-card'
import { ProductsPagination } from './products-pagination'

export function ProductsList({
  items,
  isPending,
  status,
  isError,
  onRetry,
  page,
  limit,
  total,
  onPaginationChange,
}: {
  items: MarketplaceSearchProduct[]
  isPending: boolean
  status?: AutomationTaskStatus
  isError: boolean
  onRetry: () => void
  page: number
  limit: number
  total: number
  onPaginationChange: (pagination: { page: number; limit: number }) => void
}) {
  const isActive = status === 'pending' || status === 'processing'

  return (
    <section className='space-y-4' aria-labelledby='products-heading'>
      <div>
        <h2 id='products-heading' className='text-xl font-semibold'>
          Produtos descobertos
        </h2>
        <p className='text-sm text-muted-foreground'>
          Resultados na ordem em que foram encontrados.
        </p>
      </div>

      {isPending ? (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className='h-[420px]' />
          ))}
        </div>
      ) : null}

      {isError ? (
        <Alert variant='destructive'>
          <AlertTitle>Não foi possível carregar os produtos.</AlertTitle>
          <AlertDescription>
            <Button type='button' variant='outline' onClick={onRetry}>
              Tentar carregar produtos novamente
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!isError && items.length > 0 ? (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {items.map((item) => (
            <ProductCard key={item.resultId} item={item} />
          ))}
        </div>
      ) : null}

      {!isPending && !isError && total === 0 && status ? (
        <div className='flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center'>
          <PackageOpen
            className='size-9 text-muted-foreground'
            aria-hidden='true'
          />
          <h3 className='font-semibold'>Nenhum produto encontrado ainda</h3>
          <p className='max-w-lg text-sm text-muted-foreground'>
            {isActive
              ? 'A busca ainda está em andamento. Novos produtos aparecerão aqui.'
              : 'A busca foi concluída sem produtos para exibir.'}
          </p>
        </div>
      ) : null}

      {!isPending && !isError && total > 0 ? (
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
