import { ref, computed } from 'vue'
import type { Enquiry, CreateEnquiryData, UpdateEnquiryData } from '../types/enquiry'

// Dummy data - exported for shared use with Projects module
export const dummyEnquiries: Enquiry[] = [
  {
    id: 1,
    client_id: 1,
    client: {
      id: 1,
      name: 'ABC Corporation',
      email: 'contact@abc.com'
    },
    title: 'Corporate Event Booth Setup',
    description: 'Need a professional booth setup for our annual corporate event',
    project_scope: 'Complete booth design, construction, and setup for 200 attendees',
    priority: 'high',
    status: 'enquiry_logged',
    estimated_budget: 50000,
    created_by: 1,
    created_by_user: {
      id: 1,
      name: 'Client Service Officer 1'
    },
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z'
  },
  {
    id: 2,
    client_id: 2,
    client: {
      id: 2,
      name: 'XYZ Events',
      email: 'info@xyz.com'
    },
    title: 'Wedding Exhibition Display',
    description: 'Custom display for wedding exhibition',
    project_scope: 'Elegant display booth with lighting and branding',
    priority: 'medium',
    status: 'client_registered',
    estimated_budget: 25000,
    created_by: 2,
    created_by_user: {
      id: 2,
      name: 'Client Service Officer 2'
    },
    created_at: '2024-09-05T14:30:00Z',
    updated_at: '2024-09-10T16:45:00Z'
  },
  {
    id: 3,
    client_id: 1,
    client: {
      id: 1,
      name: 'ABC Corporation',
      email: 'contact@abc.com'
    },
    title: 'Product Launch Event',
    description: 'Product launch event setup',
    project_scope: 'Stage setup, lighting, sound system, and branding',
    priority: 'urgent',
    status: 'converted_to_project',
    estimated_budget: 75000,
    created_by: 1,
    created_by_user: {
      id: 1,
      name: 'Client Service Officer 1'
    },
    created_at: '2024-08-20T09:15:00Z',
    updated_at: '2024-09-15T11:20:00Z'
  }
]

const enquiries = ref<Enquiry[]>([...dummyEnquiries])
const loading = ref(false)
const error = ref<string | null>(null)

export function useEnquiries() {
  const fetchEnquiries = async (filters?: {
    search?: string;
    status?: string;
    priority?: string;
    client_id?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredEnquiries = [...dummyEnquiries]

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filteredEnquiries = filteredEnquiries.filter(enquiry =>
          enquiry.title.toLowerCase().includes(search) ||
          enquiry.description.toLowerCase().includes(search) ||
          enquiry.client?.name.toLowerCase().includes(search)
        )
      }

      if (filters?.status) {
        filteredEnquiries = filteredEnquiries.filter(enquiry => enquiry.status === filters.status)
      }

      if (filters?.priority) {
        filteredEnquiries = filteredEnquiries.filter(enquiry => enquiry.priority === filters.priority)
      }

      if (filters?.client_id) {
        filteredEnquiries = filteredEnquiries.filter(enquiry => enquiry.client_id === filters.client_id)
      }

      enquiries.value = filteredEnquiries
    } catch (err) {
      error.value = 'Failed to fetch enquiries'
      console.error('Error fetching enquiries:', err)
    } finally {
      loading.value = false
    }
  }

  const getEnquiry = (id: number): Enquiry | undefined => {
    // First check current enquiries ref, then fall back to dummy data
    return enquiries.value.find(enquiry => enquiry.id === id) ||
           dummyEnquiries.find(enquiry => enquiry.id === id)
  }

  const createEnquiry = async (data: CreateEnquiryData): Promise<Enquiry> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newEnquiry: Enquiry = {
        id: Math.max(...enquiries.value.map(e => e.id)) + 1,
        ...data,
        status: 'enquiry_logged',
        created_by: 1, // Current user
        created_by_user: {
          id: 1,
          name: 'Current User'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      enquiries.value.push(newEnquiry)
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = enquiries.value.findIndex(enquiry => enquiry.id === id)
      if (index === -1) {
        throw new Error('Enquiry not found')
      }

      const updatedEnquiry = {
        ...enquiries.value[index],
        ...data,
        updated_at: new Date().toISOString()
      }

      enquiries.value[index] = updatedEnquiry
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

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
