export interface Budget {
  id: number
  project: string
  total: number
  spent: number
  remaining: number
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  created: string
}

export interface BudgetForm {
  projectId: number
  projectName: string
  items: BudgetItem[]
  totalAmount: number
  currency: string
  fiscalYear: string
  notes?: string
}

export interface BudgetItem {
  id?: number
  category: string
  description: string
  estimatedAmount: number
  actualAmount?: number
  variance?: number
}
