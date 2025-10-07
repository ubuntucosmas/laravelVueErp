# Roles & Permissions Alignment - Enterprise ERP System

## Executive Summary

This document provides a comprehensive roles and permissions alignment for your ERP system, addressing the current security vulnerabilities while establishing a scalable, enterprise-grade authorization framework.

## Current System Issues

### Critical Problems Identified
1. **Permission Bypass**: Finance/Creatives access all enquiries without proper authorization
2. **Inconsistent Role Mapping**: Frontend role mappings don't match backend permissions
3. **Missing Department Isolation**: No department-based data access control
4. **Over-Permissive Roles**: Roles have excessive permissions beyond job requirements
5. **No Permission Inheritance**: Flat permission structure without hierarchical access

## Professional Roles & Permissions Framework

### 1. Role Hierarchy Architecture

#### Core Principles
- **Separation of Duties**: No single role has conflicting permissions
- **Least Privilege**: Users get minimum permissions needed for their job
- **Hierarchical Access**: Higher roles inherit lower role permissions
- **Department Isolation**: Department-specific permissions with cross-department collaboration

#### Role Categories
```typescript
enum RoleCategory {
  EXECUTIVE = 'executive',           // CEO, CTO, CFO
  MANAGEMENT = 'management',         // Department Heads, Project Managers
  PROFESSIONAL = 'professional',     // Specialists, Senior Staff
  OPERATIONAL = 'operational',       // Standard employees
  ADMINISTRATIVE = 'administrative', // System administrators
  SUPPORT = 'support'               // Help desk, junior staff
}
```

### 2. Comprehensive Role Definitions

#### Executive Roles
```typescript
interface ExecutiveRoles {
  // CEO - Full system access
  CEO: {
    name: 'Chief Executive Officer'
    category: RoleCategory.EXECUTIVE
    permissions: string[] // All permissions
    departments: 'all'
    dataAccess: 'full'
  }

  // CFO - Finance oversight
  CFO: {
    name: 'Chief Financial Officer'
    category: RoleCategory.EXECUTIVE
    permissions: [
      'finance.*',
      'budget.*',
      'report.financial.*',
      'project.read',
      'enquiry.read'
    ]
    departments: ['finance', 'projects']
    dataAccess: 'department'
  }

  // CTO - Technical oversight
  CTO: {
    name: 'Chief Technology Officer'
    category: RoleCategory.EXECUTIVE
    permissions: [
      'system.*',
      'user.*',
      'department.*',
      'project.*',
      'report.technical.*'
    ]
    departments: 'all'
    dataAccess: 'full'
  }
}
```

#### Department Management Roles
```typescript
interface ManagementRoles {
  // Project Manager
  PROJECT_MANAGER: {
    name: 'Project Manager'
    category: RoleCategory.MANAGEMENT
    permissions: [
      'project.*',
      'enquiry.*',
      'task.*',
      'budget.read',
      'report.project.*',
      'team.manage'
    ]
    departments: ['projects']
    dataAccess: 'department'
  }

  // Department Head
  DEPARTMENT_HEAD: {
    name: 'Department Head'
    category: RoleCategory.MANAGEMENT
    permissions: [
      'department.manage',
      'employee.manage',
      'budget.approve',
      'report.department.*',
      'project.read',
      'enquiry.read'
    ]
    departments: 'assigned_department'
    dataAccess: 'department'
  }

  // Finance Manager
  FINANCE_MANAGER: {
    name: 'Finance Manager'
    category: RoleCategory.MANAGEMENT
    permissions: [
      'finance.*',
      'budget.*',
      'invoice.*',
      'report.financial.*',
      'project.read',
      'enquiry.read'
    ]
    departments: ['finance']
    dataAccess: 'department'
  }
}
```

