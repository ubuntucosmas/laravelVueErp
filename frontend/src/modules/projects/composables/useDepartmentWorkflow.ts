import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Enquiry } from '../types'

export interface DepartmentWorkflowConfig {
  department: string
  phase: 'survey' | 'materials' | 'budget' | 'project' | 'design_concept' | 'material_specification' | 'project_management' | 'procurement'
  title: string
  description: string
  permissions: string[]
  workflowStep?: number
  primaryAction?: string
  features?: string[]
}

export function useDepartmentWorkflow() {
  const router = useRouter()
  const route = useRoute()

  // Department-specific workflow configurations
  const workflowConfigs = ref<DepartmentWorkflowConfig[]>([
    {
      department: 'creatives',
      phase: 'design_concept',
      title: 'Design Concept Development',
      description: 'Creative concept creation and ideation',
      permissions: ['creatives.access', 'creatives.design.create'],
      workflowStep: 2,
      primaryAction: 'Create Design Concepts',
      features: ['Concept ideation', 'Mood boards', 'Design briefs']
    },
    {
      department: 'design',
      phase: 'material_specification',
      title: 'Material Specification & Planning',
      description: 'Material requirements and specifications',
      permissions: ['creatives.access', 'creatives.materials.manage'],
      workflowStep: 2,
      primaryAction: 'Specify Materials',
      features: ['Material lists', 'Cost estimation', 'Supplier coordination']
    },
    {
      department: 'survey',
      phase: 'survey',
      title: 'Site Survey & Assessment',
      description: 'Project site evaluation and requirements analysis',
      permissions: ['projects.survey.access', 'projects.survey.manage'],
      workflowStep: 1,
      primaryAction: 'Conduct Site Survey',
      features: ['Site assessment', 'Requirements gathering', 'Feasibility analysis']
    },
    {
      department: 'projects',
      phase: 'project_management',
      title: 'Project Management & Coordination',
      description: 'Overall project coordination and management',
      permissions: ['projects.manage', 'projects.convert'],
      workflowStep: 4,
      primaryAction: 'Manage Project',
      features: ['Timeline management', 'Resource allocation', 'Progress tracking']
    },
    {
      department: 'procurement',
      phase: 'procurement',
      title: 'Procurement & Vendor Management',
      description: 'Material procurement and vendor coordination',
      permissions: ['procurement.access', 'procurement.manage'],
      workflowStep: 3,
      primaryAction: 'Manage Procurement',
      features: ['Vendor selection', 'Purchase orders', 'Delivery tracking']
    }
  ])

  // Current workflow state
  const currentDepartment = ref<string>('')
  const currentPhase = ref<string>('')
  const currentEnquiry = ref<Enquiry | null>(null)
  const accessError = ref<string>('')

  // Computed properties
  const currentConfig = computed(() => {
    return workflowConfigs.value.find(config =>
      config.department === currentDepartment.value &&
      config.phase === currentPhase.value
    )
  })

  const canAccessCurrentWorkflow = computed(() => {
    if (!currentConfig.value) return false

    // Check if user has required permissions for this department workflow
    const requiredPermissions = currentConfig.value.permissions
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission))

    // Additional access control based on enquiry status and department
    if (currentEnquiry.value) {
      const enquiryStatus = currentEnquiry.value.status
      const departmentAccess = checkDepartmentAccess(currentDepartment.value, enquiryStatus)
      return hasAllPermissions && departmentAccess
    }

    return hasAllPermissions
  })

  const checkDepartmentAccess = (department: string, enquiryStatus: string): boolean => {
    const accessRules: Record<string, string[]> = {
      'creatives': ['enquiry_logged', 'site_survey_completed', 'design_completed'],
      'design': ['enquiry_logged', 'site_survey_completed', 'design_completed', 'materials_specified'],
      'survey': ['enquiry_logged', 'client_registered'],
      'procurement': ['materials_specified', 'design_completed', 'budget_created'],
      'projects': ['quote_approved', 'budget_created', 'converted_to_project']
    }

    const allowedStatuses = accessRules[department] || []
    return allowedStatuses.includes(enquiryStatus)
  }

  const phaseStepMapping = computed(() => {
    const mapping: Record<string, number> = {
      'survey': 1,
      'materials': 2,
      'budget': 3,
      'project': 4
    }
    return mapping
  })

  // Methods
  const initializeFromRoute = (enquiry: Enquiry) => {
    currentEnquiry.value = enquiry

    // Get department and phase from route query parameters
    const department = route.query.department as string
    const phase = route.query.phase as string

    if (department && phase) {
      currentDepartment.value = department
      currentPhase.value = phase

      // Validate access
      if (!canAccessCurrentWorkflow.value) {
        accessError.value = `Access denied to ${department} department workflow`
        return false
      }

      return true
    }

    // Default to general workflow if no specific department/phase
    currentDepartment.value = 'general'
    currentPhase.value = 'overview'
    return true
  }

  const navigateToDepartmentWorkflow = (enquiry: Enquiry, department: string, phase?: string) => {
    const config = workflowConfigs.value.find(c => c.department === department)
    if (!config) {
      accessError.value = `Invalid department: ${department}`
      return false
    }

    const targetPhase = phase || config.phase

    // Navigate to the specific workflow
    router.push(`/projects/enquiries/${enquiry.id}?department=${department}&phase=${targetPhase}`)
    return true
  }

  const getWorkflowStep = (phase: string): number => {
    return phaseStepMapping.value[phase] || 1
  }

  const getDepartmentFromEnquiry = (enquiry: Enquiry): string => {
    return enquiry.department?.name?.toLowerCase() ||
           enquiry.assigned_department?.toLowerCase() ||
           'general'
  }

  const updateEnquiryStatus = async (enquiry: Enquiry, status: string) => {
    // TODO: Implement API call to update enquiry status
    console.log(`Updating enquiry ${enquiry.id} status to: ${status}`)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update local enquiry object
    if (currentEnquiry.value && currentEnquiry.value.id === enquiry.id) {
      currentEnquiry.value.status = status as Enquiry['status']
    }
  }

  const completeDepartmentTask = async (enquiry: Enquiry, taskType: string) => {
    try {
      accessError.value = ''

      // Determine status based on task type and department
      let newStatus: Enquiry['status'] = enquiry.status

      if (currentDepartment.value === 'creatives' || currentDepartment.value === 'design') {
        if (taskType === 'materials') {
          newStatus = 'materials_specified'
        } else if (taskType === 'design') {
          newStatus = 'design_completed'
        }
      } else if (currentDepartment.value === 'survey') {
        newStatus = 'site_survey_completed'
      }

      await updateEnquiryStatus(enquiry, newStatus)

      // Navigate back to general workflow or next phase
      router.push(`/projects/enquiries/${enquiry.id}`)

      return true
    } catch (error) {
      accessError.value = `Failed to complete ${taskType} task: ${error}`
      return false
    }
  }

  const hasPermission = (permission: string): boolean => {
    // TODO: Implement actual permission checking based on user roles
    // For now, return true for demonstration
    console.log(`Checking permission: ${permission}`)
    return true
  }

  const getAvailablePhases = (enquiry: Enquiry): DepartmentWorkflowConfig[] => {
    const currentStatus = enquiry.status
    const availableConfigs: DepartmentWorkflowConfig[] = []

    workflowConfigs.value.forEach(config => {
      if (checkDepartmentAccess(config.department, currentStatus)) {
        availableConfigs.push(config)
      }
    })

    return availableConfigs
  }

  const getNextAvailablePhase = (enquiry: Enquiry, currentPhase?: string): DepartmentWorkflowConfig | null => {
    const availablePhases = getAvailablePhases(enquiry)
    const currentIndex = availablePhases.findIndex(p => p.phase === currentPhase)

    if (currentIndex >= 0 && currentIndex < availablePhases.length - 1) {
      return availablePhases[currentIndex + 1]
    }

    return null
  }

  const canAccessPhase = (enquiry: Enquiry, department: string, phase: string): boolean => {
    const config = workflowConfigs.value.find(c => c.department === department && c.phase === phase)
    if (!config) return false

    return checkDepartmentAccess(department, enquiry.status) && hasPermission(config.permissions[0])
  }

  const getPhaseProgress = (enquiry: Enquiry, department: string): number => {
    const config = workflowConfigs.value.find(c => c.department === department)
    if (!config) return 0

    // Calculate progress based on enquiry status and department
    const statusProgress: Record<string, number> = {
      'enquiry_logged': 10,
      'site_survey_completed': 25,
      'design_completed': 50,
      'materials_specified': 75,
      'budget_created': 85,
      'quote_approved': 95,
      'converted_to_project': 100
    }

    const baseProgress = statusProgress[enquiry.status] || 0

    // Adjust progress based on department-specific factors
    if (department === 'creatives' && enquiry.status === 'design_completed') {
      return 100
    } else if (department === 'design' && enquiry.status === 'materials_specified') {
      return 100
    }

    return Math.min(baseProgress, 90) // Cap at 90% until task completion
  }

  const clearError = () => {
    accessError.value = ''
  }

  return {
    // State
    currentDepartment,
    currentPhase,
    currentEnquiry,
    accessError,

    // Computed
    currentConfig,
    canAccessCurrentWorkflow,
    phaseStepMapping,

    // Methods
    initializeFromRoute,
    navigateToDepartmentWorkflow,
    getWorkflowStep,
    getDepartmentFromEnquiry,
    updateEnquiryStatus,
    completeDepartmentTask,
    hasPermission,
    clearError,
    getAvailablePhases,
    getNextAvailablePhase,
    canAccessPhase,
    getPhaseProgress,
    checkDepartmentAccess
  }
}
