import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  WorkflowTemplate,
  WorkflowInstance,
  WorkflowTask
} from '@/modules/projects/types/workflow'

export const useWorkflowStore = defineStore('workflow', () => {
  // State
  const workflowTemplates = ref<WorkflowTemplate[]>([])
  const workflowInstances = ref<WorkflowInstance[]>([])
  const workflowTasks = ref<WorkflowTask[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeWorkflowTemplates = computed(() =>
    workflowTemplates.value.filter(template => template.is_active)
  )

  const pendingWorkflowInstances = computed(() =>
    workflowInstances.value.filter(instance => instance.status === 'pending')
  )

  const inProgressWorkflowInstances = computed(() =>
    workflowInstances.value.filter(instance => instance.status === 'in_progress')
  )

  const completedWorkflowInstances = computed(() =>
    workflowInstances.value.filter(instance => instance.status === 'completed')
  )

  const pendingWorkflowTasks = computed(() =>
    workflowTasks.value.filter(task => task.status === 'pending')
  )

  const inProgressWorkflowTasks = computed(() =>
    workflowTasks.value.filter(task => task.status === 'in_progress')
  )

  const completedWorkflowTasks = computed(() =>
    workflowTasks.value.filter(task => task.status === 'completed')
  )

  const getWorkflowTemplateById = computed(() => (id: number) =>
    workflowTemplates.value.find(template => template.id === id)
  )

  const getWorkflowInstanceById = computed(() => (id: number) =>
    workflowInstances.value.find(instance => instance.id === id)
  )

  const getWorkflowTaskById = computed(() => (id: number) =>
    workflowTasks.value.find(task => task.id === id)
  )

  // Actions
  const setWorkflowTemplates = (templates: WorkflowTemplate[]) => {
    workflowTemplates.value = templates
  }

  const addWorkflowTemplate = (template: WorkflowTemplate) => {
    workflowTemplates.value.push(template)
  }

  const updateWorkflowTemplate = (updatedTemplate: WorkflowTemplate) => {
    const index = workflowTemplates.value.findIndex(t => t.id === updatedTemplate.id)
    if (index !== -1) {
      workflowTemplates.value[index] = updatedTemplate
    }
  }

  const removeWorkflowTemplate = (id: number) => {
    const index = workflowTemplates.value.findIndex(t => t.id === id)
    if (index !== -1) {
      workflowTemplates.value.splice(index, 1)
    }
  }

  const setWorkflowInstances = (instances: WorkflowInstance[]) => {
    workflowInstances.value = instances
  }

  const addWorkflowInstance = (instance: WorkflowInstance) => {
    workflowInstances.value.push(instance)
  }

  const updateWorkflowInstance = (updatedInstance: WorkflowInstance) => {
    const index = workflowInstances.value.findIndex(i => i.id === updatedInstance.id)
    if (index !== -1) {
      workflowInstances.value[index] = updatedInstance
    }
  }

  const removeWorkflowInstance = (id: number) => {
    const index = workflowInstances.value.findIndex(i => i.id === id)
    if (index !== -1) {
      workflowInstances.value.splice(index, 1)
    }
  }

  const setWorkflowTasks = (tasks: WorkflowTask[]) => {
    workflowTasks.value = tasks
  }

  const addWorkflowTask = (task: WorkflowTask) => {
    workflowTasks.value.push(task)
  }

  const updateWorkflowTask = (updatedTask: WorkflowTask) => {
    const index = workflowTasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      workflowTasks.value[index] = updatedTask
    }
  }

  const removeWorkflowTask = (id: number) => {
    const index = workflowTasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      workflowTasks.value.splice(index, 1)
    }
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (value: string | null) => {
    error.value = value
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    workflowTemplates,
    workflowInstances,
    workflowTasks,
    loading,
    error,

    // Getters
    activeWorkflowTemplates,
    pendingWorkflowInstances,
    inProgressWorkflowInstances,
    completedWorkflowInstances,
    pendingWorkflowTasks,
    inProgressWorkflowTasks,
    completedWorkflowTasks,
    getWorkflowTemplateById,
    getWorkflowInstanceById,
    getWorkflowTaskById,

    // Actions
    setWorkflowTemplates,
    addWorkflowTemplate,
    updateWorkflowTemplate,
    removeWorkflowTemplate,
    setWorkflowInstances,
    addWorkflowInstance,
    updateWorkflowInstance,
    removeWorkflowInstance,
    setWorkflowTasks,
    addWorkflowTask,
    updateWorkflowTask,
    removeWorkflowTask,
    setLoading,
    setError,
    clearError
  }
})
