import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { MarketplaceSearchCapture } from '../schemas/search-captures-schema'
import { AutomationStatusBadge } from './automation-status-badge'
import { ProductsPagination } from './products-pagination'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function formatDate(value: string | null) {
  if (!value) return 'Não disponível'

  return dateFormatter.format(new Date(value))
}

function SearchCaptureCard({ item }: { item: MarketplaceSearchCapture }) {
  const productName = item.productTitle ?? 'Produto não disponível'
  const hasAffiliateLink = Boolean(item.capturedAffiliateUrl)

  const handleCopyAffiliateLink = async () => {
    if (!item.capturedAffiliateUrl) return

    try {
      await navigator.clipboard.writeText(item.capturedAffiliateUrl)
      toast.success('Link afiliado copiado.')
    } catch {
      toast.error('Não foi possível copiar o link afiliado.')
    }
  }

  return (
    <Card className='[contain-intrinsic-size:0_220px] [content-visibility:auto]'>
      <CardHeader>
        <CardTitle>{productName}</CardTitle>
        <CardDescription className='break-all'>
          {item.capturedAffiliateUrl ?? 'Link afiliado indisponível'}
        </CardDescription>
        <CardAction>
          <AutomationStatusBadge status={item.status} />
        </CardAction>
      </CardHeader>

      <CardContent>
        <dl className='grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <dt className='text-muted-foreground'>Criada</dt>
            <dd>Criada: {formatDate(item.taskCreatedAt)}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>Iniciada</dt>
            <dd>Iniciada: {formatDate(item.startedAt)}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>Finalizada</dt>
            <dd>Finalizada: {formatDate(item.finishedAt)}</dd>
          </div>
          <div>
            <dt className='text-muted-foreground'>Capturada</dt>
            <dd>Capturada: {formatDate(item.capturedAt)}</dd>
          </div>
        </dl>
      </CardContent>

      <Separator />

      <CardFooter className='flex-wrap gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={!hasAffiliateLink}
          aria-label={`Copiar link afiliado de ${productName}`}
          onClick={() => void handleCopyAffiliateLink()}
        >
          <Copy data-icon='inline-start' aria-hidden='true' />
          Copiar link
        </Button>
        {item.capturedAffiliateUrl ? (
          <Button asChild variant='outline' size='sm'>
            <a
              href={item.capturedAffiliateUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Abrir link afiliado de ${productName}`}
            >
              Abrir link
              <ExternalLink data-icon='inline-end' aria-hidden='true' />
            </a>
          </Button>
        ) : null}
        <Button asChild variant='outline' size='sm'>
          <a
            href={`/automation-tasks/${item.taskId}`}
            aria-label={`Abrir diagnóstico da captura ${productName}`}
          >
            Ver diagnóstico
            <ExternalLink data-icon='inline-end' aria-hidden='true' />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function SearchCapturesList({
  items,
  isPending,
  isError,
  onRetry,
  page,
  limit,
  total,
  onPaginationChange,
}: {
  items: MarketplaceSearchCapture[]
  isPending: boolean
  isError: boolean
  onRetry: () => void
  page: number
  limit: number
  total: number
  onPaginationChange: (pagination: { page: number; limit: number }) => void
}) {
  return (
    <section className='flex flex-col gap-4' aria-labelledby='captures-heading'>
      <div>
        <h2 id='captures-heading' className='text-xl font-semibold'>
          Capturas de link afiliado
        </h2>
        <p className='text-sm text-muted-foreground'>
          Tarefas originadas por esta busca.
        </p>
      </div>

      {isPending ? (
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className='h-36' />
          ))}
        </div>
      ) : null}

      {isError ? (
        <Alert variant='destructive'>
          <AlertTitle>Não foi possível carregar as capturas.</AlertTitle>
          <AlertDescription>
            <Button type='button' variant='outline' onClick={onRetry}>
              Tentar carregar capturas novamente
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!isPending && !isError && total === 0 ? (
        <Card>
          <CardContent className='flex min-h-40 flex-col items-center justify-center gap-2 text-center'>
            <h3 className='font-semibold'>Nenhuma captura iniciada ainda</h3>
            <p className='max-w-lg text-sm text-muted-foreground'>
              As capturas enfileiradas a partir dos produtos descobertos
              aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!isError && items.length > 0 ? (
        <div className='flex flex-col gap-3'>
          {items.map((item) => (
            <SearchCaptureCard key={item.taskId} item={item} />
          ))}
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
