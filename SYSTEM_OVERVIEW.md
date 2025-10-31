# ERP System - Complete Implementation Overview

## System Architecture

This is a **Laravel + Vue.js ERP system** for managing project enquiries, tasks, and workflows with a focus on event production and project management.

### Technology Stack

**Backend:**
- Laravel 11.x (PHP)
- MySQL Database
- Sanctum Authentication
- Spatie Laravel Permission (RBAC)
- RESTful API Architecture

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Tailwind CSS
- Axios for API calls
- Vite build tool

---

## Core System Components

### 1. **User Management & Authentication**

**Models:**
- `User` - System users with roles and permissions
- `Employee` - Employee details linked to users
- `Department` - Organizational departments

**Key Features:**
- Role-Based Access Control (RBAC)
- Department-based access restrictions
- Sanctum token-based authentication
- Permission system for granular access control

**Departments:**
- Client Service
- Design/Creatives
- Procurement
- Accounts/Finance
- Costing
- Production
- Logistics
- Stores
- Projects

---

### 2. **Client Management**

**Models:**
- `Client` - Client information and contact details

**Features:**
- Client CRUD operations
- Client status management (active/inactive)
- Client contact information tracking

---

### 3. **Project Enquiry System**

**Models:**
- `ProjectEnquiry` - Main enquiry/project entity
- `EnquiryTask` - Tasks associated with enquiries

**Enquiry Lifecycle:**
```
enquiry_logged → site_survey_pending → site_survey_completed → 
design_pending → design_completed → materials_pending → 
materials_completed → budget_pending → budget_completed → 
quote_pending → quote_completed → quote_approved → 
converted_to_project
```

**Key Fields:**
- `enquiry_number` - Unique identifier (e.g., ENQ-202510-001)
- `client_id` - Associated client
- `title` - Project title
- `description` - Project description
- `venue` - Event venue
- `expected_delivery_date` - Target completion date
- `status` - Current enquiry status
- `department_id` - Assigned department
- `estimated_budget` - Budget estimate
- `quote_approved` - Quote approval status

---

### 4. **Task Management System**

**Models:**
- `EnquiryTask` - Tasks within the enquiry workflow

**Task Types & Department Mapping:**
```php
'site-survey' => 'Client Service'
'design' => 'Design/Creatives'
'materials' => 'Procurement'
'budget' => 'Accounts/Finance'
'quote' => 'Costing'
'production' => 'Production'
'logistics' => 'Logistics'
'stores' => 'Stores'
'project_management' => 'Projects'
```

**Task Statuses:**
- `pending` - Not started
- `in_progress` - Currently being worked on
- `completed` - Finished
- `on_hold` - Temporarily paused
- `cancelled` - Cancelled

**Task Features:**
- Task assignment to users
- Task reassignment with history tracking
- Priority levels (low, medium, high, urgent)
- Due date tracking
- Task-specific data storage (survey, design, materials, budget)

---

### 5. **Site Survey Module**

**Models:**
- `SiteSurvey` - Site survey data

**Purpose:** Capture detailed site information before project execution

**Key Data Captured:**
- **Basic Information:**
  - Site visit date
  - Location
  - Client details
  - Attendees
  
- **Site Assessment:**
  - Project description
  - Objectives
  - Current site condition
  - Existing branding
  - Site measurements
  - Room/area sizes
  - Constraints
  
- **Access & Logistics:**
  - Access logistics
  - Parking availability
  - Lifts/elevators
  - Door sizes
  - Loading areas
  
- **Requirements:**
  - Branding preferences
  - Material preferences
  - Color schemes
  - Brand guidelines
  - Electrical requirements
  - Special instructions
  
- **Safety & Timeline:**
  - Safety conditions
  - Potential hazards
  - Safety requirements
  - Project start date
  - Project deadline
  - Key milestones
  
- **Additional:**
  - Additional notes
  - Special requests
  - Action items
  - Prepared by
  - Client approval

**API Endpoints:**
- `GET /api/projects/site-surveys?project_enquiry_id={id}` - Get surveys
- `POST /api/projects/site-surveys` - Create survey
- `PUT /api/projects/site-surveys/{id}` - Update survey
- `DELETE /api/projects/site-surveys/{id}` - Delete survey

**Frontend Component:** `SurveyTask.vue`

