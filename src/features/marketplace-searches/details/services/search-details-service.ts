import { api } from '@/lib/api-client'
import {
  automationTaskSummarySchema,
  marketplaceSearchDetailSchema,
} from '../schemas/search-details-schema'
import { marketplaceSearchCapturesSchema } from '../schemas/search-captures-schema'
import { marketplaceSearchProductsSchema } from '../schemas/search-products-schema'

export const searchDetailsService = {
  async findById(searchId: string) {
    const response = await api.get(`/marketplace-searches/${searchId}`)
    return marketplaceSearchDetailSchema.parse(response.data)
  },

  async findTask(taskId: string) {
    const response = await api.get(`/automation-tasks/${taskId}`)
    return automationTaskSummarySchema.parse(response.data)
  },

  async findProducts(searchId: string, page: number, limit: number) {
    const response = await api.get(
      `/marketplace-searches/${searchId}/products`,
      {
        params: { page, limit },
      }
    )
    return marketplaceSearchProductsSchema.parse(response.data)
  },

  async findCaptures(searchId: string, page: number, limit: number) {
    const response = await api.get(
      `/marketplace-searches/${searchId}/affiliate-link-capture-tasks`,
      {
        params: { page, limit },
      }
    )
    return marketplaceSearchCapturesSchema.parse(response.data)
  },
}
