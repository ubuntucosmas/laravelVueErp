# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Vue 3)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    User Interface Layer                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │  Dashboard │  │  Enquiries │  │   Tasks    │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Component Layer                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Survey   │ │ Design   │ │Materials │ │ Budget   │   │  │
│  │  │ Task     │ │ Task     │ │ Task     │ │ Task     │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Service Layer                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Materials    │  │ Budget       │  │ API          │   │  │
│  │  │ Service      │  │ Service      │  │ Client       │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (Sanctum Auth)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Laravel 11)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes Layer                       │  │
│  │  /api/auth  /api/projects  /api/hr  /api/admin          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Controller Layer                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Enquiry  │ │ Task     │ │Materials │ │ Budget   │   │  │
│  │  │Controller│ │Controller│ │Controller│ │Controller│   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Service Layer                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Workflow     │  │ Notification │  │ Permission   │   │  │
│  │  │ Service      │  │ Service      │  │ Service      │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Model Layer                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Enquiry  │ │ Task     │ │Materials │ │ Budget   │   │  │
│  │  │ Model    │ │ Model    │ │ Model    │ │ Model    │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MySQL Database                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Users, Roles, Permissions, Departments                  │  │
│  │  Clients, ProjectEnquiries, EnquiryTasks                 │  │
│  │  SiteSurveys, DesignAssets                               │  │
│  │  TaskMaterialsData, ProjectElements, ElementMaterials    │  │
│  │  TaskBudgetData, BudgetApprovals                         │  │
│  │  Notifications, TaskAssignmentHistory                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Enquiry Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Enquiry Lifecycle                           │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │ Enquiry Logged   │ ← Client Service creates enquiry
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Site Survey      │ ← Survey Task created
    │ Pending          │   (Client Service Department)
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Site Survey      │ ← Survey completed with site data
    │ Completed        │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Design Pending   │ ← Design Task created
    └────────┬─────────┘   (Design/Creatives Department)
             │
             ▼
    ┌──────────────────┐
    │ Design Completed │ ← Design assets uploaded
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Materials        │ ← Materials Task created
    │ Pending          │   (Procurement Department)
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Materials        │ ← Materials specified with elements
    │ Completed        │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Budget Pending   │ ← Budget Task created
    └────────┬─────────┘   (Accounts/Finance Department)
             │
             ▼
    ┌──────────────────┐
    │ Budget Completed │ ← Budget prepared and approved
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Quote Pending    │ ← Quote Task created
    └────────┬─────────┘   (Costing Department)
             │
             ▼
    ┌──────────────────┐
    │ Quote Completed  │ ← Quote generated
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Quote Approved   │ ← Finance approves quote
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │ Converted to     │ ← Project created
    │ Project          │
    └──────────────────┘
