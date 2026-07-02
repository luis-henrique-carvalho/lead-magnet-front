import { MarketplaceSearchesCreatePrimaryButton } from '../../components/marketplace_searches_create_primary_button'

type HistoryPrimaryButtonsProps = {
  onCreateMarketplaceSearches: () => void
}

export function HistoryPrimaryButtons({
  onCreateMarketplaceSearches,
}: HistoryPrimaryButtonsProps) {
  return (
    <MarketplaceSearchesCreatePrimaryButton
      size='sm'
      onCreateMarketplaceSearches={onCreateMarketplaceSearches}
    />
  )
}
