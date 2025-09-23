import { ref, computed } from 'vue'
import { useTasks } from './useTasks'
import type { Enquiry } from '../../projects/types'
import type { CreativeTask, CreateCreativeTaskData } from '../types/task'

export function useEnquiryIntegration() {
  const { tasks, createTask, fetchTasks } = useTasks()

  // Reactive state
  const isCreatingTasks = ref(false)
  const integrationError = ref<string | null>(null)

  // Computed properties
  const enquiryTasks = computed(() => {
    return tasks.value.filter(task => task.enquiry_id)
  })

  const getTasksForEnquiry = (enquiryId: number) => {
    return tasks.value.filter(task => task.enquiry_id === enquiryId)
  }

  const getTaskStatsForEnquiry = (enquiryId: number) => {
    const enquiryTasks = getTasksForEnquiry(enquiryId)
    return {
      total: enquiryTasks.length,
      pending: enquiryTasks.filter(task => task.status === 'pending').length,
      assigned: enquiryTasks.filter(task => task.status === 'assigned').length,
      inProgress: enquiryTasks.filter(task => task.status === 'in_progress').length,
      completed: enquiryTasks.filter(task => task.status === 'completed').length,
      approved: enquiryTasks.filter(task => task.status === 'approved').length
    }
  }

  // Methods
  const createTasksFromEnquiry = async (enquiry: Enquiry, assignedBy: number) => {
    isCreatingTasks.value = true
    integrationError.value = null

    try {
      const tasksToCreate: CreateCreativeTaskData[] = []

      // Create design task
      tasksToCreate.push({
        title: `Design Concept for ${enquiry.title}`,
        description: `Create design concept for enquiry: ${enquiry.description}`,
        enquiry_id: enquiry.id,
        task_type: 'design',
        priority: enquiry.priority,
        assigned_by: assignedBy,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        estimated_hours: 16,
        progress_percentage: 0,
        design_data: {
          design_type: 'concept',
          specifications: enquiry.project_scope,
          dimensions: {
            width: 0, // Will be specified by designer
            height: 0,
            unit: 'cm'
          },
          color_scheme: 'To be determined',
          style_preferences: 'Based on client requirements',
          reference_materials: []
        }
      })

      // Create mockup task
      tasksToCreate.push({
        title: `3D Mockup for ${enquiry.title}`,
        description: `Create 3D mockup for enquiry: ${enquiry.description}`,
        enquiry_id: enquiry.id,
        task_type: 'mockup',
        priority: enquiry.priority,
        assigned_by: assignedBy,
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
        estimated_hours: 12,
        progress_percentage: 0,
        mockup_data: {
          mockup_type: '3d',
          scale: 1,
          materials_needed: [],
          complexity_level: 'medium',
          presentation_format: 'digital'
        }
      })

      // Create render task
      tasksToCreate.push({
        title: `Photorealistic Render for ${enquiry.title}`,
        description: `Create photorealistic render for enquiry: ${enquiry.description}`,
        enquiry_id: enquiry.id,
        task_type: 'render',
        priority: enquiry.priority,
        assigned_by: assignedBy,
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 days from now
        estimated_hours: 8,
        progress_percentage: 0,
        render_data: {
          render_type: 'photorealistic',
          quality: 'high',
          output_format: 'image',
          resolution: {
            width: 1920,
            height: 1080
          },
          lighting_requirements: 'Natural lighting simulation',
          camera_angles: ['Front view', 'Side view', 'Top view']
        }
      })

      // Create material list task
      tasksToCreate.push({
        title: `Material List for ${enquiry.title}`,
        description: `Generate material list for enquiry: ${enquiry.description}`,
        enquiry_id: enquiry.id,
        task_type: 'material_list',
        priority: enquiry.priority,
        assigned_by: assignedBy,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
        estimated_hours: 6,
        progress_percentage: 0,
        material_data: {
          category_focus: 'both',
          budget_range: {
            min: (enquiry.estimated_budget || 100000) * 0.6,
            max: (enquiry.estimated_budget || 100000) * 1.2
          },
          preferred_suppliers: [],
          quality_requirements: 'Standard quality materials',
          timeline_requirements: 'Normal procurement timeline'
        }
      })

      // Create all tasks
      const createdTasks: CreativeTask[] = []
      for (const taskData of tasksToCreate) {
        const createdTask = await createTask(taskData)
        if (createdTask) {
          createdTasks.push(createdTask)
        }
      }

      return createdTasks
    } catch (error) {
      integrationError.value = error instanceof Error ? error.message : 'Failed to create tasks from enquiry'
      console.error('Error creating tasks from enquiry:', error)
      return []
    } finally {
      isCreatingTasks.value = false
    }
  }

  const getEnquiryProgress = (enquiryId: number) => {
    const tasks = getTasksForEnquiry(enquiryId)
    if (tasks.length === 0) return 0

    const completedTasks = tasks.filter(task => task.status === 'completed' || task.status === 'approved')
    return Math.round((completedTasks.length / tasks.length) * 100)
  }

  const canCreateTasks = (enquiry: Enquiry) => {
    // Can create tasks if enquiry is in appropriate status and no tasks exist yet
    const existingTasks = getTasksForEnquiry(enquiry.id)
    return (
      enquiry.status === 'site_survey_completed' ||
      enquiry.status === 'enquiry_logged'
    ) && existingTasks.length === 0
  }

  const canAccessCreatives = (enquiry: Enquiry) => {
    // Can access creatives if tasks exist or can be created
    const existingTasks = getTasksForEnquiry(enquiry.id)
    return existingTasks.length > 0 || canCreateTasks(enquiry)
  }

  return {
    // State
    isCreatingTasks,
    integrationError,

    // Computed
    enquiryTasks,
    getTasksForEnquiry,
    getTaskStatsForEnquiry,
    getEnquiryProgress,
    canCreateTasks,
    canAccessCreatives,

    // Methods
    createTasksFromEnquiry,
    fetchTasks
  }
}
