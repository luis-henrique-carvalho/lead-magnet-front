import { z } from 'zod'
import {
  automationTaskTypeSchema,
  automationErrorTypeSchema,
} from '@/features/automation-tasks/diagnostics/schemas/automation-task-diagnostics-schema'
import { automationTaskStatusSchema } from '@/features/marketplace-searches/details/schemas/search-details-schema'

export const automationTaskSummarySchema = z.object({
  pending: z.number().int().nonnegative(),
  processing: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  partial: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  manualRequired: z.number().int().nonnegative(),
})

export const automationTaskListContextSchema = z
  .object({
    kind: z.string().optional(),
    searchId: z.string().optional(),
    query: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    requestedLimit: z.number().optional(),
    foundCount: z.number().optional(),
    savedCount: z.number().optional(),
    originUrl: z.string().optional(),
    productId: z.string().optional(),
    originalProductUrl: z.string().optional().nullable(),
    capturedAffiliateUrl: z.string().optional().nullable(),
  })
  .nullable()
  .optional()

export const automationTaskListItemSchema = z.object({
  taskId: z.string(),
  type: automationTaskTypeSchema,
  marketplace: z.string().nullable(),
  status: automationTaskStatusSchema,
  statusUrl: z.string(),
  error: z.string().nullable(),
  errorType: automationErrorTypeSchema.nullable(),
  attempts: z.number().int().nonnegative(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  context: automationTaskListContextSchema,
})

export const automationTaskListResponseSchema = z.object({
  items: z.array(automationTaskListItemSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  summary: automationTaskSummarySchema,
})

export type AutomationTaskListItem = z.infer<typeof automationTaskListItemSchema>
export type AutomationTaskSummary = z.infer<typeof automationTaskSummarySchema>
export type AutomationTaskListResponse = z.infer<
  typeof automationTaskListResponseSchema
>
