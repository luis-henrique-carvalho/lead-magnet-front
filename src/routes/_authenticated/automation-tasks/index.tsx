import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AutomationTaskListScreen } from '@/features/automation-tasks'
import { type NavigateFn } from '@/hooks/use-table-url-state'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce.number().int().min(1).max(100).catch(20),
  query: z.string().optional().catch(''),
  status: z.string().optional().catch(''),
  type: z.string().optional().catch(''),
  marketplace: z.string().optional().catch(''),
  createdFrom: z.string().optional().catch(''),
  createdTo: z.string().optional().catch(''),
})

function AutomationTaskListRoute() {
  const {
    page,
    limit,
    query,
    status,
    type,
    marketplace,
    createdFrom,
    createdTo,
  } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <AutomationTaskListScreen
      page={page}
      limit={limit}
      query={query}
      status={status}
      type={type}
      marketplace={marketplace}
      createdFrom={createdFrom}
      createdTo={createdTo}
      navigate={navigate as unknown as NavigateFn}
    />
  )
}

export const Route = createFileRoute('/_authenticated/automation-tasks/')({
  validateSearch: searchSchema,
  component: AutomationTaskListRoute,
})
