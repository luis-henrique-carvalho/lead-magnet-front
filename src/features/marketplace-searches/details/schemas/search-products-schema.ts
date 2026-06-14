import { z } from 'zod'

export const marketplaceSearchProductsSchema = z.object({
  items: z.array(
    z.object({
      resultId: z.string(),
      discoveredAt: z.string(),
      product: z.object({
        id: z.string(),
        externalId: z.string().nullable(),
        marketplace: z.string(),
        title: z.string(),
        originalUrl: z.url(),
        imageUrl: z.url().nullable(),
        price: z.number().nullable(),
        rating: z.number().nullable(),
        reviewsCount: z.number().int().nonnegative().nullable(),
        salesCount: z.number().int().nonnegative().nullable(),
        category: z.string().nullable(),
      }),
    })
  ),
  page: z.number().int().positive(),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
})

export type MarketplaceSearchProduct = z.infer<
  typeof marketplaceSearchProductsSchema
>['items'][number]
