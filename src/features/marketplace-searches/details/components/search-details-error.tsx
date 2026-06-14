import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function SearchDetailsError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant='destructive'>
      <AlertCircle aria-hidden='true' />
      <AlertTitle>Não foi possível carregar esta busca.</AlertTitle>
      <AlertDescription>
        <p>Verifique sua conexão e tente novamente.</p>
        <Button type='button' variant='outline' onClick={onRetry}>
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  )
}
