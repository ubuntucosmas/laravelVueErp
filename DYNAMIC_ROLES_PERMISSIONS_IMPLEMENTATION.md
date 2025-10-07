# Dynamic Roles & Permissions System - Your Company Implementation

## Executive Summary

This implementation creates a **dynamic, scalable roles and permissions system** specifically tailored to your company's organizational structure. The system supports all your current roles while being designed for easy expansion and maintenance.

## Your Company Roles Structure

### Executive Level
- **Super Admin (CEO)**: Complete system access, emergency override

### Management Level
- **Project Manager**: Project lifecycle management and team leadership
- **Finance Manager**: Financial oversight and budget approval
- **Department Lead**: Department operations management

### Professional Level
- **Project Officer**: Project execution and coordination
- **Client Service Officer**: Client relationship management
- **Finance Officer**: Financial operations and transactions
- **Procurement Officer**: Supplier and purchasing management
- **HR Officer (HR)**: Human resources management
- **Designer**: Creative design and production
- **Production Officer**: Manufacturing and production oversight
- **Logistics Officer**: Supply chain and logistics management

### Operational Level
- **Junior Staff**: Entry-level operational tasks
- **Support Staff**: Help desk and user support

### Administrative Level
- **System Admin (Admin)**: Technical system administration

---

## 1. Dynamic Permission Architecture

### Permission Categories & Taxonomy

```typescript
// Dynamic permission structure
interface PermissionDefinition {
  id: string
  category: PermissionCategory
  action: PermissionAction
  scope: PermissionScope
  description: string
  dependencies?: string[] // Permissions required for this permission
  restrictions?: PermissionRestriction[]
}

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

  // Creative & Production
  CREATIVES = 'creatives',
  DESIGN = 'design',
  PRODUCTION = 'production',
  LOGISTICS = 'logistics',

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
  REVIEW = 'review',
  EXECUTE = 'execute'
}

enum PermissionScope {
  GLOBAL = 'global',           // System-wide access
  DEPARTMENT = 'department',   // Department-specific
  OWN = 'own',                // Own records only
  TEAM = 'team',              // Team members
  PROJECT = 'project',        // Project-specific
  CLIENT = 'client',          // Client-specific
  REPORTING_LINE = 'reporting_line' // Manager-subordinate relationship
}
```

### Dynamic Role Configuration

```typescript
interface RoleConfiguration {
  id: string
  name: string
  displayName: string
  category: RoleCategory
  hierarchy: RoleHierarchy
  permissions: PermissionAssignment[]
  departmentRestrictions?: DepartmentRestriction[]
  userLimits?: UserLimit[]
  approvalWorkflow?: ApprovalWorkflow
}

interface PermissionAssignment {
  permissionId: string
  scope: PermissionScope
  conditions?: PermissionCondition[]
  overrides?: PermissionOverride[]
}

interface PermissionCondition {
  type: 'department_match' | 'ownership' | 'project_membership' | 'approval_required'
  value: any
}

interface PermissionOverride {
  context: string
  scope: PermissionScope
  additionalPermissions?: string[]
  restrictedPermissions?: string[]
}
```

---

## 2. Your Company Role Definitions

### Executive Roles

#### Super Admin (CEO)
```typescript
const SUPER_ADMIN_ROLE: RoleConfiguration = {
  id: 'super_admin',
  name: 'Super Admin',
  displayName: 'Chief Executive Officer',
  category: RoleCategory.EXECUTIVE,
  hierarchy: {
    level: 1,
    reportsTo: null,
    canManage: ['all'],
    approvalAuthority: 'unlimited'
  },
  permissions: [
    {
      permissionId: '*',
      scope: PermissionScope.GLOBAL,
      conditions: [],
      overrides: [{
        context: 'emergency_access',
        scope: PermissionScope.GLOBAL,
        additionalPermissions: ['system.emergency_override']
      }]
    }
  ],
  departmentRestrictions: [],
  userLimits: [{ type: 'max_users', value: 1 }],
  approvalWorkflow: {
    requiresApproval: false,
    approvers: [],
    emergencyBypass: true
  }
}
```

### Management Roles