---

### 6. **Design Module**

**Models:**
- `DesignAsset` - Design files and assets

**Purpose:** Manage design assets for projects

**Key Features:**
- File upload and storage
- Asset versioning
- Asset approval workflow
- Multiple file types support
- Asset metadata (title, description, version)

**API Endpoints:**
- `GET /api/projects/enquiry-tasks/{taskId}/design-assets` - List assets
- `POST /api/projects/enquiry-tasks/{taskId}/design-assets` - Upload asset
- `GET /api/projects/enquiry-tasks/{taskId}/design-assets/{assetId}` - Get asset
- `PUT /api/projects/enquiry-tasks/{taskId}/design-assets/{assetId}` - Update asset
- `DELETE /api/projects/enquiry-tasks/{taskId}/design-assets/{assetId}` - Delete asset
- `GET /api/projects/enquiry-tasks/{taskId}/design-assets/{assetId}/download` - Download asset

**Frontend Component:** `DesignTask.vue`

---

### 7. **Materials Management Module**

**Models:**
- `TaskMaterialsData` - Materials data for a task
- `ProjectElement` - Project elements (stage, backdrop, etc.)
- `ElementMaterial` - Individual materials within elements
- `ElementTemplate` - Reusable element templates
- `ElementTemplateMaterial` - Default materials for templates

**Purpose:** Manage materials required for project elements

**Data Structure:**
```
TaskMaterialsData
├── project_info (JSON)
│   ├── projectId
│   ├── enquiryTitle
│   ├── clientName
│   ├── eventVenue
│   ├── setupDate
│   └── setDownDate
└── ProjectElements[]
    ├── id
    ├── templateId (optional)
    ├── elementType (e.g., "stage", "backdrop")
    ├── name
    ├── category (production/hire/outsourced)
    ├── dimensions {length, width, height}
    ├── isIncluded
    ├── notes
    └── ElementMaterials[]
        ├── id
        ├── description
        ├── unitOfMeasurement
        ├── quantity
        ├── isIncluded
        └── notes
```

**Element Templates:**
Pre-defined templates for common project elements:
- Stage
- Stage Skirting
- Stage Backdrop
- Entrance Arc
- Walkway and Dance Floor
- Custom elements

**Categories:**
- `structure` - Structural elements
- `decoration` - Decorative elements
- `flooring` - Floor-related elements
- `technical` - Technical equipment
- `furniture` - Furniture items
- `branding` - Branding materials
- `custom` - Custom elements

**Element Categories:**
- `production` - Produced in-house
- `hire` - Hired/rented
- `outsourced` - Outsourced to vendors

**API Endpoints:**
- `GET /api/projects/tasks/{taskId}/materials` - Get materials data
- `POST /api/projects/tasks/{taskId}/materials` - Save materials data
- `GET /api/projects/element-templates` - Get element templates
- `POST /api/projects/element-templates` - Create element template

**Frontend Components:**
- `MaterialsTask.vue` - Main materials task interface
- `MaterialsDataDisplay.vue` - Read-only materials display

---

### 8. **Budget Management Module**

**Models:**
- `TaskBudgetData` - Budget data for a task
- `BudgetApproval` - Budget approval records

**Purpose:** Manage project budgets with detailed cost breakdown

**Data Structure:**
```
TaskBudgetData
├── project_info (JSON)
├── materials_data (JSON) - Imported from MaterialsTask
│   └── Elements with materials and costs
├── labour_data (JSON)
│   └── Labour items with rates and hours
├── expenses_data (JSON)
│   └── Expense items with costs
├── logistics_data (JSON)
│   └── Logistics items with costs
├── budget_summary (JSON)
│   ├── materialsTotal
│   ├── labourTotal
│   ├── expensesTotal
│   ├── logisticsTotal
│   ├── subtotal
│   ├── contingency
│   ├── profitMargin
│   └── grandTotal
└── status (draft/pending_approval/approved/rejected)
```

**Budget Tabs:**
1. **Materials** - Auto-imported from Materials Task
2. **Labour** - Labour costs and hours
3. **Expenses** - Additional expenses
4. **Logistics** - Transportation and logistics costs
5. **Summary** - Overall budget summary

