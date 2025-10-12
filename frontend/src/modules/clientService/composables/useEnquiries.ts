import { ref, computed } from 'vue'
import type { Enquiry, CreateEnquiryData, UpdateEnquiryData } from '../types/enquiry'
import api from '@/plugins/axios'

// Dummy data removed - projects module deleted
const enquiries = ref<Enquiry[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useEnquiries() {
  const fetchEnquiries = async (filters?: {
    search?: string;
    status?: string;
    client_name?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/clientservice/enquiries', { params: filters })
      let apiEnquiries = response.data.data

      // Handle pagination - if it's a paginated response, get the data array
      if (apiEnquiries && typeof apiEnquiries === 'object' && 'data' in apiEnquiries) {
        apiEnquiries = apiEnquiries.data
      }

      enquiries.value = apiEnquiries || []
    } catch (err) {
      error.value = 'Failed to fetch enquiries'
      console.error('Error fetching enquiries:', err)
      // Fallback to dummy data if API fails
      enquiries.value = []
    } finally {
      loading.value = false
    }
  }

  const getEnquiry = (id: number): Enquiry | undefined => {
    // Only check current enquiries ref - dummy data removed
    return enquiries.value.find((enquiry: any) => enquiry.id === id)
  }

  const createEnquiry = async (data: CreateEnquiryData): Promise<Enquiry> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/clientservice/enquiries', data)
      const apiEnquiry = response.data.data

      const newEnquiry = apiEnquiry

      enquiries.value.push(newEnquiry)

      // Departmental tasks are now created automatically by the backend

      return newEnquiry
    } catch (err) {
      error.value = 'Failed to create enquiry'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEnquiry = async (id: number, data: UpdateEnquiryData): Promise<Enquiry> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/clientservice/enquiries/${id}`, data)
      const apiEnquiry = response.data.data

      const updatedEnquiry = apiEnquiry

      const index = enquiries.value.findIndex(enquiry => enquiry.id === id)
      if (index !== -1) {
        enquiries.value[index] = updatedEnquiry
      }

      return updatedEnquiry
    } catch (err) {
      error.value = 'Failed to update enquiry'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteEnquiry = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/api/clientservice/enquiries/${id}`)

      const index = enquiries.value.findIndex(enquiry => enquiry.id === id)
      if (index !== -1) {
        enquiries.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete enquiry'
      throw err
    } finally {
      loading.value = false
    }
  }

  const convertToProject = async (id: number): Promise<void> => {
    await updateEnquiry(id, { status: 'converted_to_project' })
  }

  const canConvertToProject = (enquiry: Enquiry): boolean => {
    // Enquiry can only be converted to project if:
    // 1. Site survey is completed (optional, but if exists must be completed)
    // 2. Design phase is completed (design artworks, mockups, renders)
    // 3. Materials are created
    // 4. Budget and quotation are approved

    // For now, we'll check if status is 'approved' which means all requirements are met
    // In a real implementation, this would check related records:
    // - Has site survey (if required) and it's completed
    // - Has design phase completed
    // - Has materials list created
    // - Has quotation approved

    return enquiry.status === 'quote_approved'
  }

  const newEnquiries = computed(() => enquiries.value.filter(enquiry => enquiry.status === 'enquiry_logged'))
  const inProgressEnquiries = computed(() => enquiries.value.filter(enquiry =>
    ['site_survey_completed', 'design_completed', 'design_approved', 'materials_specified', 'budget_created', 'quote_prepared'].includes(enquiry.status)
  ))
  const convertedEnquiries = computed(() => enquiries.value.filter(enquiry => enquiry.status === 'converted_to_project'))
  const totalEnquiries = computed(() => enquiries.value.length)

  return {
    enquiries,
    loading,
    error,
    fetchEnquiries,
    getEnquiry,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    convertToProject,
    canConvertToProject,
    newEnquiries,
    inProgressEnquiries,
    convertedEnquiries,
    totalEnquiries
  }
}
