import { useEffect } from 'react'

type UseCorrectProductsPageOptions = {
  page: number
  limit: number
  total?: number
  onPaginationChange: (pagination: { page: number; limit: number }) => void
}

export function useCorrectProductsPage({
  page,
  limit,
  total,
  onPaginationChange,
}: UseCorrectProductsPageOptions) {
  useEffect(() => {
    if (total === undefined) return

    const lastPage = Math.max(1, Math.ceil(total / limit))
    if (page > lastPage) {
      onPaginationChange({ page: lastPage, limit })
    }
  }, [limit, onPaginationChange, page, total])
}
