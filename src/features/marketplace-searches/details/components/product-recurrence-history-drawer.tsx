import { useState } from 'react'
import { ExternalLink, History } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useProductSearchOccurrences } from '../hooks/use-search-details'
import type { ProductSearchOccurrence } from '../schemas/product-search-occurrences-schema'
import type { MarketplaceSearchProduct } from '../schemas/search-products-schema'
import { ProductsPagination } from './products-pagination'

type Product = MarketplaceSearchProduct['product']

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const marketplaceLabels: Record<string, string> = {
  amazon: 'Amazon',
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function ProductSearchOccurrenceItem({
  occurrence,
}: {
  occurrence: ProductSearchOccurrence
}) {
  const query = occurrence.query ?? 'Busca sem palavra-chave'

  return (
    <a
      href={`/marketplace-searches/${occurrence.searchId}`}
      aria-label={`Abrir busca ${query}`}
      className='block rounded-md border p-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden'
    >
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div>
          <h3 className='font-medium'>{query}</h3>
          <p className='text-sm text-muted-foreground'>
            Descoberto em {formatDate(occurrence.discoveredAt)}
          </p>
        </div>
        <ExternalLink className='size-4 text-muted-foreground' aria-hidden />
      </div>
      <div className='mt-3 flex flex-wrap gap-2'>
        <Badge variant='secondary'>
          {marketplaceLabels[occurrence.marketplace] ?? occurrence.marketplace}
        </Badge>
        <Badge variant='outline'>
          {occurrence.category ?? 'Categoria não disponível'}
        </Badge>
      </div>
    </a>
  )
}

export function ProductRecurrenceHistoryDrawer({
  product,
}: {
  product: Product
}) {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10
  const occurrencesQuery = useProductSearchOccurrences({
    productId: product.id,
    page,
    limit,
    enabled: open,
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className='w-full'
          aria-label={`Ver histórico de recorrência de ${product.title}`}
        >
          <History data-icon='inline-start' aria-hidden='true' />
          Histórico de recorrência
        </Button>
      </SheetTrigger>
      <SheetContent className='w-full overflow-y-auto sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>Histórico de recorrência</SheetTitle>
          <SheetDescription>{product.title}</SheetDescription>
        </SheetHeader>

        <div className='flex flex-1 flex-col gap-4 px-4 pb-4'>
          <Alert>
            <AlertTitle>Histórico comprovado</AlertTitle>
            <AlertDescription>
              Associações legadas não comprovadas não estão incluídas neste
              histórico.
            </AlertDescription>
          </Alert>

          {occurrencesQuery.isPending ? (
            <div className='flex flex-col gap-3'>
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className='h-28' />
              ))}
            </div>
          ) : null}

          {occurrencesQuery.isError ? (
            <Alert variant='destructive'>
              <AlertTitle>Não foi possível carregar o histórico.</AlertTitle>
              <AlertDescription>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => void occurrencesQuery.refetch()}
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          {!occurrencesQuery.isPending &&
          !occurrencesQuery.isError &&
          occurrencesQuery.data?.items.length === 0 ? (
            <p className='rounded-md border p-4 text-sm text-muted-foreground'>
              Nenhuma recorrência comprovada encontrada para este produto.
            </p>
          ) : null}

          {occurrencesQuery.data?.items.length ? (
            <div className='flex flex-col gap-3'>
              {occurrencesQuery.data.items.map((occurrence) => (
                <ProductSearchOccurrenceItem
                  key={occurrence.searchId}
                  occurrence={occurrence}
                />
              ))}
            </div>
          ) : null}

          {occurrencesQuery.data && occurrencesQuery.data.total > 0 ? (
            <ProductsPagination
              page={page}
              limit={limit}
              total={occurrencesQuery.data.total}
              onChange={({ page: nextPage }) => setPage(nextPage)}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
