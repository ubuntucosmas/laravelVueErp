import { ref, computed } from 'vue'

export interface WorkflowStep {
  id: string
  name: string
  description: string
  icon: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  isRequired: boolean
  order: number
  conditions?: WorkflowCondition[]
  actions?: WorkflowAction[]
  customFields?: CustomField[]
  dependencies?: string[]
  estimatedDuration?: number
  assignedRole?: string
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string | number | boolean
  logic: 'and' | 'or'
}

export interface WorkflowAction {
  type: 'notification' | 'email' | 'update_field' | 'create_task' | 'trigger_workflow'
  config: Record<string, string | number | boolean>
}

export interface CustomField {
  id: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox'
  label: string
  required: boolean
  options?: string[]
  validation?: Record<string, string | number | boolean>
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  steps: WorkflowStep[]
  isDefault: boolean
  applicableTo: string[]
}

export interface WorkflowConfig {
  id: string
  name: string
  description: string
  templateId: string
  customSteps: WorkflowStep[]
  customFields: CustomField[]
  automationRules: AutomationRule[]
  notifications: NotificationConfig[]
  integrations: IntegrationConfig[]
}

export interface AutomationRule {
  id: string
  trigger: 'status_change' | 'field_update' | 'time_based' | 'condition_met'
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  enabled: boolean
}

export interface NotificationConfig {
  id: string
  trigger: string
  recipients: string[]
  template: string
  channels: ('email' | 'in_app' | 'sms')[]
  enabled: boolean
}

export interface IntegrationConfig {
  id: string
  system: string
  endpoint: string
  auth: Record<string, string | number | boolean>
  mappings: Record<string, string>
  enabled: boolean
}

const workflowTemplates = ref<WorkflowTemplate[]>([
  {
    id: 'standard_enquiry',
    name: 'Standard Enquiry Workflow',
    description: 'Default workflow for general enquiries',
    category: 'enquiry',
    isDefault: true,
    applicableTo: ['enquiry'],
    steps: [
      {
        id: 'enquiry_logged',
        name: 'Enquiry Logged',
        description: 'Initial enquiry capture and logging',
        icon: 'clipboard-list',
        status: 'pending',
        isRequired: true,
        order: 1,
        estimatedDuration: 1,
        assignedRole: 'Client Service Officer'
      },
      {
        id: 'site_survey',
        name: 'Site Survey',
        description: 'On-site assessment and requirements gathering',
        icon: 'map-marker-alt',
        status: 'pending',
        isRequired: true,
        order: 2,
        estimatedDuration: 3,
        assignedRole: 'Survey Officer'
      },
      {
        id: 'design_concept',
        name: 'Design Concept',
        description: 'Creative design and concept development',
        icon: 'palette',
        status: 'pending',
        isRequired: true,
        order: 3,
        estimatedDuration: 7,
        assignedRole: 'Design Officer'
      },
      {
        id: 'material_specification',
        name: 'Material Specification',
        description: 'Detailed material requirements and specifications',
        icon: 'cogs',
        status: 'pending',
        isRequired: true,
        order: 4,
        estimatedDuration: 3,
        assignedRole: 'Procurement Officer'
      },
      {
        id: 'budget_quote',
        name: 'Budget & Quote',
        description: 'Cost calculation and quotation preparation',
        icon: 'calculator',
        status: 'pending',
        isRequired: true,
        order: 5,
        estimatedDuration: 4,
        assignedRole: 'Project Lead'
      },
      {
        id: 'quote_approval',
        name: 'Quote Approval',
        description: 'Client review and approval of quotation',
        icon: 'check-circle',
        status: 'pending',
        isRequired: true,
        order: 6,
        estimatedDuration: 2,
        assignedRole: 'Client'
      },
      {
        id: 'project_conversion',
        name: 'Project Conversion',
        description: 'Convert approved enquiry to active project',
        icon: 'rocket',
        status: 'pending',
        isRequired: true,
        order: 7,
        assignedRole: 'Project Manager'
      }
    ]
  },
  {
    id: 'exhibition_project',
    name: 'Exhibition Project Workflow',
    description: 'Specialized workflow for exhibition and event projects',
    category: 'project',
    isDefault: false,
    applicableTo: ['exhibition', 'event'],
    steps: [
      {
        id: 'client_briefing',
        name: 'Client Briefing & Requirements',
        description: 'Detailed client briefing and requirements gathering',
        icon: 'users',
        status: 'pending',
        isRequired: true,
        order: 1,
        estimatedDuration: 2,
        assignedRole: 'Project Lead'
      },
      {
        id: 'concept_design',
        name: 'Concept Design',
        description: 'Initial concept and design development',
        icon: 'lightbulb',
        status: 'pending',
        isRequired: true,
        order: 2,
        estimatedDuration: 5,
        assignedRole: 'Design Officer'
      },
      {
        id: 'technical_drawings',
        name: 'Technical Drawings',
        description: 'Detailed technical drawings and specifications',
        icon: 'drafting-compass',
        status: 'pending',
        isRequired: true,
        order: 3,
        estimatedDuration: 4,
        assignedRole: 'Technical Officer'
      },
      {
        id: 'material_procurement',
        name: 'Material Procurement',
        description: 'Sourcing and procurement of all required materials',
        icon: 'shopping-cart',
        status: 'pending',
        isRequired: true,
        order: 4,
        estimatedDuration: 7,
        assignedRole: 'Procurement Officer'
      },
      {
        id: 'production',
        name: 'Production & Assembly',
        description: 'Manufacturing and assembly of exhibition components',
        icon: 'cog',
        status: 'pending',
        isRequired: true,
        order: 5,
        estimatedDuration: 10,
        assignedRole: 'Production Manager'
      },
      {
        id: 'logistics',
        name: 'Logistics & Transportation',
        description: 'Planning and execution of transportation',
        icon: 'truck',
        status: 'pending',
        isRequired: true,
        order: 6,
        estimatedDuration: 3,
        assignedRole: 'Logistics Coordinator'
      },
      {
        id: 'installation',
        name: 'On-site Installation',
        description: 'Installation and setup at event venue',
        icon: 'tools',
        status: 'pending',
        isRequired: true,
        order: 7,
        estimatedDuration: 4,
        assignedRole: 'Installation Team'
      },
      {
        id: 'client_handover',
        name: 'Client Handover',
        description: 'Final handover and client sign-off',
        icon: 'handshake',
        status: 'pending',
        isRequired: true,
        order: 8,
        assignedRole: 'Project Lead'
      },
      {
        id: 'dismantle_return',
        name: 'Dismantle & Return',
        description: 'Post-event dismantle and equipment return',
        icon: 'undo',
        status: 'pending',
        isRequired: true,
        order: 9,
        estimatedDuration: 3,
        assignedRole: 'Operations Team'
      }
    ]
  }
])