#### Project Manager
```typescript
const PROJECT_MANAGER_ROLE: RoleConfiguration = {
  id: 'project_manager',
  name: 'Project Manager',
  displayName: 'Project Manager',
  category: RoleCategory.MANAGEMENT,
  hierarchy: {
    level: 2,
    reportsTo: ['super_admin', 'department_lead'],
    canManage: ['project_officer', 'junior_staff'],
    approvalAuthority: 'department_budget'
  },
  permissions: [
    // Project Management
    { permissionId: 'project.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'enquiry.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'task.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'budget.read', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'budget.approve', scope: PermissionScope.DEPARTMENT, conditions: [
      { type: 'approval_required', value: 'department_budget_limit' }
    ]},
    { permissionId: 'report.project.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'team.manage', scope: PermissionScope.DEPARTMENT },

    // Cross-department collaboration
    { permissionId: 'client.read', scope: PermissionScope.PROJECT },
    { permissionId: 'creatives.read', scope: PermissionScope.PROJECT },
    { permissionId: 'finance.read', scope: PermissionScope.PROJECT },
    { permissionId: 'procurement.read', scope: PermissionScope.PROJECT }
  ],
  departmentRestrictions: [{ type: 'assigned_department_only' }],
  userLimits: [{ type: 'max_users', value: 5 }]
}
```

#### Finance Manager
```typescript
const FINANCE_MANAGER_ROLE: RoleConfiguration = {
  id: 'finance_manager',
  name: 'Finance Manager',
  displayName: 'Finance Manager',
  category: RoleCategory.MANAGEMENT,
  hierarchy: {
    level: 2,
    reportsTo: ['super_admin'],
    canManage: ['finance_officer'],
    approvalAuthority: 'company_budget'
  },
  permissions: [
    { permissionId: 'finance.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'budget.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'invoice.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'report.financial.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'project.read', scope: PermissionScope.GLOBAL },
    { permissionId: 'enquiry.read', scope: PermissionScope.GLOBAL }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'finance' }],
  userLimits: [{ type: 'max_users', value: 2 }]
}
```

#### Department Lead
```typescript
const DEPARTMENT_LEAD_ROLE: RoleConfiguration = {
  id: 'department_lead',
  name: 'Department Lead',
  displayName: 'Department Lead',
  category: RoleCategory.MANAGEMENT,
  hierarchy: {
    level: 2,
    reportsTo: ['super_admin'],
    canManage: ['department_staff'],
    approvalAuthority: 'department_operations'
  },
  permissions: [
    { permissionId: 'department.manage', scope: PermissionScope.OWN },
    { permissionId: 'employee.manage', scope: PermissionScope.OWN },
    { permissionId: 'budget.approve', scope: PermissionScope.OWN },
    { permissionId: 'report.department.*', scope: PermissionScope.OWN },
    { permissionId: 'project.read', scope: PermissionScope.OWN },
    { permissionId: 'enquiry.read', scope: PermissionScope.OWN }
  ],
  departmentRestrictions: [{ type: 'assigned_department_only' }],
  userLimits: [{ type: 'max_users', value: 10 }]
}
```

### Professional Roles

#### Project Officer
```typescript
const PROJECT_OFFICER_ROLE: RoleConfiguration = {
  id: 'project_officer',
  name: 'Project Officer',
  displayName: 'Project Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['project_manager'],
    canManage: ['junior_staff'],
    approvalAuthority: 'task_level'
  },
  permissions: [
    { permissionId: 'project.read', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'project.update', scope: PermissionScope.ASSIGNED },
    { permissionId: 'task.*', scope: PermissionScope.ASSIGNED },
    { permissionId: 'enquiry.read', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'budget.read', scope: PermissionScope.ASSIGNED },
    { permissionId: 'report.project.read', scope: PermissionScope.ASSIGNED }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'projects' }]
}
```

#### Client Service Officer
```typescript
const CLIENT_SERVICE_OFFICER_ROLE: RoleConfiguration = {
  id: 'client_service_officer',
  name: 'Client Service Officer',
  displayName: 'Client Service Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['department_lead'],
    canManage: [],
    approvalAuthority: 'client_interactions'
  },
  permissions: [
    { permissionId: 'enquiry.create', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'enquiry.update', scope: PermissionScope.OWN },
    { permissionId: 'enquiry.read', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'client.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'project.read', scope: PermissionScope.CLIENT_RELATED }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'client_service' }]
}
```

