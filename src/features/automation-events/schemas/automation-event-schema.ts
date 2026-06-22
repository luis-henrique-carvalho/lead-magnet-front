import { z } from 'zod'
import { automationTaskStatusSchema } from '@/features/marketplace-searches/details/schemas/search-details-schema'

export const automationEventSchema = z.object({
  eventId: z.string().min(1),
  eventType: z.enum(['task.created', 'task.updated']),
  taskId: z.string().min(1),
  type: z.string().min(1),
  status: automationTaskStatusSchema,
  marketplace: z.string().nullable(),
  updatedAt: z.string().min(1),
  searchId: z.string().nullish(),
  productId: z.string().nullish(),
})

export type AutomationEvent = z.infer<typeof automationEventSchema>
