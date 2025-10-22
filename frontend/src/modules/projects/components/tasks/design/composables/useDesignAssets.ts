import { ref, computed, watch } from 'vue'
import type {
  DesignAsset,
  AssetFilters,
  AssetStatus,
  AssetCategory
} from '../types/design'

/**
 * Composable for managing design assets with filtering, sorting, and CRUD operations
 */
export function useDesignAssets(initialAssets: DesignAsset[] = []) {
  const assets = ref<DesignAsset[]>(initialAssets)
  const filters = ref<AssetFilters>({
    search: '',
    category: '',
    status: '',
  })
  const sortBy = ref<'name' | 'uploadedAt' | 'size' | 'category'>('uploadedAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const selectedAssets = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
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
        return assetDate >= start && assetDate <= end
      })
    }

    // Apply uploaded by filter
    if (filters.value.uploadedBy) {
      filtered = filtered.filter(asset => asset.uploadedById === filters.value.uploadedBy)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy.value) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'uploadedAt':
          aValue = new Date(a.uploadedAt).getTime()
          bValue = new Date(b.uploadedAt).getTime()
          break
        case 'size':
          aValue = a.sizeBytes
          bValue = b.sizeBytes
          break
        case 'category':
          aValue = a.category
          bValue = b.category
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  })

  const stats = computed(() => ({
    total: assets.value.length,
    approved: assets.value.filter(a => a.status === 'approved').length,
    pending: assets.value.filter(a => a.status === 'pending').length,
    rejected: assets.value.filter(a => a.status === 'rejected').length,
    revision: assets.value.filter(a => a.status === 'revision').length,
    uploading: 0, // This would come from upload composable
  }))

  const categories = computed(() => {
    const categorySet = new Set(assets.value.map(a => a.category))
    return Array.from(categorySet).sort()
  })

  const selectedAssetsList = computed(() =>
    assets.value.filter(asset => selectedAssets.value.has(asset.id))
  )

  const hasSelectedAssets = computed(() => selectedAssets.value.size > 0)

  // Methods
  const addAsset = (asset: DesignAsset) => {
    assets.value.unshift(asset) // Add to beginning for recency
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
      selectedAssets.value.delete(assetId)
    }
  }

  const updateAssetStatus = (assetId: string, status: AssetStatus) => {
    updateAsset(assetId, { status })
  }

  const updateAssetCategory = (assetId: string, category: AssetCategory) => {
    updateAsset(assetId, { category })
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

  const setSorting = (field: typeof sortBy.value, order?: typeof sortOrder.value) => {
    sortBy.value = field
    if (order) sortOrder.value = order
  }

  const toggleSort = (field: typeof sortBy.value) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
  }

  const selectAsset = (assetId: string) => {
    selectedAssets.value.add(assetId)
  }

  const deselectAsset = (assetId: string) => {
    selectedAssets.value.delete(assetId)
  }

  const toggleAssetSelection = (assetId: string) => {
    if (selectedAssets.value.has(assetId)) {
      deselectAsset(assetId)
    } else {
      selectAsset(assetId)
    }
  }

  const selectAllVisible = () => {
    filteredAssets.value.forEach(asset => selectedAssets.value.add(asset.id))
  }

  const deselectAll = () => {
    selectedAssets.value.clear()
  }

  const bulkUpdateStatus = (status: AssetStatus) => {
    selectedAssetsList.value.forEach(asset => updateAssetStatus(asset.id, status))
    deselectAll()
  }

  const bulkUpdateCategory = (category: AssetCategory) => {
    selectedAssetsList.value.forEach(asset => updateAssetCategory(asset.id, category))
    deselectAll()
  }

  const bulkDelete = () => {
    selectedAssetsList.value.forEach(asset => removeAsset(asset.id))
    deselectAll()
  }

  const loadAssets = async (taskId: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await api.getDesignAssets(taskId)
      // assets.value = response.data

      // For now, keep existing assets or load from localStorage
      const saved = localStorage.getItem(`design-assets-${taskId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        assets.value = parsed.map((asset: DesignAsset) => ({
          ...asset,
          uploadedAt: new Date(asset.uploadedAt),
        }))
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load assets'
    } finally {
      isLoading.value = false
    }
  }

  const saveAssets = async (taskId: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.saveDesignAssets(taskId, assets.value)

      // For now, save to localStorage
      localStorage.setItem(`design-assets-${taskId}`, JSON.stringify(assets.value))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save assets'
      throw err
    }
  }

  // Auto-save functionality
  let saveTimeout: number | null = null
  const autoSave = (taskId: string, delay = 2000) => {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveAssets(taskId).catch(console.error)
    }, delay)
  }

  // Watch for changes and auto-save
  watch(assets, () => {
    // TODO: Get taskId from props/context
    // autoSave(taskId)
  }, { deep: true })

  // Cleanup on unmount
  const cleanup = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }
  }

  return {
    // State
    assets,
    filters,
    sortBy,
    sortOrder,
    selectedAssets,
    isLoading,
    error,

    // Computed
    filteredAssets,
    stats,
    categories,
    selectedAssetsList,
    hasSelectedAssets,

    // Methods
    addAsset,
    updateAsset,
    removeAsset,
    updateAssetStatus,
    updateAssetCategory,
    setFilters,
    clearFilters,
    setSorting,
    toggleSort,
    selectAsset,
    deselectAsset,
    toggleAssetSelection,
    selectAllVisible,
    deselectAll,
    bulkUpdateStatus,
    bulkUpdateCategory,
    bulkDelete,
    loadAssets,
    saveAssets,
    cleanup,
  }
}
