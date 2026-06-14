import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { createMarketplaceSearch } from '@/lib/api-client'
import { SearchForm, type SearchFormValues } from './components/search-form'

export function NewSearch() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createMarketplaceSearch,
    onSuccess: (data) => {
      navigate({
        to: '/marketplace-searches/$searchId',
        params: { searchId: data.searchId },
      })
    },
  })

  const handleSubmit = (values: SearchFormValues) => {
    mutation.mutate({
      marketplace: values.marketplace,
      keyword: values.keyword,
      category: values.category || undefined,
      limit: values.limit,
    })
  }

  const getErrorMessage = (error: unknown) => {
    if (!error) return null
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.message ||
        error.message ||
        'Erro ao conectar ao servidor.'
      )
    }
    return 'Erro inesperado ao criar a busca.'
  }

  return (
    <>
      {/* ===== Header ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Nova Busca</h1>
          <p className='text-muted-foreground'>
            Preencha os campos abaixo para iniciar uma nova busca de produtos no marketplace.
          </p>
        </div>

        <div className='flex justify-start'>
          <SearchForm
            onSubmit={handleSubmit}
            isPending={mutation.isPending}
            error={getErrorMessage(mutation.error)}
          />
        </div>
      </Main>
    </>
  )
}
