// src/modules/production/composables/useWorkOrders.ts
import { ref, computed } from 'vue'
import type { WorkOrder } from '../types'

// Mock data for development
const mockWorkOrders: WorkOrder[] = [
  {
    id: 1,
    project_id: 1,
    title: 'Furniture Production - Living Room Set',
    description: 'Production of 3-seater sofa, 2 armchairs, and coffee table',
    status: 'in_progress',
    priority: 'high',
    start_date: '2023-06-01',
    due_date: '2023-06-30',
    created_at: '2023-05-20T10:00:00Z',
    updated_at: '2023-05-20T10:00:00Z',
    project: {
      id: 1,
      title: 'Luxury Apartment - Phase 1',
      client: {
        id: 1,
        name: 'Premium Living Ltd'
      }
    }
  },
  // Add more mock data as needed
]

const workOrders = ref<WorkOrder[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentWorkOrder = ref<WorkOrder | null>(null)

export function useWorkOrders() {
  const fetchWorkOrders = async (filters: {
    status?: string
    priority?: string
    project_id?: number
  } = {}) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, this would be an API call:
      // const response = await api.get('/api/production/work-orders', { params: filters })
      // workOrders.value = response.data
      
      // For now, filter the mock data
      let result = [...mockWorkOrders]
      
      if (filters.status) {
        result = result.filter(wo => wo.status === filters.status)
      }
      
      if (filters.priority) {
        result = result.filter(wo => wo.priority === filters.priority)
      }
      
      if (filters.project_id) {
        result = result.filter(wo => wo.project_id === filters.project_id)
      }
      
      workOrders.value = result
    } catch (err) {
      error.value = 'Failed to fetch work orders'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchWorkOrderById = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // In a real app:
      // const response = await api.get(`/api/production/work-orders/${id}`)
      // currentWorkOrder.value = response.data
      
      // Mock implementation
      const workOrder = mockWorkOrders.find(wo => wo.id === id)
      if (workOrder) {
        currentWorkOrder.value = { ...workOrder }
      } else {
        throw new Error('Work order not found')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch work order'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createWorkOrder = async (data: Omit<WorkOrder, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app:
      // const response = await api.post('/api/production/work-orders', data)
      // const newWorkOrder = response.data
      // workOrders.value = [newWorkOrder, ...workOrders.value]
      // return newWorkOrder
      
      // Mock implementation
      const newWorkOrder: WorkOrder = {
        ...data,
        id: Math.max(0, ...mockWorkOrders.map(wo => wo.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      mockWorkOrders.unshift(newWorkOrder)
      workOrders.value = [newWorkOrder, ...workOrders.value]
      return newWorkOrder
    } catch (err) {
      error.value = 'Failed to create work order'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWorkOrder = async (id: number, data: Partial<WorkOrder>) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app:
      // const response = await api.put(`/api/production/work-orders/${id}`, data)
      // const updatedWorkOrder = response.data
      // workOrders.value = workOrders.value.map(wo => 
      //   wo.id === id ? updatedWorkOrder : wo
      // )
      // return updatedWorkOrder
      
      // Mock implementation
      const index = mockWorkOrders.findIndex(wo => wo.id === id)
      if (index === -1) {
        throw new Error('Work order not found')
      }
      
      const updatedWorkOrder = {
        ...mockWorkOrders[index],
        ...data,
        updated_at: new Date().toISOString()
      }
      
      mockWorkOrders[index] = updatedWorkOrder
      workOrders.value = workOrders.value.map(wo => 
        wo.id === id ? updatedWorkOrder : wo
      )
      
      if (currentWorkOrder.value?.id === id) {
        currentWorkOrder.value = updatedWorkOrder
      }
      
      return updatedWorkOrder
    } catch (err) {
      error.value = 'Failed to update work order'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWorkOrder = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // In a real app:
      // await api.delete(`/api/production/work-orders/${id}`)
      // workOrders.value = workOrders.value.filter(wo => wo.id !== id)
      
      // Mock implementation
      const index = mockWorkOrders.findIndex(wo => wo.id === id)
      if (index === -1) {
        throw new Error('Work order not found')
      }
      
      mockWorkOrders.splice(index, 1)
      workOrders.value = workOrders.value.filter(wo => wo.id !== id)
      
      if (currentWorkOrder.value?.id === id) {
        currentWorkOrder.value = null
      }
    } catch (err) {
      error.value = 'Failed to delete work order'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    workOrders: computed(() => workOrders.value),
    currentWorkOrder: computed(() => currentWorkOrder.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchWorkOrders,
    fetchWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
  }
}