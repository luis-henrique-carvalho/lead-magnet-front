import { Skeleton } from '@/components/ui/skeleton'

export function SearchDetailsSkeleton() {
  return (
    <div
      className='flex flex-col gap-4'
      aria-label='Carregando detalhes da busca'
    >
      <Skeleton className='h-32 w-full' />
      <div className='grid gap-4 sm:grid-cols-3'>
        <Skeleton className='h-32' />
        <Skeleton className='h-32' />
        <Skeleton className='h-32' />
      </div>
    </div>
  )
}