```

---

## Task Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Task Data Persistence                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Survey Task  │
└──────┬───────┘
       │
       │ Saves to
       ▼
┌──────────────────────────────────────────────────────────────┐
│ site_surveys table                                           │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ - project_enquiry_id                                     ││
│ │ - enquiry_task_id                                        ││
│ │ - site_visit_date, location, client_name                 ││
│ │ - project_description, objectives                        ││
│ │ - access_logistics, parking_availability                 ││
│ │ - safety_conditions, potential_hazards                   ││
│ │ - attendees (JSON), action_items (JSON)                  ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

┌──────────────┐
│Materials Task│
└──────┬───────┘
       │
       │ Saves to
       ▼
┌──────────────────────────────────────────────────────────────┐
│ task_materials_data table                                    │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ - enquiry_task_id                                        ││
│ │ - project_info (JSON)                                    ││
│ └──────────────────────────────────────────────────────────┘│
│         │                                                     │
│         │ Has Many                                            │
│         ▼                                                     │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ project_elements table                                   ││
│ │ - template_id, element_type, name, category              ││
│ │ - dimensions (JSON), is_included, notes                  ││
│ └──────────────────────────────────────────────────────────┘│
│         │                                                     │
│         │ Has Many                                            │
│         ▼                                                     │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ element_materials table                                  ││
│ │ - description, unit_of_measurement, quantity             ││
│ │ - is_included, notes                                     ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Budget Task  │
└──────┬───────┘
       │
       │ Imports from Materials Task
       │ Saves to
       ▼
┌──────────────────────────────────────────────────────────────┐
│ task_budget_data table                                       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ - enquiry_task_id                                        ││
│ │ - project_info (JSON)                                    ││
│ │ - materials_data (JSON) ← Imported from Materials       ││
│ │ - labour_data (JSON)                                     ││
│ │ - expenses_data (JSON)                                   ││
│ │ - logistics_data (JSON)                                  ││
│ │ - budget_summary (JSON)                                  ││
│ │ - status (draft/pending_approval/approved/rejected)      ││
│ └──────────────────────────────────────────────────────────┘│
│         │                                                     │
│         │ Has Many                                            │
│         ▼                                                     │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ budget_approvals table                                   ││
│ │ - approved_by, approved_at, status, comments             ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

---

## Materials to Budget Integration

```
┌─────────────────────────────────────────────────────────────────┐
│              Materials → Budget Data Flow                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Materials Task (Completed)                                   │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Project Elements:                                        ││
│ │   - Stage                                                ││
│ │     • Stage Boards (8 Pcs)                               ││
│ │     • Stage Legs (16 Pcs)                                ││
│ │   - Backdrop                                             ││
│ │     • Backdrop Frame (1 Pcs)                             ││
│ │     • Backdrop Fabric (20 sqm)                           ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
                         │
                         │ Auto-Import
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ Budget Task - Materials Tab                                  │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Imported Materials:                                      ││
│ │   - Stage                                                ││
│ │     • Stage Boards (8 Pcs) → Add Unit Cost → Total      ││
│ │     • Stage Legs (16 Pcs) → Add Unit Cost → Total       ││
│ │   - Backdrop                                             ││
│ │     • Backdrop Frame (1 Pcs) → Add Unit Cost → Total    ││
│ │     • Backdrop Fabric (20 sqm) → Add Unit Cost → Total  ││
│ │                                                          ││
│ │ Materials Total: KES 150,000                             ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Labour Tab:                                              ││
│ │   - Carpenter (8 hrs @ KES 500/hr) = KES 4,000          ││
│ │   - Electrician (4 hrs @ KES 600/hr) = KES 2,400        ││
│ │ Labour Total: KES 6,400                                  ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Expenses Tab:                                            ││
│ │   - Tools Rental = KES 5,000                             ││
│ │   - Miscellaneous = KES 2,000                            ││
│ │ Expenses Total: KES 7,000                                ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Logistics Tab:                                           ││
│ │   - Transportation = KES 10,000                          ││
│ │   - Fuel = KES 3,000                                     ││
│ │ Logistics Total: KES 13,000                              ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Summary:                                                 ││
│ │   Materials:    KES 150,000                              ││
│ │   Labour:       KES   6,400                              ││
│ │   Expenses:     KES   7,000                              ││
│ │   Logistics:    KES  13,000                              ││
│ │   ─────────────────────────                              ││
│ │   Subtotal:     KES 176,400                              ││
│ │   Contingency:  KES  17,640 (10%)                        ││
│ │   Profit:       KES  38,808 (20%)                        ││
│ │   ─────────────────────────                              ││
│ │   Grand Total:  KES 232,848                              ││
│ └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

---

## Permission & Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                  Role-Based Access Control                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Super Admin  │ → All Permissions
└──────────────┘   - Full system access
                   - User management
                   - Role management
                   - All department access

┌──────────────┐
│ Department   │ → Department-Specific Permissions
│ Manager      │   - View department enquiries
└──────────────┘   - Assign tasks to department users
                   - View department tasks
                   - Update task status

┌──────────────┐
│ Department   │ → Limited Permissions
│ User         │   - View assigned tasks
└──────────────┘   - Update assigned tasks
                   - Submit task data

┌──────────────┐
│ Finance      │ → Finance-Specific Permissions
│ Manager      │   - Approve budgets
└──────────────┘   - Approve quotes
                   - View financial data

┌──────────────┐
│ Client       │ → Client Service Permissions
│ Service      │   - Create enquiries
└──────────────┘   - Assign to departments
                   - View all enquiries
                   - Create site surveys