#### Finance Officer
```typescript
const FINANCE_OFFICER_ROLE: RoleConfiguration = {
  id: 'finance_officer',
  name: 'Finance Officer',
  displayName: 'Finance Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['finance_manager'],
    canManage: [],
    approvalAuthority: 'transaction_level'
  },
  permissions: [
    { permissionId: 'finance.read', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'budget.create', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'budget.update', scope: PermissionScope.ASSIGNED },
    { permissionId: 'invoice.create', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'invoice.update', scope: PermissionScope.ASSIGNED },
    { permissionId: 'report.financial.read', scope: PermissionScope.DEPARTMENT }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'finance' }]
}
```

#### Procurement Officer
```typescript
const PROCUREMENT_OFFICER_ROLE: RoleConfiguration = {
  id: 'procurement_officer',
  name: 'Procurement Officer',
  displayName: 'Procurement Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['department_lead'],
    canManage: [],
    approvalAuthority: 'procurement_orders'
  },
  permissions: [
    { permissionId: 'procurement.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'vendor.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'purchase_order.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'budget.read', scope: PermissionScope.PROCUREMENT_RELATED }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'procurement' }]
}
```

#### HR Officer
```typescript
const HR_OFFICER_ROLE: RoleConfiguration = {
  id: 'hr_officer',
  name: 'HR Officer',
  displayName: 'HR Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['department_lead'],
    canManage: [],
    approvalAuthority: 'hr_operations'
  },
  permissions: [
    { permissionId: 'employee.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'hr.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'payroll.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'attendance.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'user.create', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'user.update', scope: PermissionScope.DEPARTMENT }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'hr' }]
}
```

#### Designer
```typescript
const DESIGNER_ROLE: RoleConfiguration = {
  id: 'designer',
  name: 'Designer',
  displayName: 'Designer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['department_lead'],
    canManage: [],
    approvalAuthority: 'design_approvals'
  },
  permissions: [
    { permissionId: 'creatives.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'design.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'project.read', scope: PermissionScope.ASSIGNED },
    { permissionId: 'task.update', scope: PermissionScope.ASSIGNED }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'creatives' }]
}
```

#### Production Officer
```typescript
const PRODUCTION_OFFICER_ROLE: RoleConfiguration = {
  id: 'production_officer',
  name: 'Production Officer',
  displayName: 'Production Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['department_lead'],
    canManage: ['junior_staff'],
    approvalAuthority: 'production_operations'
  },
  permissions: [
    { permissionId: 'production.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'task.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'project.read', scope: PermissionScope.ASSIGNED },
    { permissionId: 'logistics.read', scope: PermissionScope.PRODUCTION_RELATED }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'production' }]
}
```

#### Logistics Officer
```typescript
const LOGISTICS_OFFICER_ROLE: RoleConfiguration = {
  id: 'logistics_officer',
  name: 'Logistics Officer',
  displayName: 'Logistics Officer',
  category: RoleCategory.PROFESSIONAL,
  hierarchy: {
    level: 3,
    reportsTo: ['department_lead'],
    canManage: ['junior_staff'],
    approvalAuthority: 'logistics_operations'
  },
  permissions: [
    { permissionId: 'logistics.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'task.*', scope: PermissionScope.DEPARTMENT },
    { permissionId: 'project.read', scope: PermissionScope.ASSIGNED },
    { permissionId: 'procurement.read', scope: PermissionScope.LOGISTICS_RELATED }
  ],
  departmentRestrictions: [{ type: 'department_only', value: 'logistics' }]
}
```

### Operational Roles

#### Junior Staff
```typescript
const JUNIOR_STAFF_ROLE: RoleConfiguration = {
  id: 'junior_staff',
  name: 'Junior Staff',
  displayName: 'Junior Staff',
  category: RoleCategory.OPERATIONAL,
  hierarchy: {
    level: 4,
    reportsTo: ['project_officer', 'department_lead', 'production_officer', 'logistics_officer'],
    canManage: [],
    approvalAuthority: 'none'
  },
  permissions: [
    { permissionId: 'task.read', scope: PermissionScope.ASSIGNED },
    { permissionId: 'task.update', scope: PermissionScope.ASSIGNED },
    { permissionId: 'project.read', scope: PermissionScope.ASSIGNED },
    { permissionId: 'enquiry.read', scope: PermissionScope.DEPARTMENT }
  ],
  departmentRestrictions: [{ type: 'assigned_department_only' }]
}
```

