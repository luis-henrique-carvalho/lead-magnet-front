import { useQuery } from '@tanstack/react-query'
import { searchDetailsService } from '../services/search-details-service'

export const marketplaceSearchKeys = {
  all: ['marketplace-searches'] as const,
  detail: (searchId: string) =>
    [...marketplaceSearchKeys.all, 'detail', searchId] as const,
  task: (taskId: string) =>
    [...marketplaceSearchKeys.all, 'task', taskId] as const,
  productsRoot: (searchId: string) =>
    [...marketplaceSearchKeys.all, 'products', searchId] as const,
  products: (searchId: string, page: number, limit: number) =>
    [...marketplaceSearchKeys.productsRoot(searchId), page, limit] as const,
  captures: (searchId: string) =>
    [...marketplaceSearchKeys.all, 'captures', searchId] as const,
}

export function useSearchDetails(
  searchId: string,
  page: number,
  limit: number
) {
  const searchQuery = useQuery({
    queryKey: marketplaceSearchKeys.detail(searchId),
    queryFn: () => searchDetailsService.findById(searchId),
  })

  const productsQuery = useQuery({
    queryKey: marketplaceSearchKeys.products(searchId, page, limit),
    queryFn: () => searchDetailsService.findProducts(searchId, page, limit),
  })

  const taskId = searchQuery.data?.taskId ?? ''
  const taskQuery = useQuery({
    queryKey: marketplaceSearchKeys.task(taskId),
    queryFn: () => searchDetailsService.findTask(taskId),
    enabled: taskId.length > 0,
  })

  return { searchQuery, taskQuery, productsQuery }
}
