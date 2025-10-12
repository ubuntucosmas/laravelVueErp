import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project } from '@/modules/clientService/types/project'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeProjects = computed(() =>
    projects.value.filter(project => project.status === 'in_progress')
  )

  const completedProjects = computed(() =>
    projects.value.filter(project => project.status === 'completed')
  )

  const planningProjects = computed(() =>
    projects.value.filter(project => project.status === 'planning')
  )

  const totalProjects = computed(() => projects.value.length)

  const getProjectById = computed(() => (id: number) =>
    projects.value.find(project => project.id === id)
  )

  // Actions
  const setProjects = (newProjects: Project[]) => {
    projects.value = newProjects
  }

  const addProject = (project: Project) => {
    projects.value.push(project)
  }

  const updateProject = (updatedProject: Project) => {
    const index = projects.value.findIndex(p => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value[index] = updatedProject
    }
  }

  const removeProject = (id: number) => {
    const index = projects.value.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
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
    projects,
    loading,
    error,

    // Getters
    activeProjects,
    completedProjects,
    planningProjects,
    totalProjects,
    getProjectById,

    // Actions
    setProjects,
    addProject,
    updateProject,
    removeProject,
    setLoading,
    setError,
    clearError
  }
})
