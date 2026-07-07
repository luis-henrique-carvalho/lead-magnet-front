import { describe, expect, it, vi, afterEach } from 'vitest'
import { api } from '@/lib/api-client'
import { automationTasksService } from './automation-tasks-service'

vi.mock('@/lib/api-client', () => ({
  api: {
    get: vi.fn(),
  },
}))

const mockValidResponse = {
  items: [
    {
      taskId: 'task-1',
      type: 'marketplace_product_search',
      marketplace: 'amazon',
      status: 'completed',
      statusUrl: 'http://localhost/status/1',
      error: null,
      errorType: null,
      attempts: 1,
      startedAt: '2026-06-14T10:00:10.000Z',
      finishedAt: '2026-06-14T10:01:00.000Z',
      createdAt: '2026-06-14T10:00:00.000Z',
      updatedAt: '2026-06-14T10:01:00.000Z',
      context: {
        searchId: 'search-1',
        originUrl: 'http://origin.url',
        query: 'kindle',
      },
    },
  ],
  page: 1,
  limit: 20,
  total: 1,
  summary: {
    pending: 0,
    processing: 0,
    completed: 1,
    partial: 0,
    failed: 0,
    manualRequired: 0,
  },
}

describe('automationTasksService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('deve chamar a API com os parâmetros corretos e retornar os dados parseados com Zod', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockValidResponse })

    const params = { page: 1, limit: 20, query: 'kindle' }
    const result = await automationTasksService.list(params)

    expect(api.get).toHaveBeenCalledWith('/automation-tasks', { params })
    expect(result).toEqual(mockValidResponse)
  })

  it('deve lançar erro se a resposta da API for inválida ou não condizer com o Schema', async () => {
    const mockInvalidResponse = {
      items: [
        {
          id: 123, // id inválido (deveria ser string)
          type: 'invalid_type', // tipo inválido
        },
      ],
      page: 'one', // página inválida (deveria ser number)
    }

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockInvalidResponse })

    await expect(automationTasksService.list({ page: 1, limit: 20 })).rejects.toThrow()
  })
})
