import { useQuery } from '@tanstack/react-query'
import {
  automationTasksService,
  type AutomationTaskListParams,
} from '../services/automation-tasks-service'
import { automationTaskKeys } from '@/features/automation-tasks/diagnostics/hooks/use-automation-task-diagnostics'

export const automationTaskListKeys = {
  list: (params: AutomationTaskListParams) =>
    [...automationTaskKeys.all, 'list', params] as const,
}

export function useAutomationTasks(params: AutomationTaskListParams) {
  return useQuery({
    queryKey: automationTaskListKeys.list(params),
    queryFn: () => automationTasksService.list(params),
  })
}
