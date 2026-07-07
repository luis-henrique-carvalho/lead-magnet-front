import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { api } from '@/lib/api-client'
import { DirectionProvider } from '@/context/direction-provider'
import { ThemeProvider } from '@/context/theme-provider'

vi.mock('@/features/automation-events/context/automation-events-context', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useAutomationEvents: () => ({
      status: 'connected',
      reconcile: vi.fn(),
    }),
  }
})

describe('rota de listagem da automação', () => {
  afterEach(() => vi.restoreAllMocks())

  it('carrega por link profundo com parâmetros de busca validados na rota', async () => {
    let getParams: unknown
    vi.spyOn(api, 'get').mockImplementation(async (url, config) => {
      if (url === '/automation-tasks') {
        getParams = config?.params
        return {
          data: {
            items: [],
            page: 2,
            limit: 10,
            total: 0,
            summary: {
              pending: 0,
              processing: 0,
              completed: 0,
              partial: 0,
              failed: 0,
              manualRequired: 0,
            },
          },
        }
      }
      throw new Error(`Unexpected URL: ${url}`)
    })

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({
        initialEntries: [
          '/automation-tasks?page=2&limit=10&query=kindle&status=completed&type=marketplace_product_search&marketplace=amazon&createdFrom=2026-06-01&createdTo=2026-06-30',
        ],
      }),
    })

    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DirectionProvider>
            <RouterProvider router={router} />
          </DirectionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    )

    await expect
      .element(
        screen.getByRole('heading', { name: 'Tarefas de Automação' })
      )
      .toBeInTheDocument()

    expect(getParams).toEqual({
      page: 2,
      limit: 10,
      query: 'kindle',
      status: 'completed',
      type: 'marketplace_product_search',
      marketplace: 'amazon',
      createdFrom: '2026-06-01',
      createdTo: '2026-06-30',
    })
  })
})
