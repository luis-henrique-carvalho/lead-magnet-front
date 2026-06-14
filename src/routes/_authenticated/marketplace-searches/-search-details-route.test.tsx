import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { api } from '@/lib/api-client'
import { DirectionProvider } from '@/context/direction-provider'
import { ThemeProvider } from '@/context/theme-provider'

describe('rota de detalhes da busca', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sincroniza a paginação da API com os query params da URL', async () => {
    let productsParams: unknown
    vi.spyOn(api, 'get').mockImplementation(async (url, config) => {
      if (url === '/marketplace-searches/search-id') {
        return {
          data: {
            searchId: 'search-id',
            taskId: 'task-id',
            marketplace: 'amazon',
            query: 'kindle',
            category: null,
            requestedLimit: 100,
            foundCount: 100,
            savedCount: 100,
            createdAt: '2026-06-14T10:00:00.000Z',
            completedAt: '2026-06-14T10:01:00.000Z',
          },
        }
      }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }

      productsParams = config?.params
      return { data: { items: [], page: 2, limit: 50, total: 100 } }
    })
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const router = createRouter({
      routeTree,
      context: { queryClient },
      history: createMemoryHistory({
        initialEntries: ['/marketplace-searches/search-id?page=2&limit=50'],
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

    await expect.element(screen.getByText('Página 2 de 2')).toBeInTheDocument()
    expect(productsParams).toEqual({ page: 2, limit: 50 })

    await userEvent.click(
      screen.getByRole('button', { name: 'Página anterior' })
    )
    await vi.waitFor(() => {
      expect(router.state.location.search).toEqual({ page: 1, limit: 50 })
    })
  })
})
