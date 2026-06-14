import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'

const formSchema = z.object({
  marketplace: z.string().min(1, 'Marketplace é obrigatório.'),
  keyword: z.string().min(1, 'Palavra-chave é obrigatória.'),
  category: z.string().optional(),
  limit: z
    .number()
    .min(1, 'Limite deve ser no mínimo 1.')
    .max(100, 'Limite deve ser no máximo 100.'),
})

export type SearchFormValues = z.infer<typeof formSchema>

interface SearchFormProps {
  onSubmit: (data: SearchFormValues) => void
  isPending: boolean
  error?: string | null
}

const marketplaces = [
  { label: 'Mercado Livre', value: 'MERCADO_LIVRE' },
  { label: 'Amazon', value: 'AMAZON' },
  { label: 'Shopee', value: 'SHOPEE' },
]

export function SearchForm({ onSubmit, isPending, error }: SearchFormProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketplace: '',
      keyword: '',
      category: '',
      limit: 100,
    },
  })

  return (
    <div className='space-y-4 max-w-md w-full'>
      {error && (
        <Alert variant='destructive'>
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='marketplace'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketplace</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder='Selecione um marketplace'
                  items={marketplaces}
                  disabled={isPending}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='keyword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palavra-chave</FormLabel>
                <FormControl>
                  <Input
                    placeholder='ex: iphone 15 pro'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input
                    placeholder='ex: Celulares (opcional)'
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='limit'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limite de Produtos</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    max={100}
                    disabled={isPending}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? (
              <>Iniciando...</>
            ) : (
              <>
                Iniciar Busca <Search className='ms-2 h-4 w-4' />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
