import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/marketplace-searches/')({
  component: () => (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>Histórico de Buscas</h1>
      <p className='text-muted-foreground'>Em breve.</p>
    </div>
  ),
})
