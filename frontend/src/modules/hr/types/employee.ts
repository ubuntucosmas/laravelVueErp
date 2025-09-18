import type { BaseEntity } from '../../admin/shared/types/common'
import type { Department } from '../../admin/departmentManagement/types/department'

export interface Employee extends BaseEntity {
  user_id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  position: string
  department_id: number
  department?: Department
  hire_date: string
  salary: number
  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern'
  manager_id: number | null
  manager?: Employee
  status: 'active' | 'inactive' | 'terminated' | 'on-leave'
  address: string | null
  date_of_birth: string | null
  emergency_contact: EmergencyContact | null
  performance_rating?: number
  last_review_date?: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface CreateEmployeeData {
  user_id?: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  position: string
  department_id: number
  hire_date: string
  salary: number
  employment_type: 'full-time' | 'part-time' | 'contract' | 'intern'
  manager_id?: number
  address?: string
  date_of_birth?: string
  emergency_contact?: EmergencyContact
}

export interface UpdateEmployeeData {
  employee_id?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  position?: string
  department_id?: number
  hire_date?: string
  salary?: number
  employment_type?: 'full-time' | 'part-time' | 'contract' | 'intern'
  manager_id?: number
  status?: 'active' | 'inactive' | 'terminated' | 'on-leave'
  address?: string
  date_of_birth?: string
  emergency_contact?: EmergencyContact
  performance_rating?: number
  last_review_date?: string
}

export interface EmployeeFilters {
  search?: string
  department?: string
  position?: string
  employment_type?: string
  status?: string
  manager_id?: number
  page?: number
  per_page?: number
}