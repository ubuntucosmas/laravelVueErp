# Budget Task Implementation Guide

## Overview

The Budget Task is a comprehensive cost management system that allows users to create detailed project budgets by importing materials from the Materials Task and adding labour, expenses, and logistics costs.

---

## System Architecture

### Frontend Components

```
frontend/src/modules/projects/
├── components/tasks/
│   ├── BudgetTask.vue                    # Main editable budget interface
│   └── data-displays/
│       └── BudgetDataDisplay.vue         # Read-only budget display
├── services/
│   ├── budgetService.ts                  # Budget API service
│   └── materialsService.ts               # Materials API service (for import)
```

### Backend Components

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── BudgetController.php          # Budget CRUD operations
│   │   └── MaterialsController.php       # Materials import endpoint
│   └── Models/
│       └── TaskBudgetData.php            # Budget data model
├── database/migrations/
│   └── 2025_10_27_133819_create_task_budget_data_table.php
└── routes/
    └── api.php                           # API routes
```

---

## Data Flow Architecture

### 1. Materials Import Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Materials Import Process                      │
└─────────────────────────────────────────────────────────────────┘

1. User Opens Budget Task
         │
         ▼
2. BudgetTask.vue Component Loads
         │
         ├─→ Check if budget exists
         │   └─→ GET /api/projects/tasks/{taskId}/budget
         │
         ├─→ If no materials, trigger import
         │
         ▼
3. importMaterials() Function Executes
         │
         ├─→ Get enquiry ID from props.task.project_enquiry_id
         │
         ├─→ Call MaterialsService.getMaterialsByEnquiry(enquiryId)
         │   │
         │   └─→ GET /api/projects/enquiries/{enquiryId}/materials
         │       │
         │       ├─→ Backend finds Materials Task for enquiry
         │       │   └─→ EnquiryTask::where('project_enquiry_id', $enquiryId)
         │       │                   ->where('type', 'materials')
         │       │
         │       ├─→ Fetch materials data from Materials Task
         │       │   └─→ TaskMaterialsData::where('enquiry_task_id', $materialsTaskId)
         │       │
         │       └─→ Return materials with project elements
         │
         ▼
4. Transform Materials Data
         │
         ├─→ Filter: Only included elements (isIncluded = true)
         ├─→ Filter: Only included materials (isIncluded = true)
         ├─→ Add budget-specific fields:
         │   ├─→ unitPrice: 0
         │   ├─→ totalPrice: 0
         │   ├─→ isAddition: false
         │   └─→ addedAt: new Date()
         │
         └─→ Assign to formData.materials
         │
         ▼
5. Display Materials in Budget UI
         │
         └─→ User can now add unit prices
```

---

## Database Schema

### task_budget_data Table

```sql
CREATE TABLE task_budget_data (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    enquiry_task_id BIGINT UNSIGNED NOT NULL,
    project_info JSON NOT NULL,
    materials_data JSON NOT NULL,
    labour_data JSON NOT NULL,
    expenses_data JSON NOT NULL,
    logistics_data JSON NOT NULL,
    budget_summary JSON NOT NULL,
    status ENUM('draft', 'pending_approval', 'approved', 'rejected') DEFAULT 'draft',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (enquiry_task_id) REFERENCES enquiry_tasks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_budget_per_task (enquiry_task_id)
);
```

### Data Structure in JSON Fields

#### project_info
```json
{
  "projectId": "ENQ-202510-001",
  "enquiryTitle": "Corporate Event Branding",
  "clientName": "ABC Corporation",
  "eventVenue": "Nairobi Convention Center",
  "setupDate": "2025-11-15",
  "setDownDate": "2025-11-16"
}
```

#### materials_data
```json
[
  {
    "id": "element-1",
    "templateId": "stage",
    "elementType": "stage",
    "name": "Main Stage",
    "category": "production",
    "dimensions": {
      "length": "10",
      "width": "8",
      "height": "1.5"
    },
    "isIncluded": true,
    "notes": "",
    "addedAt": "2025-10-30T10:00:00Z",
    "materials": [
      {
        "id": "material-1",
        "description": "Stage Boards (8x4)",
        "unitOfMeasurement": "Pcs",
        "quantity": 20,
        "isIncluded": true,
        "unitPrice": 500,
        "totalPrice": 10000,
        "isAddition": false,
        "addedAt": "2025-10-30T10:00:00Z"
      }
    ]
  }
]
```

#### labour_data
```json
[
  {
    "id": "labour-1",
    "category": "Production",
    "type": "Carpenter",
    "description": "Stage construction",
    "unit": "days",
    "quantity": 3,
    "unitRate": 2000,
    "amount": 6000,
    "isAddition": false
  }
]
```