const workflowConfigs = ref<WorkflowConfig[]>([])

export function useCustomWorkflow() {
  const currentWorkflow = ref<WorkflowStep[]>([])
  const workflowConfig = ref<WorkflowConfig | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load workflow template based on enquiry/project type
  const loadWorkflowTemplate = async (type: string, category: 'enquiry' | 'project' = 'enquiry') => {
    try {
      isLoading.value = true
      error.value = null

      const template = workflowTemplates.value.find(t =>
        t.category === category &&
        (t.applicableTo.includes(type) || t.isDefault)
      )

      if (!template) {
        throw new Error(`No workflow template found for type: ${type}`)
      }

      currentWorkflow.value = template.steps.map(step => ({ ...step }))
      return template
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load workflow template'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Customize workflow steps
  const customizeWorkflow = (customizations: Partial<WorkflowStep>[]) => {
    customizations.forEach(customization => {
      const stepIndex = currentWorkflow.value.findIndex(step => step.id === customization.id)
      if (stepIndex >= 0) {
        currentWorkflow.value[stepIndex] = {
          ...currentWorkflow.value[stepIndex],
          ...customization
        }
      }
    })
  }

  // Add custom step
  const addCustomStep = (step: WorkflowStep, position?: number) => {
    if (position !== undefined) {
      currentWorkflow.value.splice(position, 0, step)
    } else {
      currentWorkflow.value.push(step)
    }
    // Reorder steps
    currentWorkflow.value.forEach((s, index) => {
      s.order = index + 1
    })
  }

  // Remove custom step
  const removeCustomStep = (stepId: string) => {
    const index = currentWorkflow.value.findIndex(step => step.id === stepId)
    if (index >= 0 && !currentWorkflow.value[index].isRequired) {
      currentWorkflow.value.splice(index, 1)
      // Reorder remaining steps
      currentWorkflow.value.forEach((s, idx) => {
        s.order = idx + 1
      })
    }
  }

  // Reorder steps (for drag-and-drop)
  const reorderSteps = (newOrder: WorkflowStep[]) => {
    currentWorkflow.value = newOrder.map((step, index) => ({
      ...step,
      order: index + 1
    }))
  }

  // Update step status
  const updateStepStatus = (stepId: string, status: WorkflowStep['status']) => {
    const step = currentWorkflow.value.find(s => s.id === stepId)
    if (step) {
      step.status = status
      // Trigger automation rules
      checkAutomationRules(step)
    }
  }

  // Check automation rules
  const checkAutomationRules = (step: WorkflowStep) => {
    if (!workflowConfig.value?.automationRules) return

    workflowConfig.value.automationRules
      .filter(rule => rule.enabled)
      .forEach(rule => {
        if (shouldTriggerRule(rule, step)) {
          executeAutomationActions(rule.actions)
        }
      })
  }

  // Check if automation rule should trigger
  const shouldTriggerRule = (rule: AutomationRule, step: WorkflowStep): boolean => {
    if (rule.trigger === 'status_change') {
      return rule.conditions.some(condition =>
        evaluateCondition(condition, { field: 'status', value: step.status })
      )
    }
    return false
  }

  // Evaluate workflow condition
  const evaluateCondition = (condition: WorkflowCondition, context: { field: string, value: string | number | boolean }): boolean => {
    if (condition.field !== context.field) return false

    switch (condition.operator) {
      case 'equals':
        return context.value === condition.value
      case 'not_equals':
        return context.value !== condition.value
      case 'contains':
        return String(context.value).includes(String(condition.value))
      case 'greater_than':
        return Number(context.value) > Number(condition.value)
      case 'less_than':
        return Number(context.value) < Number(condition.value)
      default:
        return false
    }
  }

  // Execute automation actions
  const executeAutomationActions = (actions: WorkflowAction[]) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'notification':
          sendNotification(action.config)
          break
        case 'email':
          sendEmail(action.config)
          break
        case 'update_field':
          updateField(action.config)
          break
        case 'create_task':
          createTask(action.config)
          break
        case 'trigger_workflow':
          triggerWorkflow(action.config)
          break
      }
    })
  }

  // Placeholder functions for automation actions
  const sendNotification = (config: Record<string, string | number | boolean>) => {
    console.log('Sending notification:', config)
    // Implementation would integrate with notification system
  }

  const sendEmail = (config: Record<string, string | number | boolean>) => {
    console.log('Sending email:', config)
    // Implementation would integrate with email service
  }

  const updateField = (config: Record<string, string | number | boolean>) => {
    console.log('Updating field:', config)
    // Implementation would update relevant data
  }

  const createTask = (config: Record<string, string | number | boolean>) => {
    console.log('Creating task:', config)
    // Implementation would create task in task management system
  }

  const triggerWorkflow = (config: Record<string, string | number | boolean>) => {
    console.log('Triggering workflow:', config)
    // Implementation would trigger another workflow
  }

  // Get workflow progress
  const getWorkflowProgress = computed(() => {
    const totalSteps = currentWorkflow.value.length
    const completedSteps = currentWorkflow.value.filter(step => step.status === 'completed').length
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  })

  // Get next actionable step
  const getNextActionableStep = computed(() => {
    return currentWorkflow.value.find(step =>
      step.status === 'pending' &&
      step.dependencies?.every(depId =>
        currentWorkflow.value.find(s => s.id === depId)?.status === 'completed'
      )
    )
  })

  // Validate workflow configuration
  const validateWorkflow = (): { isValid: boolean, errors: string[] } => {
    const errors: string[] = []

    // Check for circular dependencies
    const hasCircularDeps = detectCircularDependencies()
    if (hasCircularDeps) {
      errors.push('Circular dependencies detected in workflow steps')
    }

    // Check required fields
    currentWorkflow.value.forEach(step => {
      if (!step.name || !step.id) {
        errors.push(`Step ${step.id} is missing required fields`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Detect circular dependencies
  const detectCircularDependencies = (): boolean => {
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const hasCycle = (stepId: string): boolean => {
      if (recursionStack.has(stepId)) return true
      if (visited.has(stepId)) return false

      visited.add(stepId)
      recursionStack.add(stepId)

      const step = currentWorkflow.value.find(s => s.id === stepId)
      if (step?.dependencies) {
        for (const dep of step.dependencies) {
          if (hasCycle(dep)) return true
        }
      }

      recursionStack.delete(stepId)
      return false
    }

    for (const step of currentWorkflow.value) {
      if (hasCycle(step.id)) return true
    }

    return false
  }

  // Save workflow configuration
  const saveWorkflowConfig = async (config: WorkflowConfig) => {
    try {
      isLoading.value = true
      error.value = null

      // Validate before saving
      const validation = validateWorkflow()
      if (!validation.isValid) {
        throw new Error(`Workflow validation failed: ${validation.errors.join(', ')}`)
      }

      // In a real app, this would save to backend
      workflowConfigs.value.push(config)
      workflowConfig.value = config

      return config
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to save workflow configuration'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Load workflow configuration
  const loadWorkflowConfig = async (configId: string) => {
    try {
      isLoading.value = true
      error.value = null

      const config = workflowConfigs.value.find(c => c.id === configId)
      if (!config) {
        throw new Error(`Workflow configuration not found: ${configId}`)
      }

      workflowConfig.value = config
      currentWorkflow.value = config.customSteps

      return config
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load workflow configuration'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    currentWorkflow,
    workflowConfig,
    workflowTemplates,
    workflowConfigs,
    isLoading,
    error,

    // Computed
    getWorkflowProgress,
    getNextActionableStep,

    // Methods
    loadWorkflowTemplate,
    customizeWorkflow,
    addCustomStep,
    removeCustomStep,
    reorderSteps,
    updateStepStatus,
    validateWorkflow,
    saveWorkflowConfig,
    loadWorkflowConfig,

    // Automation
    checkAutomationRules,
    executeAutomationActions
  }
}
