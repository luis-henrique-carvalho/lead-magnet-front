import { createFileRoute } from '@tanstack/react-router'
import { NewSearch } from '@/features/marketplace-searches'

export const Route = createFileRoute(
  '/_authenticated/marketplace-searches/new/'
)({
  component: NewSearch,
})
