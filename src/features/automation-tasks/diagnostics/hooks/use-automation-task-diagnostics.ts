import { useQuery } from '@tanstack/react-query'
import { automationTaskDiagnosticsService } from '../services/automation-task-diagnostics-service'

export const automationTaskKeys = {
  all: ['automation-tasks'] as const,
  detail: (taskId: string) => [...automationTaskKeys.all, taskId] as const,
  attempts: (taskId: string, page: number, limit: number) =>
    [...automationTaskKeys.detail(taskId), 'attempts', page, limit] as const,
  dependencies: (taskId: string) =>
    [...automationTaskKeys.detail(taskId), 'dependencies'] as const,
  dependents: (taskId: string) =>
    [...automationTaskKeys.detail(taskId), 'dependents'] as const,
  pendingDependencies: (taskId: string) =>
    [...automationTaskKeys.detail(taskId), 'pending-dependencies'] as const,
}

export function useAutomationTaskDiagnostics(
  taskId: string,
  attemptPage: number,
  attemptLimit: number
) {
  const taskQuery = useQuery({
    queryKey: automationTaskKeys.detail(taskId),
    queryFn: () => automationTaskDiagnosticsService.findTask(taskId),
  })
  const attemptsQuery = useQuery({
    queryKey: automationTaskKeys.attempts(taskId, attemptPage, attemptLimit),
    queryFn: () =>
      automationTaskDiagnosticsService.findAttempts(
        taskId,
        attemptPage,
        attemptLimit
      ),
  })
  const dependenciesQuery = useQuery({
    queryKey: automationTaskKeys.dependencies(taskId),
    queryFn: () => automationTaskDiagnosticsService.findDependencies(taskId),
  })
  const dependentsQuery = useQuery({
    queryKey: automationTaskKeys.dependents(taskId),
    queryFn: () => automationTaskDiagnosticsService.findDependents(taskId),
  })
  const pendingDependenciesQuery = useQuery({
    queryKey: automationTaskKeys.pendingDependencies(taskId),
    queryFn: () =>
      automationTaskDiagnosticsService.findPendingDependencies(taskId),
  })

  return {
    taskQuery,
    attemptsQuery,
    dependenciesQuery,
    dependentsQuery,
    pendingDependenciesQuery,
  }
}
