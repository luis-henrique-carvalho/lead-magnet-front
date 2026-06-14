import { AxiosError } from 'axios'
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
import { SearchDetails } from './index'

const search = {
  searchId: 'search-id',
  taskId: 'task-id',
  marketplace: 'amazon',
  query: 'kindle',
  category: 'eletrônicos',
  requestedLimit: 20,
  foundCount: 15,
  savedCount: 14,
  createdAt: '2026-06-14T10:00:00.000Z',
  completedAt: '2026-06-14T10:01:00.000Z',
}

function renderScreen({
  page = 1,
  limit = 20,
  onPaginationChange = vi.fn(),
}: {
  page?: number
  limit?: number
  onPaginationChange?: (pagination: { page: number; limit: number }) => void
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
      <SearchDetails
        searchId='search-id'
        page={page}
        limit={limit}
        onPaginationChange={onPaginationChange}
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

describe('SearchDetails', () => {
  afterEach(() => vi.restoreAllMocks())

  it('exibe o resumo e o ciclo de vida da busca', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') {
        return { data: search }
      }

      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }

      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByRole('heading', { name: 'kindle' }))
      .toBeInTheDocument()
    await expect.element(screen.getByText('Amazon')).toBeInTheDocument()
    await expect.element(screen.getByText('eletrônicos')).toBeInTheDocument()
    await expect
      .element(screen.getByText('Concluída', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('15', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('14', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(/Concluída em: 14\/06\/2026/))
      .toBeInTheDocument()
  })

  it('permite tentar novamente após uma falha temporária', async () => {
    let detailAttempts = 0
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') {
        detailAttempts += 1
        if (detailAttempts === 1) throw new Error('Network error')
        return { data: search }
      }

      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'processing' } }
      }

      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByText('Não foi possível carregar esta busca.'))
      .toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar novamente' })
    )

    await expect
      .element(screen.getByRole('heading', { name: 'kindle' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Processando', { exact: true }))
      .toBeInTheDocument()
  })

  it('exibe uma página 404 quando a busca não existe', async () => {
    const notFoundError = Object.assign(new AxiosError('Not found'), {
      response: { status: 404 },
    })
    vi.spyOn(api, 'get').mockRejectedValue(notFoundError)

    const screen = await renderScreen()

    await expect
      .element(screen.getByRole('heading', { name: 'Busca não encontrada' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('404', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('button', { name: 'Tentar novamente' }))
      .not.toBeInTheDocument()
  })

  it('exibe os produtos descobertos com seus dados e link seguro', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }

      return {
        data: {
          items: [
            {
              resultId: 'result-id',
              discoveredAt: '2026-06-14T10:00:30.000Z',
              product: {
                id: 'product-id',
                externalId: 'AMZ-1',
                marketplace: 'amazon',
                title: 'Kindle Paperwhite',
                originalUrl: 'https://amazon.com.br/dp/AMZ-1',
                imageUrl: 'https://images.example.com/kindle.jpg',
                price: 799.9,
                rating: 4.8,
                reviewsCount: 3210,
                salesCount: 950,
                category: 'Leitores digitais',
              },
            },
          ],
          page: 1,
          limit: 20,
          total: 1,
        },
      }
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByText('Kindle Paperwhite'))
      .toBeInTheDocument()
    await expect.element(screen.getByText('R$ 799,90')).toBeInTheDocument()
    await expect.element(screen.getByText('4,8')).toBeInTheDocument()
    await expect.element(screen.getByText('3.210 reviews')).toBeInTheDocument()
    await expect.element(screen.getByText('950 vendas')).toBeInTheDocument()
    await expect
      .element(screen.getByText('Leitores digitais'))
      .toBeInTheDocument()

    const productLink = screen.getByRole('link', {
      name: /Ver produto original/i,
    })
    await expect.element(productLink).toHaveAttribute('target', '_blank')
    await expect
      .element(productLink)
      .toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('não converte campos ausentes do produto para zero', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'processing' } }
      }

      return {
        data: {
          items: [
            {
              resultId: 'result-id',
              discoveredAt: '2026-06-14T10:00:30.000Z',
              product: {
                id: 'product-id',
                externalId: null,
                marketplace: 'shopee',
                title: 'Produto sem métricas',
                originalUrl: 'https://shopee.com.br/product-id',
                imageUrl: null,
                price: null,
                rating: null,
                reviewsCount: null,
                salesCount: null,
                category: null,
              },
            },
          ],
          page: 1,
          limit: 20,
          total: 1,
        },
      }
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByText('Imagem não disponível'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Categoria não disponível'))
      .toBeInTheDocument()
    await expect.element(screen.getByText('R$ 0,00')).not.toBeInTheDocument()
    await expect.element(screen.getByText('0 reviews')).not.toBeInTheDocument()
    await expect.element(screen.getByText('0 vendas')).not.toBeInTheDocument()
  })

  it('explica o estado vazio enquanto a busca ainda está ativa', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'processing' } }
      }
      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()

    await expect
      .element(
        screen.getByText(
          'A busca ainda está em andamento. Novos produtos aparecerão aqui.'
        )
      )
      .toBeInTheDocument()
  })

  it('explica quando a busca terminou sem produtos', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()

    await expect
      .element(
        screen.getByText('A busca foi concluída sem produtos para exibir.')
      )
      .toBeInTheDocument()
  })

  it('navega entre páginas preservando o limite atual', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      return { data: { items: [], page: 1, limit: 20, total: 45 } }
    })
    const onPaginationChange = vi.fn()

    const screen = await renderScreen({ onPaginationChange })

    await expect.element(screen.getByText('Página 1 de 3')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Próxima página' })
    )

    expect(onPaginationChange).toHaveBeenCalledWith({ page: 2, limit: 20 })
  })

  it('altera o limite e volta para a primeira página', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      return { data: { items: [], page: 2, limit: 20, total: 45 } }
    })
    const onPaginationChange = vi.fn()

    const screen = await renderScreen({
      page: 2,
      limit: 20,
      onPaginationChange,
    })
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Itens por página' }),
      '50'
    )

    expect(onPaginationChange).toHaveBeenCalledWith({ page: 1, limit: 50 })
  })

  it('corrige automaticamente uma página fora do intervalo', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      return { data: { items: [], page: 4, limit: 20, total: 45 } }
    })
    const onPaginationChange = vi.fn()

    await renderScreen({ page: 4, limit: 20, onPaginationChange })

    await vi.waitFor(() => {
      expect(onPaginationChange).toHaveBeenCalledWith({ page: 3, limit: 20 })
    })
  })

  it('permite tentar novamente quando apenas os produtos falham', async () => {
    let productAttempts = 0
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }

      productAttempts += 1
      if (productAttempts === 1) throw new Error('Products unavailable')
      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()

    await expect
      .element(screen.getByText('Não foi possível carregar os produtos.'))
      .toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar carregar produtos novamente' })
    )

    await expect
      .element(
        screen.getByText('A busca foi concluída sem produtos para exibir.')
      )
      .toBeInTheDocument()
  })
})
