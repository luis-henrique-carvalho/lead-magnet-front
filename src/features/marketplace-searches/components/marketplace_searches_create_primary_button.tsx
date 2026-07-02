import { type ComponentProps } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type MarketplaceSearchesCreatePrimaryButtonProps = Omit<
  ComponentProps<typeof Button>,
  'children' | 'onClick'
> & {
  label?: string
  onCreateMarketplaceSearches: () => void
}

export function MarketplaceSearchesCreatePrimaryButton({
  label = 'Nova Busca',
  onCreateMarketplaceSearches,
  ...buttonProps
}: MarketplaceSearchesCreatePrimaryButtonProps) {
  return (
    <Button onClick={onCreateMarketplaceSearches} {...buttonProps}>
      <Plus className='me-2 h-4 w-4' />
      {label}
    </Button>
  )
}
