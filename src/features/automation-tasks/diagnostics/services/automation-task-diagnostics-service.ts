import { api } from '@/lib/api-client'
import {
  automationTaskAttemptsSchema,
  automationTaskDependenciesSchema,
  automationTaskDiagnosticsSchema,
  pendingAutomationTaskDependenciesSchema,
} from '../schemas/automation-task-diagnostics-schema'

export const automationTaskDiagnosticsService = {
  async findTask(taskId: string) {
    const response = await api.get(`/automation-tasks/${taskId}`)
    return automationTaskDiagnosticsSchema.parse(response.data)
  },

  async findAttempts(taskId: string, page: number, limit: number) {
    const response = await api.get(`/automation-tasks/${taskId}/attempts`, {
      params: { page, limit },
    })
    return automationTaskAttemptsSchema.parse(response.data)
  },

  async findDependencies(taskId: string) {
    const response = await api.get(`/automation-tasks/${taskId}/dependencies`)
    return automationTaskDependenciesSchema.parse(response.data)
  },

  async findDependents(taskId: string) {
    const response = await api.get(`/automation-tasks/${taskId}/dependents`)
    return automationTaskDependenciesSchema.parse(response.data)
  },

  async findPendingDependencies(taskId: string) {
    const response = await api.get(
      `/automation-tasks/${taskId}/dependencies/pending`
    )
    return pendingAutomationTaskDependenciesSchema.parse(response.data)
  },
}
