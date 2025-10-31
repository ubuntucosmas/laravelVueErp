# BudgetTask Refactor Guide - Following SurveyTask Pattern

## Overview

This guide shows how to refactor BudgetTask.vue to follow the exact same pattern as SurveyTask.vue.

---

## Key Pattern from SurveyTask

### Structure:
```vue
<template>
  <div class="task-wrapper">
    <!-- Editable section - only show when NOT readonly -->
    <div v-if="!readonly">
      <h3>{{ task.title }}</h3>
      <!-- Error/Success messages -->
      <!-- Tab navigation -->
      <!-- Form content -->
    </div>

    <!-- Use TaskDataViewer for completed/readonly tasks -->
    <TaskDataViewer
      v-if="readonly"
      :task="task"
    />
  </div>
</template>
```

### Key Points:
1. ✅ When `readonly=true` → Show TaskDataViewer
2. ✅ When `readonly=false` → Show editable form
3. ✅ TaskDataViewer handles fetching and displaying saved data
4. ✅ No need to handle readonly display in the main component

---

## Step-by-Step Refactor Plan

### Step 1: Import TaskDataViewer

**Add to imports:**
```typescript
import TaskDataViewer from './TaskDataViewer.vue'
```

### Step 2: Wrap Editable Content

**Current structure:**
```vue
<template>
  <div class="budget-task-content">
    <!-- All content here -->
  </div>
</template>
```

**New structure:**
```vue
<template>
  <div class="budget-task-content">
    <!-- Editable section - only show when NOT readonly -->
    <div v-if="!readonly">
      <!-- All existing content here -->
    </div>

    <!-- Use TaskDataViewer for completed/readonly tasks -->
    <TaskDataViewer
      v-if="readonly"
      :task="task"
    />
  </div>
</template>
```

### Step 3: Remove Readonly-Specific Logic

Since TaskDataViewer handles readonly display, we can remove:
- ❌ Readonly checks on individual inputs
- ❌ Conditional rendering of action buttons based on readonly
- ❌ Readonly-specific data loading logic

**Before:**
```vue
<input
  v-if="!readonly"
  v-model="material.unitPrice"
  ...
/>
<span v-else>{{ formatCurrency(material.unitPrice) }}</span>
```

**After:**
```vue
<input
  v-model="material.unitPrice"
  ...
/>
```

### Step 4: Simplify loadBudgetData

**Before:**
```typescript
const loadBudgetData = async () => {
  try {
    const existingBudget = await BudgetService.getBudgetData(props.task.id)
    Object.assign(budgetData, existingBudget)
    
    if (budgetData.materials.length === 0 && !props.readonly) {
      await autoImportMaterials()
    }
  } catch (error) {
    if (!props.readonly) {
      await autoImportMaterials()
    }
  }
}
```

**After:**
```typescript
const loadBudgetData = async () => {
  try {
    const existingBudget = await BudgetService.getBudgetData(props.task.id)
    Object.assign(budgetData, existingBudget)
    
    // Auto-import if no materials
    if (budgetData.materials.length === 0) {
      await autoImportMaterials()
    }
  } catch (error) {
    // Initialize with materials import
    await autoImportMaterials()
  }
}
```

### Step 5: Remove Readonly Prop Checks

Since the entire editable section is wrapped in `v-if="!readonly"`, we don't need individual checks.

**Remove these:**
```vue
<div v-if="budgetData.materialsImported && !readonly">
  <!-- Action buttons -->
</div>
```

**Replace with:**
```vue
<div v-if="budgetData.materialsImported">
  <!-- Action buttons -->
</div>
```

---

## Complete Refactored Structure