**Features:**
- Auto-import materials from Materials Task
- Cost calculation per element/material
- Labour rate and hours tracking
- Expense tracking
- Logistics cost management
- Budget approval workflow
- Contingency and profit margin calculation

**API Endpoints:**
- `GET /api/projects/tasks/{taskId}/budget` - Get budget data
- `POST /api/projects/tasks/{taskId}/budget` - Save budget data
- `POST /api/projects/tasks/{taskId}/budget/submit-approval` - Submit for approval

**Frontend Components:**
- `BudgetTask.vue` - Main budget task interface
- Budget approval workflow components

---

### 9. **Workflow System**

**Models:**
- `WorkflowTemplate` - Workflow templates
- `WorkflowTemplateTask` - Tasks within templates
- `WorkflowInstance` - Active workflow instances
- `WorkflowTask` - Tasks within workflow instances
- `Project` - Projects created from enquiries

**Purpose:** Manage project workflows and task sequences

**Workflow Phases:**
1. **Enquiry Phase** - Initial enquiry logging
2. **Site Survey Phase** - Site assessment
3. **Design Phase** - Design creation
4. **Materials Phase** - Materials specification
5. **Budget Phase** - Budget preparation
6. **Quote Phase** - Quote generation
7. **Approval Phase** - Quote approval
8. **Project Phase** - Project execution

---

### 10. **Notification System**

**Models:**
- `Notification` - System notifications

**Purpose:** Notify users of important events

**Notification Types:**
- Task assignments
- Task status changes
- Approval requests
- Deadline reminders
- System alerts

**API Endpoints:**
- `GET /api/projects/notifications` - Get user notifications
- `PUT /api/projects/notifications/{id}/read` - Mark as read
- `PUT /api/projects/notifications/mark-all-read` - Mark all as read
- `DELETE /api/projects/notifications/{id}` - Delete notification

---

## API Structure

### Authentication
All API endpoints require authentication via Sanctum tokens:
```
Authorization: Bearer {token}
```

### Base URL
```
/api
```

### Main Route Groups

1. **Auth Routes** (`/api`)
   - POST `/register`
   - POST `/login`
   - POST `/logout`
   - GET `/user`

2. **HR Module** (`/api/hr`)
   - Employees: `/api/hr/employees`
   - Departments: `/api/hr/departments`

3. **Admin Module** (`/api/admin`)
   - Users: `/api/admin/users`
   - Roles: `/api/admin/roles`
   - Permissions: `/api/admin/permissions`

4. **Client Service** (`/api/clientservice`)
   - Clients: `/api/clientservice/clients`
   - Enquiries: `/api/clientservice/enquiries`

5. **Projects Module** (`/api/projects`)
   - Dashboard: `/api/projects/dashboard`
   - Enquiries: `/api/projects/enquiries`
   - Tasks: `/api/projects/tasks`
   - Site Surveys: `/api/projects/site-surveys`
   - Design Assets: `/api/projects/enquiry-tasks/{taskId}/design-assets`
   - Materials: `/api/projects/tasks/{taskId}/materials`
   - Budget: `/api/projects/tasks/{taskId}/budget`
   - Element Templates: `/api/projects/element-templates`
   - Notifications: `/api/projects/notifications`

---

## Frontend Structure

### Directory Structure
```
frontend/src/
├── modules/
│   ├── projects/
│   │   ├── components/
│   │   │   ├── tasks/
│   │   │   │   ├── SurveyTask.vue
│   │   │   │   ├── DesignTask.vue
│   │   │   │   ├── MaterialsTask.vue
│   │   │   │   ├── BudgetTask.vue
│   │   │   │   ├── QuoteTask.vue
│   │   │   │   ├── ProductionTask.vue
│   │   │   │   ├── LogisticsTask.vue
│   │   │   │   ├── TaskRenderer.vue
│   │   │   │   └── data-displays/
│   │   │   │       ├── SurveyDataDisplay.vue
│   │   │   │       └── MaterialsDataDisplay.vue
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── materialsService.ts
│   │   │   └── budgetService.ts
│   │   └── types/
│   ├── hr/
│   ├── admin/
│   └── clientservice/
├── plugins/
│   └── axios.ts
└── ...
```

### Task Components

Each task type has a dedicated Vue component:

