import { z } from 'zod'

export const automationTaskStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'partial',
  'failed',
  'manual_required',
])

export const marketplaceSearchDetailSchema = z.object({
  searchId: z.string(),
  taskId: z.string(),
  marketplace: z.string(),
  query: z.string().nullable(),
  category: z.string().nullable(),
  requestedLimit: z.number().int().positive(),
  foundCount: z.number().int().nonnegative(),
  savedCount: z.number().int().nonnegative(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
})

export const automationTaskSummarySchema = z.object({
  id: z.string(),
  status: automationTaskStatusSchema,
})

export type AutomationTaskStatus = z.infer<typeof automationTaskStatusSchema>
export type MarketplaceSearchDetail = z.infer<
  typeof marketplaceSearchDetailSchema
>
