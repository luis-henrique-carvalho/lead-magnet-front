import { z } from 'zod'
import { automationTaskStatusSchema } from './search-details-schema'

export const marketplaceSearchCapturesSchema = z.object({
  items: z.array(
    z.object({
      taskId: z.string(),
      status: automationTaskStatusSchema,
      marketplace: z.string().nullable(),
      productId: z.string().nullable(),
      productTitle: z.string().nullable(),
      originalProductUrl: z.url().nullable(),
      capturedAffiliateUrl: z.url().nullable(),
      taskCreatedAt: z.string(),
      startedAt: z.string().nullable(),
      finishedAt: z.string().nullable(),
      capturedAt: z.string().nullable(),
    })
  ),
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
})

export type MarketplaceSearchCapture = z.infer<
  typeof marketplaceSearchCapturesSchema
>['items'][number]