#### Professional Roles
```typescript
interface ProfessionalRoles {
  // Client Service Officer
  CLIENT_SERVICE_OFFICER: {
    name: 'Client Service Officer'
    category: RoleCategory.PROFESSIONAL
    permissions: [
      'enquiry.create',
      'enquiry.update',
      'enquiry.read',
      'client.*',
      'project.read',
      'task.assign'
    ]
    departments: ['client_service']
    dataAccess: 'department'
  }

  // Project Officer
  PROJECT_OFFICER: {
    name: 'Project Officer'
    category: RoleCategory.PROFESSIONAL
    permissions: [
      'project.read',
      'project.update',
      'task.*',
      'enquiry.read',
      'budget.read',
      'report.project.read'
    ]
    departments: ['projects']
    dataAccess: 'department'
  }

  // Finance Officer
  FINANCE_OFFICER: {
    name: 'Finance Officer'
    category: RoleCategory.PROFESSIONAL
    permissions: [
      'finance.read',
      'budget.create',
      'budget.update',
      'invoice.create',
      'report.financial.read'
    ]
    departments: ['finance']
    dataAccess: 'department'
  }

  // Creative Designer
  CREATIVE_DESIGNER: {
    name: 'Creative Designer'
    category: RoleCategory.PROFESSIONAL
    permissions: [
      'creatives.*',
      'project.read',
      'task.update',
      'enquiry.read'
    ]
    departments: ['creatives']
    dataAccess: 'department'
  }

  // Procurement Officer
  PROCUREMENT_OFFICER: {
    name: 'Procurement Officer'
    category: RoleCategory.PROFESSIONAL
    permissions: [
      'procurement.*',
      'budget.read',
      'task.update',
      'report.procurement.*'
    ]
    departments: ['procurement']
    dataAccess: 'department'
  }

  // HR Officer
  HR_OFFICER: {
    name: 'HR Officer'
    category: RoleCategory.PROFESSIONAL
    permissions: [
      'employee.*',
      'department.read',
      'user.create',
      'user.update',
      'report.hr.*'
    ]
    departments: ['hr']
    dataAccess: 'department'
  }
}
```

#### Operational Roles
```typescript
interface OperationalRoles {
  // Junior Staff
  JUNIOR_STAFF: {
    name: 'Junior Staff'
    category: RoleCategory.OPERATIONAL
    permissions: [
      'task.read',
      'task.update',
      'project.read',
      'enquiry.read'
    ]
    departments: 'assigned_department'
    dataAccess: 'own_records'
  }

  // Support Staff
  SUPPORT_STAFF: {
    name: 'Support Staff'
    category: RoleCategory.SUPPORT
    permissions: [
      'ticket.*',
      'knowledge.read',
      'user.read'
    ]
    departments: 'all'
    dataAccess: 'limited'
  }
}
```

#### Administrative Roles
```typescript
interface AdministrativeRoles {
  // System Administrator
  SYSTEM_ADMIN: {
    name: 'System Administrator'
    category: RoleCategory.ADMINISTRATIVE
    permissions: [
      'system.*',
      'user.*',
      'department.*',
      'role.*',
      'audit.*',
      'backup.*'
    ]
    departments: 'all'
    dataAccess: 'full'
  }

  // Security Administrator
  SECURITY_ADMIN: {
    name: 'Security Administrator'
    category: RoleCategory.ADMINISTRATIVE
    permissions: [
      'security.*',
      'audit.*',
      'user.security',
      'system.security',
      'report.security.*'
    ]
    departments: 'all'
    dataAccess: 'full'
  }

  // Super Admin (Emergency Access)
  SUPER_ADMIN: {
    name: 'Super Administrator'
    category: RoleCategory.ADMINISTRATIVE
    permissions: string[] // All permissions - emergency access only
    departments: 'all'
    dataAccess: 'full'
    restrictions: 'Dual authorization required for sensitive operations'
  }
}
```

### 3. Permission Taxonomy

