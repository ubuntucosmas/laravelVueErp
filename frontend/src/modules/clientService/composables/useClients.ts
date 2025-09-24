import { ref, computed } from 'vue'
import type { Client, CreateClientData, UpdateClientData } from '../types/client'
import api from '@/plugins/axios'

const clients = ref<Client[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useClients() {
  const getErrorMessage = (err: any): string => {
    if (!err.response) {
      return "Network error. Please check your connection.";
    }
    switch (err.response.status) {
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "Access denied.";
      case 404:
        return "Clients not found.";
      case 422:
        return "Validation error.";
      case 500:
        return "Server error.";
      default:
        return `Failed to fetch clients: ${err.response.status}`;
    }
  }

  const fetchClients = async (filters?: { search?: string; status?: string }) => {
    loading.value = true
    error.value = null

    if (!localStorage.getItem('auth_token')) {
      error.value = "Authentication required. Please log in.";
      loading.value = false;
      return;
    }

    console.log('Fetching clients with token:', localStorage.getItem('auth_token'))

    try {
      const response = await api.get('/api/clientservice/clients', { params: filters })
      const backendClients = response.data.data?.data || response.data.data || response.data

      const mappedClients: Client[] = backendClients.map((backendClient: any) => ({
        id: backendClient.id,
        FullName: backendClient.full_name,
        ContactPerson: backendClient.contact_person,
        Email: backendClient.email,
        Phone: backendClient.phone,
        AltContact: backendClient.alt_contact,
        Address: backendClient.address,
        City: backendClient.city,
        County: backendClient.county,
        PostalAddress: backendClient.postal_address,
        CustomerType: backendClient.customer_type,
        LeadSource: backendClient.lead_source,
        PreferredContact: backendClient.preferred_contact,
        Industry: backendClient.industry,
        companyName: backendClient.company_name,
        isActive: backendClient.is_active,
        registration_date: backendClient.registration_date,
        status: backendClient.status,
        created_at: backendClient.created_at,
        updated_at: backendClient.updated_at
      }))

      clients.value = mappedClients
    } catch (err: any) {
      error.value = getErrorMessage(err)
      console.error('Error fetching clients:', err)
      console.log('Error details:', err.response?.status, err.response?.data)
    } finally {
      loading.value = false
    }
  }

  const getClient = (id: number): Client | undefined => {
    return clients.value.find(client => client.id === id)
  }

  const fetchClient = async (id: number): Promise<Client> => {
    loading.value = true
    error.value = null

    if (!localStorage.getItem('auth_token')) {
      error.value = "Authentication required. Please log in.";
      loading.value = false;
      throw new Error("Authentication required. Please log in.");
    }

    try {
      const response = await api.get(`/api/clientservice/clients/${id}`)
      const backendClient = response.data.data

      const mappedClient: Client = {
        id: backendClient.id,
        FullName: backendClient.full_name,
        ContactPerson: backendClient.contact_person,
        Email: backendClient.email,
        Phone: backendClient.phone,
        AltContact: backendClient.alt_contact,
        Address: backendClient.address,
        City: backendClient.city,
        County: backendClient.county,
        PostalAddress: backendClient.postal_address,
        CustomerType: backendClient.customer_type,
        LeadSource: backendClient.lead_source,
        PreferredContact: backendClient.preferred_contact,
        Industry: backendClient.industry,
        companyName: backendClient.company_name,
        isActive: backendClient.is_active,
        registration_date: backendClient.registration_date,
        status: backendClient.status,
        created_at: backendClient.created_at,
        updated_at: backendClient.updated_at
      }

      return mappedClient
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createClient = async (data: CreateClientData): Promise<Client> => {
    loading.value = true
    error.value = null

    if (!localStorage.getItem('auth_token')) {
      error.value = "Authentication required. Please log in.";
      loading.value = false;
      throw new Error("Authentication required. Please log in.");
    }

    try {
      const mappedData = {
        full_name: data.FullName,
        contact_person: data.ContactPerson,
        email: data.Email,
        phone: data.Phone,
        alt_contact: data.AltContact,
        address: data.Address,
        city: data.City,
        county: data.County,
        postal_address: data.PostalAddress,
        customer_type: data.CustomerType,
        lead_source: data.LeadSource,
        preferred_contact: data.PreferredContact,
        industry: data.Industry,
        registration_date: new Date().toISOString().split('T')[0]
      }

      const response = await api.post('/api/clientservice/clients', mappedData)
      const backendClient = response.data.data

      // Map back to frontend camelCase
      const newClient: Client = {
        id: backendClient.id,
        FullName: backendClient.full_name,
        ContactPerson: backendClient.contact_person,
        Email: backendClient.email,
        Phone: backendClient.phone,
        AltContact: backendClient.alt_contact,
        Address: backendClient.address,
        City: backendClient.city,
        County: backendClient.county,
        PostalAddress: backendClient.postal_address,
        CustomerType: backendClient.customer_type,
        LeadSource: backendClient.lead_source,
        PreferredContact: backendClient.preferred_contact,
        Industry: backendClient.industry,
        companyName: backendClient.company_name,
        isActive: backendClient.is_active,
        registration_date: backendClient.registration_date,
        status: backendClient.status,
        created_at: backendClient.created_at,
        updated_at: backendClient.updated_at
      }

      clients.value.push(newClient)
      return newClient
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id: number, data: UpdateClientData): Promise<Client> => {
    loading.value = true
    error.value = null

    if (!localStorage.getItem('auth_token')) {
      error.value = "Authentication required. Please log in.";
      loading.value = false;
      throw new Error("Authentication required. Please log in.");
    }

    try {
      // Get the existing client to preserve registration_date
      const existingClient = clients.value.find(client => client.id === id)
      if (!existingClient) {
        throw new Error('Client not found')
      }

      const mappedData = {
        full_name: data.FullName,
        contact_person: data.ContactPerson,
        email: data.Email,
        phone: data.Phone,
        alt_contact: data.AltContact,
        address: data.Address,
        city: data.City,
        county: data.County,
        postal_address: data.PostalAddress,
        customer_type: data.CustomerType,
        lead_source: data.LeadSource,
        preferred_contact: data.PreferredContact,
        industry: data.Industry,
        company_name: data.companyName,
        registration_date: existingClient.registration_date
      }

      const response = await api.put(`/api/clientservice/clients/${id}`, mappedData)
      const backendClient = response.data.data

      // Map back to frontend camelCase
      const updatedClient: Client = {
        id: backendClient.id,
        FullName: backendClient.full_name,
        ContactPerson: backendClient.contact_person,
        Email: backendClient.email,
        Phone: backendClient.phone,
        AltContact: backendClient.alt_contact,
        Address: backendClient.address,
        City: backendClient.city,
        County: backendClient.county,
        PostalAddress: backendClient.postal_address,
        CustomerType: backendClient.customer_type,
        LeadSource: backendClient.lead_source,
        PreferredContact: backendClient.preferred_contact,
        Industry: backendClient.industry,
        companyName: backendClient.company_name,
        isActive: backendClient.is_active,
        registration_date: backendClient.registration_date,
        status: backendClient.status,
        created_at: backendClient.created_at,
        updated_at: backendClient.updated_at
      }

      const index = clients.value.findIndex(client => client.id === id)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }

      return updatedClient
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteClient = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = clients.value.findIndex(client => client.id === id)
      if (index === -1) {
        throw new Error('Client not found')
      }

      clients.value.splice(index, 1)
    } catch (err) {
      error.value = 'Failed to delete client'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleClientStatus = async (clientId: number): Promise<Client> => {
    loading.value = true
    error.value = null

    if (!localStorage.getItem('auth_token')) {
      error.value = "Authentication required. Please log in.";
      loading.value = false;
      throw new Error("Authentication required. Please log in.");
    }

    try {
      const response = await api.patch(`/api/clientservice/clients/${clientId}/toggle-status`)
      const backendClient = response.data.data

      const updatedClient: Client = {
        id: backendClient.id,
        FullName: backendClient.full_name,
        ContactPerson: backendClient.contact_person,
        Email: backendClient.email,
        Phone: backendClient.phone,
        AltContact: backendClient.alt_contact,
        Address: backendClient.address,
        City: backendClient.city,
        County: backendClient.county,
        PostalAddress: backendClient.postal_address,
        CustomerType: backendClient.customer_type,
        LeadSource: backendClient.lead_source,
        PreferredContact: backendClient.preferred_contact,
        Industry: backendClient.industry,
        companyName: backendClient.company_name,
        isActive: backendClient.is_active,
        registration_date: backendClient.registration_date,
        status: backendClient.status,
        created_at: backendClient.created_at,
        updated_at: backendClient.updated_at
      }

      const index = clients.value.findIndex(client => client.id === clientId)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }

      return updatedClient
    } catch (err: any) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const activeClients = computed(() => clients.value.filter(client => client.isActive))
  const totalClients = computed(() => clients.value.length)

  return {
    clients,
    loading,
    error,
    fetchClients,
    getClient,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
    activeClients,
    totalClients
  }
}
