export const PERMISSIONS = {
  // Define permissions here
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_REPORTS: 'view_reports',
  // Add more as needed
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]
