export interface MaterialItem {
  id: number
  name: string
  unitOfMeasure: string
  quantity: number
  unitPrice: number
  totalPrice: number
  comment?: string
  category: 'production' | 'hire'
  supplier?: string
  status: 'pending' | 'ordered' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface MaterialList {
  id: number
  project_id?: number
  enquiry_id?: number
  title: string
  description?: string
  items: MaterialItem[]
  totalCost: number
  status: 'draft' | 'approved' | 'finalized'
  created_by: number
  created_at: string
  updated_at: string
}

export interface MaterialCategory {
  id: string
  name: string
  icon: string
  color: string
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'production',
    name: 'Production Items',
    icon: 'bi-gear',
    color: 'blue'
  },
  {
    id: 'hire',
    name: 'Items for Hire',
    icon: 'bi-calendar-check',
    color: 'green'
  }
]

export const UNIT_OF_MEASURES = [
  'pieces',
  'meters',
  'kilograms',
  'liters',
  'hours',
  'days',
  'sets',
  'boxes',
  'rolls',
  'sheets'
]
