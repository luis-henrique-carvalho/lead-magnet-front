import { describe, expect, it, vi, afterEach } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useAutomationTasks } from './use-automation-tasks'
import { automationTasksService } from '../services/automation-tasks-service'

vi.mock('../services/automation-tasks-service', () => ({
  automationTasksService: {
    list: vi.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useAutomationTasks', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('deve chamar o service correto com os parâmetros fornecidos', async () => {
    const mockData = { items: [], page: 1, limit: 20, total: 0, summary: {} }
    vi.mocked(automationTasksService.list).mockResolvedValueOnce(mockData as any)

    const params = { page: 1, limit: 20, query: 'test' }
    const { result } = await renderHook(() => useAutomationTasks(params), {
      wrapper: createWrapper(),
    })

    await vi.waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(automationTasksService.list).toHaveBeenCalledWith(params)
    expect(result.current.data).toEqual(mockData)
  })
})
