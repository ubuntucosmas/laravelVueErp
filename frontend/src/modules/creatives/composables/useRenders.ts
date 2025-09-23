import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import type { Render, RenderFilter, RenderStats } from '../types'

export function useRenders() {
  const renders = ref<Render[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all renders with optional filtering
  const fetchRenders = async (filters?: RenderFilter) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      if (filters) {
        if (filters.status?.length) params.append('status', filters.status.join(','))
        if (filters.render_type?.length) params.append('render_type', filters.render_type.join(','))
        if (filters.render_quality?.length) params.append('render_quality', filters.render_quality.join(','))
        if (filters.priority?.length) params.append('priority', filters.priority.join(','))
        if (filters.assigned_to?.length) params.append('assigned_to', filters.assigned_to.join(','))
        if (filters.created_by?.length) params.append('created_by', filters.created_by.join(','))
        if (filters.date_from) params.append('date_from', filters.date_from)
        if (filters.date_to) params.append('date_to', filters.date_to)
      }

      const response = await axios.get(`/creatives/renders?${params}`)
      renders.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch renders'
      console.error('Error fetching renders:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single render by ID
  const fetchRender = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`/creatives/renders/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch render'
      console.error('Error fetching render:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new render
  const createRender = async (renderData: Partial<Render>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/creatives/renders', renderData)
      renders.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create render'
      console.error('Error creating render:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update render
  const updateRender = async (id: number, renderData: Partial<Render>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/creatives/renders/${id}`, renderData)
      const index = renders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        renders.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update render'
      console.error('Error updating render:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete render
  const deleteRender = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/creatives/renders/${id}`)
      renders.value = renders.value.filter(r => r.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete render'
      console.error('Error deleting render:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get render statistics
  const fetchRenderStats = async () => {
    try {
      const response = await axios.get('/creatives/renders/stats')
      return response.data as RenderStats
    } catch (err: any) {
      console.error('Error fetching render stats:', err)
      throw err
    }
  }

  // Computed properties
  const draftRenders = computed(() =>
    renders.value.filter(r => r.status === 'draft')
  )

  const processingRenders = computed(() =>
    renders.value.filter(r => r.status === 'processing')
  )

  const inReviewRenders = computed(() =>
    renders.value.filter(r => r.status === 'in_review')
  )

  const approvedRenders = computed(() =>
    renders.value.filter(r => r.status === 'approved')
  )

  const rejectedRenders = computed(() =>
    renders.value.filter(r => r.status === 'rejected')
  )

  return {
    // State
    renders,
    loading,
    error,

    // Actions
    fetchRenders,
    fetchRender,
    createRender,
    updateRender,
    deleteRender,
    fetchRenderStats,

    // Computed
    draftRenders,
    processingRenders,
    inReviewRenders,
    approvedRenders,
    rejectedRenders
  }
}
