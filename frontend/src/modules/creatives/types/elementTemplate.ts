export interface ElementTemplate {
  id: string
  name: string
  description?: string
  category: 'production' | 'hire'
  elements: TemplateElement[]
  tags?: string[]
  created_by: number
  created_at: string
  updated_at: string
  usage_count?: number
}

export interface TemplateElement {
  id: string
  elementName: string
  description?: string
  category: 'production' | 'hire'
  subItems: TemplateSubItem[]
}

export interface TemplateSubItem {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  category: 'production' | 'hire'
  comment?: string
}

export interface ElementTemplateFilter {
  search?: string
  category?: 'production' | 'hire' | ''
  tags?: string[]
  sortBy?: 'name' | 'created_at' | 'usage_count'
  sortOrder?: 'asc' | 'desc'
}

export interface ElementTemplateStats {
  total: number
  production: number
  hire: number
  mostUsed: ElementTemplate | null
}
