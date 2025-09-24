import { ref, computed } from 'vue'
import type { Enquiry, CreateEnquiryData, UpdateEnquiryData } from '../types'
import api from '@/plugins/axios'

// Import shared dummy data from ClientService module
import { dummyEnquiries } from '../../clientService/composables/useEnquiries'

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
      // Fetch from client service API
      const response = await api.get('/api/clientservice/enquiries', { params: filters })
      const clientServiceEnquiries = response.data.data.data || []

      // Map client service enquiries to projects module format
      const mappedEnquiries: Enquiry[] = clientServiceEnquiries.map((enquiry: any) => ({
        // Core fields from client service
        id: enquiry.id,
        date_received: enquiry.date_received,
        expected_delivery_date: enquiry.expected_delivery_date,
        client_name: enquiry.client_name,
        project_name: enquiry.project_name,
        project_deliverables: enquiry.project_deliverables,
        contact_person: enquiry.contact_person,
        status: enquiry.status,
        assigned_po: enquiry.assigned_po,
        follow_up_notes: enquiry.follow_up_notes,
        project_id: enquiry.project_id,
        enquiry_number: enquiry.enquiry_number,
        converted_to_project_id: enquiry.converted_to_project_id,
        venue: enquiry.venue,
        site_survey_skipped: enquiry.site_survey_skipped,
        site_survey_skip_reason: enquiry.site_survey_skip_reason,
        created_by: enquiry.created_by,
        created_by_user: enquiry.created_by_user,
        created_at: enquiry.created_at,
        updated_at: enquiry.updated_at,

        // Legacy fields for backward compatibility
        client_id: enquiry.client_id || undefined,
        client: enquiry.client || undefined,
        title: enquiry.project_name, // Map project_name to title
        description: enquiry.project_deliverables, // Map project_deliverables to description
        project_scope: enquiry.project_deliverables, // Map project_deliverables to project_scope
        priority: 'medium', // Default priority since client service doesn't have priority
        department_id: undefined,
        department: undefined,
        assigned_department: undefined,
        estimated_budget: undefined
      }))

      enquiries.value = mappedEnquiries
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
      // Use client service API for creating enquiries
      const response = await api.post('/api/clientservice/enquiries', {
        date_received: data.date_received || new Date().toISOString().split('T')[0],
        expected_delivery_date: data.expected_delivery_date,
        client_name: data.client_name,
        project_name: data.project_name || data.title, // Fallback to title if project_name not provided
        project_deliverables: data.project_deliverables || data.description, // Fallback to description
        contact_person: data.contact_person,
        status: data.status || 'enquiry_logged',
        assigned_po: data.assigned_po,
        follow_up_notes: data.follow_up_notes,
        venue: data.venue,
        site_survey_skipped: data.site_survey_skipped || false,
        site_survey_skip_reason: data.site_survey_skip_reason
      })

      const backendEnquiry = response.data.data

      // Map to projects module format
      const newEnquiry: Enquiry = {
        // Core fields from client service
        id: backendEnquiry.id,
        date_received: backendEnquiry.date_received,
        expected_delivery_date: backendEnquiry.expected_delivery_date,
        client_name: backendEnquiry.client_name,
        project_name: backendEnquiry.project_name,
        project_deliverables: backendEnquiry.project_deliverables,
        contact_person: backendEnquiry.contact_person,
        status: backendEnquiry.status,
        assigned_po: backendEnquiry.assigned_po,
        follow_up_notes: backendEnquiry.follow_up_notes,
        project_id: backendEnquiry.project_id,
        enquiry_number: backendEnquiry.enquiry_number,
        converted_to_project_id: backendEnquiry.converted_to_project_id,
        venue: backendEnquiry.venue,
        site_survey_skipped: backendEnquiry.site_survey_skipped,
        site_survey_skip_reason: backendEnquiry.site_survey_skip_reason,
        created_by: backendEnquiry.created_by,
        created_by_user: backendEnquiry.created_by_user,
        created_at: backendEnquiry.created_at,
        updated_at: backendEnquiry.updated_at,

        // Legacy fields for backward compatibility
        client_id: backendEnquiry.client_id || undefined,
        client: backendEnquiry.client || undefined,
        title: backendEnquiry.project_name,
        description: backendEnquiry.project_deliverables,
        project_scope: backendEnquiry.project_deliverables,
        priority: data.priority || 'medium',
        department_id: data.department_id,
        department: undefined,
        assigned_department: data.assigned_department,
        estimated_budget: data.estimated_budget
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
      // Use client service API for updating enquiries
      const updateData = {
        date_received: data.date_received,
        expected_delivery_date: data.expected_delivery_date,
        client_name: data.client_name,
        project_name: data.project_name || data.title,
        project_deliverables: data.project_deliverables || data.description,
        contact_person: data.contact_person,
        status: data.status,
        assigned_po: data.assigned_po,
        follow_up_notes: data.follow_up_notes,
        venue: data.venue,
        site_survey_skipped: data.site_survey_skipped,
        site_survey_skip_reason: data.site_survey_skip_reason
      }

      const response = await api.put(`/api/clientservice/enquiries/${id}`, updateData)
      const updatedBackendEnquiry = response.data.data

      // Map to projects module format
      const updatedEnquiry: Enquiry = {
        // Core fields from client service
        id: updatedBackendEnquiry.id,
        date_received: updatedBackendEnquiry.date_received,
        expected_delivery_date: updatedBackendEnquiry.expected_delivery_date,
        client_name: updatedBackendEnquiry.client_name,
        project_name: updatedBackendEnquiry.project_name,
        project_deliverables: updatedBackendEnquiry.project_deliverables,
        contact_person: updatedBackendEnquiry.contact_person,
        status: updatedBackendEnquiry.status,
        assigned_po: updatedBackendEnquiry.assigned_po,
        follow_up_notes: updatedBackendEnquiry.follow_up_notes,
        project_id: updatedBackendEnquiry.project_id,
        enquiry_number: updatedBackendEnquiry.enquiry_number,
        converted_to_project_id: updatedBackendEnquiry.converted_to_project_id,
        venue: updatedBackendEnquiry.venue,
        site_survey_skipped: updatedBackendEnquiry.site_survey_skipped,
        site_survey_skip_reason: updatedBackendEnquiry.site_survey_skip_reason,
        created_by: updatedBackendEnquiry.created_by,
        created_by_user: updatedBackendEnquiry.created_by_user,
        created_at: updatedBackendEnquiry.created_at,
        updated_at: updatedBackendEnquiry.updated_at,

        // Legacy fields for backward compatibility
        client_id: updatedBackendEnquiry.client_id || undefined,
        client: updatedBackendEnquiry.client || undefined,
        title: updatedBackendEnquiry.project_name,
        description: updatedBackendEnquiry.project_deliverables,
        project_scope: updatedBackendEnquiry.project_deliverables,
        priority: data.priority || 'medium',
        department_id: data.department_id,
        department: undefined,
        assigned_department: data.assigned_department,
        estimated_budget: data.estimated_budget
      }

      // Update the enquiry in the local array
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