#### expenses_data
```json
[
  {
    "id": "expense-1",
    "description": "Transportation to site",
    "category": "transport",
    "amount": 5000,
    "isAddition": false,
    "addedAt": "2025-10-30T10:00:00Z"
  }
]
```

#### logistics_data
```json
[
  {
    "id": "logistics-1",
    "vehicleReg": "KBZ 123A",
    "description": "Truck rental for materials",
    "category": "transport",
    "unit": "trip",
    "quantity": 2,
    "unitRate": 8000,
    "amount": 16000,
    "isAddition": false,
    "addedAt": "2025-10-30T10:00:00Z"
  }
]
```

#### budget_summary
```json
{
  "materialsTotal": 150000,
  "labourTotal": 45000,
  "expensesTotal": 25000,
  "logisticsTotal": 30000,
  "grandTotal": 250000
}
```

---

## API Endpoints

### 1. Get Budget Data
```
GET /api/projects/tasks/{taskId}/budget
```

**Response:**
```json
{
  "data": {
    "projectInfo": { ... },
    "materials": [ ... ],
    "labour": [ ... ],
    "expenses": [ ... ],
    "logistics": [ ... ],
    "budgetSummary": { ... },
    "status": "draft"
  },
  "message": "Budget data retrieved successfully"
}
```

### 2. Save Budget Data
```
POST /api/projects/tasks/{taskId}/budget
```

**Request Body:**
```json
{
  "projectInfo": { ... },
  "materials": [ ... ],
  "labour": [ ... ],
  "expenses": [ ... ],
  "logistics": [ ... ],
  "budgetSummary": {
    "materialsTotal": 150000,
    "labourTotal": 45000,
    "expensesTotal": 25000,
    "logisticsTotal": 30000,
    "grandTotal": 250000
  },
  "status": "draft"
}
```

### 3. Get Materials by Enquiry (For Import)
```
GET /api/projects/enquiries/{enquiryId}/materials
```

**Purpose:** Fetch materials from the Materials Task for the same enquiry

**Response:**
```json
{
  "data": {
    "projectInfo": { ... },
    "projectElements": [
      {
        "id": "element-1",
        "name": "Stage",
        "elementType": "stage",
        "category": "production",
        "isIncluded": true,
        "materials": [
          {
            "id": "material-1",
            "description": "Stage Boards",
            "quantity": 20,
            "unitOfMeasurement": "Pcs",
            "isIncluded": true
          }
        ]
      }
    ]
  },
  "message": "Materials data retrieved successfully"
}
```

---

## Frontend Implementation

### BudgetTask.vue Structure

```vue
<template>
  <div class="budget-task">
    <!-- Error/Success Messages -->
    <div v-if="error">{{ error }}</div>
    <div v-if="successMessage">{{ successMessage }}</div>
    
    <!-- Loading State -->
    <div v-if="isLoading">Loading...</div>
    
    <!-- Tab Navigation -->
    <nav>
      <button @click="activeTab = 'materials'">Materials</button>
      <button @click="activeTab = 'labour'">Labour</button>
      <button @click="activeTab = 'expenses'">Expenses</button>
      <button @click="activeTab = 'logistics'">Logistics</button>
      <button @click="activeTab = 'summary'">Summary</button>
    </nav>
    
    <!-- Materials Tab -->
    <div v-show="activeTab === 'materials'">
      <button @click="importMaterials">Import from Materials Task</button>
      
      <!-- Materials Display -->
      <div v-for="element in formData.materials" :key="element.id">
        <h4>{{ element.name }}</h4>
        <table>
          <tr v-for="material in element.materials" :key="material.id">
            <td>{{ material.description }}</td>
            <td>{{ material.quantity }}</td>
            <td>
              <input v-model.number="material.unitPrice" 
                     @input="calculateMaterialTotal(material)" />
            </td>
            <td>{{ formatCurrency(material.totalPrice) }}</td>
          </tr>
        </table>
      </div>
    </div>
    
    <!-- Other Tabs... -->
    
    <!-- Action Buttons -->
    <button @click="saveDraft">Save Draft</button>
    <button @click="handleSubmit">Submit Budget</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MaterialsService } from '../../services/materialsService'
import { BudgetService } from '../../services/budgetService'

// State
const formData = ref({
  projectInfo: { ... },
  materials: [],
  labour: [],
  expenses: [],
  logistics: [],
  status: 'draft'
})

// Load existing budget
const loadBudgetData = async () => {
  try {
    const data = await BudgetService.getBudgetData(props.task.id)
    formData.value = data
    
    if (data.materials.length === 0) {
      await importMaterials()
    }
  } catch {
    // Initialize new budget
    await importMaterials()
  }
}

// Import materials from Materials Task
const importMaterials = async () => {
  const materialsData = await MaterialsService.getMaterialsByEnquiry(
    props.task.project_enquiry_id
  )
  
  // Transform for budget
  formData.value.materials = materialsData.projectElements
    .filter(e => e.isIncluded)
    .map(element => ({
      ...element,
      materials: element.materials
        .filter(m => m.isIncluded)
        .map(material => ({
          ...material,
          unitPrice: 0,
          totalPrice: 0,
          isAddition: false
        }))
    }))
}

// Calculate totals
const calculateMaterialTotal = (material) => {
  material.totalPrice = material.quantity * material.unitPrice
}

const getMaterialsTotal = () => {
  return formData.value.materials.reduce((total, element) => {
    return total + element.materials.reduce((sum, material) => {
      return sum + material.totalPrice
    }, 0)
  }, 0)
}

// Save budget
const saveDraft = async () => {
  const budgetData = {
    ...formData.value,
    budgetSummary: {
      materialsTotal: getMaterialsTotal(),
      labourTotal: getLabourTotal(),
      expensesTotal: getExpensesTotal(),
      logisticsTotal: getLogisticsTotal(),
      grandTotal: getGrandTotal()
    }
  }
  
  await BudgetService.saveBudgetData(props.task.id, budgetData)
}

onMounted(() => {
  loadBudgetData()
})
</script>
```

