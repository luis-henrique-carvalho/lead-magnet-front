import type { QueryClient } from '@tanstack/react-query'
import { marketplaceSearchKeys } from '@/features/marketplace-searches/details/hooks/use-search-details'
import type { AutomationEvent } from '../schemas/automation-event-schema'

export async function invalidateAutomationEventQueries(
  queryClient: QueryClient,
  event: AutomationEvent
) {
  const invalidations = [
    queryClient.invalidateQueries({
      queryKey: marketplaceSearchKeys.task(event.taskId),
    }),
  ]

  if (event.searchId && event.type === 'marketplace_product_search') {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: marketplaceSearchKeys.detail(event.searchId),
      }),
      queryClient.invalidateQueries({
        queryKey: marketplaceSearchKeys.productsRoot(event.searchId),
      })
    )
  }

  if (event.searchId && event.type === 'affiliate_link_capture') {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: marketplaceSearchKeys.captures(event.searchId),
      })
    )
  }

  await Promise.all(invalidations)
}
