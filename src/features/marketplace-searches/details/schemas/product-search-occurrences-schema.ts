import { z } from 'zod'

export const productSearchOccurrencesSchema = z.object({
  items: z.array(
    z.object({
      searchId: z.string(),
      taskId: z.string(),
      marketplace: z.string(),
      query: z.string().nullable(),
      category: z.string().nullable(),
      requestedLimit: z.number().int().positive(),
      discoveredAt: z.string(),
    })
  ),
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
  legacyAssociationsExcluded: z.literal(true),
})

export type ProductSearchOccurrence = z.infer<
  typeof productSearchOccurrencesSchema
>['items'][number]
