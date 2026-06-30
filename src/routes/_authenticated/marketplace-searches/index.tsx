import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { HistoryScreen } from '@/features/marketplace-searches'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce.number().int().min(1).max(100).catch(20),
  query: z.string().optional().catch(''),
  marketplace: z.string().optional().catch(''),
  status: z.string().optional().catch(''),
})

import { type NavigateFn } from '@/hooks/use-table-url-state'

function HistoryRoute() {
  const { page, limit, query, marketplace, status } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <HistoryScreen
      page={page}
      limit={limit}
      query={query}
      marketplace={marketplace}
      status={status}
      navigate={navigate as unknown as NavigateFn}
    />
  )
}

export const Route = createFileRoute('/_authenticated/marketplace-searches/')({
  validateSearch: searchSchema,
  component: HistoryRoute,
})


