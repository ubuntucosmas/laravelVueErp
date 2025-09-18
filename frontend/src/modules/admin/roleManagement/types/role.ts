import type { BaseEntity } from '../../shared/types/common'

export interface Role extends BaseEntity {
  name: string
  description: string | null
  permissions: readonly Permission[]
  user_count?: number
}

export interface Permission extends BaseEntity {
  name: string
  module: string
  description: string | null
}

export interface CreateRoleData {
  name: string
  description?: string
  permission_ids: number[]
}

export interface UpdateRoleData {
  name?: string
  description?: string
  permission_ids?: number[]
}

export interface RoleFilters {
  search?: string
  page?: number
  per_page?: number
}

export interface PermissionGroup {
  module: string
  permissions: Permission[]
}