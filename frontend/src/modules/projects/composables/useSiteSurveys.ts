import { ref } from 'vue'
import type { SiteSurvey, CreateSiteSurveyData, UpdateSiteSurveyData } from '../types'

const siteSurveys = ref<SiteSurvey[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useSiteSurveys() {
  const fetchSiteSurveys = async (filters?: {
    enquiry_id?: number;
    project_id?: number;
  }) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredSurveys = [...siteSurveys.value]

      if (filters?.enquiry_id) {
        filteredSurveys = filteredSurveys.filter(survey => survey.enquiry_id === filters.enquiry_id)
      }

      if (filters?.project_id) {
        filteredSurveys = filteredSurveys.filter(survey => survey.project_id === filters.project_id)
      }

      return filteredSurveys
    } catch (err) {
      error.value = 'Failed to fetch site surveys'
      console.error('Error fetching site surveys:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getSiteSurvey = (id: number): SiteSurvey | undefined => {
    return siteSurveys.value.find(survey => survey.id === id)
  }

  const getSiteSurveyByEnquiry = (enquiryId: number): SiteSurvey | undefined => {
    return siteSurveys.value.find(survey => survey.enquiry_id === enquiryId)
  }

  const createSiteSurvey = async (data: CreateSiteSurveyData): Promise<SiteSurvey> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newSurvey: SiteSurvey = {
        id: Math.max(...siteSurveys.value.map(s => s.id), 0) + 1,
        ...data,
        status: data.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      siteSurveys.value.push(newSurvey)
      return newSurvey
    } catch (err) {
      error.value = 'Failed to create site survey'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSiteSurvey = async (id: number, data: UpdateSiteSurveyData): Promise<SiteSurvey> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = siteSurveys.value.findIndex(survey => survey.id === id)
      if (index === -1) {
        throw new Error('Site survey not found')
      }

      const updatedSurvey = {
        ...siteSurveys.value[index],
        ...data,
        updated_at: new Date().toISOString()
      }

      siteSurveys.value[index] = updatedSurvey
      return updatedSurvey
    } catch (err) {
      error.value = 'Failed to update site survey'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSiteSurvey = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = siteSurveys.value.findIndex(survey => survey.id === id)
      if (index === -1) {
        throw new Error('Site survey not found')
      }

      siteSurveys.value.splice(index, 1)
    } catch (err) {
      error.value = 'Failed to delete site survey'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    siteSurveys,
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
