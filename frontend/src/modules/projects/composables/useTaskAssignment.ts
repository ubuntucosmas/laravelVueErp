import { ref, computed } from 'vue'
import type { EnquiryTask, TaskAssignmentHistory } from '../types/enquiry'
import api from '@/plugins/axios'

export interface TaskAssignmentData {
  assigned_user_id: number
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  notes?: string
}

const enquiryTasks = ref<EnquiryTask[]>([])
const assignmentHistory = ref<TaskAssignmentHistory[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useTaskAssignment() {
  const fetchEnquiryTasks = async (enquiryId: number) => {
    loading.value = true
    error.value = null

    console.log('[DEBUG] fetchEnquiryTasks called with enquiryId:', enquiryId)

    try {
      const response = await api.get(`/api/projects/enquiries/${enquiryId}/tasks`)
      console.log('[DEBUG] fetchEnquiryTasks response:', response)
      console.log('[DEBUG] fetchEnquiryTasks response.data:', response.data)
      console.log('[DEBUG] fetchEnquiryTasks response.data.data:', response.data.data)
      enquiryTasks.value = response.data.data || []
      console.log('[DEBUG] fetchEnquiryTasks enquiryTasks.value set to:', enquiryTasks.value)
      return enquiryTasks.value
    } catch (err) {
      error.value = 'Failed to fetch enquiry tasks'
      console.error('Error fetching enquiry tasks:', err)
      enquiryTasks.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAllTasks = async (filters?: {
    search?: string
    status?: string
    priority?: string
    assigned_user_id?: number
    enquiry_id?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.priority) params.append('priority', filters.priority)
      if (filters?.assigned_user_id) params.append('assigned_user_id', filters.assigned_user_id.toString())
      if (filters?.enquiry_id) params.append('enquiry_id', filters.enquiry_id.toString())

      const queryString = params.toString()
      const url = `/api/projects/all-enquiry-tasks${queryString ? '?' + queryString : ''}`

      const response = await api.get(url)
      enquiryTasks.value = response.data.data || []
      return enquiryTasks.value
    } catch (err) {
      error.value = 'Failed to fetch all tasks'
      console.error('Error fetching all tasks:', err)
      enquiryTasks.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignTask = async (taskId: number, assignmentData: TaskAssignmentData) => {
    loading.value = true
    error.value = null

    try {
      // Convert to FormData to match backend expectations
      const formData = new FormData()
      formData.append('assigned_user_id', assignmentData.assigned_user_id.toString())
      if (assignmentData.priority) formData.append('priority', assignmentData.priority)
      if (assignmentData.due_date) formData.append('due_date', assignmentData.due_date)
      if (assignmentData.notes) formData.append('notes', assignmentData.notes)

      const response = await api.post(`/api/projects/enquiry-tasks/${taskId}/assign`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedTask = response.data.data

      // Note: Local array update removed - parent components handle their own state

      return updatedTask
    } catch (err) {
      error.value = 'Failed to assign task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (taskId: number, updateData: Partial<EnquiryTask>) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/tasks/${taskId}`, updateData)
      const updatedTask = response.data.data

      // Update the task in the local array
      const index = enquiryTasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        enquiryTasks.value[index] = { ...enquiryTasks.value[index], ...updatedTask }
      }

      return updatedTask
    } catch (err) {
      error.value = 'Failed to update task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAssignmentHistory = async (taskId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/api/projects/enquiry-tasks/${taskId}/assignment-history`)
      assignmentHistory.value = response.data.data || []
      return assignmentHistory.value
    } catch (err) {
      error.value = 'Failed to fetch assignment history'
      console.error('Error fetching assignment history:', err)
      assignmentHistory.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTaskById = (taskId: number): EnquiryTask | undefined => {
    return enquiryTasks.value.find(task => task.id === taskId)
  }

  const pendingTasks = computed(() =>
    enquiryTasks.value.filter(task => task.status === 'pending')
  )

  const inProgressTasks = computed(() =>
    enquiryTasks.value.filter(task => task.status === 'in_progress')
  )

  const completedTasks = computed(() =>
    enquiryTasks.value.filter(task => task.status === 'completed')
  )

  const tasksByPriority = computed(() => ({
    urgent: enquiryTasks.value.filter(task => task.priority === 'urgent'),
    high: enquiryTasks.value.filter(task => task.priority === 'high'),
    medium: enquiryTasks.value.filter(task => task.priority === 'medium'),
    low: enquiryTasks.value.filter(task => task.priority === 'low'),
  }))

  return {
    enquiryTasks,
    assignmentHistory,
    loading,
    error,
    fetchEnquiryTasks,
    fetchAllTasks,
    assignTask,
    updateTask,
    fetchAssignmentHistory,
    getTaskById,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    tasksByPriority,
  }
}
