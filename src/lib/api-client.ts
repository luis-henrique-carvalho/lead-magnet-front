import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

export interface CreateSearchPayload {
  marketplace: string
  keyword: string
  category?: string
  limit: number
}

export interface CreateSearchResponse {
  searchId: string
  taskId: string
}

export const createMarketplaceSearch = async (
  payload: CreateSearchPayload
): Promise<CreateSearchResponse> => {
  const response = await api.post<CreateSearchResponse>(
    '/marketplaces/search',
    payload
  )
  return response.data
}
