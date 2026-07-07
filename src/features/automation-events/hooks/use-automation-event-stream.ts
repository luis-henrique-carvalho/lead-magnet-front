import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
// TODO: Reativar quando a autenticação do frontend estiver integrada à SSE.
// import { useAuthStore } from '@/stores/auth-store'
import { api } from '@/lib/api-client'
import {
  automationEventSchema,
  type AutomationEvent,
} from '../schemas/automation-event-schema'
import { invalidateAutomationEventQueries } from '../services/automation-event-invalidations'

export type ConnectionStatus = 'connecting' | 'connected' | 'degraded'

// TODO: Reativar quando a stream voltar a depender da sessão autenticada.
// type StreamState = {
//   accessToken: string | null
//   status: ConnectionStatus
// }

const terminalStatuses = new Set<AutomationEvent['status']>([
  'completed',
  'partial',
  'failed',
  'manual_required',
])

function getAutomationEventsUrl() {
  const baseUrl = api.defaults.baseURL ?? window.location.origin
  return `${baseUrl.replace(/\/$/, '')}/automation-tasks/events`
}

export function useAutomationEventStream() {
  // TODO: Reativar quando a autenticação do frontend estiver integrada à SSE.
  // const accessToken = useAuthStore((state) => state.auth.accessToken)
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  // TODO: Reativar quando a stream voltar a depender da sessão autenticada.
  // const [streamState, setStreamState] = useState<StreamState>({
  //   accessToken: null,
  //   status: 'connecting',
  // })
  // const status =
  //   accessToken && streamState.accessToken === accessToken
  //     ? streamState.status
  //     : accessToken
  //       ? 'connecting'
  //       : 'degraded'
  const processedEventIds = useRef(new Set<string>())
  const terminalTaskIds = useRef(new Set<string>())

  const reconcile = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['marketplace-searches'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['automation-tasks'],
      }),
    ])
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

      await invalidateAutomationEventQueries(queryClient, event)
    },
    [queryClient]
  )

  useEffect(() => {
    // TODO: Implementar reconexão com backoff exponencial e jitter
    // TODO: Reativar quando a autenticação do frontend estiver integrada à SSE.
    // if (!accessToken) {
    //   processedEventIds.current.clear()
    //   terminalTaskIds.current.clear()
    //   return
    // }

    const eventSource = new EventSource(getAutomationEventsUrl(), {
      withCredentials: true,
    })

    const handleOpen = () => {
      setStatus('connected')
      // TODO: Reativar quando a stream voltar a depender da sessão autenticada.
      // setStreamState({ accessToken, status: 'connected' })
      void reconcile()
    }
    const handleError = () => {
      setStatus('degraded')
      // TODO: Reativar quando a stream voltar a depender da sessão autenticada.
      // setStreamState({ accessToken, status: 'degraded' })
    }
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
  }, [processEvent, reconcile])
  // TODO: Reativar quando a autenticação do frontend estiver integrada à SSE:
  // }, [accessToken, processEvent, reconcile])

  return { status, reconcile }
}
