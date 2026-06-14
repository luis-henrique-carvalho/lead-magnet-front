import { z } from 'zod'

export const affiliateLinkCaptureResponseSchema = z.object({
  taskId: z.string(),
  statusUrl: z.string(),
})

export type AffiliateLinkCapturePayload = {
  searchId: string
  productId: string
  marketplace: string
  originalProductUrl: string
}
