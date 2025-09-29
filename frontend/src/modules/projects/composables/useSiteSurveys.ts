import { ref } from 'vue'
import api from '../../../plugins/axios'
import type { SiteSurvey, CreateSiteSurveyData, UpdateSiteSurveyData } from '../types'

const loading = ref(false)
const error = ref<string | null>(null)

export function useSiteSurveys() {
  const fetchSiteSurveys = async (filters?: {
    enquiry_id?: number;
    project_id?: number;
  }): Promise<SiteSurvey[]> => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.enquiry_id) params.append('enquiry_id', filters.enquiry_id.toString())
      if (filters?.project_id) params.append('project_id', filters.project_id.toString())

      const response = await api.get(`/api/projects/site-surveys?${params.toString()}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch site surveys'
      console.error('Error fetching site surveys:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getSiteSurvey = async (id: number): Promise<SiteSurvey | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/site-surveys/${id}`)
      return response.data
    } catch (err) {
      error.value = 'Failed to fetch site survey'
      console.error('Error fetching site survey:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const getSiteSurveyByEnquiry = async (enquiryId: number): Promise<SiteSurvey | null> => {
    loading.value = true
    error.value = null

    try {
      const surveys = await fetchSiteSurveys({ enquiry_id: enquiryId })
      return surveys.length > 0 ? surveys[0] : null
    } catch (err) {
      error.value = 'Failed to fetch site survey by enquiry'
      console.error('Error fetching site survey by enquiry:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createSiteSurvey = async (data: CreateSiteSurveyData): Promise<SiteSurvey> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/projects/site-surveys', data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create site survey'
      console.error('Error creating site survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSiteSurvey = async (id: number, data: UpdateSiteSurveyData): Promise<SiteSurvey> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/site-surveys/${id}`, data)
      return response.data
    } catch (err) {
      error.value = 'Failed to update site survey'
      console.error('Error updating site survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSiteSurvey = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/projects/site-surveys/${id}`)
    } catch (err) {
      error.value = 'Failed to delete site survey'
      console.error('Error deleting site survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchSiteSurveys,
    getSiteSurvey,
    getSiteSurveyByEnquiry,
    createSiteSurvey,
    updateSiteSurvey,
    deleteSiteSurvey
  }
}
