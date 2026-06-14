/* eslint-disable react-refresh/only-export-components */
import { useCallback } from 'react'
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SearchDetails } from '@/features/marketplace-searches'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce.number().int().min(1).max(100).catch(20),
})

function SearchDetailsRoute() {
  const { searchId } = Route.useParams()
  const { page, limit } = Route.useSearch()
  const navigate = Route.useNavigate()
  const handlePaginationChange = useCallback(
    (pagination: { page: number; limit: number }) => {
      void navigate({
        search: (current) => ({ ...current, ...pagination }),
        replace: true,
      })
    },
    [navigate]
  )

  return (
    <SearchDetails
      searchId={searchId}
      page={page}
      limit={limit}
      onPaginationChange={handlePaginationChange}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/marketplace-searches/$searchId'
)({
  validateSearch: searchSchema,
  component: SearchDetailsRoute,
})
