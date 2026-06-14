import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchDetailsNotFound() {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center'>
      <SearchX className='size-12 text-muted-foreground' aria-hidden='true' />
      <p className='text-6xl font-bold tracking-tight'>404</p>
      <h3 className='text-xl font-semibold'>Busca não encontrada</h3>
      <p className='max-w-md text-muted-foreground'>
        Esta busca não existe ou foi removida. Verifique o endereço informado.
      </p>
      <Button asChild variant='outline'>
        <a href='/marketplace-searches/new'>Criar nova busca</a>
      </Button>
    </div>
  )
}
