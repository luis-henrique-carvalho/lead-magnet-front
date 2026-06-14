import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { marketplaceSearchKeys } from '@/features/marketplace-searches/details/hooks/use-search-details'
import {
  automationEventSchema,
  type AutomationEvent,
} from './automation-event-schema'

type ConnectionStatus = 'connecting' | 'connected' | 'degraded'

const terminalStatuses = new Set([
  'completed',
  'partial',
  'failed',
  'manual_required',
])

type AutomationEventsContextValue = {
  status: ConnectionStatus
  reconcile: () => Promise<void>
}

const AutomationEventsContext =
  createContext<AutomationEventsContextValue | null>(null)

function getAutomationEventsUrl() {
  const baseUrl = api.defaults.baseURL ?? window.location.origin
  return `${baseUrl.replace(/\/$/, '')}/automation-tasks/events`
}

export function AutomationEventsProvider({
  children,
}: {
  children: ReactNode
}) {
  const accessToken = useAuthStore((state) => state.auth.accessToken)
  const queryClient = useQueryClient()
  const [streamStatus, setStreamStatus] =
    useState<ConnectionStatus>('connecting')
  const status = accessToken ? streamStatus : 'degraded'
  const processedEventIds = useRef(new Set<string>())
  const terminalTaskIds = useRef(new Set<string>())

  const reconcile = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['marketplace-searches'],
    })
  }, [queryClient])

  const processEvent = useCallback(
    async (event: AutomationEvent) => {
      if (
        processedEventIds.current.has(event.eventId) ||
        terminalTaskIds.current.has(event.taskId)
      ) {
        return
      }
      processedEventIds.current.add(event.eventId)
      if (terminalStatuses.has(event.status)) {
        terminalTaskIds.current.add(event.taskId)
      }

      const invalidations = [
        queryClient.invalidateQueries({
          queryKey: marketplaceSearchKeys.task(event.taskId),
        }),
      ]

      if (event.searchId) {
        if (event.type === 'marketplace_product_search') {
          invalidations.push(
            queryClient.invalidateQueries({
              queryKey: marketplaceSearchKeys.detail(event.searchId),
            }),
            queryClient.invalidateQueries({
              queryKey: [
                ...marketplaceSearchKeys.all,
                'products',
                event.searchId,
              ],
            })
          )
        }

        if (event.type === 'affiliate_link_capture') {
          invalidations.push(
            queryClient.invalidateQueries({
              queryKey: marketplaceSearchKeys.captures(event.searchId),
            })
          )
        }
      }

      await Promise.all(invalidations)
    },
    [queryClient]
  )

  useEffect(() => {
    if (!accessToken) {
      processedEventIds.current.clear()
      terminalTaskIds.current.clear()
      return
    }

    const eventSource = new EventSource(getAutomationEventsUrl(), {
      withCredentials: true,
    })

    const handleOpen = () => {
      setStreamStatus('connected')
      void reconcile()
    }
    const handleError = () => setStreamStatus('degraded')
    const handleTaskEvent = (message: Event) => {
      if (!(message instanceof MessageEvent)) return

      try {
        const parsedEvent = automationEventSchema.safeParse(
          JSON.parse(message.data as string)
        )
        if (parsedEvent.success) void processEvent(parsedEvent.data)
      } catch {
        // Invalid notifications are ignored; REST remains the source of truth.
      }
    }

    eventSource.addEventListener('open', handleOpen)
    eventSource.addEventListener('error', handleError)
    eventSource.addEventListener('task.created', handleTaskEvent)
    eventSource.addEventListener('task.updated', handleTaskEvent)

    return () => {
      eventSource.removeEventListener('open', handleOpen)
      eventSource.removeEventListener('error', handleError)
      eventSource.removeEventListener('task.created', handleTaskEvent)
      eventSource.removeEventListener('task.updated', handleTaskEvent)
      eventSource.close()
    }
  }, [accessToken, processEvent, reconcile])

  const value = useMemo(() => ({ status, reconcile }), [status, reconcile])

  return (
    <AutomationEventsContext value={value}>{children}</AutomationEventsContext>
  )
}

function useAutomationEvents() {
  const context = use(AutomationEventsContext)

  if (!context) {
    throw new Error(
      'useAutomationEvents must be used within AutomationEventsProvider'
    )
  }

  return context
}

export function AutomationConnectionStatus() {
  const { status, reconcile } = useAutomationEvents()
  const isConnected = status === 'connected'
  const isConnecting = status === 'connecting'
  const label = isConnected
    ? 'Atualizações em tempo real conectadas'
    : status === 'connecting'
      ? 'Conectando atualizações em tempo real'
      : 'Atualizações em tempo real desconectadas'

  return (
    <div
      role='status'
      aria-label={label}
      className='flex items-center gap-2 text-sm text-muted-foreground'
    >
      {isConnected ? (
        <Wifi className='size-4 text-emerald-600' aria-hidden='true' />
      ) : isConnecting ? (
        <Loader2
          className='size-4 animate-spin text-muted-foreground'
          aria-hidden='true'
        />
      ) : (
        <WifiOff className='size-4 text-amber-600' aria-hidden='true' />
      )}
      <span className='hidden sm:inline'>
        {isConnected
          ? 'Tempo real conectado'
          : isConnecting
            ? 'Conectando tempo real'
            : 'Tempo real indisponível'}
      </span>
      {status === 'degraded' ? (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => void reconcile()}
        >
          <RefreshCw aria-hidden='true' />
          Atualizar dados
        </Button>
      ) : null}
    </div>
  )
}
