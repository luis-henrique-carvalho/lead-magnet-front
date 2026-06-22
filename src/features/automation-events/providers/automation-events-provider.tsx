import { useMemo, type ReactNode } from 'react'
import { AutomationConnectionStatus } from '../components/automation-connection-status'
import { AutomationEventsContext } from '../context/automation-events-context'
import { useAutomationEventStream } from '../hooks/use-automation-event-stream'

export function AutomationEventsProvider({
  children,
}: {
  children: ReactNode
}) {
  const { status, reconcile } = useAutomationEventStream()

  const value = useMemo(() => ({ status, reconcile }), [status, reconcile])

  return (
    <AutomationEventsContext value={value}>{children}</AutomationEventsContext>
  )
}

export { AutomationConnectionStatus }