---

## Backend Implementation

### BudgetController.php

```php
class BudgetController extends Controller
{
    /**
     * Get budget data for a task
     */
    public function getBudgetData(int $taskId): JsonResponse
    {
        $budgetData = TaskBudgetData::where('enquiry_task_id', $taskId)->first();
        
        if (!$budgetData) {
            return response()->json([
                'data' => $this->getDefaultBudgetStructure($taskId),
                'message' => 'Budget data retrieved successfully'
            ]);
        }
        
        return response()->json([
            'data' => $budgetData->toArray(),
            'message' => 'Budget data retrieved successfully'
        ]);
    }
    
    /**
     * Save budget data
     */
    public function saveBudgetData(Request $request, int $taskId): JsonResponse
    {
        $budgetData = TaskBudgetData::updateOrCreate(
            ['enquiry_task_id' => $taskId],
            [
                'project_info' => $request->projectInfo,
                'materials_data' => $request->materials,
                'labour_data' => $request->labour,
                'expenses_data' => $request->expenses,
                'logistics_data' => $request->logistics,
                'budget_summary' => $request->budgetSummary,
                'status' => $request->status
            ]
        );
        
        return response()->json([
            'data' => $budgetData->fresh(),
            'message' => 'Budget data saved successfully'
        ]);
    }
}
```

### MaterialsController.php

```php
class MaterialsController extends Controller
{
    /**
     * Get materials by enquiry ID (for budget import)
     */
    public function getMaterialsByEnquiry(int $enquiryId): JsonResponse
    {
        // Find materials task for this enquiry
        $materialsTask = EnquiryTask::where('project_enquiry_id', $enquiryId)
            ->where('type', 'materials')
            ->first();
        
        if (!$materialsTask) {
            return response()->json([
                'message' => 'Materials task not found for this enquiry',
                'data' => null
            ], 404);
        }
        
        // Get materials data using the materials task ID
        return $this->getMaterialsData($materialsTask->id);
    }
}
```

---

## Key Features

### 1. Materials Import
- **Automatic Import**: When budget is opened, materials are automatically imported if not present
- **Manual Re-import**: User can manually trigger import to get latest materials
- **Data Transformation**: Materials are transformed to include pricing fields (unitPrice, totalPrice)
- **Filtering**: Only included elements and materials are imported

### 2. Cost Calculation
- **Real-time Calculation**: Total price updates as user enters unit prices
- **Element Totals**: Each element shows its total cost
- **Category Totals**: Materials, Labour, Expenses, Logistics totals calculated
- **Grand Total**: Overall budget total automatically calculated

### 3. Budget Tabs
- **Materials**: Imported from Materials Task, user adds unit prices
- **Labour**: User adds labour items with rates and quantities
- **Expenses**: User adds expense items with amounts
- **Logistics**: User adds logistics items with costs
- **Summary**: Overview of all costs and grand total

### 4. Data Persistence
- **Draft Saving**: User can save budget as draft multiple times
- **Auto-save**: Optional auto-save functionality
- **Status Tracking**: Draft → Pending Approval → Approved/Rejected

### 5. Validation
- **Required Fields**: Project info, materials, budget summary required
- **Status Validation**: Status must be one of: draft, pending_approval, approved, rejected
- **Data Integrity**: Foreign key constraints ensure data consistency

---

## User Workflow

### Creating a New Budget