#### Support Staff
```typescript
const SUPPORT_STAFF_ROLE: RoleConfiguration = {
  id: 'support_staff',
  name: 'Support Staff',
  displayName: 'Support Staff',
  category: RoleCategory.SUPPORT,
  hierarchy: {
    level: 4,
    reportsTo: ['system_admin'],
    canManage: [],
    approvalAuthority: 'none'
  },
  permissions: [
    { permissionId: 'ticket.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'knowledge.read', scope: PermissionScope.GLOBAL },
    { permissionId: 'user.read', scope: PermissionScope.GLOBAL }
  ],
  departmentRestrictions: []
}
```

### Administrative Roles

#### System Admin
```typescript
const SYSTEM_ADMIN_ROLE: RoleConfiguration = {
  id: 'system_admin',
  name: 'System Admin',
  displayName: 'System Administrator',
  category: RoleCategory.ADMINISTRATIVE,
  hierarchy: {
    level: 2,
    reportsTo: ['super_admin'],
    canManage: ['support_staff'],
    approvalAuthority: 'system_operations'
  },
  permissions: [
    { permissionId: 'system.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'user.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'department.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'role.manage', scope: PermissionScope.GLOBAL },
    { permissionId: 'permission.manage', scope: PermissionScope.GLOBAL },
    { permissionId: 'audit.*', scope: PermissionScope.GLOBAL },
    { permissionId: 'backup.*', scope: PermissionScope.GLOBAL }
  ],
  departmentRestrictions: [],
  userLimits: [{ type: 'max_users', value: 3 }]
}
```

---

## 3. Dynamic Permission Engine

### Backend Implementation

