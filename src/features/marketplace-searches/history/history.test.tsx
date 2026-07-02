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
import { HistoryScreen } from './index'

const mockHistoryResponse = {
  items: [
    {
      searchId: 'search-1',
      taskId: 'task-1',
      marketplace: 'amazon',
      query: 'kindle',
      category: 'eletrônicos',
      requestedLimit: 20,
      foundCount: 15,
      savedCount: 14,
      createdAt: '2026-06-14T10:00:00.000Z',
      completedAt: '2026-06-14T10:01:00.000Z',
      task: {
        status: 'completed',
        error: null,
        errorType: null,
        startedAt: '2026-06-14T10:00:10.000Z',
        finishedAt: '2026-06-14T10:01:00.000Z',
        updatedAt: '2026-06-14T10:01:00.000Z',
      },
    },
    {
      searchId: 'search-2',
      taskId: 'task-2',
      marketplace: 'mercado_livre',
      query: 'iphone',
      category: null,
      requestedLimit: 10,
      foundCount: 0,
      savedCount: 0,
      createdAt: '2026-06-14T11:00:00.000Z',
      completedAt: null,
      task: {
        status: 'failed',
        error: 'Timeout error occurred',
        errorType: 'timeout',
        startedAt: '2026-06-14T11:00:10.000Z',
        finishedAt: null,
        updatedAt: '2026-06-14T11:05:00.000Z',
      },
    },
  ],
  page: 1,
  limit: 20,
  total: 2,
}

function renderScreen({
  page = 1,
  limit = 20,
  query = '',
  marketplace = '',
  status = '',
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
      <HistoryScreen
        page={page}
        limit={limit}
        query={query}
        marketplace={marketplace}
        status={status}
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

describe('HistoryScreen', () => {
  afterEach(() => vi.restoreAllMocks())

  it('exibe a listagem com os dados da API', async () => {
    const getSpy = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: mockHistoryResponse })

    const screen = await renderScreen()

    // check title
    await expect
      .element(screen.getByRole('heading', { name: 'Histórico de Buscas' }))
      .toBeInTheDocument()

    // check listing items
    await expect.element(screen.getByText('kindle')).toBeInTheDocument()
    await expect.element(screen.getByText('Amazon')).toBeInTheDocument()
    await expect.element(screen.getByText('iphone')).toBeInTheDocument()
    await expect.element(screen.getByText('Mercado Livre')).toBeInTheDocument()

    // check status badges
    await expect.element(screen.getByText('Concluída')).toBeInTheDocument()
    await expect.element(screen.getByText('Falhou')).toBeInTheDocument()

    // check fail error displays
    expect(getSpy).toHaveBeenCalledWith('/marketplace-searches', {
      params: {
        page: 1,
        limit: 20,
        query: undefined,
        marketplace: undefined,
        status: undefined,
      },
    })
  })

  it('abre a sheet para iniciar uma nova busca', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockHistoryResponse })

    const screen = await renderScreen()

    await userEvent.click(screen.getByRole('button', { name: 'Nova Busca' }))

    await expect
      .element(screen.getByRole('dialog', { name: 'Nova Busca' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByLabelText('Palavra-chave'))
      .toBeInTheDocument()
  })

  it('exibe o estado de erro com a opção de tentar novamente', async () => {
    const getSpy = vi
      .spyOn(api, 'get')
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: mockHistoryResponse })

    const screen = await renderScreen()

    // check error alert shows up
    await expect.element(screen.getByTestId('error-alert')).toBeInTheDocument()
    await expect.element(screen.getByText('Network Error')).toBeInTheDocument()

    // trigger retry
    const retryBtn = screen.getByRole('button', { name: 'Tentar novamente' })
    await retryBtn.click()

    // check loading/rendering works after retry
    await expect.element(screen.getByText('kindle')).toBeInTheDocument()
    expect(getSpy).toHaveBeenCalledTimes(2)
  })

  it('exibe o estado vazio quando nenhuma busca existe no banco', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { items: [], page: 1, limit: 20, total: 0 },
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByTestId('empty-state-no-searches'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Nenhuma busca cadastrada'))
      .toBeInTheDocument()
  })

  it('exibe tabela vazia com texto apropriado quando filtros reduzem resultados a zero', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: { items: [], page: 1, limit: 20, total: 0 },
    })

    const screen = await renderScreen({ query: 'non-existing-term' })

    // table toolbar is shown, and "Nenhum histórico encontrado." is in the table cell
    await expect
      .element(screen.getByText('Nenhum histórico encontrado.'))
      .toBeInTheDocument()
  })
})
