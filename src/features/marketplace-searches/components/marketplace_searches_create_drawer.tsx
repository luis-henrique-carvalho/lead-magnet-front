import { isAxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createMarketplaceSearch } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  MarketplaceSearchesForm,
  type MarketplaceSearchesFormValues,
} from './marketplace_searches_form'

type MarketplaceSearchesCreateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MARKETPLACE_SEARCHES_CREATE_FORM_ID = 'marketplace-searches-create-form'

function getErrorMessage(error: unknown) {
  if (!error) return null

  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      'Erro ao conectar ao servidor.'
    )
  }

  return 'Erro inesperado ao criar a busca.'
}

export function MarketplaceSearchesCreateDrawer({
  open,
  onOpenChange,
}: MarketplaceSearchesCreateDrawerProps) {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createMarketplaceSearch,
    onSuccess: (data) => {
      onOpenChange(false)
      navigate({
        to: '/marketplace-searches/$searchId',
        params: { searchId: data.searchId },
        search: { page: 1, limit: 20, capturePage: 1, captureLimit: 20 },
      })
    },
  })

  const handleSubmit = (values: MarketplaceSearchesFormValues) => {
    mutation.mutate({
      marketplace: values.marketplace,
      query: values.query,
      category: values.category || undefined,
      limit: values.limit,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col sm:max-w-md'>
        <SheetHeader className='text-start'>
          <SheetTitle>Nova Busca</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para iniciar uma nova busca de produtos no
            marketplace.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto px-4'>
          <MarketplaceSearchesForm
            key={
              open
                ? 'marketplace-searches-create-open'
                : 'marketplace-searches-create-closed'
            }
            formId={MARKETPLACE_SEARCHES_CREATE_FORM_ID}
            onSubmit={handleSubmit}
            isPending={mutation.isPending}
            error={getErrorMessage(mutation.error)}
            showSubmitButton={false}
          />
        </div>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline' disabled={mutation.isPending}>
              Fechar
            </Button>
          </SheetClose>
          <Button
            form={MARKETPLACE_SEARCHES_CREATE_FORM_ID}
            type='submit'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Iniciando...' : 'Iniciar Busca'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
