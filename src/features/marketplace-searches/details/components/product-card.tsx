import {
  ExternalLink,
  ImageOff,
  MessageSquareText,
  ShoppingBag,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { MarketplaceSearchProduct } from '../schemas/search-products-schema'
import { AffiliateLinkCaptureButton } from './affiliate-link-capture-button'
import { ProductRecurrenceHistoryDrawer } from './product-recurrence-history-drawer'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
const numberFormatter = new Intl.NumberFormat('pt-BR')
const marketplaceLabels: Record<string, string> = {
  amazon: 'Amazon',
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
}

function OptionalMetric({
  icon: Icon,
  value,
}: {
  icon: typeof Star
  value: string | null
}) {
  return (
    <span className='inline-flex items-center gap-1 text-sm text-muted-foreground'>
      <Icon aria-hidden='true' />
      {value ?? 'Não disponível'}
    </span>
  )
}

export function ProductCard({ item }: { item: MarketplaceSearchProduct }) {
  const { product } = item

  return (
    <Card className='overflow-hidden py-0 [contain-intrinsic-size:0_420px] [content-visibility:auto]'>
      <div className='aspect-[4/3] overflow-hidden bg-muted'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-muted-foreground'>
            <ImageOff className='size-10' aria-hidden='true' />
            <span className='sr-only'>Imagem não disponível</span>
          </div>
        )}
      </div>

      <CardContent className='flex flex-1 flex-col gap-4 pt-5'>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='secondary'>
            {marketplaceLabels[product.marketplace] ?? product.marketplace}
          </Badge>
          <Badge variant='outline'>
            {product.category ?? 'Categoria não disponível'}
          </Badge>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='line-clamp-2 font-semibold'>{product.title}</h3>
          <p className='text-xl font-bold'>
            {product.price === null
              ? 'Não disponível'
              : priceFormatter.format(product.price)}
          </p>
        </div>

        <div className='grid gap-2 sm:grid-cols-3'>
          <OptionalMetric
            icon={Star}
            value={
              product.rating === null
                ? null
                : product.rating.toLocaleString('pt-BR')
            }
          />
          <OptionalMetric
            icon={MessageSquareText}
            value={
              product.reviewsCount === null
                ? null
                : `${numberFormatter.format(product.reviewsCount)} reviews`
            }
          />
          <OptionalMetric
            icon={ShoppingBag}
            value={
              product.salesCount === null
                ? null
                : `${numberFormatter.format(product.salesCount)} vendas`
            }
          />
        </div>
      </CardContent>

      <CardFooter className='grid gap-2 pb-5'>
        <ProductRecurrenceHistoryDrawer product={product} />
        <AffiliateLinkCaptureButton product={product} />
        <Button asChild variant='outline' className='w-full'>
          <a
            href={product.originalUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            Ver produto original
            <ExternalLink data-icon='inline-end' aria-hidden='true' />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
