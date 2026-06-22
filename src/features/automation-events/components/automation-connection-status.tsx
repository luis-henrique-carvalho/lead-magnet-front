import { Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAutomationEvents } from '../context/automation-events-context'

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
