import type { BaseEntity } from '../../shared/types/common'

export interface User extends Partial<BaseEntity> {
  id: number
  name: string
  email: string
  department_id?: number | null
  department?: Department
  roles: readonly Role[]
  is_active: boolean
  last_login_at?: string | null
}

export interface Department {
  id: number
  name: string
  description?: string | null
}

export interface Role {
  id: number
  name: string
  description?: string | null
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  department_id?: number
  role_ids?: number[]
  employee_id?: number
}

export interface UpdateUserData {
  name?: string
  email?: string
  department_id?: number
  is_active?: boolean
  role_ids?: number[]
}

export interface UserFilters {
  search?: string
  department_id?: number
  role_id?: number
  is_active?: boolean
  page?: number
  per_page?: number
}