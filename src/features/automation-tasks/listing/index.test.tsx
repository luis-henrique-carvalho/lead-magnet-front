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
import { userEvent } from 'vitest/browser'
import { api } from '@/lib/api-client'
import { DirectionProvider } from '@/context/direction-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { AutomationTaskListScreen } from './index'

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

const mockListResponse = {
  items: [
    {
      taskId: 'task-1',
      type: 'marketplace_product_search',
      marketplace: 'amazon',
      status: 'completed',
      statusUrl: 'http://localhost/status/1',
      error: null,
      errorType: null,
      attempts: 2,
      startedAt: '2026-06-14T10:00:10.000Z',
      finishedAt: '2026-06-14T10:01:00.000Z',
      createdAt: '2026-06-14T10:00:00.000Z',
      updatedAt: '2026-06-14T10:01:00.000Z',
      context: {
        searchId: 'search-1',
        originUrl: 'http://localhost/marketplace-searches/search-1',
        query: 'kindle',
      },
    },
    {
      taskId: 'task-2',
      type: 'affiliate_link_capture',
      marketplace: 'mercado_livre',
      status: 'failed',
      statusUrl: 'http://localhost/status/2',
      error: 'Timeout error occurred in agent',
      errorType: 'timeout',
      attempts: 1,
      startedAt: '2026-06-14T11:00:10.000Z',
      finishedAt: '2026-06-14T11:05:00.000Z',
      createdAt: '2026-06-14T11:00:00.000Z',
      updatedAt: '2026-06-14T11:05:00.000Z',
      context: {
        originUrl: 'https://mercadolivre.com.br/product-123',
      },
    },
    {
      taskId: 'task-3',
      type: 'fetch_rendered_html',
      marketplace: null,
      status: 'pending',
      statusUrl: 'http://localhost/status/3',
      error: null,
      errorType: null,
      attempts: 0,
      startedAt: null,
      finishedAt: null,
      createdAt: '2026-06-14T12:00:00.000Z',
      updatedAt: '2026-06-14T12:00:00.000Z',
      context: null,
    },
  ],
  page: 1,
  limit: 20,
  total: 3,
  summary: {
    pending: 1,
    processing: 0,
    completed: 1,
    partial: 0,
    failed: 1,
    manualRequired: 0,
  },
}

function renderScreen({
  page = 1,
  limit = 20,
  query = '',
  status = '',
  type = '',
  marketplace = '',
  createdFrom = '',
  createdTo = '',
  navigate = vi.fn(),
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
                <Toaster />
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
      <AutomationTaskListScreen
        page={page}
        limit={limit}
        query={query}
        status={status}
        type={type}
        marketplace={marketplace}
        createdFrom={createdFrom}
        createdTo={createdTo}
        navigate={navigate}
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

describe('AutomationTaskListScreen', () => {
  afterEach(() => vi.restoreAllMocks())

  it('exibe a listagem com dados da API e resumo operacional', async () => {
    const getSpy = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: mockListResponse })

    const screen = await renderScreen()

    // Title and subtitle
    await expect
      .element(screen.getByRole('heading', { name: 'Tarefas de Automação' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Acompanhe as automações executadas pelo Lead Magnet.'))
      .toBeInTheDocument()

    // Summary cards
    await expect.element(screen.getByText('Pendente').first()).toBeInTheDocument()
    await expect.element(screen.getByText('Concluída').first()).toBeInTheDocument()
    await expect.element(screen.getByText('Falhou').first()).toBeInTheDocument()

    // Table rows: translated task type, marketplace, badges
    await expect.element(screen.getByText('Busca de produtos')).toBeInTheDocument()
    await expect.element(screen.getByText('Captura de afiliado')).toBeInTheDocument()
    await expect.element(screen.getByText('Captura HTML')).toBeInTheDocument()

    await expect.element(screen.getByText('Amazon')).toBeInTheDocument()
    await expect.element(screen.getByText('Mercado Livre')).toBeInTheDocument()

    // Table row error truncation/presence
    await expect.element(screen.getByText('Timeout error occurred in agent')).toBeInTheDocument()

    expect(getSpy).toHaveBeenCalledWith('/automation-tasks', {
      params: {
        page: 1,
        limit: 20,
        query: undefined,
        status: undefined,
        type: undefined,
        marketplace: undefined,
        createdFrom: undefined,
        createdTo: undefined,
      },
    })
  })

  it('exibe o estado de erro com a opção de tentar novamente', async () => {
    const getSpy = vi
      .spyOn(api, 'get')
      .mockRejectedValueOnce(new Error('API failure'))
      .mockResolvedValueOnce({ data: mockListResponse })

    const screen = await renderScreen()

    await expect.element(screen.getByTestId('error-alert')).toBeInTheDocument()
    await expect.element(screen.getByText('API failure')).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: 'Tentar novamente' })
    await retryBtn.click()

    await expect.element(screen.getByText('Busca de produtos')).toBeInTheDocument()
    expect(getSpy).toHaveBeenCalledTimes(2)
  })

  it('exibe o estado vazio quando nenhuma task existe no banco', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        items: [],
        page: 1,
        limit: 20,
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
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByTestId('empty-state-no-tasks'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Nenhuma tarefa registrada'))
      .toBeInTheDocument()
  })

  it('exibe tabela vazia com texto apropriado quando filtros reduzem resultados a zero', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        items: [],
        page: 1,
        limit: 20,
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
    })

    const screen = await renderScreen({ query: 'non-existing-task' })

    await expect
      .element(screen.getByText('Nenhuma tarefa encontrada.'))
      .toBeInTheDocument()
  })
})
