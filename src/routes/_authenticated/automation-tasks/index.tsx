import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/automation-tasks/')({
  component: () => (
    <div className='p-8'>
      <h1 className='text-2xl font-bold'>Tarefas de Automação</h1>
      <p className='text-muted-foreground'>Em breve.</p>
    </div>
  ),
})
