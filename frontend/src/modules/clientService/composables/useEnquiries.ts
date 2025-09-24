import { ref, computed } from 'vue'
import type { Enquiry, CreateEnquiryData, UpdateEnquiryData } from '../types/enquiry'
import api from '@/plugins/axios'

// Dummy data - exported for shared use with Projects module
export const dummyEnquiries: Enquiry[] = [
  {
    id: 1,
    date_received: '2024-09-01',
    expected_delivery_date: '2024-09-15',
    client_name: 'ABC Corporation',
    project_name: 'Corporate Event Booth Setup',
    project_deliverables: 'Complete booth design, construction, and setup for 200 attendees',
    contact_person: 'John Doe',
    status: 'enquiry_logged',
    assigned_po: 'PO12345',
    follow_up_notes: 'Client prefers email communication',
    enquiry_number: 'ENQ-2024-0001',
    venue: 'Convention Center',
    site_survey_skipped: false,
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
    date_received: '2024-09-05',
    expected_delivery_date: '2024-09-20',
    client_name: 'XYZ Events',
    project_name: 'Wedding Exhibition Display',
    project_deliverables: 'Elegant display booth with lighting and branding',
    contact_person: 'Jane Smith',
    status: 'client_registered',
    enquiry_number: 'ENQ-2024-0002',
    venue: 'Exhibition Hall',
    site_survey_skipped: true,
    site_survey_skip_reason: 'Client provided detailed specifications',
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
    date_received: '2024-08-20',
    expected_delivery_date: '2024-09-10',
    client_name: 'ABC Corporation',
    project_name: 'Product Launch Event',
    project_deliverables: 'Stage setup, lighting, sound system, and branding',
    contact_person: 'Mike Johnson',
    status: 'converted_to_project',
    assigned_po: 'PO67890',
    enquiry_number: 'ENQ-2024-0003',
    venue: 'Grand Hotel Ballroom',
    site_survey_skipped: false,
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
    client_name?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/clientservice/enquiries', { params: filters })
      enquiries.value = response.data.data.data || []
    } catch (err) {
      error.value = 'Failed to fetch enquiries'
      console.error('Error fetching enquiries:', err)
      // Fallback to dummy data if API fails
      enquiries.value = [...dummyEnquiries]
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
      const response = await api.post('/api/clientservice/enquiries', data)
      const newEnquiry = response.data.data

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
