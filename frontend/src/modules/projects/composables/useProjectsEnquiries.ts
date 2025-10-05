import { ref, computed } from 'vue'
import type { ProjectEnquiry, CreateProjectEnquiryData, UpdateProjectEnquiryData } from '../types/enquiry'
import api from '@/plugins/axios'
import { PAGINATION_PER_PAGE, CONVERTIBLE_STATUSES } from '../constants/enquiryConstants'

const enquiries = ref<ProjectEnquiry[]>([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: PAGINATION_PER_PAGE,
  total: 0,
  from: 0,
  to: 0
})
const loading = ref(false)
const error = ref<string | null>(null)

export function useProjectsEnquiries() {
  const fetchEnquiries = async (filters?: {
    search?: string;
    status?: string;
    client_name?: string;
    page?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/projects/enquiries', { params })
      const paginationData = response.data.data

      enquiries.value = paginationData.data || []
      pagination.value = {
        current_page: paginationData.current_page || 1,
        last_page: paginationData.last_page || 1,
        per_page: paginationData.per_page || 15,
        total: paginationData.total || 0,
        from: paginationData.from || 0,
        to: paginationData.to || 0
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch enquiries'
      enquiries.value = []
      pagination.value = {
        current_page: 1,
        last_page: 1,
        per_page: PAGINATION_PER_PAGE,
        total: 0,
        from: 0,
        to: 0
      }
    } finally {
      loading.value = false
    }
  }

  const getEnquiry = (id: number): ProjectEnquiry | undefined => {
    return enquiries.value.find((enquiry) => enquiry.id === id)
  }

  const createEnquiry = async (data: CreateProjectEnquiryData): Promise<ProjectEnquiry> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/api/projects/enquiries', data)
      const apiEnquiry = response.data.data

      const newEnquiry = apiEnquiry

      enquiries.value.push(newEnquiry)

      return newEnquiry
    } catch (err) {
      error.value = 'Failed to create enquiry'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEnquiry = async (id: number, data: UpdateProjectEnquiryData): Promise<ProjectEnquiry> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/enquiries/${id}`, data)
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
      await api.delete(`/api/projects/enquiries/${id}`)

      const index = enquiries.value.findIndex(enquiry => enquiry.id === id)
      if (index === -1) {
        throw new Error('Enquiry not found')
      }

      enquiries.value.splice(index, 1)
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

  const canConvertToProject = (enquiry: ProjectEnquiry): boolean => {
    return CONVERTIBLE_STATUSES.includes(enquiry.status)
  }

  const approveQuote = async (id: number): Promise<void> => {
    try {
      await api.post(`/api/projects/enquiries/${id}/approve-quote`)
      // Refresh the enquiry data
      await fetchEnquiries()
    } catch (err) {
      error.value = 'Failed to approve quote'
      throw err
    }
  }

  const newEnquiries = computed(() => enquiries.value.filter(enquiry => enquiry.status === 'enquiry_logged'))
  const inProgressEnquiries = computed(() => enquiries.value.filter(enquiry =>
    ['site_survey_completed', 'design_completed', 'design_approved', 'materials_specified', 'budget_created', 'quote_prepared'].includes(enquiry.status)
  ))
  const convertedEnquiries = computed(() => enquiries.value.filter(enquiry => enquiry.status === 'converted_to_project'))
  const totalEnquiries = computed(() => enquiries.value.length)

  const goToPage = async (page: number) => {
    await fetchEnquiries({ page })
  }

  return {
    enquiries,
    pagination,
    loading,
    error,
    fetchEnquiries,
    goToPage,
    getEnquiry,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    convertToProject,
    canConvertToProject,
    approveQuote,
    newEnquiries,
    inProgressEnquiries,
    convertedEnquiries,
    totalEnquiries
  }
}
