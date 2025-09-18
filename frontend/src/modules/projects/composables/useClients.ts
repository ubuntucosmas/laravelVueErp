import { ref, computed } from 'vue'
import type { Client, CreateClientData, UpdateClientData } from '../types'

// Dummy data
const dummyClients: Client[] = [
  {
    id: 1,
    FullName: 'ABC Corporation Ltd',
    ContactPerson: 'John Doe',
    Email: 'contact@abc.com',
    Phone: '+254 700 123 456',
    AltContact: '+254 700 123 457',
    Address: '123 Business Avenue, Westlands',
    City: 'Nairobi',
    County: 'Nairobi',
    PostalAddress: 'P.O. Box 12345-00100',
    CustomerType: 'company',
    LeadSource: 'Website',
    PreferredContact: 'email',
    Industry: 'Technology',
    registration_date: '2024-01-15',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    FullName: 'XYZ Events Ltd',
    ContactPerson: 'Jane Smith',
    Email: 'info@xyz.com',
    Phone: '+254 711 987 654',
    AltContact: '+254 711 987 655',
    Address: '456 Event Plaza, Kilimani',
    City: 'Nairobi',
    County: 'Nairobi',
    PostalAddress: 'P.O. Box 67890-00200',
    CustomerType: 'company',
    LeadSource: 'Referral',
    PreferredContact: 'phone',
    Industry: 'Events',
    registration_date: '2024-02-20',
    status: 'active',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z'
  },
  {
    id: 3,
    FullName: 'Mike Johnson',
    ContactPerson: 'Mike Johnson',
    Email: 'mike.johnson@email.com',
    Phone: '+254 722 555 789',
    AltContact: '+254 722 555 790',
    Address: '789 Residential Road, Koinange',
    City: 'Kisumu',
    County: 'Kisumu',
    PostalAddress: 'P.O. Box 54321-40100',
    CustomerType: 'individual',
    LeadSource: 'Social Media',
    PreferredContact: 'email',
    Industry: 'Consulting',
    registration_date: '2024-03-10',
    status: 'inactive',
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-03-10T09:15:00Z'
  }
]

const clients = ref<Client[]>([...dummyClients])
const loading = ref(false)
const error = ref<string | null>(null)

export function useClients() {
  const fetchClients = async (filters?: { search?: string; status?: string }) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredClients = [...dummyClients]

      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filteredClients = filteredClients.filter(client =>
          client.FullName.toLowerCase().includes(search) ||
          client.Email.toLowerCase().includes(search) ||
          client.ContactPerson.toLowerCase().includes(search) ||
          client.Phone.includes(search) ||
          client.Industry?.toLowerCase().includes(search)
        )
      }

      if (filters?.status) {
        filteredClients = filteredClients.filter(client => client.status === filters.status)
      }

      clients.value = filteredClients
    } catch (err) {
      error.value = 'Failed to fetch clients'
      console.error('Error fetching clients:', err)
    } finally {
      loading.value = false
    }
  }

  const getClient = (id: number): Client | undefined => {
    return clients.value.find(client => client.id === id)
  }

  const createClient = async (data: CreateClientData): Promise<Client> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newClient: Client = {
        id: Math.max(...clients.value.map(c => c.id)) + 1,
        ...data,
        registration_date: new Date().toISOString().split('T')[0],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      clients.value.push(newClient)
      return newClient
    } catch (err) {
      error.value = 'Failed to create client'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateClient = async (id: number, data: UpdateClientData): Promise<Client> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = clients.value.findIndex(client => client.id === id)
      if (index === -1) {
        throw new Error('Client not found')
      }

      const updatedClient = {
        ...clients.value[index],
        ...data,
        updated_at: new Date().toISOString()
      }

      clients.value[index] = updatedClient
      return updatedClient
    } catch (err) {
      error.value = 'Failed to update client'
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

  const activeClients = computed(() => clients.value.filter(client => client.status === 'active'))
  const totalClients = computed(() => clients.value.length)

  return {
    clients,
    loading,
    error,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    activeClients,
    totalClients
  }
}