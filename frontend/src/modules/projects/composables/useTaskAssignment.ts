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

    try {
      const response = await api.get(`/api/projects/enquiries/${enquiryId}/tasks`)
      enquiryTasks.value = response.data.data || []
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

  const assignTask = async (taskId: number, assignmentData: TaskAssignmentData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/api/projects/enquiry-tasks/${taskId}/assign`, assignmentData)
      const updatedTask = response.data.data

      // Update the task in the local array
      const index = enquiryTasks.value.findIndex(task => task.id === taskId)
      if (index !== -1) {
        enquiryTasks.value[index] = { ...enquiryTasks.value[index], ...updatedTask }
      }

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
