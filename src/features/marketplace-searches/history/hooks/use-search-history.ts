import { useQuery } from '@tanstack/react-query'
import { searchHistoryService, type SearchHistoryParams } from '../services/search-history-service'
import { marketplaceSearchKeys } from '../../details/hooks/use-search-details'

export const searchHistoryKeys = {
  list: (params: SearchHistoryParams) =>
    [...marketplaceSearchKeys.all, 'list', params] as const,
}

export function useSearchHistory(params: SearchHistoryParams) {
  return useQuery({
    queryKey: searchHistoryKeys.list(params),
    queryFn: () => searchHistoryService.list(params),
  })
}
