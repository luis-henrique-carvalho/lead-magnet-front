import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { api } from '@/lib/api-client'
import { DirectionProvider } from '@/context/direction-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AutomationTaskDiagnostics } from './index'

function renderScreen({
  attemptPage = 1,
  attemptLimit = 20,
  onAttemptsPaginationChange = vi.fn(),
}: {
  attemptPage?: number
  attemptLimit?: number
  onAttemptsPaginationChange?: (pagination: {
    attemptPage: number
    attemptLimit: number
  }) => void
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const rootRoute = createRootRoute({
    component: () => (
      <SearchProvider>
        <DirectionProvider>
          <ThemeProvider>
            <LayoutProvider>
              <SidebarProvider>
                <Outlet />
              </SidebarProvider>
            </LayoutProvider>
          </ThemeProvider>
        </DirectionProvider>
      </SearchProvider>
    ),
  })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
      <AutomationTaskDiagnostics
        taskId='task-id'
        attemptPage={attemptPage}
        attemptLimit={attemptLimit}
        onAttemptsPaginationChange={onAttemptsPaginationChange}
      />
    ),
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

describe('AutomationTaskDiagnostics', () => {
  afterEach(() => vi.restoreAllMocks())

  it('exibe dados da task, tentativas e dependências relacionadas', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url, config) => {
      if (url === '/automation-tasks/task-id') {
        return {
          data: {
            id: 'task-id',
            type: 'affiliate_link_capture',
            marketplace: 'amazon',
            status: 'failed',
            statusUrl: '/automation-tasks/task-id',
            result: {
              searchId: 'search-id',
              productId: 'product-id',
            },
            error: 'Sessão expirada',
            errorType: 'session_invalid',
            attempts: 2,
            attemptsHistory: [],
            pendingPredecessorTaskIds: ['required-pending-id'],
            startedAt: '2026-06-14T10:00:10.000Z',
            finishedAt: '2026-06-14T10:01:00.000Z',
            createdAt: '2026-06-14T10:00:00.000Z',
            updatedAt: '2026-06-14T10:01:00.000Z',
          },
        }
      }

      if (url === '/automation-tasks/task-id/attempts') {
        expect(config?.params).toEqual({ page: 1, limit: 20 })
        return {
          data: {
            items: [
              {
                number: 2,
                jobId: 'job-2',
                status: 'failed',
                error: 'Sessão expirada',
                errorType: 'session_invalid',
                metadata: null,
                startedAt: '2026-06-14T10:00:30.000Z',
                finishedAt: '2026-06-14T10:01:00.000Z',
                createdAt: '2026-06-14T10:00:30.000Z',
                updatedAt: '2026-06-14T10:01:00.000Z',
              },
            ],
            page: 1,
            limit: 20,
            total: 1,
          },
        }
      }

      if (url === '/automation-tasks/task-id/dependencies') {
        return {
          data: [
            {
              taskId: 'required-pending-id',
              type: 'marketplace_product_search',
              status: 'processing',
              direction: 'predecessor',
              required: true,
              createdAt: '2026-06-14T09:59:00.000Z',
            },
            {
              taskId: 'optional-predecessor-id',
              type: 'fetch_rendered_html',
              status: 'completed',
              direction: 'predecessor',
              required: false,
              createdAt: '2026-06-14T09:58:00.000Z',
            },
          ],
        }
      }

      if (url === '/automation-tasks/task-id/dependents') {
        return {
          data: [
            {
              taskId: 'successor-id',
              type: 'content_generation',
              status: 'pending',
              direction: 'successor',
              required: true,
              createdAt: '2026-06-14T10:02:00.000Z',
            },
          ],
        }
      }

      if (url === '/automation-tasks/task-id/dependencies/pending') {
        return {
          data: [
            {
              taskId: 'required-pending-id',
              type: 'marketplace_product_search',
              status: 'processing',
              direction: 'predecessor',
              required: true,
              createdAt: '2026-06-14T09:59:00.000Z',
            },
          ],
        }
      }

      throw new Error(`Unexpected URL: ${url}`)
    })

    const screen = await renderScreen()

    await expect
      .element(
        screen.getByRole('heading', { name: 'Diagnóstico da automação' })
      )
      .toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Resumo técnico' })

    await expect
      .element(summary.getByText('Captura de afiliado'))
      .toBeInTheDocument()
    await expect.element(summary.getByText('Amazon')).toBeInTheDocument()
    await expect
      .element(summary.getByText('Falhou', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(summary.getByText('Sessão expirada'))
      .toBeInTheDocument()
    await expect
      .element(summary.getByText('Sessão inválida'))
      .toBeInTheDocument()
    await expect.element(summary.getByText('2 tentativas')).toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('region', { name: 'Tentativas' }).getByText('job-2')
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen
          .getByRole('region', { name: 'Predecessoras' })
          .getByRole('link', { name: 'required-pending-id' })
      )
      .toHaveAttribute('href', '/automation-tasks/required-pending-id')
    await expect
      .element(
        screen
          .getByRole('region', { name: 'Sucessoras' })
          .getByRole('link', { name: 'successor-id' })
      )
      .toHaveAttribute('href', '/automation-tasks/successor-id')
    await expect
      .element(
        screen.getByRole('link', { name: 'Voltar para a busca de origem' })
      )
      .toHaveAttribute('href', '/marketplace-searches/search-id')
  })
})
