import { api } from '@/lib/api-client'
import {
  affiliateLinkCaptureResponseSchema,
  type AffiliateLinkCapturePayload,
} from '../schemas/affiliate-link-capture-schema'

export const affiliateLinkCaptureService = {
  async enqueue(payload: AffiliateLinkCapturePayload) {
    const response = await api.post('/affiliate-link-capture', payload)
    return affiliateLinkCaptureResponseSchema.parse(response.data)
  },
}
