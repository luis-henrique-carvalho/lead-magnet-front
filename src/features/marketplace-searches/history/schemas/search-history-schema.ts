import { z } from 'zod'
import { automationTaskStatusSchema } from '../../details/schemas/search-details-schema'

export const searchHistoryTaskSchema = z.object({
  status: automationTaskStatusSchema,
  error: z.string().nullable(),
  errorType: z.string().nullable(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  updatedAt: z.string(),
})

export const searchHistoryItemSchema = z.object({
  searchId: z.string(),
  taskId: z.string(),
  marketplace: z.string(),
  query: z.string().nullable(),
  category: z.string().nullable(),
  requestedLimit: z.number(),
  foundCount: z.number(),
  savedCount: z.number(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  task: searchHistoryTaskSchema,
})

export const searchHistoryResponseSchema = z.object({
  items: z.array(searchHistoryItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
})

export type SearchHistoryItem = z.infer<typeof searchHistoryItemSchema>
export type SearchHistoryResponse = z.infer<typeof searchHistoryResponseSchema>