#### Permission Service
```php
<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Department;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class DynamicPermissionService
{
    /**
     * Get effective permissions for a user with dynamic role resolution
     */
    public function getEffectivePermissions(int $userId): array
    {
        return Cache::remember(
            "user_permissions_{$userId}",
            3600, // 1 hour
            fn() => $this->calculateEffectivePermissions($userId)
        );
    }

    /**
     * Calculate effective permissions based on user's roles and department
     */
    private function calculateEffectivePermissions(int $userId): array
    {
        $user = User::with('roles.permissions', 'department')->find($userId);
        if (!$user) return [];

        $permissions = collect();

        // Add permissions from all user roles
        foreach ($user->roles as $role) {
            $rolePermissions = $this->getRolePermissions($role, $user);
            $permissions = $permissions->merge($rolePermissions);
        }

        // Apply department-specific overrides
        $departmentOverrides = $this->getDepartmentOverrides($user->department_id ?? null);
        $permissions = $this->applyOverrides($permissions, $departmentOverrides);

        // Apply user-specific overrides
        $userOverrides = $this->getUserOverrides($userId);
        $permissions = $this->applyOverrides($permissions, $userOverrides);

        return $permissions->unique()->values()->toArray();
    }

    /**
     * Get permissions for a specific role with context
     */
    private function getRolePermissions(Role $role, User $user): Collection
    {
        $permissions = collect();

        // Get base role permissions
        $basePermissions = $role->permissions->pluck('name');
        $permissions = $permissions->merge($basePermissions);

        // Apply role-specific logic based on your company structure
        switch ($role->name) {
            case 'Project Manager':
                $permissions = $this->addProjectManagerPermissions($permissions, $user);
                break;
            case 'Department Lead':
                $permissions = $this->addDepartmentLeadPermissions($permissions, $user);
                break;
            case 'Finance Manager':
                $permissions = $this->addFinanceManagerPermissions($permissions, $user);
                break;
            case 'Client Service Officer':
                $permissions = $this->addClientServicePermissions($permissions, $user);
                break;
            case 'Finance Officer':
                $permissions = $this->addFinanceOfficerPermissions($permissions, $user);
                break;
            case 'Procurement Officer':
                $permissions = $this->addProcurementPermissions($permissions, $user);
                break;
            case 'HR Officer':
                $permissions = $this->addHROfficerPermissions($permissions, $user);
                break;
            case 'Designer':
                $permissions = $this->addDesignerPermissions($permissions, $user);
                break;
            case 'Production Officer':
                $permissions = $this->addProductionPermissions($permissions, $user);
                break;
            case 'Logistics Officer':
                $permissions = $this->addLogisticsPermissions($permissions, $user);
                break;
            case 'Junior Staff':
                $permissions = $this->addJuniorStaffPermissions($permissions, $user);
                break;
            case 'Support Staff':
                $permissions = $this->addSupportStaffPermissions($permissions, $user);
                break;
        }

        return $permissions;
    }

    /**
     * Project Manager specific permissions
     */
    private function addProjectManagerPermissions(Collection $permissions, User $user): Collection
    {
        // Add cross-department collaboration permissions
        $permissions->push('client.read');
        $permissions->push('creatives.read');
        $permissions->push('finance.read');
        $permissions->push('procurement.read');

        // Add team management permissions
        $permissions->push('team.manage');
        $permissions->push('report.project.*');

        return $permissions;
    }

    /**
     * Department Lead specific permissions
     */
    private function addDepartmentLeadPermissions(Collection $permissions, User $user): Collection
    {
        // Add department management permissions
        $permissions->push('department.manage');
        $permissions->push('employee.manage');
        $permissions->push('budget.approve');
        $permissions->push('report.department.*');

        return $permissions;
    }

    /**
     * Finance Manager specific permissions
     */
    private function addFinanceManagerPermissions(Collection $permissions, User $user): Collection
    {
        // Add global financial permissions
        $permissions->push('finance.*');
        $permissions->push('budget.*');
        $permissions->push('invoice.*');
        $permissions->push('report.financial.*');

        return $permissions;
    }

    /**
     * Client Service Officer specific permissions
     */
    private function addClientServicePermissions(Collection $permissions, User $user): Collection
    {
        // Add client relationship permissions
        $permissions->push('client.*');
        $permissions->push('enquiry.create');
        $permissions->push('enquiry.update');
        $permissions->push('enquiry.read');

        return $permissions;
    }

    /**
     * Finance Officer specific permissions
     */
    private function addFinanceOfficerPermissions(Collection $permissions, User $user): Collection
    {
        // Add financial operations permissions
        $permissions->push('finance.read');
        $permissions->push('budget.create');
        $permissions->push('budget.update');
        $permissions->push('invoice.create');
        $permissions->push('invoice.update');

        return $permissions;
    }

    /**
     * Procurement Officer specific permissions
     */
    private function addProcurementPermissions(Collection $permissions, User $user): Collection
    {
        // Add procurement operations permissions
        $permissions->push('procurement.*');
        $permissions->push('vendor.*');
        $permissions->push('purchase_order.*');

        return $permissions;
    }

    /**
     * HR Officer specific permissions
     */
    private function addHROfficerPermissions(Collection $permissions, User $user): Collection
    {
        // Add HR operations permissions
        $permissions->push('employee.*');
        $permissions->push('hr.*');
        $permissions->push('payroll.*');
        $permissions->push('attendance.*');

        return $permissions;
    }

    /**
     * Designer specific permissions
     */
    private function addDesignerPermissions(Collection $permissions, User $user): Collection
    {
        // Add creative permissions
        $permissions->push('creatives.*');
        $permissions->push('design.*');

        return $permissions;
    }

    /**
     * Production Officer specific permissions
     */
    private function addProductionPermissions(Collection $permissions, User $user): Collection
    {
        // Add production permissions
        $permissions->push('production.*');
        $permissions->push('task.*');

        return $permissions;
    }

    /**
     * Logistics Officer specific permissions
     */
    private function addLogisticsPermissions(Collection $permissions, User $user): Collection
    {
        // Add logistics permissions
        $permissions->push('logistics.*');
        $permissions->push('task.*');

        return $permissions;
    }

    /**
     * Junior Staff specific permissions
     */
    private function addJuniorStaffPermissions(Collection $permissions, User $user): Collection
    {
        // Add basic operational permissions
        $permissions->push('task.read');
        $permissions->push('task.update');
        $permissions->push('project.read');
        $permissions->push('enquiry.read');

        return $permissions;
    }

    /**
     * Support Staff specific permissions
     */
    private function addSupportStaffPermissions(Collection $permissions, User $user): Collection
    {
        // Add support permissions
        $permissions->push('ticket.*');
        $permissions->push('knowledge.read');
        $permissions->push('user.read');

        return $permissions;
    }

    /**
     * Check if user has specific permission with context
     */
    public function hasPermission(int $userId, string $permission, array $context = []): bool
    {
        $userPermissions = $this->getEffectivePermissions($userId);

        // Basic permission check
        if (!in_array($permission, $userPermissions)) {
            return false;
        }

        // Context-specific validation
        return $this->validatePermissionContext($userId, $permission, $context);
    }

    /**
     * Validate permission context
     */
    private function validatePermissionContext(int $userId, string $permission, array $context): bool
    {
        $user = User::find($userId);
        if (!$user) return false;

        // Department-based access control
        if (isset($context['department_id'])) {
            if (!$this->canAccessDepartment($user, $context['department_id'])) {
                return false;
            }
        }

        // Ownership-based access
        if (isset($context['owner_id'])) {
            if ($context['owner_id'] === $userId) {
                return true; // Owners always have access
            }
        }

        // Project collaboration access
        if (isset($context['project_id'])) {
            return $this->canAccessProject($user, $context['project_id']);
        }

        return true;
    }

    /**
     * Check department access permissions
     */
    private function canAccessDepartment(User $user, int $departmentId): bool
    {
        // Super Admin can access all departments
        if ($user->hasRole('Super Admin')) return true;

        // User can access their own department
        if ($user->department_id === $departmentId) return true;

        // Department leads can access their department
        if ($user->hasRole('Department Lead') && $user->department_id === $departmentId) {
            return true;
        }

        // Project managers can access project-related departments
        if ($user->hasRole('Project Manager')) {
            return $this->isProjectRelatedDepartment($departmentId);
        }

        // Finance managers have global access
        if ($user->hasRole('Finance Manager')) return true;

        return false;
    }

    /**
     * Check project access permissions
     */
    private function canAccessProject(User $user, int $projectId): bool
    {
        // Super Admin can access all projects
        if ($user->hasRole('Super Admin')) return true;

        // Check if user is assigned to the project
        $project = \App\Models\Project::find($projectId);
        if (!$project) return false;

        // Project owner
        if ($project->owner_id === $user->id) return true;

        // Department-based access
        if ($project->department_id === $user->department_id) return true;

        // Team member access
        return $project->teamMembers()->where('user_id', $user->id)->exists();
    }

    /**
     * Get department-specific permission overrides
     */
    private function getDepartmentOverrides(?int $departmentId): array
    {
        if (!$departmentId) return [];

        return Cache::remember(
            "dept_overrides_{$departmentId}",
            3600,
            fn() => \App\Models\DepartmentPermissionOverride::where('department_id', $departmentId)
                ->get()
                ->toArray()
        );
    }

    /**
     * Get user-specific permission overrides
     */
    private function getUserOverrides(int $userId): array
    {
        return Cache::remember(
            "user_overrides_{$userId}",
            3600,
            fn() => \App\Models\UserPermissionOverride::where('user_id', $userId)
                ->get()
                ->toArray()
        );
    }

    /**
     * Apply permission overrides
     */
    private function applyOverrides(Collection $permissions, array $overrides): Collection
    {
        foreach ($overrides as $override) {
            if ($override['type'] === 'grant') {
                $permissions->push($override['permission']);
            } elseif ($override['type'] === 'revoke') {
                $permissions = $permissions->reject(fn($p) => $p === $override['permission']);
            }
        }

        return $permissions->unique();
    }

    /**
     * Clear user permission cache
     */
    public function clearUserCache(int $userId): void
    {
        Cache::forget("user_permissions_{$userId}");
        Cache::forget("user_overrides_{$userId}");
    }

    /**
     * Clear department cache
     */
    public function clearDepartmentCache(int $departmentId): void
    {
        Cache::forget("dept_overrides_{$departmentId}");
    }

    /**
     * Check if department is project-related
     */
    private function isProjectRelatedDepartment(int $departmentId): bool
    {
        $projectRelated = ['client_service', 'creatives', 'finance', 'procurement', 'production', 'logistics'];
        $department = Department::find($departmentId);

        return $department && in_array(strtolower($department->name), $projectRelated);
    }
}
```

