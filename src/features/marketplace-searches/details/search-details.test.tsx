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
import { Toaster } from '@/components/ui/sonner'
import { AutomationEventsProvider } from '@/features/automation-events/providers/automation-events-provider'
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

const captureProductResponse = {
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
        imageUrl: null,
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
}

function renderScreen({
  page = 1,
  limit = 20,
  capturePage = 1,
  captureLimit = 20,
  onPaginationChange = vi.fn(),
  onCapturesPaginationChange = vi.fn(),
}: {
  page?: number
  limit?: number
  capturePage?: number
  captureLimit?: number
  onPaginationChange?: (pagination: { page: number; limit: number }) => void
  onCapturesPaginationChange?: (pagination: {
    capturePage: number
    captureLimit: number
  }) => void
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const rootRoute = createRootRoute({
    component: () => (
      <AutomationEventsProvider>
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
      </AutomationEventsProvider>
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
        capturePage={capturePage}
        captureLimit={captureLimit}
        onPaginationChange={onPaginationChange}
        onCapturesPaginationChange={onCapturesPaginationChange}
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
    await expect
      .element(screen.getByText('Task ID: task-id'))
      .toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('link', {
          name: 'Abrir diagnóstico da task principal task-id',
        })
      )
      .toHaveAttribute('href', '/automation-tasks/task-id')
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

  it('abre o histórico de recorrência do produto e navega para a busca relacionada', async () => {
    let occurrencesParams: unknown
    vi.spyOn(api, 'get').mockImplementation(async (url, config) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      if (url === '/marketplace-searches/search-id/products') {
        return { data: captureProductResponse }
      }
      if (url === '/marketplace-products/product-id/searches') {
        occurrencesParams = config?.params
        return {
          data: {
            items: [
              {
                searchId: 'related-search-id',
                taskId: 'related-task-id',
                marketplace: 'amazon',
                query: 'kindle promoção',
                category: 'Leitores digitais',
                requestedLimit: 20,
                discoveredAt: '2026-06-15T12:30:00.000Z',
              },
            ],
            page: 1,
            limit: 10,
            total: 1,
            legacyAssociationsExcluded: true,
          },
        }
      }

      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Ver histórico de recorrência de Kindle Paperwhite',
      })
    )

    const dialog = screen.getByRole('dialog', {
      name: 'Histórico de recorrência',
    })

    await expect.element(dialog).toBeInTheDocument()
    await expect
      .element(dialog.getByText('kindle promoção'))
      .toBeInTheDocument()
    await expect
      .element(dialog.getByText('Leitores digitais'))
      .toBeInTheDocument()
    await expect.element(dialog.getByText('Amazon')).toBeInTheDocument()
    await expect.element(dialog.getByText(/15\/06\/2026/)).toBeInTheDocument()
    await expect
      .element(
        dialog.getByText(
          'Associações legadas não comprovadas não estão incluídas neste histórico.'
        )
      )
      .toBeInTheDocument()
    await expect
      .element(
        dialog.getByRole('link', { name: /Abrir busca kindle promoção/ })
      )
      .toHaveAttribute('href', '/marketplace-searches/related-search-id')
    expect(occurrencesParams).toEqual({ page: 1, limit: 10 })
  })

  it('enfileira a captura de link afiliado com os dados do produto e da busca', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }

      return { data: captureProductResponse }
    })
    const invalidateQueries = vi.spyOn(
      QueryClient.prototype,
      'invalidateQueries'
    )
    const post = vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        taskId: 'capture-task-id',
        statusUrl: '/automation-tasks/capture-task-id',
      },
    })

    const screen = await renderScreen()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Iniciar captura de link afiliado para Kindle Paperwhite',
      })
    )

    await vi.waitFor(() => {
      expect(post).toHaveBeenCalledWith('/affiliate-link-capture', {
        searchId: 'search-id',
        productId: 'product-id',
        marketplace: 'amazon',
        originalProductUrl: 'https://amazon.com.br/dp/AMZ-1',
      })
    })
    await expect
      .element(screen.getByText('Captura de link afiliado enfileirada.'))
      .toBeInTheDocument()
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['marketplace-searches', 'captures', 'search-id'],
    })
  })

  it('bloqueia novos envios enquanto a captura está sendo enfileirada', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      return { data: captureProductResponse }
    })
    let resolveCapture: ((value: unknown) => void) | undefined
    const post = vi.spyOn(api, 'post').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCapture = resolve
        })
    )
    const screen = await renderScreen()
    const captureButton = screen.getByRole('button', {
      name: 'Iniciar captura de link afiliado para Kindle Paperwhite',
    })

    await userEvent.click(captureButton)

    await expect.element(captureButton).toBeDisabled()
    await expect
      .element(screen.getByText('Enfileirando...'))
      .toBeInTheDocument()
    expect(post).toHaveBeenCalledTimes(1)

    resolveCapture?.({
      data: {
        taskId: 'capture-task-id',
        statusUrl: '/automation-tasks/capture-task-id',
      },
    })
  })

  it('informa quando a captura de link afiliado não pode ser enfileirada', async () => {
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }

      return { data: captureProductResponse }
    })
    vi.spyOn(api, 'post').mockRejectedValue(new Error('Queue unavailable'))

    const screen = await renderScreen()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Iniciar captura de link afiliado para Kindle Paperwhite',
      })
    )

    await expect
      .element(
        screen.getByText(
          'Não foi possível enfileirar a captura de link afiliado.'
        )
      )
      .toBeInTheDocument()
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
    const productsRegion = screen.getByRole('region', {
      name: 'Produtos descobertos',
    })

    await expect
      .element(productsRegion.getByText('Página 1 de 3'))
      .toBeInTheDocument()
    await userEvent.click(
      productsRegion.getByRole('button', { name: 'Próxima página' })
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
    const productsRegion = screen.getByRole('region', {
      name: 'Produtos descobertos',
    })
    await userEvent.click(
      productsRegion.getByRole('combobox', { name: 'Itens por página' })
    )
    await userEvent.click(screen.getByRole('option', { name: '50' }))

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

  it('exibe as capturas de link afiliado relacionadas à busca', async () => {
    let capturesParams: unknown
    vi.spyOn(api, 'get').mockImplementation(async (url, config) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      if (
        url === '/marketplace-searches/search-id/affiliate-link-capture-tasks'
      ) {
        capturesParams = config?.params
        return {
          data: {
            items: [
              {
                taskId: 'capture-task-id',
                status: 'completed',
                marketplace: 'amazon',
                productId: 'product-id',
                productTitle: 'Kindle Paperwhite',
                originalProductUrl: 'https://amazon.com.br/dp/AMZ-1',
                capturedAffiliateUrl: 'https://amzn.to/example',
                taskCreatedAt: '2026-06-14T10:00:00.000Z',
                startedAt: '2026-06-14T10:00:10.000Z',
                finishedAt: '2026-06-14T10:00:30.000Z',
                capturedAt: '2026-06-14T10:00:30.000Z',
              },
            ],
            page: 2,
            limit: 10,
            total: 12,
          },
        }
      }

      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen({ capturePage: 2, captureLimit: 10 })
    const capturesRegion = screen.getByRole('region', {
      name: 'Capturas de link afiliado',
    })

    await expect
      .element(
        capturesRegion.getByRole('heading', {
          name: 'Capturas de link afiliado',
        })
      )
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText('Kindle Paperwhite'))
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText('capture-task-id'))
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText('https://amzn.to/example'))
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText('Concluída', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText(/Criada: 14\/06\/2026/))
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText(/Iniciada: 14\/06\/2026/))
      .toBeInTheDocument()
    await expect
      .element(capturesRegion.getByText(/Finalizada: 14\/06\/2026/))
      .toBeInTheDocument()
    expect(capturesParams).toEqual({ page: 2, limit: 10 })
  })

  it('permite copiar, abrir e diagnosticar uma captura que exige ação manual', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/marketplace-searches/search-id') return { data: search }
      if (url === '/automation-tasks/task-id') {
        return { data: { id: 'task-id', status: 'completed' } }
      }
      if (
        url === '/marketplace-searches/search-id/affiliate-link-capture-tasks'
      ) {
        return {
          data: {
            items: [
              {
                taskId: 'manual-task-id',
                status: 'manual_required',
                marketplace: 'amazon',
                productId: 'product-id',
                productTitle: 'Kindle com bloqueio',
                originalProductUrl: 'https://amazon.com.br/dp/AMZ-2',
                capturedAffiliateUrl: 'https://amzn.to/manual',
                taskCreatedAt: '2026-06-14T10:00:00.000Z',
                startedAt: '2026-06-14T10:00:10.000Z',
                finishedAt: null,
                capturedAt: null,
              },
            ],
            page: 1,
            limit: 20,
            total: 1,
          },
        }
      }

      return { data: { items: [], page: 1, limit: 20, total: 0 } }
    })

    const screen = await renderScreen()
    const capturesRegion = screen.getByRole('region', {
      name: 'Capturas de link afiliado',
    })

    await expect
      .element(capturesRegion.getByText('Ação manual requerida'))
      .toBeInTheDocument()

    await userEvent.click(
      capturesRegion.getByRole('button', {
        name: 'Copiar link afiliado de Kindle com bloqueio',
      })
    )

    expect(writeText).toHaveBeenCalledWith('https://amzn.to/manual')
    await expect
      .element(screen.getByText('Link afiliado copiado.'))
      .toBeInTheDocument()

    const affiliateLink = capturesRegion.getByRole('link', {
      name: 'Abrir link afiliado de Kindle com bloqueio',
    })
    await expect.element(affiliateLink).toHaveAttribute('target', '_blank')
    await expect
      .element(affiliateLink)
      .toHaveAttribute('rel', 'noopener noreferrer')

    await expect
      .element(
        capturesRegion.getByRole('link', {
          name: 'Abrir diagnóstico da captura Kindle com bloqueio',
        })
      )
      .toHaveAttribute('href', '/automation-tasks/manual-task-id')
  })
})
