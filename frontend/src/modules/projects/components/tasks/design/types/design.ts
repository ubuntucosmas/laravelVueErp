export interface DesignAsset {
  id: string
  name: string
  type: string
  size: string
  sizeBytes: number
  url: string
  preview?: string
  thumbnail?: string
  category: AssetCategory
  status: AssetStatus
  uploadedAt: string // ISO date string from backend
  uploadedBy: string
  uploadedById: number
  description?: string
  tags?: string[]
  version?: number
  parentAssetId?: string // For version control
  metadata?: AssetMetadata
  error?: string
  // Backend relationships
  uploader?: {
    id: number
    name: string
  }
  approver?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export interface AssetMetadata {
  width?: number
  height?: number
  dpi?: number
  colorSpace?: string
  software?: string
  exif?: Record<string, unknown>
  checksum?: string
}

export interface FileUpload {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled'
  asset?: DesignAsset
  error?: string
  abortController?: AbortController
}

export interface AssetFilters {
  search: string
  category: string
  status: string
  dateRange?: {
    start: Date
    end: Date
  }
  uploadedBy?: number
}

export interface DesignTaskData {
  assets: DesignAsset[]
  uploads: FileUpload[]
  filters: AssetFilters
  stats: {
    total: number
    approved: number
    pending: number
    rejected: number
    uploading: number
  }
}

export type AssetCategory =
  | 'concept'
  | 'mockup'
  | 'artwork'
  | 'logo'
  | 'ui-ux'
  | 'illustration'
  | 'prototype'
  | 'presentation'
  | 'other'

export type AssetStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'revision'
  | 'archived'

export interface UploadConfig {
  maxFileSize: number // in bytes
  allowedTypes: string[]
  maxConcurrentUploads: number
  chunkSize: number // for resumable uploads
  retryAttempts: number
  retryDelay: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface UploadResult {
  success: boolean
  asset?: DesignAsset
  error?: string
  retryable?: boolean
}

export interface DesignServiceConfig {
  apiBaseUrl: string
  uploadEndpoint: string
  assetEndpoint: string
  maxRetries: number
  timeout: number
}