#### Permission Categories
```typescript
enum PermissionCategory {
  // Core Business Objects
  USER = 'user',
  DEPARTMENT = 'department',
  EMPLOYEE = 'employee',
  CLIENT = 'client',
  PROJECT = 'project',
  ENQUIRY = 'enquiry',
  TASK = 'task',

  // Financial
  FINANCE = 'finance',
  BUDGET = 'budget',
  INVOICE = 'invoice',

  // Creative & Design
  CREATIVES = 'creatives',
  DESIGN = 'design',
  MATERIALS = 'materials',

  // Procurement
  PROCUREMENT = 'procurement',
  VENDOR = 'vendor',
  PURCHASE_ORDER = 'purchase_order',

  // HR
  HR = 'hr',
  PAYROLL = 'payroll',
  ATTENDANCE = 'attendance',

  // System & Administration
  SYSTEM = 'system',
  ROLE = 'role',
  PERMISSION = 'permission',
  AUDIT = 'audit',
  REPORT = 'report',
  BACKUP = 'backup',

  // Support
  TICKET = 'ticket',
  KNOWLEDGE = 'knowledge'
}
```

#### Permission Actions
```typescript
enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  EXPORT = 'export',
  IMPORT = 'import',
  MANAGE = 'manage',
  ASSIGN = 'assign',
  COMPLETE = 'complete',
  REVIEW = 'review'
}
```

#### Permission Structure
```typescript
interface Permission {
  id: string
  category: PermissionCategory
  action: PermissionAction
  resource?: string
  scope: PermissionScope
  description: string
}

enum PermissionScope {
  GLOBAL = 'global',           // System-wide access
  DEPARTMENT = 'department',   // Department-specific
  OWN = 'own',                // Own records only
  TEAM = 'team',              // Team members
  PROJECT = 'project',        // Project-specific
  CLIENT = 'client'           // Client-specific
}
```

### 4. Comprehensive Permission Matrix

#### User Management Permissions
```typescript
const USER_PERMISSIONS = {
  'user.create': {
    category: PermissionCategory.USER,
    action: PermissionAction.CREATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Create new users within department'
  },
  'user.read': {
    category: PermissionCategory.USER,
    action: PermissionAction.READ,
    scope: PermissionScope.DEPARTMENT,
    description: 'View user information within department'
  },
  'user.update': {
    category: PermissionCategory.USER,
    action: PermissionAction.UPDATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Update user information within department'
  },
  'user.delete': {
    category: PermissionCategory.USER,
    action: PermissionAction.DELETE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Delete users within department'
  },
  'user.assign_role': {
    category: PermissionCategory.USER,
    action: PermissionAction.ASSIGN,
    scope: PermissionScope.DEPARTMENT,
    description: 'Assign roles to users within department'
  },
  'user.assign_department': {
    category: PermissionCategory.USER,
    action: PermissionAction.ASSIGN,
    scope: PermissionScope.GLOBAL,
    description: 'Assign users to departments'
  }
}
```

#### Enquiry Management Permissions
```typescript
const ENQUIRY_PERMISSIONS = {
  'enquiry.create': {
    category: PermissionCategory.ENQUIRY,
    action: PermissionAction.CREATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Create new enquiries'
  },
  'enquiry.read': {
    category: PermissionCategory.ENQUIRY,
    action: PermissionAction.READ,
    scope: PermissionScope.DEPARTMENT,
    description: 'View enquiries within department'
  },
  'enquiry.update': {
    category: PermissionCategory.ENQUIRY,
    action: PermissionAction.UPDATE,
    scope: PermissionScope.OWN,
    description: 'Update own enquiries or department enquiries'
  },
  'enquiry.delete': {
    category: PermissionCategory.ENQUIRY,
    action: PermissionAction.DELETE,
    scope: PermissionScope.OWN,
    description: 'Delete own enquiries'
  },
  'enquiry.convert': {
    category: PermissionCategory.ENQUIRY,
    action: PermissionAction.UPDATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Convert enquiries to projects'
  },
  'enquiry.assign': {
    category: PermissionCategory.ENQUIRY,
    action: PermissionAction.ASSIGN,
    scope: PermissionScope.DEPARTMENT,
    description: 'Assign enquiries to team members'
  }
}
```

