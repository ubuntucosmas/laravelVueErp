import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  DesignAsset,
  AssetFilters,
  FileUpload,
  DesignTaskData
} from '../types/design'

export const useDesignStore = defineStore('design', () => {
  // State
  const assets = ref<DesignAsset[]>([])
  const uploads = ref<FileUpload[]>([])
  const filters = ref<AssetFilters>({
    search: '',
    category: '',
    status: '',
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastSaved = ref<Date | null>(null)

  // Getters
  const filteredAssets = computed(() => {
    let filtered = [...assets.value]

    // Apply search filter
    if (filters.value.search.trim()) {
      const searchTerm = filters.value.search.toLowerCase().trim()
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.category.toLowerCase().includes(searchTerm) ||
        asset.description?.toLowerCase().includes(searchTerm) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Apply category filter
    if (filters.value.category) {
      filtered = filtered.filter(asset => asset.category === filters.value.category)
    }

    // Apply status filter
    if (filters.value.status) {
      filtered = filtered.filter(asset => asset.status === filters.value.status)
    }

    // Apply date range filter
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      filtered = filtered.filter(asset => {
        const assetDate = new Date(asset.uploadedAt)
        return (!start || assetDate >= start) && (!end || assetDate <= end)
      })
    }

    // Apply uploaded by filter
    if (filters.value.uploadedBy) {
      filtered = filtered.filter(asset => asset.uploadedById === filters.value.uploadedBy)
    }

    return filtered
  })

  const stats = computed(() => ({
    total: assets.value.length,
    approved: assets.value.filter(a => a.status === 'approved').length,
    pending: assets.value.filter(a => a.status === 'pending').length,
    rejected: assets.value.filter(a => a.status === 'rejected').length,
    revision: assets.value.filter(a => a.status === 'revision').length,
    uploading: uploads.value.filter(u => u.status === 'uploading').length,
  }))

  const activeUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'uploading')
  )

  const completedUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'completed')
  )

  const failedUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'failed')
  )

  const totalUploadProgress = computed(() => {
    if (uploads.value.length === 0) return 0
    const total = uploads.value.reduce((sum, upload) => sum + upload.progress, 0)
    return Math.round(total / uploads.value.length)
  })

  const taskData = computed((): DesignTaskData => ({
    assets: assets.value,
    uploads: uploads.value,
    filters: filters.value,
    stats: stats.value,
  }))

  // Actions
  const setAssets = (newAssets: DesignAsset[]) => {
    assets.value = newAssets
  }

  const addAsset = (asset: DesignAsset) => {
    assets.value.unshift(asset)
  }

  const updateAsset = (assetId: string, updates: Partial<DesignAsset>) => {
    const index = assets.value.findIndex(a => a.id === assetId)
    if (index !== -1) {
      assets.value[index] = { ...assets.value[index], ...updates }
    }
  }

  const removeAsset = (assetId: string) => {
    const index = assets.value.findIndex(a => a.id === assetId)
    if (index !== -1) {
      assets.value.splice(index, 1)
    }
  }

  const addUpload = (upload: FileUpload) => {
    uploads.value.push(upload)
  }

  const updateUpload = (uploadId: string, updates: Partial<FileUpload>) => {
    const index = uploads.value.findIndex(u => u.id === uploadId)
    if (index !== -1) {
      uploads.value[index] = { ...uploads.value[index], ...updates }
    }
  }

  const removeUpload = (uploadId: string) => {
    const index = uploads.value.findIndex(u => u.id === uploadId)
    if (index !== -1) {
      uploads.value.splice(index, 1)
    }
  }

  const setFilters = (newFilters: Partial<AssetFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      search: '',
      category: '',
      status: '',
    }
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (newError: string | null) => {
    error.value = newError
  }

  const setLastSaved = (date: Date) => {
    lastSaved.value = date
  }

  // Bulk operations
  const bulkUpdateStatus = (assetIds: string[], status: DesignAsset['status']) => {
    assetIds.forEach(id => updateAsset(id, { status }))
  }

  const bulkUpdateCategory = (assetIds: string[], category: DesignAsset['category']) => {
    assetIds.forEach(id => updateAsset(id, { category }))
  }

  const bulkDelete = (assetIds: string[]) => {
    assetIds.forEach(id => removeAsset(id))
  }

  // Persistence
  const saveToStorage = (taskId: string) => {
    try {
      const data = {
        assets: assets.value,
        filters: filters.value,
        lastSaved: new Date(),
      }
      localStorage.setItem(`design-task-${taskId}`, JSON.stringify(data))
      setLastSaved(new Date())
    } catch (err) {
      console.error('Failed to save design data to storage:', err)
    }
  }

  const loadFromStorage = (taskId: string) => {
    try {
      const stored = localStorage.getItem(`design-task-${taskId}`)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.assets) {
          assets.value = data.assets.map((asset: DesignAsset) => ({
            ...asset,
            uploadedAt: new Date(asset.uploadedAt),
          }))
        }
        if (data.filters) {
          filters.value = data.filters
        }
        if (data.lastSaved) {
          lastSaved.value = new Date(data.lastSaved)
        }
      }
    } catch (err) {
      console.error('Failed to load design data from storage:', err)
    }
  }

  const clearStorage = (taskId: string) => {
    localStorage.removeItem(`design-task-${taskId}`)
  }

  // Reset store
  const reset = () => {
    assets.value = []
    uploads.value = []
    filters.value = {
      search: '',
      category: '',
      status: '',
    }
    isLoading.value = false
    error.value = null
    lastSaved.value = null
  }

  return {
    // State
    assets,
    uploads,
    filters,
    isLoading,
    error,
    lastSaved,

    // Getters
    filteredAssets,
    stats,
    activeUploads,
    completedUploads,
    failedUploads,
    totalUploadProgress,
    taskData,

    // Actions
    setAssets,
    addAsset,
    updateAsset,
    removeAsset,
    addUpload,
    updateUpload,
    removeUpload,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    setLastSaved,
    bulkUpdateStatus,
    bulkUpdateCategory,
    bulkDelete,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    reset,
  }
})