1. **Open Budget Task**
   - User navigates to Budget Task from task list
   - Component loads and checks for existing budget

2. **Materials Import**
   - If no budget exists, materials are automatically imported
   - User sees loading indicator during import
   - Success message displayed when import completes

3. **Add Unit Prices**
   - User navigates to Materials tab
   - For each material, user enters unit price
   - Total price calculates automatically (quantity × unit price)

4. **Add Labour Costs**
   - User switches to Labour tab
   - Clicks "Add Labour" button
   - Fills in: Type, Category, Unit, Quantity, Rate
   - Amount calculates automatically (quantity × rate)

5. **Add Expenses**
   - User switches to Expenses tab
   - Clicks "Add Expense" button
   - Fills in: Description, Category, Amount

6. **Add Logistics**
   - User switches to Logistics tab
   - Clicks "Add Logistics" button
   - Fills in: Vehicle Reg, Description, Category, Unit, Quantity, Rate

7. **Review Summary**
   - User switches to Summary tab
   - Reviews all totals:
     - Materials Total
     - Labour Total
     - Expenses Total
     - Logistics Total
     - Grand Total

8. **Save Budget**
   - User clicks "Save Draft" to save progress
   - Or clicks "Submit Budget" to finalize

---

## Error Handling

### Frontend Errors

```typescript
try {
  await importMaterials()
} catch (err) {
  if (err.response?.status === 404) {
    error.value = 'Materials task not found. Please complete Materials Task first.'
  } else if (err.response?.status === 500) {
    error.value = 'Server error. Please try again later.'
  } else {
    error.value = 'Failed to import materials. Please try again.'
  }
}
```

### Backend Errors

```php
try {
    $budgetData = TaskBudgetData::updateOrCreate(...);
    return response()->json(['data' => $budgetData]);
} catch (\Exception $e) {
    \Log::error('Budget save failed', [
        'taskId' => $taskId,
        'error' => $e->getMessage()
    ]);
    
    return response()->json([
        'message' => 'Failed to save budget data',
        'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
    ], 500);
}
```

---

## Testing Checklist

### Materials Import
- [ ] Import works on new budget
- [ ] Import shows loading indicator
- [ ] Import displays success message
- [ ] Import handles missing materials task
- [ ] Import handles empty materials
- [ ] Import filters only included items

### Cost Calculation
- [ ] Unit price input updates total price
- [ ] Element totals calculate correctly
- [ ] Category totals calculate correctly
- [ ] Grand total calculates correctly
- [ ] Calculations handle zero values
- [ ] Calculations handle decimal values

### Data Persistence
- [ ] Draft saves successfully
- [ ] Saved data loads correctly
- [ ] Materials persist after save
- [ ] Labour items persist after save
- [ ] Expenses persist after save
- [ ] Logistics persist after save
- [ ] Status updates correctly

### User Experience
- [ ] Tab navigation works smoothly
- [ ] Add/Remove items work correctly
- [ ] Form validation works
- [ ] Error messages display clearly
- [ ] Success messages display
- [ ] Loading states show appropriately

---

## Future Enhancements

1. **Materials Update Detection**
   - Detect when materials have been updated in Materials Task
   - Show warning to user
   - Allow selective re-import

2. **Budget Templates**
   - Save budget as template
   - Apply template to new projects
   - Template library

3. **Approval Workflow**
   - Multi-level approval
   - Approval notifications
   - Approval history tracking

4. **Budget Comparison**
   - Compare budget vs actual costs
   - Variance analysis
   - Cost tracking

5. **Export Functionality**
   - Export to PDF
   - Export to Excel
   - Email budget to stakeholders

6. **Budget Revisions**
   - Version control for budgets
   - Track changes between versions
   - Revert to previous versions

---

## Troubleshooting

### Materials Not Importing

**Problem:** Materials import fails with 500 error

**Solutions:**
1. Check if Materials Task exists for the enquiry
2. Verify Materials Task has data
3. Check backend logs for specific error
4. Verify API route is registered
5. Check database connection

### Budget Not Saving

**Problem:** Budget save fails

**Solutions:**
1. Check validation errors in response
2. Verify all required fields are present
3. Check budget summary is calculated
4. Verify task ID is correct
5. Check database permissions

### Totals Not Calculating

**Problem:** Totals show 0 or incorrect values

**Solutions:**
1. Verify unit prices are numbers, not strings
2. Check quantity values are valid
3. Ensure calculation functions are called
4. Check for null/undefined values
5. Verify data types in TypeScript

---

## Conclusion

The Budget Task implementation provides a comprehensive cost management system with seamless materials import, real-time calculations, and robust data persistence. The architecture is scalable, maintainable, and follows best practices for both frontend and backend development.
