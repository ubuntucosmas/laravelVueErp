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

export interface MaterialCost {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  category: 'production' | 'hire'
  totalCost: number
}

export interface LaborItem {
  id: string
  description: string
  hours: number
  ratePerHour: number
}

export interface LogisticsItem {
  id: string
  description: string
  amount: number
}

export interface MiscItem {
  id: string
  name: string
  amount: number
  notes: string
}

export interface AdditionalItem {
  id: string
  name: string
  description: string
  materials: MaterialCost[]
  workshopLabor: LaborItem[]
  siteLabor: LaborItem[]
  logisticsCosts: LogisticsItem[]
  miscCosts: MiscItem[]
  subtotal: number
}

export interface DetailedBudgetData {
  materialCosts: MaterialCost[]
  workshopLabor: LaborItem[]
  siteLabor: LaborItem[]
  logisticsCosts: LogisticsItem[]
  miscCosts: MiscItem[]
  additionals: AdditionalItem[]
  totals: {
    materialSubtotal: number
    laborSubtotal: number
    logisticsSubtotal: number
    miscSubtotal: number
    additionalsSubtotal: number
    totalBudget: number
  }
}