1. **SurveyTask.vue** - Site survey data collection
2. **DesignTask.vue** - Design asset management
3. **MaterialsTask.vue** - Materials specification
4. **BudgetTask.vue** - Budget preparation
5. **QuoteTask.vue** - Quote generation
6. **ProductionTask.vue** - Production management
7. **LogisticsTask.vue** - Logistics coordination
8. **TaskRenderer.vue** - Dynamic task component loader

### Task Component Pattern

All task components follow a similar pattern:

```vue
<template>
  <!-- Loading State -->
  <div v-if="isLoading">Loading...</div>
  
  <!-- Error State -->
  <div v-else-if="error">{{ error }}</div>
  
  <!-- Main Content -->
  <div v-else>
    <!-- Project Info Display -->
    <div class="project-info">...</div>
    
    <!-- Task-Specific Content -->
    <div class="task-content">...</div>
    
    <!-- Actions -->
    <div class="actions">
      <button @click="saveDraft">Save Draft</button>
      <button @click="submit">Submit</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TaskService } from '@/services/taskService'

const props = defineProps<{
  task: EnquiryTask
  readonly?: boolean
}>()

const isLoading = ref(true)
const error = ref<string | null>(null)
const taskData = ref({})

onMounted(async () => {
  await loadTaskData()
})

const loadTaskData = async () => {
  try {
    isLoading.value = true
    taskData.value = await TaskService.getData(props.task.id)
  } catch (err) {
    error.value = 'Failed to load task data'
  } finally {
    isLoading.value = false
  }
}

const saveDraft = async () => {
  await TaskService.saveDraft(props.task.id, taskData.value)
}

const submit = async () => {
  await TaskService.submit(props.task.id, taskData.value)
}
</script>
```

---

## Database Schema Summary

### Core Tables

1. **users** - System users
2. **employees** - Employee details
3. **departments** - Organizational departments
4. **roles** - User roles
5. **permissions** - System permissions
6. **model_has_roles** - User-role assignments
7. **model_has_permissions** - User-permission assignments
8. **role_has_permissions** - Role-permission assignments

### Client & Enquiry Tables

9. **clients** - Client information
10. **project_enquiries** - Project enquiries
11. **enquiry_tasks** - Tasks within enquiries
12. **task_assignment_history** - Task assignment history
13. **notifications** - System notifications

### Task Data Tables

14. **site_surveys** - Site survey data
15. **design_assets** - Design files and assets
16. **task_materials_data** - Materials task data
17. **project_elements** - Project elements
18. **element_materials** - Materials within elements
19. **element_templates** - Element templates
20. **element_template_materials** - Template materials
21. **task_budget_data** - Budget task data
22. **budget_approvals** - Budget approval records

### Workflow Tables

23. **projects** - Projects
24. **workflow_templates** - Workflow templates
25. **workflow_template_tasks** - Template tasks
26. **workflow_instances** - Active workflows
27. **workflow_tasks** - Workflow task instances

---

## Key Features

### 1. **Department-Based Access Control**
- Users can only access enquiries and tasks for their departments
- Cross-department visibility for managers
- Department-specific task routing

### 2. **Task Assignment & Tracking**
- Tasks automatically assigned to departments
- Manual user assignment within departments
- Task reassignment with history tracking
- Task status tracking

### 3. **Data Persistence**
- Each task type stores its specific data
- Data survives task status changes
- Read-only view for completed tasks
- Draft saving capability

### 4. **Materials-to-Budget Integration**
- Materials automatically imported into budget
- Cost calculation per material
- Element-based cost breakdown
- Real-time budget updates

### 5. **Approval Workflows**
- Budget approval workflow
- Quote approval workflow
- Multi-level approval support
- Approval history tracking

### 6. **Audit Trail**
- Task assignment history
- Status change tracking
- Data modification tracking
- User action logging

---

## Current Implementation Status

### ✅ Completed Modules

1. **Authentication & Authorization**
   - User login/logout
   - Role-based access control
   - Permission system
   - Department-based access

2. **User & Employee Management**
   - User CRUD operations
   - Employee management
   - Department management
   - Role and permission management

3. **Client Management**
   - Client CRUD operations
   - Client status management

4. **Enquiry Management**
   - Enquiry CRUD operations
   - Enquiry status workflow
   - Department assignment
   - Quote approval

