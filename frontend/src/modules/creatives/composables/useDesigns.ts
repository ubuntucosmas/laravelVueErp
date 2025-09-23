import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import type { Design, DesignFilter, DesignStats } from '../types'

export function useDesigns() {
  const designs = ref<Design[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all designs with optional filtering
  const fetchDesigns = async (filters?: DesignFilter) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      if (filters) {
        if (filters.status?.length) params.append('status', filters.status.join(','))
        if (filters.design_type?.length) params.append('design_type', filters.design_type.join(','))
        if (filters.priority?.length) params.append('priority', filters.priority.join(','))
        if (filters.assigned_to?.length) params.append('assigned_to', filters.assigned_to.join(','))
        if (filters.created_by?.length) params.append('created_by', filters.created_by.join(','))
        if (filters.date_from) params.append('date_from', filters.date_from)
        if (filters.date_to) params.append('date_to', filters.date_to)
      }

      const response = await axios.get(`/creatives/designs?${params}`)
      designs.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch designs'
      console.error('Error fetching designs:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single design by ID
  const fetchDesign = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`/creatives/designs/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch design'
      console.error('Error fetching design:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new design
  const createDesign = async (designData: Partial<Design>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/creatives/designs', designData)
      designs.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create design'
      console.error('Error creating design:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update design
  const updateDesign = async (id: number, designData: Partial<Design>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/creatives/designs/${id}`, designData)
      const index = designs.value.findIndex(d => d.id === id)
      if (index !== -1) {
        designs.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update design'
      console.error('Error updating design:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete design
  const deleteDesign = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/creatives/designs/${id}`)
      designs.value = designs.value.filter(d => d.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete design'
      console.error('Error deleting design:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get design statistics
  const fetchDesignStats = async () => {
    try {
      const response = await axios.get('/creatives/designs/stats')
      return response.data as DesignStats
    } catch (err: any) {
      console.error('Error fetching design stats:', err)
      throw err
    }
  }

  // Computed properties
  const draftDesigns = computed(() =>
    designs.value.filter(d => d.status === 'draft')
  )

  const inReviewDesigns = computed(() =>
    designs.value.filter(d => d.status === 'in_review')
  )

  const approvedDesigns = computed(() =>
    designs.value.filter(d => d.status === 'approved')
  )

  const rejectedDesigns = computed(() =>
    designs.value.filter(d => d.status === 'rejected')
  )

  return {
    // State
    designs,
    loading,
    error,

    // Actions
    fetchDesigns,
    fetchDesign,
    createDesign,
    updateDesign,
    deleteDesign,
    fetchDesignStats,

    // Computed
    draftDesigns,
    inReviewDesigns,
    approvedDesigns,
    rejectedDesigns
  }
}
