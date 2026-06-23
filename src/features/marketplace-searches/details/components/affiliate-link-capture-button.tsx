import { Link2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEnqueueAffiliateLinkCapture } from '../hooks/use-enqueue-affiliate-link-capture'
import type { MarketplaceSearchProduct } from '../schemas/search-products-schema'
import { useSearchDetailsContext } from './search-details-provider'

export function AffiliateLinkCaptureButton({
  product,
}: {
  product: MarketplaceSearchProduct['product']
}) {
  const { searchId } = useSearchDetailsContext()
  const captureMutation = useEnqueueAffiliateLinkCapture(searchId)

  const handleCapture = () => {
    captureMutation.mutate({
      productId: product.id,
      marketplace: product.marketplace,
      originalProductUrl: product.originalUrl,
    })
  }

  return (
    <Button
      type='button'
      className='w-full'
      disabled={captureMutation.isPending}
      onClick={handleCapture}
      aria-label={`Iniciar captura de link afiliado para ${product.title}`}
    >
      {captureMutation.isPending ? (
        <Loader2
          data-icon='inline-start'
          className='animate-spin'
          aria-hidden='true'
        />
      ) : (
        <Link2 data-icon='inline-start' aria-hidden='true' />
      )}
      {captureMutation.isPending ? 'Enfileirando...' : 'Capturar link afiliado'}
    </Button>
  )
}
