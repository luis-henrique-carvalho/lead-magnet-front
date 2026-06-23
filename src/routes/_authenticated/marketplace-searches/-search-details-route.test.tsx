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
      if (
        url ===
        '/marketplace-searches/search-id/affiliate-link-capture-tasks'
      ) {
        return { data: { items: [], page: 1, limit: 20, total: 0 } }
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
      expect(router.state.location.search).toEqual({
        page: 1,
        limit: 50,
        capturePage: 1,
        captureLimit: 20,
      })
    })
  })

  it('sincroniza a paginação de capturas sem alterar a paginação de produtos', async () => {
    let productsParams: unknown
    let capturesParams: unknown
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
      if (url === '/marketplace-searches/search-id/products') {
        productsParams = config?.params
        return { data: { items: [], page: 3, limit: 50, total: 150 } }
      }
      if (
        url ===
        '/marketplace-searches/search-id/affiliate-link-capture-tasks'
      ) {
        capturesParams = config?.params
        return { data: { items: [], page: 2, limit: 10, total: 25 } }
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
          '/marketplace-searches/search-id?page=3&limit=50&capturePage=2&captureLimit=10',
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
    const capturesRegion = screen.getByRole('region', {
      name: 'Capturas de link afiliado',
    })

    await expect
      .element(capturesRegion.getByText('Página 2 de 3'))
      .toBeInTheDocument()
    expect(productsParams).toEqual({ page: 3, limit: 50 })
    expect(capturesParams).toEqual({ page: 2, limit: 10 })

    await userEvent.click(
      capturesRegion.getByRole('button', { name: 'Próxima página' })
    )
    await vi.waitFor(() => {
      expect(router.state.location.search).toEqual({
        page: 3,
        limit: 50,
        capturePage: 3,
        captureLimit: 10,
      })
    })
  })
})