```vue
<template>
  <div class="budget-task-content">
    <!-- ============================================ -->
    <!-- EDITABLE SECTION - Only show when NOT readonly -->
    <!-- ============================================ -->
    <div v-if="!readonly">
      <!-- Project Header -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Budget Task - {{ task.title }}
        </h4>

        <!-- Project Information Display -->
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <!-- ... project info ... -->
        </div>
      </div>

      <!-- Auto-Import Status -->
      <div v-if="isImporting" class="mb-6">
        <!-- ... loading indicator ... -->
      </div>

      <!-- Budget Tabs -->
      <div v-if="budgetData.materialsImported || isImporting" class="mb-6">
        <!-- Tab Navigation -->
        <div class="mb-6">
          <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <!-- ... tabs ... -->
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <!-- Materials Tab -->
          <div v-if="activeTab === 'materials'" class="p-6">
            <!-- ... materials content ... -->
          </div>

          <!-- Labour Tab -->
          <div v-if="activeTab === 'labour'" class="p-6">
            <!-- ... labour content ... -->
          </div>

          <!-- Expenses Tab -->
          <div v-if="activeTab === 'expenses'" class="p-6">
            <!-- ... expenses content ... -->
          </div>

          <!-- Logistics Tab -->
          <div v-if="activeTab === 'logistics'" class="p-6">
            <!-- ... logistics content ... -->
          </div>

          <!-- Summary Tab -->
          <div v-if="activeTab === 'summary'" class="p-6">
            <!-- ... summary content ... -->
          </div>
        </div>
      </div>

      <!-- Budget Summary -->
      <div v-if="budgetData.materialsImported" class="mb-6">
        <!-- ... budget summary ... -->
      </div>

      <!-- Budget Actions -->
      <div v-if="budgetData.materialsImported" class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <button @click="reimportMaterials">Re-import Materials</button>
          <button @click="saveDraft">Save Draft</button>
          <button @click="submitForApproval">Submit for Approval</button>
          <button @click="viewBudget">View & Print Budget</button>
        </div>
      </div>

      <!-- Task Status and Actions -->
      <div class="flex items-center justify-between">
        <!-- ... status display ... -->
      </div>
    </div>

    <!-- ============================================ -->
    <!-- READONLY SECTION - Use TaskDataViewer -->
    <!-- ============================================ -->
    <TaskDataViewer
      v-if="readonly"
      :task="task"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import { MaterialsService } from '../../services/materialsService'
import { BudgetService } from '../../services/budgetService'
import TaskDataViewer from './TaskDataViewer.vue'  // ← Add this import

interface Props {
  task: EnquiryTask
  readonly?: boolean
}

const props = defineProps<Props>()

// ... rest of the script stays the same ...
// But remove all readonly-specific logic from functions
</script>
```

---

## Benefits of This Approach

### ✅ **Separation of Concerns**
- Edit mode: Handled by BudgetTask
- View mode: Handled by TaskDataViewer
- Clear responsibility boundaries

### ✅ **Code Simplification**
- No need for readonly checks on every input
- No need for conditional rendering of action buttons
- Cleaner, more maintainable code

### ✅ **Consistency**
- Same pattern as SurveyTask
- Same pattern as other tasks
- Easier for developers to understand

### ✅ **Reusability**
- TaskDataViewer can be used independently
- BudgetDataDisplay component reuses BudgetTask
- Single source of truth for display logic

---

## Implementation Checklist

### Phase 1: Preparation
- [ ] Read and understand SurveyTask.vue structure
- [ ] Identify all readonly-specific code in BudgetTask.vue
- [ ] Plan the refactor

### Phase 2: Import and Wrap
- [ ] Import TaskDataViewer component
- [ ] Wrap all editable content in `<div v-if="!readonly">`
- [ ] Add TaskDataViewer with `v-if="readonly"`

### Phase 3: Clean Up
- [ ] Remove readonly checks from individual inputs
- [ ] Remove readonly checks from action buttons
- [ ] Simplify loadBudgetData function
- [ ] Remove readonly-specific logic

### Phase 4: Testing
- [ ] Test edit mode (readonly=false)
- [ ] Test view mode (readonly=true)
- [ ] Test data loading in both modes
- [ ] Test all tabs and functionality

### Phase 5: Verification
- [ ] Check console for errors
- [ ] Verify data displays correctly
- [ ] Verify actions work in edit mode
- [ ] Verify readonly mode shows TaskDataViewer

---

## Expected Result

After refactoring:

**Edit Mode (readonly=false):**
- Shows full editable form
- All inputs are editable
- Action buttons visible
- Can save, submit, re-import

**View Mode (readonly=true):**
- Shows TaskDataViewer
- TaskDataViewer fetches and displays saved data
- Uses BudgetDataDisplay component
- BudgetDataDisplay uses BudgetTask with readonly=true
- Full circle: BudgetTask → TaskDataViewer → BudgetDataDisplay → BudgetTask(readonly)

This creates a clean separation and follows the established pattern!
