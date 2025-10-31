import { ref, computed } from 'vue'

// Permission types for petty cash module
export type PettyCashPermission = 
  | 'petty_cash.view'
  | 'petty_cash.create_top_up'
  | 'petty_cash.create_disbursement'
  | 'petty_cash.edit_disbursement'
  | 'petty_cash.void_disbursement'
  | 'petty_cash.view_balance'
  | 'petty_cash.recalculate_balance'
  | 'petty_cash.view_reports'
  | 'petty_cash.export_data'
  | 'petty_cash.manage_settings'

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  VIEW: ['petty_cash.view', 'petty_cash.view_balance'],
  CREATE: ['petty_cash.create_top_up', 'petty_cash.create_disbursement'],
  EDIT: ['petty_cash.edit_disbursement', 'petty_cash.void_disbursement'],
  ADMIN: ['petty_cash.recalculate_balance', 'petty_cash.manage_settings'],
  REPORTS: ['petty_cash.view_reports', 'petty_cash.export_data']
} as const

// User role types
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer'

// Permission error types
export interface PermissionError {
  code: 'PERMISSION_DENIED' | 'ROLE_INSUFFICIENT' | 'FEATURE_DISABLED'
  message: string
  requiredPermission?: PettyCashPermission
  userRole?: UserRole
  suggestedAction?: string
}

// Mock user data - in real app this would come from auth store/API
interface User {
  id: number
  name: string
  email: string
  role: UserRole
  permissions: PettyCashPermission[]
  isActive: boolean
}

// Default permissions by role
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PettyCashPermission[]> = {
  admin: [
    'petty_cash.view',
    'petty_cash.create_top_up',
    'petty_cash.create_disbursement',
    'petty_cash.edit_disbursement',
    'petty_cash.void_disbursement',
    'petty_cash.view_balance',
    'petty_cash.recalculate_balance',
    'petty_cash.view_reports',
    'petty_cash.export_data',
    'petty_cash.manage_settings'
  ],
  manager: [
    'petty_cash.view',
    'petty_cash.create_top_up',
    'petty_cash.create_disbursement',
    'petty_cash.edit_disbursement',
    'petty_cash.void_disbursement',
    'petty_cash.view_balance',
    'petty_cash.view_reports',
    'petty_cash.export_data'
  ],
  user: [
    'petty_cash.view',
    'petty_cash.create_disbursement',
    'petty_cash.view_balance',
    'petty_cash.view_reports'
  ],
  viewer: [
    'petty_cash.view',
    'petty_cash.view_balance',
    'petty_cash.view_reports'
  ]
}

