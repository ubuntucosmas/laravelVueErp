import { ref, computed } from 'vue'
import type { Client, CreateClientData, UpdateClientData } from '../types'

// Import shared dummy data from ClientService module
import { dummyClients } from '../../clientService/composables/useClients'

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