Department Access Matrix:
┌─────────────────┬──────────┬────────┬───────────┬────────┐
│ Department      │ Enquiry  │ Tasks  │ Approval  │ Budget │
├─────────────────┼──────────┼────────┼───────────┼────────┤
│ Client Service  │ Create   │ Survey │ -         │ View   │
│ Design          │ View     │ Design │ -         │ View   │
│ Procurement     │ View     │ Matls  │ -         │ View   │
│ Finance         │ View     │ Budget │ Approve   │ Full   │
│ Costing         │ View     │ Quote  │ -         │ View   │
│ Production      │ View     │ Prod   │ -         │ View   │
│ Logistics       │ View     │ Logis  │ -         │ View   │
└─────────────────┴──────────┴────────┴───────────┴────────┘
```

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Component Tree                       │
└─────────────────────────────────────────────────────────────────┘

App.vue
├── Router
│   ├── Dashboard
│   │   ├── DashboardMetrics
│   │   ├── RecentActivities
│   │   └── AlertsPanel
│   │
│   ├── Enquiries
│   │   ├── EnquiryList
│   │   ├── EnquiryDetail
│   │   │   ├── EnquiryInfo
│   │   │   ├── EnquiryTasks
│   │   │   │   └── TaskRenderer
│   │   │   │       ├── SurveyTask
│   │   │   │       ├── DesignTask
│   │   │   │       ├── MaterialsTask
│   │   │   │       ├── BudgetTask
│   │   │   │       ├── QuoteTask
│   │   │   │       └── DefaultTask
│   │   │   └── EnquiryTimeline
│   │   └── EnquiryForm
│   │
│   ├── Tasks
│   │   ├── TaskList
│   │   ├── TaskDetail
│   │   └── TaskAssignment
│   │
│   ├── Clients
│   │   ├── ClientList
│   │   ├── ClientDetail
│   │   └── ClientForm
│   │
│   ├── Users
│   │   ├── UserList
│   │   ├── UserDetail
│   │   └── UserForm
│   │
│   └── Settings
│       ├── RoleManagement
│       ├── PermissionManagement
│       └── DepartmentManagement
│
└── Shared Components
    ├── Navigation
    ├── Sidebar
    ├── Header
    ├── Footer
    ├── Modal
    ├── DataTable
    ├── FormInput
    └── LoadingSpinner
```

---

## API Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    API Request Lifecycle                         │
└─────────────────────────────────────────────────────────────────┘

Frontend Component
       │
       │ 1. User Action (e.g., Save Materials)
       ▼
Service Layer (materialsService.ts)
       │
       │ 2. Prepare Request Data
       │    - Format data
       │    - Add auth token
       ▼
Axios HTTP Client
       │
       │ 3. HTTP POST /api/projects/tasks/{taskId}/materials
       │    Headers: Authorization: Bearer {token}
       │    Body: { projectInfo, projectElements }
       ▼
Laravel API Routes (api.php)
       │
       │ 4. Route Matching
       │    - Authenticate user (Sanctum)
       │    - Check permissions
       ▼
Middleware Stack
       │
       │ 5. Authentication & Authorization
       │    - Verify token
       │    - Check user permissions
       │    - Load user data
       ▼
Controller (MaterialsController)
       │
       │ 6. Request Validation
       │    - Validate input data
       │    - Return 422 if invalid
       ▼
Business Logic
       │
       │ 7. Process Request
       │    - Create/Update TaskMaterialsData
       │    - Create/Update ProjectElements
       │    - Create/Update ElementMaterials
       ▼
Database (MySQL)
       │
       │ 8. Persist Data
       │    - Insert/Update records
       │    - Maintain relationships
       ▼
Response Formation
       │
       │ 9. Format Response
       │    - Load relationships
       │    - Format data
       │    - Add success message
       ▼
JSON Response
       │
       │ 10. Return to Frontend
       │     { data: {...}, message: "Success" }
       ▼
Service Layer
       │
       │ 11. Process Response
       │     - Extract data
       │     - Handle errors
       ▼
Component
       │
       │ 12. Update UI
       │     - Display success message
       │     - Refresh data
       │     - Update state
       ▼
User sees updated data
```

This comprehensive architecture documentation provides a complete understanding of the system's structure, data flow, and component relationships.
