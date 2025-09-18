import type { BaseEntity } from '../../shared/types/common'

export interface Employee extends BaseEntity {
  name: string
  email: string
  phone?: string
  position?: string
  department_id: number | null
  department?: Department
  hire_date?: string
  salary?: number
  is_active: boolean
}

export interface Department {
  id: number
  name: string
  description: string | null
}

export interface CreateEmployeeData {
  name: string
  email: string
  phone?: string
  position?: string
  department_id?: number
  hire_date?: string
  salary?: number
}

export interface UpdateEmployeeData {
  name?: string
  email?: string
  phone?: string
  position?: string
  department_id?: number
  hire_date?: string
  salary?: number
  is_active?: boolean
}

export interface EmployeeFilters {
  search?: string
  department_id?: number
  is_active?: boolean
  page?: number
  per_page?: number
}