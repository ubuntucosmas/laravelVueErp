import api from '@/plugins/axios'
import type { ApiResponse, FilterOptions } from '../types/common'

// Real API functions using axios
export function useApi() {
  const get = async <T>(endpoint: string, params?: FilterOptions): Promise<ApiResponse<T>> => {
    const response = await api.get(endpoint, { params })
    return response.data
  }

  const post = async <T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> => {
    const response = await api.post(endpoint, data)
    return response.data
  }

  const put = async <T>(endpoint: string, data: Record<string, unknown>): Promise<ApiResponse<T>> => {
    const response = await api.put(endpoint, data)
    return response.data
  }

  const deleteRequest = async (endpoint: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(endpoint)
    return response.data
  }

  return {
    get,
    post,
    put,
    delete: deleteRequest
  }
}

// Standardized error handling utility
export function handleApiError(err: unknown, defaultMessage: string): string {
  if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data && typeof err.response.data.message === 'string') {
    return err.response.data.message
  }
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message
  }
  return defaultMessage
}
