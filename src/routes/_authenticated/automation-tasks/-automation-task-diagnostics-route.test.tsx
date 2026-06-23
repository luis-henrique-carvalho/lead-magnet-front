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

describe('rota de diagnóstico da automação', () => {
  afterEach(() => vi.restoreAllMocks())

  it('carrega por link profundo e sincroniza a paginação de tentativas', async () => {
    let attemptsParams: unknown
    vi.spyOn(api, 'get').mockImplementation(async (url, config) => {
      if (url === '/automation-tasks/task-id') {
        return {
          data: {
            id: 'task-id',
            type: 'affiliate_link_capture',
            marketplace: 'amazon',
            status: 'completed',
            statusUrl: '/automation-tasks/task-id',
            result: { searchId: 'search-id' },
            error: null,
            errorType: null,
            attempts: 21,
            attemptsHistory: [],
            pendingPredecessorTaskIds: [],
            startedAt: '2026-06-14T10:00:00.000Z',
            finishedAt: '2026-06-14T10:02:00.000Z',
            createdAt: '2026-06-14T10:00:00.000Z',
            updatedAt: '2026-06-14T10:02:00.000Z',
          },
        }
      }

      if (url === '/automation-tasks/task-id/attempts') {
        attemptsParams = config?.params
        return {
          data: {
            items: [],
            page: 2,
            limit: 10,
            total: 21,
          },
        }
      }

      if (
        url === '/automation-tasks/task-id/dependencies' ||
        url === '/automation-tasks/task-id/dependents' ||
        url === '/automation-tasks/task-id/dependencies/pending'
      ) {
        return { data: [] }
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
          '/automation-tasks/task-id?attemptPage=2&attemptLimit=10',
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
        screen.getByRole('heading', { name: 'Diagnóstico da automação' })
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen
          .getByRole('region', { name: 'Tentativas' })
          .getByText('Página 2 de 3')
      )
      .toBeInTheDocument()
    expect(attemptsParams).toEqual({ page: 2, limit: 10 })

    await userEvent.click(
      screen
        .getByRole('region', { name: 'Tentativas' })
        .getByRole('button', { name: 'Próxima página' })
    )
    await vi.waitFor(() => {
      expect(router.state.location.search).toEqual({
        attemptPage: 3,
        attemptLimit: 10,
      })
    })
  })
})
