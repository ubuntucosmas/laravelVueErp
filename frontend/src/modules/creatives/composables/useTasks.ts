import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import type { CreativeTask, TaskFilter, TaskStats, TaskComment, TaskAssignment } from '../types'

export function useTasks() {
  const tasks = ref<CreativeTask[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all tasks with optional filtering
  const fetchTasks = async (filters?: TaskFilter) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      if (filters) {
        if (filters.status?.length) params.append('status', filters.status.join(','))
        if (filters.task_type?.length) params.append('task_type', filters.task_type.join(','))
        if (filters.priority?.length) params.append('priority', filters.priority.join(','))
        if (filters.assigned_to?.length) params.append('assigned_to', filters.assigned_to.join(','))
        if (filters.assigned_by?.length) params.append('assigned_by', filters.assigned_by.join(','))
        if (filters.enquiry_id?.length) params.append('enquiry_id', filters.enquiry_id.join(','))
        if (filters.date_from) params.append('date_from', filters.date_from)
        if (filters.date_to) params.append('date_to', filters.date_to)
      }

      const response = await axios.get(`/creatives/tasks?${params}`)
      tasks.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single task by ID
  const fetchTask = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`/creatives/tasks/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch task'
      console.error('Error fetching task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new task
  const createTask = async (taskData: Partial<CreativeTask>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/creatives/tasks', taskData)
      tasks.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create task'
      console.error('Error creating task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update task
  const updateTask = async (id: number, taskData: Partial<CreativeTask>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/creatives/tasks/${id}`, taskData)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      console.error('Error updating task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete task
  const deleteTask = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/creatives/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      console.error('Error deleting task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Assign task to designer
  const assignTask = async (taskId: number, designerId: number, notes?: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`/creatives/tasks/${taskId}/assign`, {
        assigned_to: designerId,
        notes
      })

      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to assign task'
      console.error('Error assigning task:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update task progress
  const updateProgress = async (taskId: number, progress: number, notes?: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/creatives/tasks/${taskId}/progress`, {
        progress_percentage: progress,
        notes
      })

      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update progress'
      console.error('Error updating progress:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add comment to task
  const addComment = async (taskId: number, comment: string, isInternal: boolean = false) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`/creatives/tasks/${taskId}/comments`, {
        comment,
        is_internal: isInternal
      })

      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        if (!tasks.value[index].comments) {
          tasks.value[index].comments = []
        }
        tasks.value[index].comments.push(response.data)
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add comment'
      console.error('Error adding comment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get task statistics
  const fetchTaskStats = async () => {
    try {
      const response = await axios.get('/creatives/tasks/stats')
      return response.data as TaskStats
    } catch (err: any) {
      console.error('Error fetching task stats:', err)
      throw err
    }
  }

  // Get tasks assigned to current user
  const fetchMyTasks = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/creatives/tasks/my-tasks')
      tasks.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch my tasks'
      console.error('Error fetching my tasks:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const pendingTasks = computed(() =>
    tasks.value.filter(t => t.status === 'pending')
  )

  const assignedTasks = computed(() =>
    tasks.value.filter(t => t.status === 'assigned')
  )

  const inProgressTasks = computed(() =>
    tasks.value.filter(t => t.status === 'in_progress')
  )

  const reviewTasks = computed(() =>
    tasks.value.filter(t => t.status === 'review')
  )

  const completedTasks = computed(() =>
    tasks.value.filter(t => t.status === 'completed')
  )

  const overdueTasks = computed(() =>
    tasks.value.filter(t => {
      if (!t.due_date || t.status === 'completed') return false
      return new Date(t.due_date) < new Date()
    })
  )

  const designTasks = computed(() =>
    tasks.value.filter(t => t.task_type === 'design')
  )

  const mockupTasks = computed(() =>
    tasks.value.filter(t => t.task_type === 'mockup')
  )

  const renderTasks = computed(() =>
    tasks.value.filter(t => t.task_type === 'render')
  )

  const materialTasks = computed(() =>
    tasks.value.filter(t => t.task_type === 'material_list')
  )

  return {
    // State
    tasks,
    loading,
    error,

    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    updateProgress,
    addComment,
    fetchTaskStats,
    fetchMyTasks,

    // Computed
    pendingTasks,
    assignedTasks,
    inProgressTasks,
    reviewTasks,
    completedTasks,
    overdueTasks,
    designTasks,
    mockupTasks,
    renderTasks,
    materialTasks
  }
}
