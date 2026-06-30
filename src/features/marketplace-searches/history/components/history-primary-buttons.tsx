import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HistoryPrimaryButtons() {
  return (
    <Button asChild size='sm'>
      <Link to='/marketplace-searches/new'>
        <Plus className='me-2 h-4 w-4' />
        Nova Busca
      </Link>
    </Button>
  )
}
