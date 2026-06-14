import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import type { AutomationTaskStatus } from '../schemas/search-details-schema'
import { AutomationStatusBadge } from './automation-status-badge'

const statuses: Array<[AutomationTaskStatus, string]> = [
  ['pending', 'Pendente'],
  ['processing', 'Processando'],
  ['completed', 'Concluída'],
  ['partial', 'Parcial'],
  ['failed', 'Falhou'],
  ['manual_required', 'Ação manual requerida'],
]

describe('AutomationStatusBadge', () => {
  it.each(statuses)('exibe o rótulo de %s', async (status, label) => {
    const screen = await render(<AutomationStatusBadge status={status} />)

    await expect.element(screen.getByText(label)).toBeInTheDocument()
  })
})
