import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
  marketplace: z.enum(['mercado_livre', 'amazon', 'shopee'], {
    error: 'Marketplace é obrigatório.',
  }),
  query: z.string().min(1, 'Palavra-chave é obrigatória.'),
  category: z.string().optional(),
  limit: z
    .number()
    .min(1, 'Limite deve ser no mínimo 1.')
    .max(100, 'Limite deve ser no máximo 100.'),
})

export type MarketplaceSearchesFormValues = z.infer<typeof formSchema>

interface MarketplaceSearchesFormProps {
  onSubmit: (data: MarketplaceSearchesFormValues) => void
  isPending: boolean
  error?: string | null
  formId?: string
  showSubmitButton?: boolean
}

const marketplaces = [
  { label: 'Mercado Livre', value: 'mercado_livre' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Shopee', value: 'shopee' },
]

export function MarketplaceSearchesForm({
  onSubmit,
  isPending,
  error,
  formId,
  showSubmitButton = true,
}: MarketplaceSearchesFormProps) {
  const form = useForm<MarketplaceSearchesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketplace: undefined,
      query: '',
      category: '',
      limit: 100,
    },
  })

  return (
    <div className='w-full space-y-4'>
      {error ? (
        <Alert variant='destructive'>
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
        >
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
            name='query'
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

          {showSubmitButton ? (
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <>Iniciando...</>
              ) : (
                <>
                  Iniciar Busca <Search className='ms-2 h-4 w-4' />
                </>
              )}
            </Button>
          ) : null}
        </form>
      </Form>
    </div>
  )
}
