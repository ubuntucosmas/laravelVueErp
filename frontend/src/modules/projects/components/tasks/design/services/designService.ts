import type { DesignAsset, AssetFilters } from '../types/design'
import axios from '@/plugins/axios'

export class DesignService {
  private baseUrl = '/api/projects'

  async getAssets(taskId: string, filters?: AssetFilters): Promise<{ data: DesignAsset[], links: Record<string, unknown>, meta: Record<string, unknown> }> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    const response = await axios.get(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets`, { params })
    return response.data
  }

  async uploadAssets(taskId: string, files: File[], options?: {
    category?: string
    description?: string
    tags?: string[]
  }): Promise<DesignAsset[]> {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    if (options?.category) formData.append('category', options.category)
    if (options?.description) formData.append('description', options.description)
    if (options?.tags && options.tags.length > 0) {
      options.tags.forEach(tag => formData.append('tags[]', tag))
    }

    const response = await axios.post(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  }

  async getAsset(taskId: string, assetId: string): Promise<DesignAsset> {
    const response = await axios.get(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets/${assetId}`)
    return response.data
  }

  async updateAsset(taskId: string, assetId: string, updates: {
    category?: string
    status?: string
    description?: string
    tags?: string[]
  }): Promise<DesignAsset> {
    const response = await axios.put(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets/${assetId}`, updates)
    return response.data
  }

  async deleteAsset(taskId: string, assetId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets/${assetId}`)
  }

  async downloadAsset(taskId: string, assetId: string): Promise<Blob> {
    const response = await axios.get(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets/${assetId}/download`, {
      responseType: 'blob'
    })
    return response.data
  }

  // Bulk operations
  async bulkUpdateStatus(taskId: string, assetIds: string[], status: string, approvedBy?: number): Promise<{ updated: number }> {
    const response = await axios.post(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets/bulk-update-status`, {
      asset_ids: assetIds,
      status,
      approved_by: approvedBy
    })
    return response.data
  }

  // Asset statistics
  async getAssetStats(taskId: string): Promise<{
    total: number
    approved: number
    pending: number
    rejected: number
    archived: number
    total_size: number
    categories: Record<string, number>
    recent_uploads: number
  }> {
    const response = await axios.get(`${this.baseUrl}/enquiry-tasks/${taskId}/design-assets/stats`)
    return response.data
  }
}
