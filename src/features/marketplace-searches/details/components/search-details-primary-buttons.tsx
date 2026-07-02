import { MarketplaceSearchesCreatePrimaryButton } from '../../components/marketplace_searches_create_primary_button'

type SearchDetailsPrimaryButtonsProps = {
  onCreateMarketplaceSearches: () => void
}

export function SearchDetailsPrimaryButtons({
  onCreateMarketplaceSearches,
}: SearchDetailsPrimaryButtonsProps) {
  return (
    <MarketplaceSearchesCreatePrimaryButton
      label='Nova busca'
      onCreateMarketplaceSearches={onCreateMarketplaceSearches}
    />
  )
}
