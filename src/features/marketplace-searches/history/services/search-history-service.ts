import { api } from '@/lib/api-client'
import { searchHistoryResponseSchema } from '../schemas/search-history-schema'

export type SearchHistoryParams = {
  page: number
  limit: number
  query?: string
  marketplace?: string
  status?: string
}

export const searchHistoryService = {
  async list(params: SearchHistoryParams) {
    const response = await api.get('/marketplace-searches', { params })
    return searchHistoryResponseSchema.parse(response.data)
  },
}
