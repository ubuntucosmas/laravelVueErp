# Departmental Task Management UI Specification

## Overview

This specification outlines the frontend components for departmental task management in the Vue.js application. The system allows departments to view, claim, and manage their specific tasks within project phases, with automatic phase progression when all departmental tasks are completed.

## Component Hierarchy

### Main Dashboard Components

```
DepartmentalTaskDashboard.vue (Main container)
├── DepartmentalTaskHeader.vue (Project/Phase context)
├── DepartmentalTaskFilters.vue (Filtering controls)
├── DepartmentalTaskList.vue (Task list with cards/grid)
│   ├── DepartmentalTaskCard.vue (Individual task display)
│   └── DepartmentalTaskListItem.vue (List view alternative)
├── PhaseProgressVisualization.vue (Phase completion status)
└── DepartmentalTaskModal.vue (Task detail and actions)
    ├── TaskActionButtons.vue (Claim/Start/Complete/Submit)
    ├── TaskTimeTracking.vue (Hours logging)
    └── TaskComments.vue (Notes and updates)
```

### Supporting Components

```
DepartmentalTaskNotifications.vue (Real-time notifications)
DepartmentalTaskStats.vue (Department performance metrics)
DepartmentalTaskCalendar.vue (Due date visualization)
```

## Data Structures

### DepartmentalTask Interface

```typescript
interface DepartmentalTask {
  id: number;
  project_phase_id: number;
  department_id: number;
  task_name: string;
  task_description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_user_id?: number;
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  order: number;
  created_at: string;
  updated_at: string;

  // Relations
  project_phase?: ProjectPhase;
  department?: Department;
  assigned_user?: User;
}
```

### ProjectPhase Interface (Extended)

```typescript
interface ProjectPhase {
  // ... existing fields
  departmental_completion_count: number;
  total_departmental_tasks: number;
  auto_progress_enabled: boolean;
  departmental_tasks?: DepartmentalTask[];
}
```

## Task List Views

### DepartmentalTaskList.vue

**Features:**
- Grid and list view toggle
- Infinite scroll or pagination
- Real-time status updates
- Bulk actions for multiple tasks

**Filtering Options:**
- Status: All, Pending, In Progress, Completed
- Priority: All, High, Medium, Low
- Assignment: All, Assigned to me, Unassigned, Assigned to others
- Due Date: All, Overdue, Due Today, Due This Week, Due This Month
- Project Phase: Current phase, All phases

**Sorting Options:**
- Due Date (ascending/descending)
- Priority (high to low)
- Created Date (newest/oldest)
- Task Name (alphabetical)

### DepartmentalTaskCard.vue

**Layout:**
- Card-based design with status indicator
- Task name and description
- Priority badge and due date
- Assigned user avatar/initials
- Progress indicator (for in-progress tasks)
- Action buttons (quick actions)

**Status Indicators:**
- Pending: Gray border, clock icon
- In Progress: Blue border, spinner icon
- Completed: Green border, checkmark icon
- Overdue: Red border, warning icon

## Task Detail Modal

### DepartmentalTaskModal.vue

**Sections:**
1. **Header**
   - Task name and status badge
   - Priority indicator
   - Close button

2. **Task Information**
   - Description
   - Project and phase context
   - Department assignment
   - Created/updated timestamps

3. **Assignment Section**
   - Current assignee (with avatar)
   - Reassign option (for managers)
   - Assignment history

4. **Time Tracking**
   - Estimated hours
   - Actual hours logged
   - Time logging interface
   - Progress percentage

5. **Action Buttons**
   - Primary actions based on status and permissions
   - Secondary actions (edit, delete for admins)

6. **Comments/Notes**
   - Activity log
   - Add comments
   - File attachments

### TaskActionButtons.vue

**Action Flow:**
```
Pending → [Claim] → In Progress
In Progress → [Complete] → Completed
Completed → [Submit for Review] → Submitted
```

**Button States:**
- **Claim**: Available when unassigned, changes status to in_progress
- **Start**: Available when assigned but not started, sets started_at
- **Complete**: Available when in_progress, sets completed_at
- **Submit**: Available when completed, triggers phase progression check

## Phase Progress Visualization

### PhaseProgressVisualization.vue

**Components:**
- Phase completion percentage
- Departmental task completion breakdown
- Progress bars for each department
- Overall phase status

**Visualization Types:**
1. **Circular Progress**: Overall phase completion
2. **Department Progress Bars**: Individual department completion
3. **Timeline View**: Phase progression with milestones
4. **Status Summary Cards**: Quick overview per department

**Real-time Updates:**
- WebSocket connections for live progress updates
- Automatic refresh when tasks are completed
- Notification when phase is ready to advance

## Department-Specific Views

### Role-Based UI Elements

**Department Manager View:**
- All tasks in department
- Reassignment capabilities
- Bulk operations
- Performance metrics
- Override permissions

**Team Member View:**
- My assigned tasks
- Department tasks (read-only for others)
- Personal dashboard
- Time tracking interface

**Project Manager View:**
- Cross-department visibility
- Phase progression controls
- Bottleneck identification
- Resource allocation

### Department-Specific Features

**Creatives Department:**
- Design file attachments
- Mood board integration
- Client feedback tracking

