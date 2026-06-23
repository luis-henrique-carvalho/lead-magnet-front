import { z } from 'zod'
import { automationTaskStatusSchema } from '@/features/marketplace-searches/details/schemas/search-details-schema'

export const automationTaskTypeSchema = z.enum([
  'marketplace_product_search',
  'fetch_rendered_html',
  'affiliate_link_capture',
  'content_generation',
  'publication',
])

export const automationErrorTypeSchema = z.enum([
  'timeout',
  'upstream_error',
  'validation_error',
  'internal_error',
  'auth_error',
  'throttling',
  'session_invalid',
  'layout_changed',
  'captcha_required',
  'manual_required',
])

export const automationTaskAttemptSchema = z.object({
  number: z.number().int().positive(),
  jobId: z.string(),
  status: automationTaskStatusSchema,
  error: z.string().nullable(),
  errorType: automationErrorTypeSchema.nullable(),
  metadata: z.unknown().optional(),
  startedAt: z.string(),
  finishedAt: z.string().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const automationTaskDiagnosticsSchema = z.object({
  id: z.string(),
  type: automationTaskTypeSchema,
  marketplace: z.string().nullable(),
  status: automationTaskStatusSchema,
  statusUrl: z.string(),
  result: z.unknown().nullable(),
  error: z.string().nullable(),
  errorType: automationErrorTypeSchema.nullable(),
  attempts: z.number().int().nonnegative(),
  attemptsHistory: z.array(automationTaskAttemptSchema),
  pendingPredecessorTaskIds: z.array(z.string()),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const automationTaskAttemptsSchema = z.object({
  items: z.array(automationTaskAttemptSchema),
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
})

export const automationTaskDependencySchema = z.object({
  taskId: z.string(),
  type: automationTaskTypeSchema,
  status: automationTaskStatusSchema,
  direction: z.enum(['predecessor', 'successor']),
  required: z.boolean(),
  createdAt: z.string(),
})

export const pendingAutomationTaskDependencySchema = z
  .object({
    predecessorId: z.string().optional(),
    taskId: z.string().optional(),
    status: automationTaskStatusSchema,
  })
  .transform((dependency) => ({
    predecessorId: dependency.predecessorId ?? dependency.taskId ?? '',
    status: dependency.status,
  }))
  .pipe(
    z.object({
      predecessorId: z.string().min(1),
      status: automationTaskStatusSchema,
    })
  )

export const automationTaskDependenciesSchema = z.array(
  automationTaskDependencySchema
)
export const pendingAutomationTaskDependenciesSchema = z.array(
  pendingAutomationTaskDependencySchema
)

export type AutomationTaskDiagnosticsData = z.infer<
  typeof automationTaskDiagnosticsSchema
>
export type AutomationTaskAttempt = z.infer<typeof automationTaskAttemptSchema>
export type AutomationTaskDependency = z.infer<
  typeof automationTaskDependencySchema
>
export type PendingAutomationTaskDependency = z.infer<
  typeof pendingAutomationTaskDependencySchema
>
