import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import type { Mockup, MockupFilter, MockupStats } from '../types'

export function useMockups() {
  const mockups = ref<Mockup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all mockups with optional filtering
  const fetchMockups = async (filters?: MockupFilter) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      if (filters) {
        if (filters.status?.length) params.append('status', filters.status.join(','))
        if (filters.mockup_type?.length) params.append('mockup_type', filters.mockup_type.join(','))
        if (filters.priority?.length) params.append('priority', filters.priority.join(','))
        if (filters.assigned_to?.length) params.append('assigned_to', filters.assigned_to.join(','))
        if (filters.created_by?.length) params.append('created_by', filters.created_by.join(','))
        if (filters.date_from) params.append('date_from', filters.date_from)
        if (filters.date_to) params.append('date_to', filters.date_to)
      }

      const response = await axios.get(`/creatives/mockups?${params}`)
      mockups.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch mockups'
      console.error('Error fetching mockups:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single mockup by ID
  const fetchMockup = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`/creatives/mockups/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch mockup'
      console.error('Error fetching mockup:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new mockup
  const createMockup = async (mockupData: Partial<Mockup>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/creatives/mockups', mockupData)
      mockups.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create mockup'
      console.error('Error creating mockup:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update mockup
  const updateMockup = async (id: number, mockupData: Partial<Mockup>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/creatives/mockups/${id}`, mockupData)
      const index = mockups.value.findIndex(m => m.id === id)
      if (index !== -1) {
        mockups.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update mockup'
      console.error('Error updating mockup:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete mockup
  const deleteMockup = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/creatives/mockups/${id}`)
      mockups.value = mockups.value.filter(m => m.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete mockup'
      console.error('Error deleting mockup:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get mockup statistics
  const fetchMockupStats = async () => {
    try {
      const response = await axios.get('/creatives/mockups/stats')
      return response.data as MockupStats
    } catch (err: any) {
      console.error('Error fetching mockup stats:', err)
      throw err
    }
  }

  // Computed properties
  const draftMockups = computed(() =>
    mockups.value.filter(m => m.status === 'draft')
  )

  const inReviewMockups = computed(() =>
    mockups.value.filter(m => m.status === 'in_review')
  )

  const approvedMockups = computed(() =>
    mockups.value.filter(m => m.status === 'approved')
  )

  const rejectedMockups = computed(() =>
    mockups.value.filter(m => m.status === 'rejected')
  )

  return {
    // State
    mockups,
    loading,
    error,

    // Actions
    fetchMockups,
    fetchMockup,
    createMockup,
    updateMockup,
    deleteMockup,
    fetchMockupStats,

    // Computed
    draftMockups,
    inReviewMockups,
    approvedMockups,
    rejectedMockups
  }
}
