# TaskDataViewer Budget Integration Fix

## Issue

The TaskDataViewer component was showing the error:
```
TaskDataViewer: No specific endpoint for task type: budget - will use default display
```

This meant that when viewing a completed budget task, the system didn't know:
1. Which API endpoint to call to fetch budget data
2. Which component to use for editing

## Root Cause

The `TaskDataViewer.vue` component had:
- ✅ Budget display component registered in `dataDisplayComponents`
- ❌ No endpoint defined in the `fetchTaskData()` switch statement
- ❌ No editable component registered in `editableComponents`

## Solution Implemented

### 1. Added Budget Endpoint

**File:** `frontend/src/modules/projects/components/tasks/TaskDataViewer.vue`

**Added to the switch statement:**
```typescript
case 'budget':
  endpoint = `/api/projects/tasks/${props.task.id}/budget`
  console.log('TaskDataViewer: Budget task endpoint:', endpoint)
  break
```

### 2. Added Budget Editable Component

**Added to editableComponents map:**
```typescript
const editableComponents = {
  'site-survey': () => import('./SurveyTask.vue'),
  'design': () => import('./DesignTask.vue'),
  'materials': () => import('./MaterialsTask.vue'),
  'budget': () => import('./BudgetTask.vue'),  // ← Added
  // Add more task types here as needed
}
```

## How It Works Now

### Viewing a Completed Budget Task:

```
1. User clicks on completed budget task
         │
         ▼
2. TaskDataViewer component loads
         │
         ▼
3. fetchTaskData() is called
         │
         ├─→ Identifies task type as 'budget'
         │
         ├─→ Sets endpoint: /api/projects/tasks/{taskId}/budget
         │
         ├─→ Calls API to fetch budget data
         │
         └─→ Receives budget data from database
         │
         ▼
4. getDataComponent() is called
         │
         ├─→ Finds BudgetDataDisplay in dataDisplayComponents
         │
         └─→ Renders BudgetDataDisplay component
         │
         ▼
5. BudgetDataDisplay shows:
         │
         ├─→ Project Information
         ├─→ Budget Summary (with totals)
         ├─→ Materials Breakdown
         ├─→ Labour Breakdown
         ├─→ Expenses Breakdown
         ├─→ Logistics Breakdown
         └─→ Metadata (created/updated timestamps)
```

### Editing a Budget Task:

```
1. User clicks "Edit" button
         │
         ▼
2. toggleEditMode() is called
         │
         ▼
3. getEditableComponent() is called
         │
         ├─→ Finds BudgetTask in editableComponents
         │
         ├─→ Dynamically imports BudgetTask.vue
         │
         └─→ Renders BudgetTask component
         │
         ▼
4. User can edit budget data
         │
         ├─→ Modify materials pricing
         ├─→ Add/edit labour items
         ├─→ Add/edit expenses
         ├─→ Add/edit logistics
         └─→ Save changes
```

## Complete Task Type Support

### Now Supported in TaskDataViewer:

| Task Type | Display Component | Editable Component | Endpoint |
|-----------|------------------|-------------------|----------|
| site-survey | ✅ SurveyDataDisplay | ✅ SurveyTask | `/api/projects/site-surveys?enquiry_task_id={id}` |
| materials | ✅ MaterialsDataDisplay | ✅ MaterialsTask | `/api/projects/tasks/{id}/materials` |
| **budget** | ✅ **BudgetDataDisplay** | ✅ **BudgetTask** | `/api/projects/tasks/{id}/budget` |
| design | ✅ DesignDataDisplay | ✅ DesignTask | `/api/projects/enquiry-tasks/{id}/design-assets` |
| conversion | ✅ ConversionDataDisplay | ❌ | - |
| handover | ✅ HandoverDataDisplay | ❌ | - |
| logistics | ✅ LogisticsDataDisplay | ❌ | - |
| procurement | ✅ ProcurementDataDisplay | ❌ | - |
| production | ✅ ProductionDataDisplay | ❌ | - |
| quote_approval | ✅ QuoteApprovalDataDisplay | ❌ | - |
| quote | ✅ QuoteDataDisplay | ❌ | - |
| report | ✅ ReportDataDisplay | ❌ | - |
| setdown | ✅ SetdownDataDisplay | ❌ | - |
| setup | ✅ SetupDataDisplay | ❌ | - |

## Testing Checklist

### ✅ Test Scenarios:

1. **View Completed Budget Task**
   - Navigate to a completed budget task
   - Should load BudgetDataDisplay component
   - Should fetch data from `/api/projects/tasks/{id}/budget`
   - Should display budget summary and breakdowns
   - No error messages in console

2. **Edit Budget Task**
   - Click "Edit" button on completed budget task
   - Should load BudgetTask component
   - Should allow editing budget data
   - Should save changes successfully

3. **Console Logging**
   - Should see: `TaskDataViewer: Budget task endpoint: /api/projects/tasks/{id}/budget`
   - Should NOT see: `No specific endpoint for task type: budget`

4. **Error Handling**
   - If budget data doesn't exist, should show appropriate message
   - If API fails, should show error state

## Files Modified

1. ✅ `frontend/src/modules/projects/components/tasks/TaskDataViewer.vue`
   - Added budget endpoint in fetchTaskData()
   - Added budget to editableComponents map

## Related Components

### Budget Task Ecosystem:

```
TaskDataViewer.vue (Router)
    │
    ├─→ BudgetDataDisplay.vue (Read-only view)
    │   └─→ BudgetService.getBudgetData()
    │       └─→ GET /api/projects/tasks/{id}/budget
    │           └─→ BudgetController::getBudgetData()
    │               └─→ TaskBudgetData model
    │
    └─→ BudgetTask.vue (Editable view)
        └─→ BudgetService.saveBudgetData()
            └─→ POST /api/projects/tasks/{id}/budget
                └─→ BudgetController::saveBudgetData()
                    └─→ TaskBudgetData model
```

## Benefits

### ✅ Complete Integration:
- Budget tasks now fully integrated with TaskDataViewer
- Seamless viewing and editing experience
- Consistent with other task types

### ✅ User Experience:
- No more error messages
- Proper data display for completed budgets
- Edit functionality available

### ✅ Maintainability:
- Clear endpoint mapping
- Easy to add more task types
- Follows existing patterns

## Conclusion

The TaskDataViewer component now fully supports budget tasks with:
- ✅ Proper API endpoint configuration
- ✅ Display component integration
- ✅ Edit component integration
- ✅ Error-free operation

**Status:** ✅ **FIXED AND READY FOR USE**

Users can now view completed budget tasks without errors, and the budget data will be properly displayed using the BudgetDataDisplay component.
