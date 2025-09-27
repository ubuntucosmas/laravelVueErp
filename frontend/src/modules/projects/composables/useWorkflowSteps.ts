import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Enquiry, SiteSurvey, Quotation, Project, ProjectPhase } from '../types'
import { useEnquiries } from './useEnquiries'
import { useSiteSurveys } from './useSiteSurveys'
import { useEnquiryIntegration } from '../../creatives/composables'
import { useDepartmentWorkflow } from './useDepartmentWorkflow'

export function useWorkflowSteps() {
  const route = useRoute()
  const router = useRouter()
  const { enquiries } = useEnquiries()
  const { getSiteSurveyByEnquiry } = useSiteSurveys()
  const {
    canCreateTasks,
    canAccessCreatives,
    getEnquiryProgress,
    createTasksFromEnquiry,
    isCreatingTasks,
    integrationError,
    fetchTasks
  } = useEnquiryIntegration()
  const {
    initializeFromRoute,
    currentDepartment,
    currentPhase: departmentPhase,
    currentEnquiry: departmentEnquiry,
    accessError,
    canAccessCurrentWorkflow,
    currentConfig,
    completeDepartmentTask,
    clearError: clearDepartmentError
  } = useDepartmentWorkflow()

  // Reactive data
  const enquiry = ref<Enquiry | null>(null)
  const selectedSurvey = ref<SiteSurvey | null>(null)
  const selectedQuotation = ref<Quotation | null>(null)
  const selectedProject = ref<Project | null>(null)
  const currentDetailStep = ref(1)
  const currentPhaseIndex = ref(0)
  const quotationApproved = ref(false)
  const workflowOffset = ref(0) // 0 = enquiry workflow, -100 = project workflow
  const showMaterialsModal = ref(false)
  const showBudgetModal = ref(false)
  const showQuoteModal = ref(false)
  const showQuotationViewer = ref(false)
  const showSiteSurveyModal = ref(false)
  const budgetMaterialCosts = ref([])
  const quoteMaterialElements = ref([])
  const currentQuotation = ref<any>(null)

  // Workflow step statuses (reactive)
  const stepStatuses = ref({
    1: 'completed', // Enquiry & Site Survey
    2: 'pending',   // Material Specification
    3: 'pending',   // Budget & Quote Preparation
    4: 'pending'    // Project Conversion
  })

  // Mock data for demonstration
  const materialItemsCount = ref(15)
  const materialTotalCost = ref(250000)

  // Computed properties
  const overallProgress = computed(() => {
    let completed = 0
    // Step 1: Enquiry & Site Survey - always completed if enquiry exists
    if (enquiry.value) completed++
    // Step 2: Material Specification - check if materials exist
    if (materialItemsCount.value > 0) completed++
    // Step 3: Budget & Quote Preparation - check if quotation exists
    if (selectedQuotation.value) completed++
    // Step 4: Project Conversion - check if project exists
    if (selectedProject.value) completed++

    return Math.round((completed / 4) * 100)
  })

  const canAccessMaterials = computed(() => {
    return selectedSurvey.value && selectedSurvey.value.status === 'completed'
  })

  const currentPhase = computed(() => {
    const phase = selectedProject.value?.phases[currentPhaseIndex.value] || null
    console.log('=== DETAILED CONTENT AREA DEBUG ===')
    console.log('Current Detail Step:', currentDetailStep.value)
    console.log('Selected Project:', selectedProject.value ? 'Yes' : 'No')
    console.log('Current Phase Index:', currentPhaseIndex.value)
    console.log('Current Phase:', phase)
    console.log('Enquiry:', enquiry.value)
    console.log('Selected Survey:', selectedSurvey.value)
    console.log('Selected Quotation:', selectedQuotation.value)
    console.log('Content Area Rendering: Step', currentDetailStep.value, selectedProject.value ? 'with Project Phases' : 'without Project')
    console.log('BUTTON ACCESSIBILITY: Site Survey - ALWAYS VISIBLE | Materials - ALWAYS VISIBLE | Creative Tasks - ALWAYS VISIBLE')
    console.log('=====================================')
    return phase
  })

  const projectProgressPercentage = computed(() => {
    if (!selectedProject.value) return 0
    const completed = selectedProject.value.phases.filter(phase => phase.status === 'Completed').length
    return (completed / selectedProject.value.phases.length) * 100
  })

  const projectCompletedPhases = computed(() => {
    return selectedProject.value?.phases.filter(phase => phase.status === 'Completed').length || 0
  })

  const canGoToPreviousPhase = computed(() => {
    return currentPhaseIndex.value > 0
  })

  const canGoToNextPhase = computed(() => {
    if (!selectedProject.value) return false
    const nextIndex = currentPhaseIndex.value + 1
    return nextIndex < selectedProject.value.phases.length
  })

  // Methods
  const getStepStatus = (step: number) => {
    return stepStatuses.value[step as keyof typeof stepStatuses.value] || 'pending'
  }

  const getStepStatusText = (step: number) => {
    const status = getStepStatus(step)
    switch (status) {
      case 'completed': return 'Completed'
      case 'in_progress': return 'In Progress'
      case 'pending': return 'Pending'
      default: return 'Unknown'
    }
  }

  const getStepBorderClass = (step: number) => {
    const status = getStepStatus(step)
    if (currentDetailStep.value === step) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    } else if (status === 'completed') {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20'
    } else if (status === 'in_progress') {
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    } else {
      return 'border-gray-300 dark:border-gray-600'
    }
  }

  const getStepNumberClass = (step: number) => {
    const status = getStepStatus(step)
    if (currentDetailStep.value === step) {
      return 'bg-blue-500 text-white'
    } else if (status === 'completed') {
      return 'bg-green-500 text-white'
    } else if (status === 'in_progress') {
      return 'bg-yellow-500 text-white'
    } else {
      return 'bg-gray-400 text-white'
    }
  }

  const getStepIconClass = (step: number) => {
    const status = getStepStatus(step)
    if (status === 'completed') {
      return 'bg-green-500'
    } else if (status === 'in_progress') {
      return 'bg-blue-500'
    } else if (status === 'pending') {
      return 'bg-yellow-500'
    } else {
      return 'bg-gray-400'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityClass = (priority?: string) => {
    const classes = {
      low: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      medium: 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs',
      high: 'text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs',
      urgent: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
    }
    return classes[priority as keyof typeof classes] || classes.medium
  }

  const getStatusClass = (status: string) => {
    const classes = {
      pending: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
      completed: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      approved: 'text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs',
      rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs'
    }
    return classes[status as keyof typeof classes] || classes.pending
  }

  const getQuotationStatusClass = (status: string) => {
    const classes = {
      draft: 'text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs',
      sent: 'text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs',
      approved: 'text-green-600 bg-green-100 px-2 py-1 rounded text-xs',
      rejected: 'text-red-600 bg-red-100 px-2 py-1 rounded text-xs',
      expired: 'text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs'
    }
    return classes[status as keyof typeof classes] || classes.draft
  }

  const getPhaseStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Not Started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPhaseStatusText = (status: string) => {
    switch (status) {
      case 'Completed': return 'Completed'
      case 'In Progress': return 'In Progress'
      case 'Not Started': return 'Not Started'
      default: return 'Unknown'
    }
  }

  const getTaskStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPhaseIconClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500'
      case 'In Progress': return 'bg-blue-500'
      case 'Not Started': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const canStartPhase = (phase: ProjectPhase, index: number) => {
    if (!selectedProject.value) return false

    // Can start if previous phase is completed and current phase is not started
    if (index === 0) {
      return phase.status === 'Not Started'
    }

    const previousPhase = selectedProject.value.phases[index - 1]
    return previousPhase.status === 'Completed' && phase.status === 'Not Started'
  }

  const canCompletePhase = (phase: ProjectPhase) => {
    return phase.status === 'In Progress'
  }

  const startProjectPhase = (index: number) => {
    if (!selectedProject.value) return

    // Update phase status to In Progress
    selectedProject.value.phases[index].status = 'In Progress'
    console.log(`Started phase: ${selectedProject.value.phases[index].name}`)
  }

  const completeProjectPhase = (index: number) => {
    if (!selectedProject.value) return

    // Update phase status to Completed
    selectedProject.value.phases[index].status = 'Completed'

    // If this is the last phase, mark project as completed
    if (index === selectedProject.value.phases.length - 1) {
      selectedProject.value.status = 'completed'
    }

    console.log(`Completed phase: ${selectedProject.value.phases[index].name}`)
  }

  // Computed properties for project summary
  const completedPhases = computed(() => {
    if (!selectedProject.value) return 0
    return selectedProject.value.phases.filter(phase => phase.status === 'Completed').length
  })

  const inProgressPhases = computed(() => {
    if (!selectedProject.value) return 0
    return selectedProject.value.phases.filter(phase => phase.status === 'In Progress').length
  })

  const remainingPhases = computed(() => {
    if (!selectedProject.value) return 0
    return selectedProject.value.phases.filter(phase => phase.status === 'Not Started').length
  })

  const getCurrentStepTitle = () => {
    const titles = [
      'Enquiry & Site Survey',
      'Design Concept and Material Specification',
      'Budget & Quote Preparation',
      'Project Conversion'
    ]
    return titles[currentDetailStep.value - 1] || 'Enquiry & Site Survey'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const previousStep = () => {
    if (currentDetailStep.value > 1) {
      currentDetailStep.value--
    }
  }

  const updateStepStatus = (stepNumber: number, status: string) => {
    // Update the status of workflow steps
    stepStatuses.value[stepNumber as keyof typeof stepStatuses.value] = status

    // Update enquiry status based on step completion
    if (enquiry.value) {
      if (stepNumber === 4 && status === 'completed') {
        enquiry.value.status = 'converted_to_project'
      } else if (stepNumber >= 1 && status === 'completed') {
        enquiry.value.status = 'design_completed'
      }
    }

    console.log(`Updated step ${stepNumber} to status: ${status}`)
  }

  const nextStep = () => {
    if (currentDetailStep.value < 4) {
      // Update the status of current step to completed
      updateStepStatus(currentDetailStep.value, 'completed')

      // Move to next step
      currentDetailStep.value++

      // Update the status of new current step to in_progress
      if (currentDetailStep.value <= 4) {
        updateStepStatus(currentDetailStep.value, 'in_progress')
      }
    }
  }

  const openSurveyModal = () => {
    console.log('=== DEBUG: openSurveyModal called ===')
    console.log('Enquiry:', enquiry.value)
    console.log('Selected Survey:', selectedSurvey.value)
    console.log('Current Department:', currentDepartment.value)
    console.log('Modal visibility before:', showSiteSurveyModal.value)
    // Show site survey modal
    showSiteSurveyModal.value = true
    console.log('Site Survey Modal opened - visibility after:', showSiteSurveyModal.value)
  }

  const openMaterialsModal = () => {
    console.log('=== DEBUG: openMaterialsModal called ===')
    console.log('Enquiry:', enquiry.value)
    console.log('Material Items Count:', materialItemsCount.value)
    console.log('Current Department:', currentDepartment.value)
    console.log('Modal visibility before:', showMaterialsModal.value)
    showMaterialsModal.value = true
    console.log('Materials Modal opened - visibility after:', showMaterialsModal.value)
  }

  const openDesignMaterialModal = () => {
    showMaterialsModal.value = true
    // This will trigger the enhanced materials modal with design-specific features
    console.log('Opening design material list modal for department:', currentDepartment.value)
  }

  const openBudgetModal = () => {
    console.log('=== DEBUG: openBudgetModal called ===')
    console.log('Enquiry:', enquiry.value)
    console.log('Material Total Cost:', materialTotalCost.value)
    console.log('Selected Quotation:', selectedQuotation.value)
    console.log('Current Department:', currentDepartment.value)
    console.log('Modal visibility before:', showBudgetModal.value)
    // Prepare material costs for budget modal (flattened for backward compatibility)
    budgetMaterialCosts.value = [
      {
        id: '1',
        name: 'Aluminum Frame 2x3m',
        quantity: 4,
        unit: 'pcs',
        unitPrice: 15000,
        category: 'hire',
        totalCost: 60000
      },
      {
        id: '2',
        name: 'LED Panel 50"',
        quantity: 2,
        unit: 'pcs',
        unitPrice: 25000,
        category: 'hire',
        totalCost: 50000
      },
      {
        id: '3',
        name: 'Carpet Tiles',
        quantity: 20,
        unit: 'sqm',
        unitPrice: 5000,
        category: 'production',
        totalCost: 100000
      }
    ]

    // Prepare hierarchical material elements for quote generation
    quoteMaterialElements.value = [
      {
        id: '1',
        elementName: 'Exhibition Booth 3x3m',
        description: 'Complete exhibition booth setup with all components',
        category: 'production',
        subItems: [
          {
            id: '1-1',
            name: 'Aluminum Frame 2x3m',
            quantity: 4,
            unit: 'pcs',
            unitPrice: 15000,
            category: 'hire',
            comment: 'Main structural frame'
          },
          {
            id: '1-2',
            name: 'LED Panel 50"',
            quantity: 2,
            unit: 'pcs',
            unitPrice: 25000,
            category: 'hire',
            comment: 'High-brightness display panels'
          },
          {
            id: '1-3',
            name: 'Carpet Tiles',
            quantity: 20,
            unit: 'sqm',
            unitPrice: 5000,
            category: 'production',
            comment: 'Premium carpet flooring'
          }
        ]
      }
    ]

    showBudgetModal.value = true
    console.log('Budget Modal opened - visibility after:', showBudgetModal.value)
  }

  const handleMaterialsSave = (materials: any[], files: any[], notes: string) => {
    console.log('Materials saved:', { materials, files, notes })

    // Update material items count and cost
    materialItemsCount.value = materials.length
    materialTotalCost.value = materials.reduce((total, item) => total + (item.quantity * item.unitPrice), 0)

    // Update step status if materials are added
    if (materials.length > 0) {
      updateStepStatus(2, 'completed')
    }

    // Close modal
    showMaterialsModal.value = false
  }

  const handleBudgetSave = (budget: any) => {
    console.log('Budget saved:', budget)

    // Update quotation with budget data
    selectedQuotation.value = {
      id: Date.now(),
      enquiry_id: enquiry.value?.id || 0,
      enquiry: {
        id: enquiry.value?.id || 0,
        title: enquiry.value?.title || '',
        client: {
          id: enquiry.value?.client_id || 0,
          name: enquiry.value?.client?.name || 'Unknown Client'
        }
      },
      title: `Quotation for ${enquiry.value?.title}`,
      description: 'Generated quotation from budget calculation',
      items: [
        {
          id: 1,
          description: 'Material Costs',
          quantity: 1,
          unit_price: budget.totals.materialSubtotal,
          total_price: budget.totals.materialSubtotal,
          category: 'Materials'
        },
        {
          id: 2,
          description: 'Labor Costs',
          quantity: 1,
          unit_price: budget.totals.laborSubtotal,
          total_price: budget.totals.laborSubtotal,
          category: 'Labor'
        },
        {
          id: 3,
          description: 'Logistics & Transportation',
          quantity: 1,
          unit_price: budget.totals.logisticsSubtotal,
          total_price: budget.totals.logisticsSubtotal,
          category: 'Logistics'
        },
        {
          id: 4,
          description: 'Miscellaneous Costs',
          quantity: 1,
          unit_price: budget.totals.miscSubtotal,
          total_price: budget.totals.miscSubtotal,
          category: 'Miscellaneous'
        }
      ],
      subtotal: budget.totals.totalBudget,
      tax_rate: 16,
      tax_amount: budget.totals.totalBudget * 0.16,
      discount_rate: 0,
      discount_amount: 0,
      total_amount: budget.totals.totalBudget * 1.16,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      notes: 'Auto-generated quotation from budget calculation',
      created_by: 1,
      created_by_user: {
        id: 1,
        name: 'System'
      },
      approved_by: undefined,
      approved_at: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Update step status to completed
    updateStepStatus(3, 'completed')

    // Close modal
    showBudgetModal.value = false

    // Show success message
    alert('Budget saved and quotation created successfully!')
  }

  const handleGenerateQuote = (materialElements: any[]) => {
    // Set the material elements for the quote modal
    quoteMaterialElements.value = materialElements
    // Open the quote modal
    showQuoteModal.value = true
  }

  const handleQuoteSave = (quotation: any) => {
    console.log('Quotation saved:', quotation)

    // Update the quotation with the final pricing
    selectedQuotation.value = {
      id: Date.now(),
      enquiry_id: enquiry.value?.id || 0,
      enquiry: {
        id: enquiry.value?.id || 0,
        title: enquiry.value?.title || '',
        client: {
          id: enquiry.value?.client_id || 0,
          name: enquiry.value?.client?.name || 'Unknown Client'
        }
      },
      title: `Final Quotation for ${enquiry.value?.title}`,
      description: 'Final quotation with profit margins and VAT applied',
      items: quotation.elements.map((element: any, index: number) => ({
        id: index + 1,
        description: element.elementName,
        quantity: 1,
        unit_price: element.quotePrice,
        total_price: element.quotePrice,
        category: element.category === 'production' ? 'Production' : 'Hire'
      })),
      subtotal: quotation.summary.subtotalBeforeTax,
      tax_rate: 16,
      tax_amount: quotation.summary.vatAmount,
      discount_rate: 0,
      discount_amount: 0,
      total_amount: quotation.summary.totalQuoteAmount,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      notes: `Final quotation with ${quotation.summary.averageMarginPercentage.toFixed(1)}% average margin. Subtotal: KES ${quotation.summary.subtotalBeforeTax.toLocaleString()}, VAT (16%): KES ${quotation.summary.vatAmount.toLocaleString()}, Total: KES ${quotation.summary.totalQuoteAmount.toLocaleString()}. Total profit: KES ${quotation.summary.totalProfitAmount.toLocaleString()}`,
      created_by: 1,
      created_by_user: {
        id: 1,
        name: 'System'
      },
      approved_by: undefined,
      approved_at: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Update step status to completed
    updateStepStatus(3, 'completed')

    // Close modal
    showQuoteModal.value = false

    // Show success message
    alert(`Final quotation created successfully!\nSubtotal: KES ${quotation.summary.subtotalBeforeTax.toLocaleString()}\nVAT (16%): KES ${quotation.summary.vatAmount.toLocaleString()}\nTotal: KES ${quotation.summary.totalQuoteAmount.toLocaleString()}\nProfit: KES ${quotation.summary.totalProfitAmount.toLocaleString()}`)
  }

  const handleSiteSurveySave = (survey: SiteSurvey) => {
    console.log('Site survey saved:', survey)

    // Update the selected survey
    selectedSurvey.value = survey

    // Update step status to completed if survey is completed
    if (survey.status === 'completed') {
      updateStepStatus(1, 'completed')
    }

    // Close modal
    showSiteSurveyModal.value = false

    // Show success message
    alert('Site survey saved successfully!')
  }

  const viewQuotation = () => {
    if (selectedQuotation.value) {
      // Prepare the quotation data for the viewer
      // We need to reconstruct the hierarchical structure from the saved quotation
      const quotationData = {
        elements: selectedQuotation.value.items?.map(item => ({
          id: item.id.toString(),
          elementName: item.description,
          description: `Element from quotation item`,
          category: item.category === 'Production' ? 'production' : 'hire',
          subItems: [], // We'll need to reconstruct this from the original data
          baseCost: item.unit_price,
          marginPercentage: 0, // We'll calculate this
          marginFixed: 0,
          profitAmount: 0,
          quotePrice: item.unit_price
        })) || [],
        summary: {
          totalBaseCost: selectedQuotation.value.subtotal || 0,
          totalProfitAmount: 0, // We'll need to calculate this
          subtotalBeforeTax: selectedQuotation.value.subtotal || 0,
          vatAmount: selectedQuotation.value.tax_amount || 0,
          totalQuoteAmount: selectedQuotation.value.total_amount || 0,
          averageMarginPercentage: 0
        },
        enquiry: {
          id: selectedQuotation.value.enquiry_id,
          title: selectedQuotation.value.enquiry?.title || '',
          client: selectedQuotation.value.enquiry?.client
        },
        createdAt: selectedQuotation.value.created_at
      }

      currentQuotation.value = quotationData
      showQuotationViewer.value = true
    }
  }

  const startProduction = () => {
    if (!enquiry.value) return

    // Create dummy quotation if none exists
    if (!selectedQuotation.value) {
      selectedQuotation.value = {
        id: Date.now(),
        enquiry_id: enquiry.value.id,
        enquiry: {
          id: enquiry.value.id,
          title: enquiry.value.title,
          client: {
            id: enquiry.value.client_id,
            name: enquiry.value.client?.name || 'Unknown Client'
          }
        },
        title: `Quotation for ${enquiry.value.title}`,
        description: 'Generated quotation for project conversion',
        items: [
          {
            id: 1,
            description: 'Project Materials',
            quantity: 1,
            unit_price: 200000,
            total_price: 200000,
            category: 'Materials'
          },
          {
            id: 2,
            description: 'Labor and Installation',
            quantity: 1,
            unit_price: 50000,
            total_price: 50000,
            category: 'Labor'
          }
        ],
        subtotal: 250000,
        tax_rate: 16,
        tax_amount: 40000,
        discount_rate: 0,
        discount_amount: 0,
        total_amount: 290000,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'approved',
        notes: 'Auto-generated quotation for project conversion',
        created_by: 1,
        created_by_user: {
          id: 1,
          name: 'System'
        },
        approved_by: 1,
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    // Create the project
    selectedProject.value = {
      id: Date.now(),
      enquiry_id: enquiry.value.id,
      enquiry: {
        id: enquiry.value.id,
        title: enquiry.value.title,
        client: {
          id: enquiry.value.client_id,
          name: enquiry.value.client?.name || 'Unknown Client'
        }
      },
      name: `Project for ${enquiry.value.client?.name || 'Client'}`,
      description: enquiry.value.description,
      start_date: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      budget: selectedQuotation.value.total_amount,
      current_phase: 0,
      phases: [
        {
          name: 'Procurement & Material Sourcing',
          icon: 'bi-cart-plus',
          summary: 'Source and acquire all required materials and supplies for production.',
          status: 'Not Started',
          estimatedDuration: 5,
          assignedRole: 'Procurement Officer',
          id: 'procurement',
          isRequired: true,
          order: 1,
          tasks: [
            {
              name: 'Material Procurement',
              description: 'Order all required materials from approved suppliers.',
              deliverables: [
                'Create purchase orders for all materials.',
                'Confirm supplier availability and lead times.',
                'Track order status and delivery dates.'
              ]
            },
            {
              name: 'Material Receipt & Inspection',
              description: 'Receive and inspect delivered materials.',
              deliverables: [
                'Verify material quality and specifications.',
                'Document any discrepancies.',
                'Store materials appropriately.'
              ]
            }
          ]
        },
        {
          name: 'Production',
          icon: 'bi-gear',
          summary: 'Manufacturing and assembly of project components. Tracks work orders, progress, and quality control.',
          status: 'Not Started',
          estimatedDuration: 7,
          assignedRole: 'Production Manager',
          id: 'production',
          isRequired: true,
          order: 2,
          tasks: [
            {
              name: 'Manufacturing Execution',
              description: 'Produce items according to specifications.',
              deliverables: [
                'Follow production procedures.',
                'Monitor quality standards.',
                'Document production progress.'
              ]
            },
            {
              name: 'Assembly & Finishing',
              description: 'Complete final assembly and finishing work.',
              deliverables: [
                'Assemble components.',
                'Apply finishing touches.',
                'Prepare for quality inspection.'
              ]
            }
          ]
        },
        {
          name: 'Logistics',
          icon: 'bi-truck',
          summary: 'Coordination of transportation, storage, and delivery of project materials and equipment.',
          status: 'Not Started',
          estimatedDuration: 3,
          assignedRole: 'Logistics Coordinator',
          id: 'logistics',
          isRequired: true,
          order: 3,
          tasks: [
            {
              name: 'Transportation Planning',
              description: 'Arrange appropriate transportation method.',
              deliverables: [
                'Select transportation provider.',
                'Schedule delivery time.',
                'Prepare shipping documents.'
              ]
            },
            {
              name: 'Delivery Execution',
              description: 'Monitor and confirm successful delivery.',
              deliverables: [
                'Track shipment progress.',
                'Confirm delivery receipt.',
                'Handle any delivery issues.'
              ]
            }
          ]
        },
        {
          name: 'Event Setup & Execution',
          icon: 'bi-tools',
          summary: 'On-site setup and implementation. Includes installation schedules and site reports.',
          status: 'Not Started',
          estimatedDuration: 4,
          assignedRole: 'Installation Team',
          id: 'event-setup',
          isRequired: true,
          order: 4,
          tasks: [
            {
              name: 'Site Preparation',
              description: 'Prepare installation site.',
              deliverables: [
                'Assess installation location.',
                'Prepare necessary tools.',
                'Ensure safety compliance.'
              ]
            },
            {
              name: 'Installation & Testing',
              description: 'Install and test the products.',
              deliverables: [
                'Complete installation.',
                'Test functionality.',
                'Provide client training.'
              ]
            }
          ]
        },
        {
          name: 'Client Handover',
          icon: 'bi-clipboard-check',
          summary: 'Final delivery to client. Includes training, documentation, and sign-off procedures.',
          status: 'Not Started',
          estimatedDuration: 2,
          assignedRole: 'Project Lead',
          id: 'client-handover',
          isRequired: true,
          order: 5,
          tasks: [
            {
              name: 'Client Training',
              description: 'Train client on product usage.',
              deliverables: [
                'Conduct training session.',
                'Provide user manuals.',
                'Answer client questions.'
              ]
            },
            {
              name: 'Final Handover',
              description: 'Complete project handover.',
              deliverables: [
                'Deliver all documentation.',
                'Obtain client sign-off.',
                'Confirm client satisfaction.'
              ]
            }
          ]
        },
        {
          name: 'Set Down & Return',
          icon: 'bi-arrow-return-left',
          summary: 'Post-event activities, including equipment return and storage.',
          status: 'Not Started',
          estimatedDuration: 3,
          assignedRole: 'Operations Team',
          id: 'set-down-return',
          isRequired: true,
          order: 6,
          tasks: [
            {
              name: 'Equipment Return',
              description: 'Return any temporary equipment.',
              deliverables: [
                'Collect all equipment.',
                'Inspect for damage.',
                'Return to storage.'
              ]
            },
            {
              name: 'Site Cleanup',
              description: 'Clean up installation site.',
              deliverables: [
                'Remove packaging materials.',
                'Clean work area.',
                'Restore site to original condition.'
              ]
            }
          ]
        },
        {
          name: 'Archival & Reporting',
          icon: 'bi-archive',
          summary: 'Final project review, documentation, and lessons learned. Formally closes out the project.',
          status: 'Not Started',
          estimatedDuration: 2,
          assignedRole: 'Project Lead',
          id: 'archival-reporting',
          isRequired: true,
          order: 7,
          tasks: [
            {
              name: 'Final Documentation',
              description: 'Complete all project documentation.',
              deliverables: [
                'Compile project reports.',
                'Archive all documents.',
                'Update project database.'
              ]
            },
            {
              name: 'Project Review',
              description: 'Review project performance.',
              deliverables: [
                'Collect team feedback.',
                'Document lessons learned.',
                'Prepare final report.'
              ]
            }
          ]
        }
      ],
      assigned_users: [1],
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Update enquiry status to converted
    if (enquiry.value) {
      enquiry.value.status = 'converted_to_project'
    }

    // Set current phase to the first incomplete phase
    const firstIncompleteIndex = selectedProject.value.phases.findIndex(phase => phase.status !== 'Completed')
    currentPhaseIndex.value = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0

    // Trigger smooth workflow transition animation
    setTimeout(() => {
      workflowOffset.value = -100
    }, 100) // Small delay to ensure DOM is ready

    // Update workflow to show project phases
    console.log('Project created and workflow transitioned to project phases with smooth animation')
  }

  const goToPreviousPhase = () => {
    if (canGoToPreviousPhase.value) {
      currentPhaseIndex.value--
    }
  }

  const goToNextPhase = () => {
    if (canGoToNextPhase.value) {
      currentPhaseIndex.value++
    }
  }

  const updatePhaseStatus = (phaseId: string, status: string) => {
    if (!selectedProject.value) return

    const phaseIndex = selectedProject.value.phases.findIndex(phase => phase.id === phaseId)
    if (phaseIndex >= 0) {
      selectedProject.value.phases[phaseIndex].status = status as ProjectPhase['status']
      console.log(`Updated phase ${phaseId} to status: ${status}`)
    }
  }

  const setCurrentPhase = (index: number) => {
    currentPhaseIndex.value = index
  }

  const approveQuotation = () => {
    quotationApproved.value = true
    // In a real application, this would update the quotation status in the backend
    // For demo purposes, we just set the local state
    console.log('Quotation approved for project:', selectedProject.value?.name)
  }

  const updateSurveyStatus = (status: 'pending' | 'approved' | 'completed' | 'rejected') => {
    if (selectedSurvey.value) {
      selectedSurvey.value.status = status
      console.log('Survey status updated to:', status)
    }
  }

  const navigateToCreatives = () => {
    if (enquiry.value) {
      router.push(`/creatives/tasks?enquiry_id=${enquiry.value.id}`)
    }
  }

  const createCreativeTasks = async () => {
    if (!enquiry.value) return

    try {
      const createdTasks = await createTasksFromEnquiry(enquiry.value, 1) // Assuming user ID 1 for now
      if (createdTasks.length > 0) {
        console.log('Creative tasks created successfully:', createdTasks)
        // Refresh tasks to update the UI
        await fetchTasks()
        // Update step status
        updateStepStatus(2, 'in_progress')
        // Clear any previous errors
        integrationError.value = null
        // Navigate to creatives module
        navigateToCreatives()
      } else {
        throw new Error('No tasks were created')
      }
    } catch (error) {
      console.error('Failed to create creative tasks:', error)
      // Set integration error for display
      integrationError.value = error instanceof Error ? error.message : 'Failed to create creative tasks'
    }
  }

  const retryCreativeTasks = async () => {
    integrationError.value = null
    await createCreativeTasks()
  }

  const clearError = () => {
    integrationError.value = null
  }

  const retryAccess = () => {
    // Clear the current error
    accessError.value = ''

    // Re-initialize the workflow from route
    if (enquiry.value) {
      const initialized = initializeFromRoute(enquiry.value)
      if (!initialized) {
        // If still failing, show a more specific error
        accessError.value = `Unable to access ${currentDepartment.value} department workflow. Please check your permissions and try again.`
      }
    }
  }

  // Department-specific methods
  const getDepartmentPhaseTitle = () => {
    switch (currentDepartment.value) {
      case 'creatives':
        return 'Creative Department - Design Concept Development'
      case 'design':
        return 'Design Department - Material Specification & Planning'
      case 'survey':
        return 'Survey Department - Site Assessment & Analysis'
      case 'procurement':
        return 'Procurement Department - Vendor Management & Sourcing'
      case 'projects':
        return 'Projects Department - Project Management & Coordination'
      default:
        return 'Department Workflow'
    }
  }

  const getDepartmentDescription = () => {
    switch (currentDepartment.value) {
      case 'creatives':
        return 'Handles enquiry designs, mockups, renders, and material specifications for creative projects'
      case 'design':
        return 'Manages detailed material specifications, technical drawings, and production planning'
      case 'survey':
        return 'Conducts site assessments, feasibility studies, and requirement analysis'
      case 'procurement':
        return 'Manages vendor relationships, material sourcing, and supply chain coordination'
      case 'projects':
        return 'Oversees project execution, timeline management, and client coordination'
      default:
        return 'Department-specific workflow management'
    }
  }

  const getDepartmentProgress = () => {
    if (!enquiry.value) return 0

    switch (currentDepartment.value) {
      case 'creatives':
        return getEnquiryProgress(enquiry.value.id)
      case 'design':
        return materialItemsCount.value > 0 ? 75 : 25
      case 'survey':
        return selectedSurvey.value?.status === 'completed' ? 100 : 50
      case 'procurement':
        return selectedQuotation.value ? 80 : 30
      case 'projects':
        return selectedProject.value ? 90 : 40
      default:
        return 0
    }
  }

  const getDepartmentFeatures = () => {
    switch (currentDepartment.value) {
      case 'creatives':
        return ['Design Creation', 'Mockup Development', '3D Rendering', 'Material Lists']
      case 'design':
        return ['Technical Drawings', 'Material Specs', 'Production Planning', 'Quality Standards']
      case 'survey':
        return ['Site Assessment', 'Feasibility Studies', 'Requirement Analysis', 'Risk Assessment']
      case 'procurement':
        return ['Vendor Management', 'Price Negotiation', 'Quality Control', 'Supply Chain']
      case 'projects':
        return ['Timeline Management', 'Resource Allocation', 'Client Communication', 'Progress Tracking']
      default:
        return ['Task Management', 'Progress Tracking', 'Team Coordination']
    }
  }

  const navigateToDesign = () => {
    if (enquiry.value) {
      router.push(`/projects/enquiries/${enquiry.value.id}?phase=material_specification&department=design`)
    }
  }

  const handleStepClick = (step: number) => {
    currentDetailStep.value = step
  }

  onMounted(async () => {
    console.log('EnquiryWorkflow mounted')
    console.log('Route params:', route.params)
    console.log('Route query:', route.query)
    console.log('Available enquiries before fetch:', enquiries.value)

    // Ensure enquiries are loaded
    if (enquiries.value.length === 0) {
      console.log('Enquiries array is empty, fetching data...')
      // You might need to call fetchEnquiries here if data isn't loaded
    }

    console.log('Available enquiries after check:', enquiries.value)

    const enquiryId = parseInt(route.params.id as string)
    console.log('Parsed enquiry ID:', enquiryId)

    if (enquiryId) {
      // Find the enquiry in the enquiries array
      const foundEnquiry = enquiries.value.find(e => e.id === enquiryId)
      console.log('Found enquiry:', foundEnquiry)

      if (foundEnquiry) {
        enquiry.value = foundEnquiry
        console.log('Enquiry set successfully:', enquiry.value)

        // Load site survey for this enquiry
        const survey = getSiteSurveyByEnquiry(foundEnquiry.id)
        if (survey) {
          selectedSurvey.value = survey
          console.log('Site survey loaded:', survey)
        }

        // Initialize department workflow from route parameters
        const initialized = initializeFromRoute(foundEnquiry)
        if (!initialized) {
          console.warn('Failed to initialize department workflow, access may be restricted')
        }
      } else {
        console.error(`Enquiry with ID ${enquiryId} not found`)
        console.log('Available enquiry IDs:', enquiries.value.map(e => e.id))
        console.log('Searching in dummy data directly...')

        // Try to find in dummy data as fallback
        const dummyEnquiries = [
          { id: 1, title: 'Corporate Event Booth Setup', client: { name: 'ABC Corporation' } },
          { id: 2, title: 'Wedding Exhibition Display', client: { name: 'XYZ Events' } },
          { id: 3, title: 'Product Launch Event', client: { name: 'ABC Corporation' } }
        ]
        const dummyEnquiry = dummyEnquiries.find(e => e.id === enquiryId)
        if (dummyEnquiry) {
          console.log('Found in dummy data, setting manually...')
          enquiry.value = dummyEnquiry as Enquiry

          // Initialize department workflow for dummy data
          initializeFromRoute(dummyEnquiry as Enquiry)
        }
      }
    } else {
      console.error('No enquiry ID provided in route')
    }
  })

  return {
    enquiry,
    selectedSurvey,
    selectedQuotation,
    selectedProject,
    currentDetailStep,
    currentPhaseIndex,
    stepStatuses,
    overallProgress,
    currentPhase,
    projectProgressPercentage,
    projectCompletedPhases,
    canGoToPreviousPhase,
    canGoToNextPhase,
    completedPhases,
    inProgressPhases,
    remainingPhases,
    materialItemsCount,
    materialTotalCost,
    quotationApproved,
    workflowOffset,
    showMaterialsModal,
    showBudgetModal,
    showQuoteModal,
    showQuotationViewer,
    showSiteSurveyModal,
    budgetMaterialCosts,
    quoteMaterialElements,
    currentQuotation,
    enquiries,
    accessError,
    getEnquiryProgress,
    isCreatingTasks,
    currentDepartment,
    getCurrentStepTitle,
    formatDate,
    getPriorityClass,
    getStatusClass,
    getQuotationStatusClass,
    getPhaseStatusBadgeClass,
    getPhaseStatusText,
    getTaskStatusClass,
    getPhaseIconClass,
    updateStepStatus,
    previousStep,
    nextStep,
    handleStepClick,
    openSurveyModal,
    openMaterialsModal,
    openBudgetModal,
    handleMaterialsSave,
    handleBudgetSave,
    handleGenerateQuote,
    handleQuoteSave,
    handleSiteSurveySave,
    viewQuotation,
    startProduction,
    goToPreviousPhase,
    goToNextPhase,
    setCurrentPhase,
    approveQuotation,
    updateSurveyStatus,
    navigateToCreatives,
    createCreativeTasks,
    retryAccess
  }
}