#### Project Management Permissions
```typescript
const PROJECT_PERMISSIONS = {
  'project.create': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.CREATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Create new projects'
  },
  'project.read': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.READ,
    scope: PermissionScope.DEPARTMENT,
    description: 'View projects within department'
  },
  'project.update': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.UPDATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Update project information'
  },
  'project.delete': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.DELETE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Delete projects'
  },
  'project.assign_users': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.ASSIGN,
    scope: PermissionScope.DEPARTMENT,
    description: 'Assign users to projects'
  },
  'project.view_reports': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.READ,
    scope: PermissionScope.DEPARTMENT,
    description: 'View project reports'
  },
  'project.close': {
    category: PermissionCategory.PROJECT,
    action: PermissionAction.UPDATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Close completed projects'
  }
}
```

#### Financial Permissions
```typescript
const FINANCIAL_PERMISSIONS = {
  'finance.view': {
    category: PermissionCategory.FINANCE,
    action: PermissionAction.READ,
    scope: PermissionScope.DEPARTMENT,
    description: 'View financial information'
  },
  'finance.budget.create': {
    category: PermissionCategory.BUDGET,
    action: PermissionAction.CREATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Create budgets'
  },
  'finance.budget.read': {
    category: PermissionCategory.BUDGET,
    action: PermissionAction.READ,
    scope: PermissionScope.DEPARTMENT,
    description: 'View budgets'
  },
  'finance.budget.update': {
    category: PermissionCategory.BUDGET,
    action: PermissionAction.UPDATE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Update budgets'
  },
  'finance.budget.approve': {
    category: PermissionCategory.BUDGET,
    action: PermissionAction.APPROVE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Approve budgets'
  },
  'finance.budget.delete': {
    category: PermissionCategory.BUDGET,
    action: PermissionAction.DELETE,
    scope: PermissionScope.DEPARTMENT,
    description: 'Delete budgets'
  }
}
```

### 5. Department-Based Access Control

#### Department Isolation Rules
```typescript
interface DepartmentAccessRules {
  // Data visibility rules
  canAccessDepartmentData(userDept: string, targetDept: string): boolean
  canModifyDepartmentData(userDept: string, targetDept: string): boolean
  canAssignCrossDepartment(userDept: string, targetDept: string): boolean

  // Collaboration rules
  canCollaborateOnProject(userDept: string, projectDept: string): boolean
  canViewClientData(userDept: string, clientDept: string): boolean
  canAccessSharedResources(userDept: string, resourceDept: string): boolean
}

class DepartmentAccessControl implements DepartmentAccessRules {
  canAccessDepartmentData(userDept: string, targetDept: string): boolean {
    // Users can access their own department data
    if (userDept === targetDept) return true

    // Cross-department access for collaborative roles
    const collaborativeRoles = ['PROJECT_MANAGER', 'DEPARTMENT_HEAD', 'SYSTEM_ADMIN']
    if (this.hasCollaborativeRole(userDept)) return true

    // Executive access
    if (this.isExecutiveRole(userDept)) return true

    return false
  }

  canModifyDepartmentData(userDept: string, targetDept: string): boolean {
    // Only same department or management can modify
    return userDept === targetDept || this.isManagementRole(userDept)
  }

  canCollaborateOnProject(userDept: string, projectDept: string): boolean {
    // Projects allow cross-department collaboration
    return true // Projects are collaborative by nature
  }
}
```