5. **Task Management**
   - Task creation and assignment
   - Task status tracking
   - Task reassignment
   - Assignment history

6. **Site Survey Module**
   - Complete survey data capture
   - Read-only view for completed surveys
   - Survey data persistence

7. **Design Module**
   - Design asset upload
   - Asset management
   - Asset versioning

8. **Materials Module**
   - Element templates
   - Project elements
   - Material specification
   - Category management (production/hire/outsourced)
   - Data persistence

9. **Budget Module**
   - Materials import from Materials Task
   - Labour cost tracking
   - Expense tracking
   - Logistics cost tracking
   - Budget summary calculation
   - Approval workflow

10. **Notification System**
    - User notifications
    - Notification management

### 🚧 In Progress / Planned

1. **Quote Generation**
   - Quote template system
   - PDF generation
   - Quote versioning

2. **Production Management**
   - Production scheduling
   - Resource allocation
   - Progress tracking

3. **Logistics Management**
   - Transportation planning
   - Delivery scheduling
   - Vehicle management

4. **Reporting & Analytics**
   - Dashboard metrics
   - Project reports
   - Financial reports
   - Performance analytics

5. **Document Management**
   - Document templates
   - Document generation
   - Document versioning

---

## Development Guidelines

### Backend Development

1. **Controller Structure**
   - Use resource controllers for CRUD operations
   - Implement proper validation
   - Return consistent JSON responses
   - Handle exceptions gracefully

2. **Model Relationships**
   - Define all relationships in models
   - Use eager loading to prevent N+1 queries
   - Implement proper cascading deletes

3. **API Response Format**
   ```json
   {
     "data": {},
     "message": "Success message"
   }
   ```

4. **Error Response Format**
   ```json
   {
     "message": "Error message",
     "errors": {}
   }
   ```

### Frontend Development

1. **Component Structure**
   - Use Composition API
   - Implement proper loading states
   - Handle errors gracefully
   - Use TypeScript for type safety

2. **Service Layer**
   - Create service files for API calls
   - Use TypeScript interfaces
   - Handle API errors consistently

3. **State Management**
   - Use reactive refs for component state
   - Implement proper data flow
   - Avoid prop drilling

4. **Styling**
   - Use Tailwind CSS utility classes
   - Implement dark mode support
   - Ensure responsive design

---

## Testing Strategy

### Backend Testing

1. **Unit Tests**
   - Test model methods
   - Test service classes
   - Test helper functions

2. **Feature Tests**
   - Test API endpoints
   - Test authentication
   - Test authorization
   - Test workflows

3. **Integration Tests**
   - Test complete workflows
   - Test data persistence
   - Test relationships

### Frontend Testing

1. **Component Tests**
   - Test component rendering
   - Test user interactions
   - Test data binding

2. **Integration Tests**
   - Test API integration
   - Test routing
   - Test state management

---

## Deployment Considerations

### Backend

1. **Environment Configuration**
   - Set proper `.env` values
   - Configure database connection
   - Set up mail configuration
   - Configure file storage

2. **Database**
   - Run migrations
   - Seed initial data
   - Set up backups

3. **Performance**
   - Enable query caching
   - Optimize database indexes
   - Configure queue workers

### Frontend

1. **Build Configuration**
   - Set API base URL
   - Configure environment variables
   - Optimize build size

2. **Deployment**
   - Build production assets
   - Deploy to web server
   - Configure routing

---

## Security Considerations

1. **Authentication**
   - Use Sanctum tokens
   - Implement token expiration
   - Secure password storage

2. **Authorization**
   - Implement permission checks
   - Validate user access
   - Protect sensitive routes

3. **Data Validation**
   - Validate all inputs
   - Sanitize user data
   - Prevent SQL injection

4. **File Uploads**
   - Validate file types
   - Limit file sizes
   - Scan for malware

---

## Conclusion

This ERP system provides a comprehensive solution for managing project enquiries, tasks, and workflows with a focus on event production and project management. The modular architecture allows for easy extension and customization to meet specific business needs.

The system is built with modern technologies and follows best practices for security, performance, and maintainability. The clear separation between backend and frontend allows for independent development and deployment.

Key strengths:
- Modular task system
- Department-based access control
- Comprehensive data capture
- Workflow automation
- Real-time collaboration
- Audit trail and history tracking
