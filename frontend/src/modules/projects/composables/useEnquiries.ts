import { ref, computed } from 'vue'
import type { Enquiry, CreateEnquiryData, UpdateEnquiryData } from '../types'
import api from '@/plugins/axios'

const enquiries = ref<Enquiry[]>([])
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
      // Fetch from projects API
      const response = await api.get('/api/projects/enquiries', { params: filters })
      const clientServiceEnquiries = response.data.data.data || []

      // Map enquiries to projects module format
      const mappedEnquiries: Enquiry[] = clientServiceEnquiries.map((enquiry: any) => ({
        id: enquiry.id,
        date_received: enquiry.date_received,
        expected_delivery_date: enquiry.expected_delivery_date,
        client_id: enquiry.client_id,
        client: enquiry.client,
        title: enquiry.title,
        description: enquiry.description,
        project_scope: enquiry.project_scope,
        priority: enquiry.priority,
        status: enquiry.status,
        department_id: enquiry.department_id,
        assigned_department: enquiry.assigned_department,
        project_deliverables: enquiry.project_deliverables,
        contact_person: enquiry.contact_person,
        assigned_po: enquiry.assigned_po,
        follow_up_notes: enquiry.follow_up_notes,
        enquiry_number: enquiry.enquiry_number,
        converted_to_project_id: enquiry.converted_to_project_id,
        venue: enquiry.venue,
        site_survey_skipped: enquiry.site_survey_skipped,
        site_survey_skip_reason: enquiry.site_survey_skip_reason,
        quote_approved: enquiry.quote_approved,
        quote_approved_at: enquiry.quote_approved_at,
        quote_approved_by: enquiry.quote_approved_by,
        created_by: enquiry.created_by
      }))

      enquiries.value = mappedEnquiries
    } catch (err) {
      error.value = 'Failed to fetch enquiries'
      console.error('Error fetching enquiries:', err)
      enquiries.value = []
    } finally {
      loading.value = false
    }
  }

  const getEnquiry = (id: number): Enquiry | undefined => {
    return enquiries.value.find(enquiry => enquiry.id === id)
  }

  const createEnquiry = async (data: CreateEnquiryData): Promise<Enquiry> => {
    loading.value = true
    error.value = null

    try {
      // Use projects API for creating enquiries
      const response = await api.post('/api/projects/enquiries', {
        date_received: data.date_received || new Date().toISOString().split('T')[0],
        expected_delivery_date: data.expected_delivery_date,
        client_id: data.client_id,
        title: data.title,
        description: data.description,
        project_scope: data.project_scope,
        priority: data.priority,
        status: data.status || 'enquiry_logged',
        department_id: data.department_id,
        assigned_department: data.assigned_department,
        project_deliverables: data.project_deliverables,
        contact_person: data.contact_person,
        assigned_po: data.assigned_po,
        follow_up_notes: data.follow_up_notes,
        venue: data.venue,
        site_survey_skipped: data.site_survey_skipped || false,
        site_survey_skip_reason: data.site_survey_skip_reason
      })

      const backendEnquiry = response.data.data

      // Map to projects module format
      const newEnquiry: Enquiry = {
        id: backendEnquiry.id,
        date_received: backendEnquiry.date_received,
        expected_delivery_date: backendEnquiry.expected_delivery_date,
        client_id: backendEnquiry.client_id,
        client: backendEnquiry.client,
        title: backendEnquiry.title,
        description: backendEnquiry.description,
        project_scope: backendEnquiry.project_scope,
        priority: backendEnquiry.priority,
        status: backendEnquiry.status,
        department_id: backendEnquiry.department_id,
        assigned_department: backendEnquiry.assigned_department,
        project_deliverables: backendEnquiry.project_deliverables,
        contact_person: backendEnquiry.contact_person,
        assigned_po: backendEnquiry.assigned_po,
        follow_up_notes: backendEnquiry.follow_up_notes,
        enquiry_number: backendEnquiry.enquiry_number,
        converted_to_project_id: backendEnquiry.converted_to_project_id,
        venue: backendEnquiry.venue,
        site_survey_skipped: backendEnquiry.site_survey_skipped,
        site_survey_skip_reason: backendEnquiry.site_survey_skip_reason,
        quote_approved: backendEnquiry.quote_approved,
        quote_approved_at: backendEnquiry.quote_approved_at,
        quote_approved_by: backendEnquiry.quote_approved_by,
        created_by: backendEnquiry.created_by
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
      // Use projects API for updating enquiries
      const updateData = {
        date_received: data.date_received,
        expected_delivery_date: data.expected_delivery_date,
        client_id: data.client_id,
        title: data.title,
        description: data.description,
        project_scope: data.project_scope,
        priority: data.priority,
        status: data.status,
        department_id: data.department_id,
        assigned_department: data.assigned_department,
        project_deliverables: data.project_deliverables,
        contact_person: data.contact_person,
        assigned_po: data.assigned_po,
        follow_up_notes: data.follow_up_notes,
        venue: data.venue,
        site_survey_skipped: data.site_survey_skipped,
        site_survey_skip_reason: data.site_survey_skip_reason
      }

      const response = await api.put(`/api/projects/enquiries/${id}`, updateData)
      const updatedBackendEnquiry = response.data.data

      // Map to projects module format
      const updatedEnquiry: Enquiry = {
        id: updatedBackendEnquiry.id,
        date_received: updatedBackendEnquiry.date_received,
        expected_delivery_date: updatedBackendEnquiry.expected_delivery_date,
        client_id: updatedBackendEnquiry.client_id,
        client: updatedBackendEnquiry.client,
        title: updatedBackendEnquiry.title,
        description: updatedBackendEnquiry.description,
        project_scope: updatedBackendEnquiry.project_scope,
        priority: updatedBackendEnquiry.priority,
        status: updatedBackendEnquiry.status,
        department_id: updatedBackendEnquiry.department_id,
        assigned_department: updatedBackendEnquiry.assigned_department,
        project_deliverables: updatedBackendEnquiry.project_deliverables,
        contact_person: updatedBackendEnquiry.contact_person,
        assigned_po: updatedBackendEnquiry.assigned_po,
        follow_up_notes: updatedBackendEnquiry.follow_up_notes,
        enquiry_number: updatedBackendEnquiry.enquiry_number,
        converted_to_project_id: updatedBackendEnquiry.converted_to_project_id,
        venue: updatedBackendEnquiry.venue,
        site_survey_skipped: updatedBackendEnquiry.site_survey_skipped,
        site_survey_skip_reason: updatedBackendEnquiry.site_survey_skip_reason,
        quote_approved: updatedBackendEnquiry.quote_approved,
        quote_approved_at: updatedBackendEnquiry.quote_approved_at,
        quote_approved_by: updatedBackendEnquiry.quote_approved_by,
        created_by: updatedBackendEnquiry.created_by
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