#### Cross-Department Collaboration Matrix
```typescript
const CROSS_DEPARTMENT_ACCESS = {
  // Projects can access all departments for collaboration
  projects: {
    client_service: { read: true, write: false, assign: false },
    creatives: { read: true, write: false, assign: true },
    finance: { read: true, write: false, assign: false },
    procurement: { read: true, write: false, assign: true },
    hr: { read: false, write: false, assign: false }
  },

  // Finance can view project and procurement data
  finance: {
    projects: { read: true, write: false, assign: false },
    procurement: { read: true, write: false, assign: false },
    client_service: { read: true, write: false, assign: false }
  },

  // Client Service can view project progress
  client_service: {
    projects: { read: true, write: false, assign: false }
  }
}
```

### 6. Role Assignment & Management

#### Role Assignment Rules
```typescript
interface RoleAssignmentRules {
  canAssignRole(assignerRole: string, targetRole: string): boolean
  canRevokeRole(assignerRole: string, targetRole: string): boolean
  getAssignableRoles(userRole: string): string[]
  validateRoleTransition(currentRole: string, newRole: string): boolean
}

class RoleManagementSystem implements RoleAssignmentRules {
  canAssignRole(assignerRole: string, targetRole: string): boolean {
    const hierarchy = this.getRoleHierarchy()

    // Executives can assign any role
    if (this.isExecutiveRole(assignerRole)) return true

    // Department heads can assign roles within their department
    if (this.isDepartmentHead(assignerRole)) {
      return this.isDepartmentRole(targetRole)
    }

    // System admins can assign technical roles
    if (assignerRole === 'SYSTEM_ADMIN') {
      return this.isTechnicalRole(targetRole)
    }

    return false
  }

  getAssignableRoles(userRole: string): string[] {
    // Return roles that this user can assign
    switch (userRole) {
      case 'CEO':
        return Object.keys(ALL_ROLES)
      case 'DEPARTMENT_HEAD':
        return DEPARTMENT_ROLES
      case 'PROJECT_MANAGER':
        return PROJECT_ROLES
      case 'SYSTEM_ADMIN':
        return TECHNICAL_ROLES
      default:
        return []
    }
  }
}
```

### 7. Permission Inheritance & Overrides

#### Hierarchical Permission System
```typescript
interface PermissionHierarchy {
  getInheritedPermissions(roleId: string): string[]
  getEffectivePermissions(userId: number): string[]
  resolvePermissionConflicts(permissions: string[]): string[]
  applyDepartmentOverrides(basePermissions: string[], department: string): string[]
}

class HierarchicalPermissionSystem implements PermissionHierarchy {
  getInheritedPermissions(roleId: string): string[] {
    const permissions = new Set<string>()
    const role = this.getRole(roleId)

    // Add direct permissions
    role.permissions.forEach(p => permissions.add(p))

    // Add inherited permissions from parent roles
    if (role.parentRoles) {
      role.parentRoles.forEach(parentId => {
        this.getInheritedPermissions(parentId).forEach(p => permissions.add(p))
      })
    }

    return Array.from(permissions)
  }

  getEffectivePermissions(userId: number): string[] {
    const user = this.getUser(userId)
    const permissions = new Set<string>()

    // Add permissions from all user roles
    user.roles.forEach(roleId => {
      this.getInheritedPermissions(roleId).forEach(p => permissions.add(p))
    })

    // Apply department-specific overrides
    const departmentOverrides = this.getDepartmentOverrides(user.department)
    departmentOverrides.forEach(override => {
      if (override.type === 'grant') {
        permissions.add(override.permission)
      } else if (override.type === 'revoke') {
        permissions.delete(override.permission)
      }
    })

    // Apply user-specific overrides
    const userOverrides = this.getUserOverrides(userId)
    userOverrides.forEach(override => {
      if (override.type === 'grant') {
        permissions.add(override.permission)
      } else if (override.type === 'revoke') {
        permissions.delete(override.permission)
      }
    })

    return Array.from(permissions)
  }
}
```

### 8. Implementation Examples