export function usePermissions() {
  // Mock current user - in real app this would come from auth store
  const currentUser = ref<User | null>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'manager',
    permissions: DEFAULT_ROLE_PERMISSIONS.manager,
    isActive: true
  })

  const isLoading = ref(false)
  const error = ref<PermissionError | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!currentUser.value)
  const userRole = computed(() => currentUser.value?.role || 'viewer')
  const userPermissions = computed(() => currentUser.value?.permissions || [])
  const isActive = computed(() => currentUser.value?.isActive || false)

  // Permission checking methods
  const hasPermission = (permission: PettyCashPermission): boolean => {
    if (!isAuthenticated.value || !isActive.value) {
      return false
    }

    return userPermissions.value.includes(permission)
  }

  const hasAnyPermission = (permissions: PettyCashPermission[]): boolean => {
    if (!isAuthenticated.value || !isActive.value) {
      return false
    }

    return permissions.some(permission => userPermissions.value.includes(permission))
  }

  const hasAllPermissions = (permissions: PettyCashPermission[]): boolean => {
    if (!isAuthenticated.value || !isActive.value) {
      return false
    }

    return permissions.every(permission => userPermissions.value.includes(permission))
  }

  const hasRole = (role: UserRole): boolean => {
    return userRole.value === role
  }

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      user: 2,
      manager: 3,
      admin: 4
    }

    const currentRoleLevel = roleHierarchy[userRole.value] || 0
    const requiredRoleLevel = roleHierarchy[minimumRole] || 0

    return currentRoleLevel >= requiredRoleLevel
  }

  // Permission group checks
  const canView = computed(() => hasAnyPermission(PERMISSION_GROUPS.VIEW))
  const canCreate = computed(() => hasAnyPermission(PERMISSION_GROUPS.CREATE))
  const canEdit = computed(() => hasAnyPermission(PERMISSION_GROUPS.EDIT))
  const canAdmin = computed(() => hasAnyPermission(PERMISSION_GROUPS.ADMIN))
  const canViewReports = computed(() => hasAnyPermission(PERMISSION_GROUPS.REPORTS))

  // Specific permission checks
  const canCreateTopUp = computed(() => hasPermission('petty_cash.create_top_up'))
  const canCreateDisbursement = computed(() => hasPermission('petty_cash.create_disbursement'))
  const canEditDisbursement = computed(() => hasPermission('petty_cash.edit_disbursement'))
  const canVoidDisbursement = computed(() => hasPermission('petty_cash.void_disbursement'))
  const canViewBalance = computed(() => hasPermission('petty_cash.view_balance'))
  const canRecalculateBalance = computed(() => hasPermission('petty_cash.recalculate_balance'))
  const canExportData = computed(() => hasPermission('petty_cash.export_data'))
  const canManageSettings = computed(() => hasPermission('petty_cash.manage_settings'))

  // Permission validation with error handling
  const requirePermission = (permission: PettyCashPermission): void => {
    if (!isAuthenticated.value) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: 'Authentication required',
        suggestedAction: 'Please log in to continue'
      }
      throw error
    }

    if (!isActive.value) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: 'Account is inactive',
        suggestedAction: 'Please contact your administrator'
      }
      throw error
    }

    if (!hasPermission(permission)) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: `Permission '${permission}' is required`,
        requiredPermission: permission,
        userRole: userRole.value,
        suggestedAction: 'Contact your administrator for access permissions'
      }
      throw error
    }
  }

  const requireAnyPermission = (permissions: PettyCashPermission[]): void => {
    if (!isAuthenticated.value) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: 'Authentication required',
        suggestedAction: 'Please log in to continue'
      }
      throw error
    }

    if (!hasAnyPermission(permissions)) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: `One of the following permissions is required: ${permissions.join(', ')}`,
        userRole: userRole.value,
        suggestedAction: 'Contact your administrator for access permissions'
      }
      throw error
    }
  }

  const requireRole = (role: UserRole): void => {
    if (!isAuthenticated.value) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: 'Authentication required',
        suggestedAction: 'Please log in to continue'
      }
      throw error
    }

    if (!hasRole(role)) {
      const error: PermissionError = {
        code: 'ROLE_INSUFFICIENT',
        message: `Role '${role}' is required`,
        userRole: userRole.value,
        suggestedAction: 'Contact your administrator for role upgrade'
      }
      throw error
    }
  }

  const requireMinimumRole = (minimumRole: UserRole): void => {
    if (!isAuthenticated.value) {
      const error: PermissionError = {
        code: 'PERMISSION_DENIED',
        message: 'Authentication required',
        suggestedAction: 'Please log in to continue'
      }
      throw error
    }

    if (!hasMinimumRole(minimumRole)) {
      const error: PermissionError = {
        code: 'ROLE_INSUFFICIENT',
        message: `Minimum role '${minimumRole}' is required`,
        userRole: userRole.value,
        suggestedAction: 'Contact your administrator for role upgrade'
      }
      throw error
    }
  }

  // Utility methods
  const getPermissionError = (permission: PettyCashPermission): PermissionError | null => {
    try {
      requirePermission(permission)
      return null
    } catch (error) {
      return error as PermissionError
    }
  }

  const getUserFriendlyPermissionName = (permission: PettyCashPermission): string => {
    const permissionNames: Record<PettyCashPermission, string> = {
      'petty_cash.view': 'View Petty Cash',
      'petty_cash.create_top_up': 'Create Top-ups',
      'petty_cash.create_disbursement': 'Create Disbursements',
      'petty_cash.edit_disbursement': 'Edit Disbursements',
      'petty_cash.void_disbursement': 'Void Disbursements',
      'petty_cash.view_balance': 'View Balance',
      'petty_cash.recalculate_balance': 'Recalculate Balance',
      'petty_cash.view_reports': 'View Reports',
      'petty_cash.export_data': 'Export Data',
      'petty_cash.manage_settings': 'Manage Settings'
    }

    return permissionNames[permission] || permission
  }

  const getUserFriendlyRoleName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      admin: 'Administrator',
      manager: 'Manager',
      user: 'User',
      viewer: 'Viewer'
    }

    return roleNames[role] || role
  }

  // Mock methods for updating user data (in real app these would call APIs)
  const refreshPermissions = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, this would fetch fresh user data from API
      // For now, just simulate success
      console.log('Permissions refreshed')
    } catch (err) {
      error.value = {
        code: 'PERMISSION_DENIED',
        message: 'Failed to refresh permissions',
        suggestedAction: 'Please try again or contact support'
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateUserRole = (newRole: UserRole): void => {
    if (currentUser.value) {
      currentUser.value.role = newRole
      currentUser.value.permissions = DEFAULT_ROLE_PERMISSIONS[newRole]
    }
  }

  // Clear error
  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    currentUser,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    userRole,
    userPermissions,
    isActive,
    canView,
    canCreate,
    canEdit,
    canAdmin,
    canViewReports,
    canCreateTopUp,
    canCreateDisbursement,
    canEditDisbursement,
    canVoidDisbursement,
    canViewBalance,
    canRecalculateBalance,
    canExportData,
    canManageSettings,

    // Methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasMinimumRole,
    requirePermission,
    requireAnyPermission,
    requireRole,
    requireMinimumRole,
    getPermissionError,
    getUserFriendlyPermissionName,
    getUserFriendlyRoleName,
    refreshPermissions,
    updateUserRole,
    clearError
  }
}