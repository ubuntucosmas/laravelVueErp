export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface SelectOption {
  value: string | number
  label: string
}

export interface FilterOptions {
  search?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  [key: string]: any
}