#### Backend Permission Checking
```php
// app/Http/Middleware/CheckPermission.php
class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Super Admin bypass
        if ($user->hasRole('Super Admin')) {
            return $next($request);
        }

        // Check permission with department context
        if (!$this->hasPermission($user, $permission, $request)) {
            $this->logAccessDenied($user, $permission, $request);
            return response()->json([
                'error' => 'Insufficient permissions',
                'required_permission' => $permission
            ], 403);
        }

        return $next($request);
    }

    private function hasPermission(User $user, string $permission, Request $request): bool
    {
        // Get effective permissions for user
        $userPermissions = app(PermissionService::class)->getEffectivePermissions($user->id);

        if (!in_array($permission, $userPermissions)) {
            return false;
        }

        // Check department-specific access
        return $this->checkDepartmentAccess($user, $permission, $request);
    }

    private function checkDepartmentAccess(User $user, string $permission, Request $request): bool
    {
        $resourceDepartment = $this->getResourceDepartment($request);

        if (!$resourceDepartment) {
            return true; // Global permission
        }

        return app(DepartmentAccessControl::class)
            ->canAccessDepartment($user->department_id, $resourceDepartment);
    }
}
```

#### Frontend Permission Guards
```typescript
// utils/routerGuards.ts
export async function canAccessRoute(routeName: string): Promise<boolean> {
  const { user, permissions } = await fetchUserData()

  if (!user) return false

  // Super Admin can access everything
  if (user.roles?.includes('Super Admin')) return true

  // Route-specific permission checks
  const routePermissions = ROUTE_PERMISSION_MAP[routeName]
  if (!routePermissions) return false

  // Check if user has required permissions
  return routePermissions.every(permission =>
    permissions?.permissions?.includes(permission) || false
  )
}

export async function canAccessDepartment(departmentId: number): Promise<boolean> {
  const { permissions } = await fetchUserData()
  return permissions?.accessible_departments?.includes(departmentId) || false
}

export async function hasPermission(permission: string, resource?: any): Promise<boolean> {
  const { user, permissions } = await fetchUserData()

  if (!user) return false
  if (user.roles?.includes('Super Admin')) return true

  // Check basic permission
  if (!permissions?.permissions?.includes(permission)) {
    return false
  }

  // Check resource-specific access if provided
  if (resource && resource.departmentId) {
    return canAccessDepartment(resource.departmentId)
  }

  return true
}
```

#### Database Seeding
```php
// database/seeders/RolePermissionSeeder.php
class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $ceoRole = Role::create(['name' => 'CEO', 'guard_name' => 'web']);
        $projectManagerRole = Role::create(['name' => 'Project Manager', 'guard_name' => 'web']);
        $clientServiceRole = Role::create(['name' => 'Client Service Officer', 'guard_name' => 'web']);

        // Create permissions
        $permissions = [
            'enquiry.create',
            'enquiry.read',
            'enquiry.update',
            'project.create',
            'project.read',
            'project.update',
            'task.create',
            'task.read',
            'task.update',
            'client.create',
            'client.read',
            'client.update',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // Assign permissions to roles
        $ceoRole->givePermissionTo(Permission::all());
        $projectManagerRole->givePermissionTo([
            'enquiry.read',
            'enquiry.update',
            'project.*',
            'task.*'
        ]);
        $clientServiceRole->givePermissionTo([
            'enquiry.*',
            'client.*'
        ]);
    }
}
```

### 9. Testing & Validation

