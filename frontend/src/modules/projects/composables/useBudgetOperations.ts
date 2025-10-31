import { ref } from 'vue'
import { BudgetService } from '../services/budgetService'
import type { BudgetData, BudgetMaterialItem, LabourType } from '../services/budgetService'

export function useBudgetOperations(state: any, task: any, emit: any) {
  const activeTab = ref('materials')

  const tabs = [
    { key: 'materials', label: 'Materials' },
    { key: 'labour', label: 'Labour' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'logistics', label: 'Logistics' },
    { key: 'summary', label: 'Summary' },
  ]

  // Load existing budget data
  const loadBudgetData = async () => {
    state.isLoading = true
    state.error = null

    try {
      const data = await BudgetService.getBudgetData(task.id)

      // Map BudgetData to our form structure
      state.formData = {
        projectInfo: data.projectInfo,
        materials: data.materials || [],
        labour: data.labour || [],
        expenses: data.expenses || [],
        logistics: data.logistics || [],
        status: data.status,
        materialsImportInfo: data.materialsImportInfo,
      }

      // Set import status if available
      if (data.materialsImportInfo) {
        state.importStatus = data.materialsImportInfo
      }

      // If no materials, try to import
      if (data.materials.length === 0) {
        await importMaterials()
      } else {
        // Check for updates if materials exist
        await checkMaterialsUpdates()
      }
    } catch {
      // If budget doesn't exist, initialize with project info
      state.formData = {
        projectInfo: {
          projectId: task.project_enquiry?.enquiry_number || '',
          enquiryTitle: task.project_enquiry?.title || '',
          clientName: task.project_enquiry?.client?.name || '',
          eventVenue: task.project_enquiry?.venue || '',
          setupDate: task.project_enquiry?.expected_delivery_date || '',
          setDownDate: '',
        },
        materials: [],
        labour: [],
        expenses: [],
        logistics: [],
        status: 'draft',
        materialsImportInfo: undefined,
      }

      // Try to import materials
      await importMaterials()
    } finally {
      state.isLoading = false
    }
  }

  // Import materials from Materials Task
  const importMaterials = async (forceReimport = false) => {
    if (!forceReimport && state.formData.materials && state.formData.materials.length > 0) {
      return
    }

    state.isImporting = true
    state.error = null

    try {
      const budgetData = await BudgetService.importMaterials(task.id)

      // Update form data with imported materials
      state.formData.materials = budgetData.materials
      state.formData.materialsImportInfo = budgetData.materialsImportInfo

      // Update import status
      state.importStatus = budgetData.materialsImportInfo || null

      state.successMessage = forceReimport ? 'Materials re-imported successfully!' : 'Materials imported successfully!'
      setTimeout(() => {
        state.successMessage = null
      }, 3000)

      // Clear update check after successful import
      state.materialsUpdateCheck = null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import materials'

      console.error('Materials import failed:', {
        error: err,
        taskId: task.id,
        taskTitle: task.title,
        projectEnquiryId: task.project_enquiry_id,
        errorMessage,
        forceReimport,
        timestamp: new Date().toISOString(),
        response: err.response,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        request: err.request,
        config: err.config,
        stack: err.stack,
        isImporting: state.isImporting,
        currentMaterialsCount: state.formData.materials.length,
        importStatus: state.importStatus
      })

      state.error = errorMessage

      // Show specific error messages based on error type
      if (errorMessage.includes('No materials found')) {
        state.error = 'No materials found in the Materials Task. Please ensure the Materials Task is completed first.'
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        state.error = 'Network error while importing materials. Please check your connection and try again.'
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        state.error = 'You do not have permission to import materials from this task.'
      }
    } finally {
      state.isImporting = false
    }
  }

  // Check for materials updates
  const checkMaterialsUpdates = async () => {
    if (!state.importStatus?.importedAt) {
      return
    }

    state.isCheckingUpdates = true
    try {
      const updateCheck = await BudgetService.checkMaterialsUpdate(task.id)
      state.materialsUpdateCheck = updateCheck
    } catch (err) {
      console.error('Failed to check for materials updates:', err)
      // Silently fail for network errors during update checks
      if (err instanceof Error && err.message.includes('network')) {
        console.warn('Network error during update check - will retry later')
      }
    } finally {
      state.isCheckingUpdates = false
    }
  }

  // Re-import materials with confirmation
  const reImportMaterials = async () => {
    if (confirm('This will replace all current materials with the latest from the Materials Task. Any manual changes will be lost. Continue?')) {
      await importMaterials(true)
    }
  }

  // Calculate material total
  const calculateMaterialTotal = (material: BudgetMaterialItem) => {
    material.totalPrice = (material.quantity || 0) * (material.unitPrice || 0)
  }

  // Add labour item
  const addLabourItem = () => {
    state.formData.labour.push({
      id: `labour-${Date.now()}`,
      type: '',
      description: '',
      category: 'Production',
      unit: 'PAX',
      quantity: 0,
      unitRate: 0,
      amount: 0,
      isAddition: false,
    })
  }

  // Calculate labour total
  const calculateLabourTotal = (labour: LabourType) => {
    labour.amount = (labour.quantity || 0) * (labour.unitRate || 0)
  }

  // Remove labour item
  const removeLabourItem = (id: string) => {
    state.formData.labour = state.formData.labour.filter((item) => item.id !== id)
  }

  // Add expense
  const addExpense = () => {
    state.formData.expenses.push({
      id: `expense-${Date.now()}`,
      description: '',
      category: '',
      amount: 0,
      isAddition: false,
    })
  }

  // Remove expense
  const removeExpense = (index: number) => {
    state.formData.expenses.splice(index, 1)
  }

  // Add logistics item
  const addLogisticsItem = () => {
    state.formData.logistics.push({
      id: `logistics-${Date.now()}`,
      vehicleReg: '',
      description: '',
      category: 'transport',
      unit: 'trip',
      quantity: 1,
      unitRate: 0,
      amount: 0,
      isAddition: false,
    })
  }

  // Calculate logistics total
  const calculateLogisticsTotal = (logistics: any) => {
    logistics.amount = (logistics.quantity || 0) * (logistics.unitRate || 0)
  }

  // Remove logistics item
  const removeLogisticsItem = (index: number) => {
    state.formData.logistics.splice(index, 1)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Data integrity validation before saves
  const validateDataIntegrity = (budgetData: BudgetData): string[] => {
    const integrityErrors: string[] = []

    // Check for required project info
    if (!budgetData.projectInfo.projectId || !budgetData.projectInfo.enquiryTitle || !budgetData.projectInfo.clientName) {
      integrityErrors.push('Project information is incomplete. Please ensure project ID, title, and client name are provided.')
    }

    // Check for empty budget (at least one category should have data)
    const hasData = budgetData.materials.length > 0 || budgetData.labour.length > 0 ||
                   budgetData.expenses.length > 0 || budgetData.logistics.length > 0
    if (!hasData) {
      integrityErrors.push('Budget appears to be empty. Please add at least one item to materials, labour, expenses, or logistics.')
    }

    // Check for negative totals
    if (budgetData.budgetSummary.materialsTotal < 0 || budgetData.budgetSummary.labourTotal < 0 ||
        budgetData.budgetSummary.expensesTotal < 0 || budgetData.budgetSummary.logisticsTotal < 0 ||
        budgetData.budgetSummary.grandTotal < 0) {
      integrityErrors.push('Budget contains negative totals. Please review all amounts and ensure they are correct.')
    }

    // Check for unreasonably high totals (potential data corruption)
    const totalThreshold = 10000000 // 10 million KES
    if (budgetData.budgetSummary.grandTotal > totalThreshold) {
      integrityErrors.push('Budget total seems unusually high. Please verify all calculations and amounts.')
    }

    // Check for materials with zero quantity but non-zero cost
    budgetData.materials.forEach((element, elementIndex) => {
      element.materials.forEach((material, materialIndex) => {
        if (material.quantity === 0 && material.totalPrice > 0) {
          integrityErrors.push(`Material "${material.description}" has zero quantity but non-zero total cost. Please correct this.`)
        }
        if (material.quantity > 0 && material.unitPrice === 0 && material.totalPrice > 0) {
          integrityErrors.push(`Material "${material.description}" has zero unit price but non-zero total. Please set the unit price.`)
        }
      })
    })

    // Check for labour with zero quantity but non-zero amount
    budgetData.labour.forEach((labour, index) => {
      if (labour.quantity === 0 && labour.amount > 0) {
        integrityErrors.push(`Labour item "${labour.type}" has zero quantity but non-zero amount. Please correct this.`)
      }
      if (labour.quantity > 0 && labour.unitRate === 0 && labour.amount > 0) {
        integrityErrors.push(`Labour item "${labour.type}" has zero unit rate but non-zero amount. Please set the unit rate.`)
      }
    })

    // Check for logistics with zero quantity but non-zero amount
    budgetData.logistics.forEach((item, index) => {
      if (item.quantity === 0 && item.amount > 0) {
        integrityErrors.push(`Logistics item "${item.description}" has zero quantity but non-zero amount. Please correct this.`)
      }
      if (item.quantity > 0 && item.unitRate === 0 && item.amount > 0) {
        integrityErrors.push(`Logistics item "${item.description}" has zero unit rate but non-zero amount. Please set the unit rate.`)
      }
    })

    return integrityErrors
  }

  // Save draft
  const saveDraft = async () => {
    state.isSaving = true
    state.error = null

    try {
      const budgetData: BudgetData = {
        projectInfo: state.formData.projectInfo,
        materials: state.formData.materials,
        labour: state.formData.labour,
        expenses: state.formData.expenses,
        logistics: state.formData.logistics,
        budgetSummary: {
          materialsTotal: state.materialsTotal,
          labourTotal: state.labourTotal,
          expensesTotal: state.expensesTotal,
          logisticsTotal: state.logisticsTotal,
          grandTotal: state.grandTotal,
        },
        status: state.formData.status,
      }

      // Validate data integrity before saving
      const integrityErrors = validateDataIntegrity(budgetData)
      if (integrityErrors.length > 0) {
        state.error = `Data integrity issues found: ${integrityErrors.join(' ')}`
        return
      }

      await BudgetService.saveBudgetData(task.id, budgetData)
      state.successMessage = 'Budget draft saved successfully!'
      setTimeout(() => {
        state.successMessage = null
      }, 3000)
      emit('task-updated')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save budget draft'
      state.error = errorMessage
    } finally {
      state.isSaving = false
    }
  }

  // Submit budget
  const handleSubmit = async (validateFn?: (formData: any) => any) => {
    // Validate before submission if validation function provided
    if (validateFn) {
      const validationResult = validateFn(state.formData)
      if (validationResult && validationResult.errors && validationResult.errors.length > 0) {
        const firstError = validationResult.errors[0]
        state.error = `Please fix validation errors in the ${firstError.tab} tab: ${firstError.message}`
        // Switch to the tab with errors
        activeTab.value = firstError.tab
        return
      }
    }

    state.isSaving = true
    state.error = null

    try {
      const budgetData: BudgetData = {
        projectInfo: state.formData.projectInfo,
        materials: state.formData.materials,
        labour: state.formData.labour,
        expenses: state.formData.expenses,
        logistics: state.formData.logistics,
        budgetSummary: {
          materialsTotal: state.materialsTotal,
          labourTotal: state.labourTotal,
          expensesTotal: state.expensesTotal,
          logisticsTotal: state.logisticsTotal,
          grandTotal: state.grandTotal,
        },
        status: 'approved',
      }

      // Additional data integrity validation before final submission
      const integrityErrors = validateDataIntegrity(budgetData)
      if (integrityErrors.length > 0) {
        state.error = `Cannot submit budget due to data integrity issues: ${integrityErrors.join(' ')}`
        return
      }

      // Final validation: ensure budget is not empty for submission
      if (budgetData.budgetSummary.grandTotal === 0) {
        state.error = 'Cannot submit an empty budget. Please add items to at least one category before submitting.'
        return
      }

      await BudgetService.saveBudgetData(task.id, budgetData)
      state.successMessage = 'Budget submitted successfully!'
      setTimeout(() => {
        emit('task-completed')
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit budget'
      state.error = errorMessage

      // Provide recovery suggestions for common submission errors
      if (errorMessage.includes('validation')) {
        state.error += ' Please review all fields and ensure required information is provided.'
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        state.error += ' Please check your connection and try submitting again.'
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        state.error += ' You may not have permission to submit budgets. Please contact your administrator.'
      }
    } finally {
      state.isSaving = false
    }
  }

  return {
    activeTab,
    tabs,
    loadBudgetData,
    importMaterials,
    checkMaterialsUpdates,
    reImportMaterials,
    calculateMaterialTotal,
    addLabourItem,
    calculateLabourTotal,
    removeLabourItem,
    addExpense,
    removeExpense,
    addLogisticsItem,
    removeLogisticsItem,
    calculateLogisticsTotal,
    formatCurrency,
    saveDraft,
    handleSubmit,
  }
}
