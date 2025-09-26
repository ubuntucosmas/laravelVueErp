// src/modules/production/types/index.ts
export interface WorkOrder {
    id: number
    project_id: number
    title: string
    description?: string
    status: 'draft' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    start_date?: string
    due_date?: string
    completed_at?: string
    created_at: string
    updated_at: string
    tasks?: ProductionTask[]
    materials?: MaterialRequirement[]
    project?: {
      id: number
      title: string
      client?: {
        id: number
        name: string
      }
    }
  }
  
  export interface ProductionTask {
    id: number
    work_order_id: number
    title: string
    description?: string
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold'
    assigned_to?: {
      id: number
      name: string
      avatar?: string
    }
    start_date?: string
    due_date?: string
    completed_at?: string
    created_at: string
    updated_at: string
  }
  
  export interface MaterialRequirement {
    id: number
    work_order_id: number
    material_id: number
    material: {
      id: number
      name: string
      sku?: string
      unit: string
      unit_price: number
    }
    quantity: number
    quantity_used?: number
    notes?: string
  }
  
  export interface QualityCheck {
    id: number
    work_order_id: number
    task_id?: number
    status: 'pass' | 'fail' | 'pending'
    checked_by: {
      id: number
      name: string
    }
    checked_at: string
    notes?: string
    issues?: QualityIssue[]
  }
  
  export interface QualityIssue {
    id: number
    quality_check_id: number
    description: string
    status: 'open' | 'in_progress' | 'resolved'
    resolved_at?: string
    resolved_by?: {
      id: number
      name: string
    }
    resolution_notes?: string
    created_at: string
    updated_at: string
  }