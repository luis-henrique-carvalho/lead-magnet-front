import { api } from '@/lib/api-client'
import { automationTaskListResponseSchema } from '../schemas/automation-tasks-schema'

export type AutomationTaskListParams = {
  page: number
  limit: number
  query?: string
  status?: string
  type?: string
  marketplace?: string
  createdFrom?: string
  createdTo?: string
}

export const automationTasksService = {
  async list(params: AutomationTaskListParams) {
    const response = await api.get('/automation-tasks', { params })
    return automationTaskListResponseSchema.parse(response.data)
  },
}
