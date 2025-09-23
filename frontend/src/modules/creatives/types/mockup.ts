export interface Mockup {
  id: number
  title: string
  description?: string
  enquiry_id?: number
  project_id?: number
  mockup_type: '2d' | '3d' | 'interactive' | 'physical'
  status: 'draft' | 'in_review' | 'approved' | 'rejected' | 'revision_requested'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  file_path?: string
  file_url?: string
  file_size?: number
  file_type?: string
  thumbnail_url?: string
  preview_url?: string
  dimensions?: {
    width: number
    height: number
    unit: 'mm' | 'cm' | 'inches'
  }
  created_by: number
  assigned_to?: number
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  comments?: MockupComment[]
  versions?: MockupVersion[]
  materials_used?: MockupMaterial[]
}

export interface MockupComment {
  id: number
  mockup_id: number
  user_id: number
  comment: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
  }
}

export interface MockupVersion {
  id: number
  mockup_id: number
  version_number: number
  file_path: string
  file_url: string
  file_size: number
  file_type: string
  thumbnail_url?: string
  preview_url?: string
  created_by: number
  created_at: string
  changes_description?: string
}

export interface MockupMaterial {
  id: number
  mockup_id: number
  material_name: string
  quantity: number
  unit: string
  estimated_cost: number
  supplier?: string
  notes?: string
}

export interface MockupFilter {
  status?: string[]
  mockup_type?: string[]
  priority?: string[]
  assigned_to?: number[]
  created_by?: number[]
  date_from?: string
  date_to?: string
}

export interface MockupStats {
  total: number
  draft: number
  in_review: number
  approved: number
  rejected: number
  revision_requested: number
}
