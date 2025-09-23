export interface CreativeTask {
  id: number
  title: string
  description?: string
  enquiry_id: number
  project_id?: number
  task_type: 'design' | 'mockup' | 'render' | 'material_list'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'review' | 'approved' | 'rejected' | 'completed'
  assigned_to?: number // User ID of assigned designer
  assigned_by: number // User ID of design lead who assigned
  due_date?: string
  completed_at?: string
  estimated_hours?: number
  actual_hours?: number
  progress_percentage: number
  created_at: string
  updated_at: string

  // Related data
  enquiry?: {
    id: number
    title: string
    client_name: string
    description?: string
  }

  assigned_user?: {
    id: number
    name: string
    email: string
  }

  assigned_by_user?: {
    id: number
    name: string
    email: string
  }

  // Task-specific data
  design_data?: Partial<DesignTaskData>
  mockup_data?: Partial<MockupTaskData>
  render_data?: Partial<RenderTaskData>
  material_data?: Partial<MaterialTaskData>

  // Comments and communication
  comments?: TaskComment[]
}

export interface DesignTaskData {
  design_type: 'concept' | 'detailed' | 'final'
  specifications?: string
  dimensions?: {
    width: number
    height: number
    unit: 'mm' | 'cm' | 'inches'
  }
  color_scheme?: string
  style_preferences?: string
  reference_materials?: string[]
}

export interface MockupTaskData {
  mockup_type: '2d' | '3d' | 'interactive' | 'physical'
  scale?: number
  materials_needed?: string[]
  complexity_level: 'simple' | 'medium' | 'complex'
  presentation_format?: 'digital' | 'physical' | 'both'
}

export interface RenderTaskData {
  render_type: 'photorealistic' | 'stylized' | 'wireframe' | 'clay' | 'animation'
  quality: 'low' | 'medium' | 'high' | 'ultra'
  output_format: 'image' | 'video' | 'both'
  resolution?: {
    width: number
    height: number
  }
  lighting_requirements?: string
  camera_angles?: string[]
}

export interface MaterialTaskData {
  category_focus: 'production' | 'hire' | 'both'
  budget_range?: {
    min: number
    max: number
  }
  preferred_suppliers?: string[]
  quality_requirements?: string
  timeline_requirements?: string
}

export interface TaskFilter {
  status?: string[]
  task_type?: string[]
  priority?: string[]
  assigned_to?: number[]
  assigned_by?: number[]
  enquiry_id?: number[]
  date_from?: string
  date_to?: string
}

export interface TaskStats {
  total: number
  pending: number
  assigned: number
  in_progress: number
  review: number
  approved: number
  completed: number
  overdue: number
}

export interface TaskComment {
  id: number
  task_id: number
  user_id: number
  comment: string
  is_internal: boolean // Internal notes vs client communication
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
  }
}

export interface TaskAssignment {
  task_id: number
  assigned_to: number
  assigned_by: number
  assigned_at: string
  notes?: string
}

export interface CreateCreativeTaskData {
  title: string
  description?: string
  enquiry_id: number
  project_id?: number
  task_type: 'design' | 'mockup' | 'render' | 'material_list'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: number
  assigned_by: number
  due_date?: string
  estimated_hours?: number
  progress_percentage: number

  // Task-specific data
  design_data?: Partial<DesignTaskData>
  mockup_data?: Partial<MockupTaskData>
  render_data?: Partial<RenderTaskData>
  material_data?: Partial<MaterialTaskData>
}
