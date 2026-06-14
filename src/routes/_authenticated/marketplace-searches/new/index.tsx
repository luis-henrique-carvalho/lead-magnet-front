import { createFileRoute } from '@tanstack/react-router'
import { NewSearch } from '@/features/marketplace-searches/new'

export const Route = createFileRoute(
  '/_authenticated/marketplace-searches/new/'
)({
  component: NewSearch,
})
