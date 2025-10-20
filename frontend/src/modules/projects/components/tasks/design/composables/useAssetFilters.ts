import { ref, computed, watch } from 'vue'
import type { AssetFilters, DesignAsset } from '../types/design'

/**
 * Composable for advanced asset filtering with performance optimizations
 */
export function useAssetFilters(assets: DesignAsset[]) {
  const filters = ref<AssetFilters>({
    search: '',
    category: '',
    status: '',
  })

  // Advanced filters
  const dateRange = ref<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })

  const uploadedByFilter = ref<number | null>(null)
  const fileSizeRange = ref<{ min: number | null; max: number | null }>({
    min: null,
    max: null,
  })

  const tagsFilter = ref<string[]>([])
  const sortBy = ref<'name' | 'uploadedAt' | 'size' | 'category' | 'status'>('uploadedAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // Debounced search to improve performance
  let searchTimeout: number | null = null
  const debouncedSearch = ref('')

  watch(() => filters.value.search, (newSearch) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(() => {
      debouncedSearch.value = newSearch || ''
    }, 300)
  })

  // Filtered and sorted assets with memoization
  const filteredAssets = computed(() => {
    let filtered = [...assets]

    // Apply search filter (debounced)
    if (debouncedSearch.value.trim()) {
      const searchTerm = debouncedSearch.value.toLowerCase().trim()
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.category.toLowerCase().includes(searchTerm) ||
        asset.description?.toLowerCase().includes(searchTerm) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        asset.uploadedBy.toLowerCase().includes(searchTerm)
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
    if (dateRange.value.start || dateRange.value.end) {
      filtered = filtered.filter(asset => {
        const assetDate = new Date(asset.uploadedAt)
        const start = dateRange.value.start
        const end = dateRange.value.end

        if (start && assetDate < start) return false
        if (end && assetDate > end) return false
        return true
      })
    }

    // Apply uploaded by filter
    if (uploadedByFilter.value) {
      filtered = filtered.filter(asset => asset.uploadedById === uploadedByFilter.value)
    }

    // Apply file size filter
    if (fileSizeRange.value.min !== null || fileSizeRange.value.max !== null) {
      filtered = filtered.filter(asset => {
        const size = asset.sizeBytes
        const min = fileSizeRange.value.min
        const max = fileSizeRange.value.max

        if (min !== null && size < min) return false
        if (max !== null && size > max) return false
        return true
      })
    }

    // Apply tags filter
    if (tagsFilter.value.length > 0) {
      filtered = filtered.filter(asset =>
        asset.tags?.some(tag => tagsFilter.value.includes(tag))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

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
        case 'status':
          aValue = a.status
          bValue = b.status
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

  // Filter statistics
  const filterStats = computed(() => ({
    total: assets.length,
    filtered: filteredAssets.value.length,
    hasActiveFilters: !!(
      filters.value.search ||
      filters.value.category ||
      filters.value.status ||
      dateRange.value.start ||
      dateRange.value.end ||
      uploadedByFilter.value ||
      fileSizeRange.value.min ||
      fileSizeRange.value.max ||
      tagsFilter.value.length > 0
    ),
  }))

  // Available filter options based on current assets
  const availableCategories = computed(() => {
    const categories = new Set(assets.map(a => a.category))
    return Array.from(categories).sort()
  })

  const availableStatuses = computed(() => {
    const statuses = new Set(assets.map(a => a.status))
    return Array.from(statuses).sort()
  })

  const availableTags = computed(() => {
    const tags = new Set<string>()
    assets.forEach(asset => {
      asset.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  })

  const availableUploaders = computed(() => {
    const uploaders = new Map<number, string>()
    assets.forEach(asset => {
      uploaders.set(asset.uploadedById, asset.uploadedBy)
    })
    return Array.from(uploaders.entries()).map(([id, name]) => ({ id, name }))
  })

  // Methods
  const setFilters = (newFilters: Partial<AssetFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const setDateRange = (start: Date | null, end: Date | null) => {
    dateRange.value = { start, end }
  }

  const setUploadedByFilter = (userId: number | null) => {
    uploadedByFilter.value = userId
  }

  const setFileSizeRange = (min: number | null, max: number | null) => {
    fileSizeRange.value = { min, max }
  }

  const addTagFilter = (tag: string) => {
    if (!tagsFilter.value.includes(tag)) {
      tagsFilter.value.push(tag)
    }
  }

  const removeTagFilter = (tag: string) => {
    const index = tagsFilter.value.indexOf(tag)
    if (index > -1) {
      tagsFilter.value.splice(index, 1)
    }
  }

  const clearTagFilters = () => {
    tagsFilter.value = []
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

  const clearAllFilters = () => {
    filters.value = {
      search: '',
      category: '',
      status: '',
    }
    dateRange.value = { start: null, end: null }
    uploadedByFilter.value = null
    fileSizeRange.value = { min: null, max: null }
    tagsFilter.value = []
  }

  const saveFilterPreset = (name: string) => {
    const preset = {
      name,
      filters: { ...filters.value },
      dateRange: { ...dateRange.value },
      uploadedByFilter: uploadedByFilter.value,
      fileSizeRange: { ...fileSizeRange.value },
      tagsFilter: [...tagsFilter.value],
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }

    const presets = JSON.parse(localStorage.getItem('design-filter-presets') || '[]')
    presets.push(preset)
    localStorage.setItem('design-filter-presets', JSON.stringify(presets))

    return preset
  }

  const loadFilterPreset = (preset: Record<string, unknown>) => {
    filters.value = { ...preset.filters }
    dateRange.value = { ...preset.dateRange }
    uploadedByFilter.value = preset.uploadedByFilter
    fileSizeRange.value = { ...preset.fileSizeRange }
    tagsFilter.value = [...preset.tagsFilter]
    sortBy.value = preset.sortBy as typeof sortBy.value
    sortOrder.value = preset.sortOrder as 'asc' | 'desc'
  }

  const getFilterPresets = () => {
    return JSON.parse(localStorage.getItem('design-filter-presets') || '[]')
  }

  // Cleanup
  const cleanup = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
      searchTimeout = null
    }
  }

  return {
    // State
    filters,
    dateRange,
    uploadedByFilter,
    fileSizeRange,
    tagsFilter,
    sortBy,
    sortOrder,
    debouncedSearch,

    // Computed
    filteredAssets,
    filterStats,
    availableCategories,
    availableStatuses,
    availableTags,
    availableUploaders,

    // Methods
    setFilters,
    setDateRange,
    setUploadedByFilter,
    setFileSizeRange,
    addTagFilter,
    removeTagFilter,
    clearTagFilters,
    setSorting,
    toggleSort,
    clearAllFilters,
    saveFilterPreset,
    loadFilterPreset,
    getFilterPresets,
    cleanup,
  }
}
