import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchDetailsPrimaryButtons() {
  return (
    <Button asChild>
      <a href='/marketplace-searches/new'>
        <Plus />
        Nova busca
      </a>
    </Button>
  )
}