**Procurement Department:**
- Supplier contact integration
- Purchase order linking
- Inventory checks

**Production Department:**
- Manufacturing schedule integration
- Quality control checklists
- Equipment booking

## Integration with Existing Components

### WorkflowGuide.vue Integration
- Extend to show departmental task status
- Link to task management from workflow steps
- Progress synchronization

### WorkflowStep.vue Integration
- Add departmental task indicators
- Show completion status per department
- Enable phase advancement triggers

### Project Components
- Embed in ProjectsDashboard.vue
- Link from ProjectPhases components
- Share data with existing project views

## Responsive Design Considerations

### Breakpoints
- **Mobile (< 768px)**: Single column, stacked cards
- **Tablet (768px - 1024px)**: Two-column grid, condensed cards
- **Desktop (> 1024px)**: Multi-column grid, full feature set

### Mobile Optimizations
- Swipe gestures for task actions
- Bottom sheet modals
- Touch-friendly buttons
- Collapsible filters

### Tablet Optimizations
- Side panel for filters
- Split-screen task detail
- Drag-and-drop reordering

## Real-time Updates and Notifications

### WebSocket Integration
```typescript
// Real-time task updates
const taskUpdates = ref<WebSocketMessage[]>([])

// Notification types
interface TaskNotification {
  type: 'task_assigned' | 'task_completed' | 'phase_advanced' | 'deadline_approaching'
  task_id: number
  message: string
  priority: 'low' | 'medium' | 'high'
}
```

### Notification Features
- **Toast Notifications**: Immediate feedback for actions
- **Persistent Notifications**: Important updates (deadlines, assignments)
- **Email Notifications**: Configurable for important events
- **In-app Notification Center**: History and management

### Update Triggers
- Task status changes
- New task assignments
- Phase completions
- Deadline approaching (24h, 1h warnings)
- Department bottlenecks

## User Interaction Flows

### Task Claiming Flow
1. User sees unassigned task in list
2. Clicks "Claim" button
3. Confirmation dialog (optional)
4. Task status changes to "in_progress"
5. User becomes assignee
6. Notification sent to department manager

### Task Completion Flow
1. User marks task as complete
2. Time logging dialog appears
3. User enters actual hours
4. Task status changes to "completed"
5. System checks if all department tasks are complete
6. If yes, triggers phase advancement
7. Notifications sent to relevant stakeholders

### Phase Advancement Flow
1. All departmental tasks completed
2. System automatically advances phase (if auto_progress_enabled)
3. Or shows confirmation dialog for manual advancement
4. Updates project timeline
5. Notifies next department
6. Updates dashboard displays

## Wireframe Descriptions

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Header] Project: Office Renovation │ Phase: Design │ Dept: Creatives │
├─────────────────────────────────────────────────────────────┤
│ [Filters] Status: □ All □ Pending □ In Progress □ Completed │
│          Priority: □ All ■ High □ Medium □ Low              │
│          Assignment: ■ Assigned to me □ Unassigned          │
├─────────────────────────────────────────────────────────────┤
│ ┌─ Task Card ──────────────────┐ ┌─ Task Card ──────────────────┐ │
│ │ ⚠ High Priority              │ │ ⏱ In Progress                │ │
│ │ Design Concept Review        │ │ Material Specification       │ │
│ │ Due: Tomorrow                │ │ Due: Dec 15                  │ │
│ │ Assigned: John Doe           │ │ Assigned: Jane Smith         │ │
│ │ [Start] [Complete] [Details] │ │ [Complete] [Details]         │ │
│ └──────────────────────────────┘ └──────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [Phase Progress] ████████░░░░ 80% Complete                    │
│ Department Progress:                                           │
│ Creatives: ██████████ 100% │ Procurement: ███████░░░ 70%     │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────┐
│ Project: Office     │
│ Phase: Design       │
│ Dept: Creatives     │
├─────────────────────┤
│ [Filter ▼]          │
├─────────────────────┤
│ ┌─ Task Card ──────┐ │
│ │ ⚠ Design Review   │ │
│ │ Due: Tomorrow     │ │
│ │ John Doe          │ │
│ │ [Actions ▼]       │ │
│ └───────────────────┘ │
│ ┌─ Task Card ──────┐ │
│ │ ⏱ Materials       │ │
│ │ Due: Dec 15       │ │
│ │ Jane Smith        │ │
│ │ [Actions ▼]       │ │
│ └───────────────────┘ │
├─────────────────────┤
│ Phase: ████████░░ 80% │
│ Dept: ██████████ 100% │
└─────────────────────┘
```

## Implementation Considerations

### Performance Optimizations
- Virtual scrolling for large task lists
- Lazy loading of task details
- Caching of frequently accessed data
- Debounced search and filtering

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management in modals

### Error Handling
- Offline capability for critical actions
- Conflict resolution for concurrent edits
- Graceful degradation for network issues
- Clear error messages and recovery options

### Testing Strategy
- Unit tests for individual components
- Integration tests for workflows
- E2E tests for critical user journeys
- Performance testing for large datasets

## Conclusion

This specification provides a comprehensive blueprint for implementing departmental task management in the Vue.js application. The design emphasizes user experience, real-time collaboration, and seamless integration with existing workflow components while maintaining department-specific functionality and role-based access control.