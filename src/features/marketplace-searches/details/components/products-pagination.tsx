import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    <Card className='py-3'>
      <CardContent className='flex flex-wrap items-center justify-between gap-3 px-3'>
        <div className='flex flex-wrap items-center gap-4'>
          <p className='text-sm font-medium'>
            Página {page} de {totalPages}
          </p>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              Itens por página
            </span>
            <Select
              value={String(limit)}
              onValueChange={(value) =>
                onChange({ page: 1, limit: Number(value) })
              }
            >
              <SelectTrigger
                size='sm'
                className='w-20'
                aria-label='Itens por página'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[10, 20, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={page <= 1}
            onClick={() => onChange({ page: page - 1, limit })}
          >
            <ChevronLeft data-icon='inline-start' aria-hidden='true' />
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
            <ChevronRight data-icon='inline-end' aria-hidden='true' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
