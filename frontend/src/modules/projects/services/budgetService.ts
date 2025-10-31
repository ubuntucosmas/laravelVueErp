import axios from '@/plugins/axios'
import type { ProjectInfo } from './materialsService'

export interface BudgetMaterialItem {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
  isIncluded: boolean
  unitPrice: number
  totalPrice: number
  isAddition: boolean
  addedAt?: Date
}

export interface BudgetElement {
  id: string
  templateId?: string
  elementType: string
  name: string
  category: 'production' | 'hire' | 'outsourced'
  dimensions: {
    length: string
    width: string
    height: string
  }
  isIncluded: boolean
  materials: BudgetMaterialItem[]
  notes?: string
  addedAt: Date
}

export interface LabourType {
  id: string
  category: string
  type: string
  description: string
  unit: string
  quantity: number
  unitRate: number
  amount: number
  isAddition: boolean
}

export interface ExpenseItem {
  id: string
  description: string
  category: string
  amount: number
  isAddition: boolean
  addedAt?: Date
}

export interface LogisticsItem {
  id: string
  vehicleReg: string
  description: string
  category: string
  unit: string
  quantity: number
  unitRate: number
  amount: number
  isAddition: boolean
  addedAt?: Date
}

export interface BudgetSummary {
  materialsTotal: number
  labourTotal: number
  expensesTotal: number
  logisticsTotal: number
  grandTotal: number
}

export interface MaterialsImportInfo {
  importedAt?: string
  importedFromTask?: number
  manuallyModified: boolean
  importMetadata?: {
    imported_at: string
    materials_task_id: number
    materials_task_title: string
    total_elements: number
    total_materials: number
  }
}

export interface MaterialsUpdateCheckResponse {
  has_updates: boolean
  last_import_at?: string
  materials_updated_at?: string
  materials_task_title?: string
  message: string
}

export interface BudgetData {
  projectInfo: ProjectInfo
  materials: BudgetElement[]
  labour: LabourType[]
  expenses: ExpenseItem[]
  logistics: LogisticsItem[]
  budgetSummary: BudgetSummary
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  materialsImportInfo?: MaterialsImportInfo
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Simple budget service without complex error handling
 */
export class BudgetService {

  /**
   * Get budget data for a task
   */
  static async getBudgetData(taskId: number): Promise<BudgetData> {
    const response = await axios.get(`/api/projects/tasks/${taskId}/budget`)
    return response.data.data
  }

  /**
   * Save budget data for a task
   */
  static async saveBudgetData(taskId: number, data: BudgetData): Promise<BudgetData> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/budget`, data)
    return response.data.data
  }

  /**
   * Submit budget for approval
   */
  static async submitForApproval(taskId: number): Promise<void> {
    await axios.post(`/api/projects/tasks/${taskId}/budget/submit-approval`)
  }

  /**
   * Import materials from the materials task into budget
   */
  static async importMaterials(taskId: number): Promise<BudgetData> {
    const response = await axios.post(`/api/projects/tasks/${taskId}/budget/import-materials`)
    return response.data.data
  }

  /**
   * Check if materials have been updated since last import
   */
  static async checkMaterialsUpdate(taskId: number): Promise<MaterialsUpdateCheckResponse> {
    const response = await axios.get(`/api/projects/tasks/${taskId}/budget/check-materials-update`)
    return response.data
  }
}
