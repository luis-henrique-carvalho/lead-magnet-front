/* eslint-disable react-refresh/only-export-components */
import { useCallback } from 'react'
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AutomationTaskDiagnostics } from '@/features/automation-tasks/diagnostics'

const searchSchema = z.object({
  attemptPage: z.coerce.number().int().min(1).catch(1),
  attemptLimit: z.coerce.number().int().min(1).max(100).catch(20),
})

function AutomationTaskDiagnosticsRoute() {
  const { taskId } = Route.useParams()
  const { attemptPage, attemptLimit } = Route.useSearch()
  const navigate = Route.useNavigate()
  const handleAttemptsPaginationChange = useCallback(
    (pagination: { attemptPage: number; attemptLimit: number }) => {
      void navigate({
        search: (current) => ({ ...current, ...pagination }),
        replace: true,
      })
    },
    [navigate]
  )

  return (
    <AutomationTaskDiagnostics
      taskId={taskId}
      attemptPage={attemptPage}
      attemptLimit={attemptLimit}
      onAttemptsPaginationChange={handleAttemptsPaginationChange}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/automation-tasks/$taskId'
)({
  validateSearch: searchSchema,
  component: AutomationTaskDiagnosticsRoute,
})