#### Permission Seeder for Your Company
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CompanyRolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create all permissions
        $permissions = $this->getAllPermissions();
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles with their specific permissions
        $this->createSuperAdminRole();
        $this->createProjectManagerRole();
        $this->createProjectOfficerRole();
        $this->createSystemAdminRole();
        $this->createDepartmentLeadRole();
        $this->createClientServiceOfficerRole();
        $this->createFinanceOfficerRole();
        $this->createProcurementOfficerRole();
        $this->createHROfficerRole();
        $this->createFinanceManagerRole();
        $this->createJuniorStaffRole();
        $this->createSupportStaffRole();
        $this->createDesignerRole();
        $this->createProductionOfficerRole();
        $this->createLogisticsOfficerRole();
    }

    private function getAllPermissions(): array
    {
        return [
            // User Management
            'user.create', 'user.read', 'user.update', 'user.delete',
            'user.assign_role', 'user.assign_department',

            // Department Management
            'department.create', 'department.read', 'department.update', 'department.delete',
            'department.manage',

            // Employee Management
            'employee.create', 'employee.read', 'employee.update', 'employee.delete',
            'employee.manage',

            // Project Management
            'project.create', 'project.read', 'project.update', 'project.delete',
            'project.assign_users', 'project.view_reports', 'project.close',

            // Enquiry Management
            'enquiry.create', 'enquiry.read', 'enquiry.update', 'enquiry.delete',
            'enquiry.convert', 'enquiry.assign',

            // Task Management
            'task.create', 'task.read', 'task.update', 'task.delete',
            'task.assign', 'task.complete',

            // Client Management
            'client.create', 'client.read', 'client.update', 'client.delete',

            // Financial Management
            'finance.view', 'finance.read', 'finance.manage',
            'budget.create', 'budget.read', 'budget.update', 'budget.approve', 'budget.delete',
            'invoice.create', 'invoice.read', 'invoice.update', 'invoice.delete',

            // Creative & Design
            'creatives.view', 'creatives.read', 'creatives.manage',
            'design.create', 'design.read', 'design.update', 'design.approve',

            // Production
            'production.view', 'production.read', 'production.manage',
            'production.create', 'production.update', 'production.approve',

            // Logistics
            'logistics.view', 'logistics.read', 'logistics.manage',
            'logistics.create', 'logistics.update', 'logistics.approve',

            // Procurement
            'procurement.view', 'procurement.read', 'procurement.manage',
            'procurement.create', 'procurement.update', 'procurement.approve',
            'vendor.create', 'vendor.read', 'vendor.update', 'vendor.delete',
            'purchase_order.create', 'purchase_order.read', 'purchase_order.update', 'purchase_order.approve',

            // HR Management
            'hr.view', 'hr.read', 'hr.manage',
            'payroll.create', 'payroll.read', 'payroll.update', 'payroll.approve',
            'attendance.create', 'attendance.read', 'attendance.update', 'attendance.manage',

            // System Administration
            'system.view', 'system.manage', 'system.backup', 'system.restore',
            'role.create', 'role.read', 'role.update', 'role.delete', 'role.manage',
            'permission.create', 'permission.read', 'permission.update', 'permission.delete', 'permission.manage',
            'audit.read', 'audit.manage',

            // Reports
            'report.read', 'report.project', 'report.financial', 'report.department', 'report.hr',

            // Support
            'ticket.create', 'ticket.read', 'ticket.update', 'ticket.delete', 'ticket.manage',
            'knowledge.create', 'knowledge.read', 'knowledge.update', 'knowledge.delete',

            // Team Management
            'team.manage', 'team.assign', 'team.view'
        ];
    }

    private function createSuperAdminRole(): void
    {
        $role = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $role->givePermissionTo(Permission::all());
    }

    private function createProjectManagerRole(): void
    {
        $role = Role::firstOrCreate(['name' => 'Project Manager', 'guard_name' => 'web']);
        $role->givePermissionTo([
            'project.*', 'enquiry.*', 'task.*', 'budget.read', 'budget.approve',
            'report.project.*', 'team.manage', 'client.read', 'creatives.read',
            'finance.read', 'procurement.read'
        ]);
    }

    private function createProjectOfficerRole(): void
    {
        $role = Role::firstOrCreate(['name' => 'Project Officer', 'guard_name' => 'web']);
        $role->givePermissionTo([
            'project.read', 'project.update', 'task.*', 'enquiry.read',
            'budget.read', 'report.project.read'
        ]);
    }

    private function createSystemAdminRole(): void
    {
        $role = Role::firstOrCreate(['name' => 'System Admin', '