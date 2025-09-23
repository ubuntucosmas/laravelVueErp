export interface Render {
  id: number
  title: string
  description?: string
  enquiry_id?: number
  project_id?: number
  render_type: 'photorealistic' | 'stylized' | 'wireframe' | 'clay' | 'animation'
  render_quality: 'low' | 'medium' | 'high' | 'ultra'
  status: 'draft' | 'processing' | 'in_review' | 'approved' | 'rejected' | 'revision_requested'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  file_path?: string
  file_url?: string
  file_size?: number
  file_type?: string
  thumbnail_url?: string
  preview_url?: string
  resolution?: {
    width: number
    height: number
  }
  frame_rate?: number // for animations
  duration?: number // for animations in seconds
  created_by: number
  assigned_to?: number
  due_date?: string
  completed_at?: string
  processing_time?: number // in minutes
  created_at: string
  updated_at: string
  comments?: RenderComment[]
  versions?: RenderVersion[]
  lighting_setup?: RenderLighting
  camera_settings?: RenderCamera
}

export interface RenderComment {
  id: number
  render_id: number
  user_id: number
  comment: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
  }
}

export interface RenderVersion {
  id: number
  render_id: number
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
  render_settings?: RenderSettings
}

export interface RenderSettings {
  engine: 'cycles' | 'eevee' | 'arnold' | 'vray' | 'corona'
  samples: number
  resolution: {
    width: number
    height: number
  }
  lighting: string
  materials: string
  environment: string
}

export interface RenderLighting {
  type: 'hdri' | 'studio' | 'natural' | 'artificial'
  intensity: number
  color_temperature?: number
  hdri_path?: string
  lights?: RenderLight[]
}

export interface RenderLight {
  type: 'point' | 'spot' | 'area' | 'sun'
  position: {
    x: number
    y: number
    z: number
  }
  intensity: number
  color: string
}

export interface RenderCamera {
  type: 'perspective' | 'orthographic'
  focal_length: number
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
  aperture: number
  focus_distance: number
}

export interface RenderFilter {
  status?: string[]
  render_type?: string[]
  render_quality?: string[]
  priority?: string[]
  assigned_to?: number[]
  created_by?: number[]
  date_from?: string
  date_to?: string
}

export interface RenderStats {
  total: number
  draft: number
  processing: number
  in_review: number
  approved: number
  rejected: number
  revision_requested: number
}
