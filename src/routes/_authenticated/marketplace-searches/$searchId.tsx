import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/marketplace-searches/$searchId'
)({
  component: () => {
    const { searchId } = Route.useParams()
    return (
      <div className='p-8'>
        <h1 className='text-2xl font-bold'>Detalhes da Busca</h1>
        <p className='text-muted-foreground'>ID da Busca: {searchId}</p>
        <p className='text-muted-foreground'>Página de detalhes em desenvolvimento.</p>
      </div>
    )
  },
})
