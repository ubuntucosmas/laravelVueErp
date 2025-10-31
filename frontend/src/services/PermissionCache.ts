interface PermissionCache {
  [key: string]: boolean
}

interface PermissionData {
  permissions: {
    accessible_departments: number[]
    user_department?: {
      id: number
      name: string
    }
  }
  user_permissions: string[]
  effective_permissions?: string[]
}

const cache: PermissionCache = {}
let permissionData: PermissionData | null = null

export const permissionCache = {
  get: (key: string): boolean | undefined => {
    return cache[key]
  },
  set: (key: string, value: boolean): void => {
    cache[key] = value
  },
  has: (key: string): boolean => {
    return key in cache
  },
  clear: (): void => {
    Object.keys(cache).forEach(key => delete cache[key])
    permissionData = null
  },
  // New methods for handling permission data
  setPermissionData: (data: PermissionData): void => {
    permissionData = data
  },
  getPermissions: (): PermissionData | null => {
    return permissionData
  },
  getAccessibleDepartments: (): number[] => {
    return permissionData?.permissions?.accessible_departments || []
  }
}
