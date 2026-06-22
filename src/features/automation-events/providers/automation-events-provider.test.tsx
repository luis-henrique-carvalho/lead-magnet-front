import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { useAuthStore } from '@/stores/auth-store'
import {
  AutomationConnectionStatus,
  AutomationEventsProvider,
} from './automation-events-provider'

class FakeEventSource extends EventTarget {
  static instances: FakeEventSource[] = []

  readonly url: string
  readonly withCredentials: boolean
  closed = false

  constructor(url: string | URL, init?: EventSourceInit) {
    super()
    this.url = url.toString()
    this.withCredentials = init?.withCredentials ?? false
    FakeEventSource.instances.push(this)
  }

  close() {
    this.closed = true
  }

  open() {
    this.dispatchEvent(new Event('open'))
  }

  fail() {
    this.dispatchEvent(new Event('error'))
  }

  emit(type: 'task.created' | 'task.updated', data: unknown) {
    this.dispatchEvent(
      new MessageEvent(type, {
        data: JSON.stringify(data),
      })
    )
  }

  emitRaw(type: 'task.created' | 'task.updated', data: string) {
    this.dispatchEvent(new MessageEvent(type, { data }))
  }
}

async function renderProvider() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <AutomationEventsProvider>
        <AutomationConnectionStatus />
      </AutomationEventsProvider>
    </QueryClientProvider>
  )

  return { queryClient, screen }
}

describe('AutomationEventsProvider', () => {
  afterEach(() => {
    useAuthStore.getState().auth.reset()
    FakeEventSource.instances = []
    vi.unstubAllGlobals()
  })

  it('abre uma única conexão pública e informa quando está conectada', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)

    const { screen } = await renderProvider()

    expect(FakeEventSource.instances).toHaveLength(1)
    expect(FakeEventSource.instances[0]?.url).toBe(
      'http://localhost:3000/automation-tasks/events'
    )
    expect(FakeEventSource.instances[0]?.withCredentials).toBe(true)

    FakeEventSource.instances[0]?.open()

    await expect
      .element(
        screen.getByRole('status', {
          name: 'Atualizações em tempo real conectadas',
        })
      )
      .toBeInTheDocument()
  })

  it('abre conexão mesmo sem sessão enquanto a autenticação da SSE não está ativa', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)

    const { screen } = await renderProvider()

    expect(FakeEventSource.instances).toHaveLength(1)
    await expect
      .element(
        screen.getByRole('status', {
          name: 'Conectando atualizações em tempo real',
        })
      )
      .toBeInTheDocument()
  })

  it('invalida os dados afetados uma única vez por evento de busca', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    useAuthStore.getState().auth.setAccessToken('session-token')
    const { queryClient } = await renderProvider()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const event = {
      eventId: 'event-id',
      eventType: 'task.updated',
      taskId: 'task-id',
      type: 'marketplace_product_search',
      status: 'processing',
      marketplace: 'amazon',
      updatedAt: '2026-06-14T10:00:30.000Z',
      searchId: 'search-id',
    }

    FakeEventSource.instances[0]?.emit('task.updated', event)
    FakeEventSource.instances[0]?.emit('task.updated', event)

    await vi.waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledTimes(3)
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['marketplace-searches', 'task', 'task-id'],
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['marketplace-searches', 'detail', 'search-id'],
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['marketplace-searches', 'products', 'search-id'],
    })
  })

  it('ignora notificações com JSON inválido ou payload fora do schema', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    useAuthStore.getState().auth.setAccessToken('session-token')
    const { queryClient } = await renderProvider()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const eventSource = FakeEventSource.instances[0]

    eventSource?.emitRaw('task.updated', '{')
    eventSource?.emit('task.updated', {
      eventId: '',
      eventType: 'task.updated',
      taskId: 'task-id',
      type: 'marketplace_product_search',
      status: 'processing',
      marketplace: 'amazon',
      updatedAt: '2026-06-14T10:00:30.000Z',
      searchId: 'search-id',
    })

    expect(invalidateQueries).not.toHaveBeenCalled()
  })

  it('deixa de sincronizar uma task depois que ela atinge estado terminal', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    useAuthStore.getState().auth.setAccessToken('session-token')
    const { queryClient } = await renderProvider()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const terminalEvent = {
      eventId: 'terminal-event',
      eventType: 'task.updated',
      taskId: 'task-id',
      type: 'marketplace_product_search',
      status: 'completed',
      marketplace: 'amazon',
      updatedAt: '2026-06-14T10:01:00.000Z',
      searchId: 'search-id',
    }

    FakeEventSource.instances[0]?.emit('task.updated', terminalEvent)
    FakeEventSource.instances[0]?.emit('task.updated', {
      ...terminalEvent,
      eventId: 'late-event',
      updatedAt: '2026-06-14T10:02:00.000Z',
    })

    await vi.waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledTimes(3)
    })
  })

  it('invalida a lista de capturas para eventos de captura afiliada', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    useAuthStore.getState().auth.setAccessToken('session-token')
    const { queryClient } = await renderProvider()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')

    FakeEventSource.instances[0]?.emit('task.created', {
      eventId: 'capture-event',
      eventType: 'task.created',
      taskId: 'capture-task-id',
      type: 'affiliate_link_capture',
      status: 'pending',
      marketplace: 'amazon',
      updatedAt: '2026-06-14T10:00:30.000Z',
      searchId: 'search-id',
      productId: 'product-id',
    })

    await vi.waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledTimes(2)
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['marketplace-searches', 'task', 'capture-task-id'],
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['marketplace-searches', 'captures', 'search-id'],
    })
  })

  it('mantém a conexão pública quando a sessão é encerrada', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    useAuthStore.getState().auth.setAccessToken('session-token')
    await renderProvider()
    const eventSource = FakeEventSource.instances[0]

    useAuthStore.getState().auth.reset()

    expect(eventSource?.closed).toBe(false)
    expect(FakeEventSource.instances).toHaveLength(1)
  })

  it('permite reconciliar manualmente e reconcilia de novo ao reconectar', async () => {
    vi.stubGlobal('EventSource', FakeEventSource)
    useAuthStore.getState().auth.setAccessToken('session-token')
    const { queryClient, screen } = await renderProvider()
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries')
    const eventSource = FakeEventSource.instances[0]

    eventSource?.fail()

    await expect
      .element(
        screen.getByRole('status', {
          name: 'Atualizações em tempo real desconectadas',
        })
      )
      .toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Atualizar dados' })
    )
    expect(invalidateQueries).toHaveBeenCalledTimes(1)

    eventSource?.open()

    await vi.waitFor(() => {
      expect(invalidateQueries).toHaveBeenCalledTimes(2)
    })
    await expect
      .element(
        screen.getByRole('status', {
          name: 'Atualizações em tempo real conectadas',
        })
      )
      .toBeInTheDocument()
  })
})
