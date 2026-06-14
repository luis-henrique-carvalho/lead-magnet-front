import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AffiliateLinkCapturePayload } from '../schemas/affiliate-link-capture-schema'
import { affiliateLinkCaptureService } from '../services/affiliate-link-capture-service'
import { marketplaceSearchKeys } from './use-search-details'

export function useEnqueueAffiliateLinkCapture(searchId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<AffiliateLinkCapturePayload, 'searchId'>) =>
      affiliateLinkCaptureService.enqueue({ searchId, ...payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: marketplaceSearchKeys.captures(searchId),
      })
      toast.success('Captura de link afiliado enfileirada.')
    },
    onError: () => {
      toast.error('Não foi possível enfileirar a captura de link afiliado.')
    },
  })
}
