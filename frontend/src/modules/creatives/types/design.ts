export interface Design {
  id: number
  title: string
  description?: string
  enquiry_id?: number
  project_id?: number
  design_type: 'concept' | 'detailed' | 'final'
  status: 'draft' | 'in_review' | 'approved' | 'rejected' | 'revision_requested'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  file_path?: string
  file_url?: string
  file_size?: number
  file_type?: string
  thumbnail_url?: string
  created_by: number
  assigned_to?: number
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
  comments?: DesignComment[]
  versions?: DesignVersion[]
}

export interface DesignComment {
  id: number
  design_id: number
  user_id: number
  comment: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
  }
}

export interface DesignVersion {
  id: number
  design_id: number
  version_number: number
  file_path: string
  file_url: string
  file_size: number
  file_type: string
  thumbnail_url?: string
  created_by: number
  created_at: string
  changes_description?: string
}

export interface DesignFilter {
  status?: string[]
  design_type?: string[]
  priority?: string[]
  assigned_to?: number[]
  created_by?: number[]
  date_from?: string
  date_to?: string
}

export interface DesignStats {
  total: number
  draft: number
  in_review: number
  approved: number
  rejected: number
  revision_requested: number
}
