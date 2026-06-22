import { createContext, use } from 'react'
import type { ConnectionStatus } from '../hooks/use-automation-event-stream'

export type AutomationEventsContextValue = {
  status: ConnectionStatus
  reconcile: () => Promise<void>
}

export const AutomationEventsContext =
  createContext<AutomationEventsContextValue | null>(null)

export function useAutomationEvents() {
  const context = use(AutomationEventsContext)

  if (!context) {
    throw new Error(
      'useAutomationEvents must be used within AutomationEventsProvider'
    )
  }

  return context
}
