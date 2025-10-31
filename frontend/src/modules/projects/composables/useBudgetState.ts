import { computed, reactive } from 'vue'
import type {
  BudgetElement,
  LabourType,
  ExpenseItem,
  LogisticsItem,
  MaterialsImportInfo,
  MaterialsUpdateCheckResponse
} from '../services/budgetService'

export interface BudgetFormData {
  projectInfo: {
    projectId: string
    enquiryTitle: string
    clientName: string
    eventVenue: string
    setupDate: string
    setDownDate: string
  }
  materials: BudgetElement[]
  labour: LabourType[]
  expenses: ExpenseItem[]
  logistics: LogisticsItem[]
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  materialsImportInfo?: MaterialsImportInfo
}

export interface BudgetState {
  // Loading states
  isLoading: boolean
  isSaving: boolean
  isImporting: boolean
  isCheckingUpdates: boolean

  // Messages
  error: string | null
  successMessage: string | null

  // Import related
  importStatus: MaterialsImportInfo | null
  materialsUpdateCheck: MaterialsUpdateCheckResponse | null

  // Form data
  formData: BudgetFormData
}

export function useBudgetState() {
  const state = reactive<BudgetState>({
    isLoading: false,
    isSaving: false,
    isImporting: false,
    isCheckingUpdates: false,
    error: null,
    successMessage: null,
    importStatus: null,
    materialsUpdateCheck: null,
    formData: {
      projectInfo: {
        projectId: '',
        enquiryTitle: '',
        clientName: '',
        eventVenue: '',
        setupDate: '',
        setDownDate: '',
      },
      materials: [],
      labour: [],
      expenses: [],
      logistics: [],
      status: 'draft',
    },
  })

  // Computed properties for totals
  const materialsTotal = computed(() => {
    if (!state.formData.materials || !Array.isArray(state.formData.materials)) {
      return 0
    }
    return state.formData.materials.reduce((total, element) => {
      if (!element.materials || !Array.isArray(element.materials)) {
        return total
      }
      return total + element.materials.reduce((sum, material) => {
        return sum + (material.totalPrice || 0)
      }, 0)
    }, 0)
  })

  const labourTotal = computed(() => {
    if (!state.formData.labour || !Array.isArray(state.formData.labour)) {
      return 0
    }
    return state.formData.labour.reduce((total, item) => total + (item.amount || 0), 0)
  })

  const expensesTotal = computed(() => {
    if (!state.formData.expenses || !Array.isArray(state.formData.expenses)) {
      return 0
    }
    return state.formData.expenses.reduce((total, item) => total + (item.amount || 0), 0)
  })

  const logisticsTotal = computed(() => {
    if (!state.formData.logistics || !Array.isArray(state.formData.logistics)) {
      return 0
    }
    return state.formData.logistics.reduce((total, item) => total + (item.amount || 0), 0)
  })

  const grandTotal = computed(() => {
    return materialsTotal.value + labourTotal.value + expensesTotal.value + logisticsTotal.value
  })

  // Helper functions
  const clearMessages = () => {
    state.error = null
    state.successMessage = null
  }

  const setError = (message: string) => {
    state.error = message
    state.successMessage = null
  }

  const setSuccess = (message: string) => {
    state.successMessage = message
    state.error = null
  }

  const resetState = () => {
    state.isLoading = false
    state.isSaving = false
    state.isImporting = false
    state.isCheckingUpdates = false
    clearMessages()
  }

  return {
    state,
    materialsTotal,
    labourTotal,
    expensesTotal,
    logisticsTotal,
    grandTotal,
    clearMessages,
    setError,
    setSuccess,
    resetState,
  }
}
