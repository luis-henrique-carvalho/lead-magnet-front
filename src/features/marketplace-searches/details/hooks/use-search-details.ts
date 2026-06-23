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
  capturesPage: (searchId: string, page: number, limit: number) =>
    [...marketplaceSearchKeys.captures(searchId), page, limit] as const,
  productOccurrences: (productId: string, page: number, limit: number) =>
    [
      ...marketplaceSearchKeys.all,
      'product-occurrences',
      productId,
      page,
      limit,
    ] as const,
}

export function useSearchDetails(
  searchId: string,
  page: number,
  limit: number,
  capturePage: number,
  captureLimit: number
) {
  const searchQuery = useQuery({
    queryKey: marketplaceSearchKeys.detail(searchId),
    queryFn: () => searchDetailsService.findById(searchId),
  })

  const productsQuery = useQuery({
    queryKey: marketplaceSearchKeys.products(searchId, page, limit),
    queryFn: () => searchDetailsService.findProducts(searchId, page, limit),
  })

  const capturesQuery = useQuery({
    queryKey: marketplaceSearchKeys.capturesPage(
      searchId,
      capturePage,
      captureLimit
    ),
    queryFn: () =>
      searchDetailsService.findCaptures(searchId, capturePage, captureLimit),
  })

  const taskId = searchQuery.data?.taskId ?? ''
  const taskQuery = useQuery({
    queryKey: marketplaceSearchKeys.task(taskId),
    queryFn: () => searchDetailsService.findTask(taskId),
    enabled: taskId.length > 0,
  })

  return { searchQuery, taskQuery, productsQuery, capturesQuery }
}

export function useProductSearchOccurrences({
  productId,
  page,
  limit,
  enabled,
}: {
  productId: string
  page: number
  limit: number
  enabled: boolean
}) {
  return useQuery({
    queryKey: marketplaceSearchKeys.productOccurrences(productId, page, limit),
    queryFn: () =>
      searchDetailsService.findProductSearchOccurrences(productId, page, limit),
    enabled,
  })
}
