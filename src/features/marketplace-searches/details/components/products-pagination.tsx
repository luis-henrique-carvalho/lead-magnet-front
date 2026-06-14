import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ProductsPaginationProps = {
  page: number
  limit: number
  total: number
  onChange: (pagination: { page: number; limit: number }) => void
}

export function ProductsPagination({
  page,
  limit,
  total,
  onChange,
}: ProductsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3'>
      <div className='flex flex-wrap items-center gap-4'>
        <p className='text-sm font-medium'>
          Página {page} de {totalPages}
        </p>
        <label className='flex items-center gap-2 text-sm text-muted-foreground'>
          Itens por página
          <select
            aria-label='Itens por página'
            value={limit}
            onChange={(event) =>
              onChange({ page: 1, limit: Number(event.target.value) })
            }
            className='h-8 rounded-md border bg-background px-2 text-foreground'
          >
            {[10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={page <= 1}
          onClick={() => onChange({ page: page - 1, limit })}
        >
          <ChevronLeft aria-hidden='true' />
          Página anterior
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={page >= totalPages}
          onClick={() => onChange({ page: page + 1, limit })}
        >
          Próxima página
          <ChevronRight aria-hidden='true' />
        </Button>
      </div>
    </div>
  )
}
