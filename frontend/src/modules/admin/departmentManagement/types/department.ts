import type { BaseEntity } from '../../shared/types/common'
import type { Employee } from '../../../hr/types/employee'

export interface Department extends BaseEntity {
  name: string
  description: string | null
  manager_id: number | null
  manager?: Employee
  employees: readonly Employee[]
  user_count?: number
  budget?: number | string | null
  location?: string | null
}

export interface CreateDepartmentData {
  name: string
  description?: string
  manager_id?: number
  budget?: number
  location?: string
}

export interface UpdateDepartmentData {
  name?: string
  description?: string
  manager_id?: number
  budget?: number
  location?: string
}

export interface DepartmentFilters {
  search?: string
  has_manager?: boolean
  page?: number
  per_page?: number
}