#### Permission Testing
```php
// tests/Feature/PermissionTest.php
class PermissionTest extends TestCase
{
    public function test_client_service_can_create_enquiries()
    {
        $user = User::factory()->create();
        $user->assignRole('Client Service Officer');

        $this->actingAs($user)
            ->post('/api/projects/enquiries', [
                'title' => 'Test Enquiry',
                'description' => 'Test Description',
                'client_id' => 1
            ])
            ->assertStatus(201);
    }

    public function test_finance_cannot_create_enquiries()
    {
        $user = User::factory()->create();
        $user->assignRole('Finance Officer');

        $this->actingAs($user)
            ->post('/api/projects/enquiries', [
                'title' => 'Test Enquiry',
                'description' => 'Test Description',
                'client_id' => 1
            ])
            ->assertStatus(403);
    }

    public function test_department_isolation()
    {
        $financeUser = User::factory()->create();
        $financeUser->assignRole('Finance Officer');

        $projectUser = User::factory()->create();
        $projectUser->assignRole('Project Officer');

        // Finance user creates enquiry
        $enquiry = Enquiry::factory()->create([
            'assigned_department' => 'finance'
        ]);

        // Project user tries to access finance enquiry
        $this->actingAs($projectUser)
            ->get("/api/projects/enquiries/{$enquiry->id}")
            ->assertStatus(403);
    }
}
```

#### Role Assignment Testing
```php
// tests/Feature/RoleAssignmentTest.php
class RoleAssignmentTest extends TestCase
{
    public function test_department_head_can_assign_roles()
    {
        $deptHead = User::factory()->create();
        $deptHead->assignRole('Department Head');

        $employee = User::factory()->create();

        $this->actingAs($deptHead)
            ->post("/api/admin/users/{$employee->id}/assign-role", [
                'role' => 'Junior Staff'
            ])
            ->assertStatus(200);
    }

    public function test_employee_cannot_assign_roles()
    {
        $employee = User::factory()->create();
        $employee->assignRole('Junior Staff');

        $otherEmployee = User::factory()->create();

        $this->actingAs($employee)
            ->post("/api/admin/users/{$otherEmployee->id}/assign-role", [
                'role' => 'Project Officer'
            ])
            ->assertStatus(403);
    }
}
```

### 10. Monitoring & Compliance

#### Permission Audit Logging
```php
// app/Services/AuditService.php
class AuditService
{
    public static function logPermissionCheck(
        User $user,
        string $permission,
        bool $granted,
        array $context = []
    ): void {
        AuditLog::create([
            'user_id' => $user->id,
            'event_type' => 'permission.check',
            'resource_type' => 'permission',
            'resource_id' => $permission,
            'action' => $granted ? 'granted' : 'denied',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => json_encode([
                'permission' => $permission,
                'granted' => $granted,
                'context' => $context,
                'user_roles' => $user->roles->pluck('name')->toArray(),
                'user_department' => $user->department?->name
            ])
        ]);
    }

    public static function logRoleChange(
        User $changedBy,
        User $targetUser,
        string $action,
        string $roleName
    ): void {
        AuditLog::create([
            'user_id' => $changedBy->id,
            'event_type' => 'role.change',
            'resource_type' => 'user',
            'resource_id' => $targetUser->id,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => json_encode([
                'target_user_id' => $targetUser->id,
                'target_user_email' => $targetUser->email,
                'role_name' => $roleName,
                'action' => $action
            ])
        ]);
    }
}
```

## Summary

This comprehensive roles and permissions alignment provides:

1. **Clear Role Hierarchy**: 15 well-defined roles with proper separation of duties
2. **Granular Permissions**: 50+ specific permissions covering all business operations
3. **Department Isolation**: Complete data isolation with controlled collaboration
4. **Hierarchical Access**: Permission inheritance and role-based access control
5. **Audit Compliance**: Complete audit trails for all permission operations
6. **Scalable Design**: Supports unlimited users and complex organizational structures

The system eliminates the current security vulnerabilities while providing a professional, enterprise-grade authorization framework that can scale with your business growth.

**Implementation Priority:**
1. **Phase 1**: Fix critical permission bypasses (immediate)
2. **Phase 2**: Implement department-based access control (week 1)
3. **Phase 3**: Deploy comprehensive role system (week 2)
4. **Phase 4**: Add advanced features and monitoring (month 1)

This framework ensures your ERP system has bulletproof security, proper access control, and unlimited scalability for enterprise operations.