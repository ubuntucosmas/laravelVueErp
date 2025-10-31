# Budget Read-Only Display - Implementation Approach

## Current Situation

The BudgetDataDisplay.vue currently shows a simplified summary view, but we need it to show the exact same detailed view as BudgetTask.vue but in read-only mode.

## Best Approach: Add Readonly Prop to BudgetTask.vue

Instead of duplicating code, we should add a `readonly` prop to BudgetTask.vue and make inputs disabled when readonly=true.

### Benefits:
1. ✅ Single source of truth - no code duplication
2. ✅ Consistent UI between edit and view modes
3. ✅ Easier maintenance - changes in one place
4. ✅ Follows the pattern used by other tasks

### Implementation Steps:

1. **Add readonly prop to BudgetTask.vue**
2. **Disable inputs when readonly=true**
3. **Hide action buttons when readonly=true**
4. **Update BudgetDataDisplay to use BudgetTask with readonly=true**

## Alternative Approach: Duplicate with Readonly Styling

Create a complete copy of BudgetTask structure in BudgetDataDisplay but replace all inputs with read-only displays.

### Issues with this approach:
- ❌ Code duplication (2000+ lines)
- ❌ Maintenance nightmare
- ❌ Inconsistencies between edit and view
- ❌ Not following DRY principle

## Recommended Solution

### Step 1: Modify BudgetTask.vue

Add readonly prop and conditional rendering:

```vue
<script setup lang="ts">
interface Props {
  task: EnquiryTask
  readonly?: boolean  // Add this
}

const props = defineProps<Props>()
</script>

<template>
  <!-- Hide action buttons when readonly -->
  <div v-if="!readonly" class="budget-actions">
    <button @click="saveDraft">Save Draft</button>
    <button @click="submitForApproval">Submit</button>
  </div>

  <!-- Make inputs readonly/disabled -->
  <input
    v-model="material.unitPrice"
    type="number"
    :readonly="readonly"
    :disabled="readonly"
    :class="{ 'bg-gray-100 cursor-not-allowed': readonly }"
  />
</template>
```

### Step 2: Update BudgetDataDisplay.vue

Simply use BudgetTask with readonly prop:

```vue
<template>
  <div class="budget-data-display">
    <BudgetTask
      :task="task"
      :readonly="true"
    />
  </div>
</template>

<script setup lang="ts">
import BudgetTask from '../BudgetTask.vue'
import type { EnquiryTask } from '../../../types/enquiry'

interface Props {
  task: EnquiryTask
  taskData?: Record<string, unknown>
}

defineProps<Props>()
</script>
```

## Implementation Plan

1. ✅ Add `readonly?: boolean` prop to BudgetTask.vue Props interface
2. ✅ Add conditional rendering for action buttons (`v-if="!readonly"`)
3. ✅ Add `:readonly="readonly"` and `:disabled="readonly"` to all input fields
4. ✅ Add readonly styling classes
5. ✅ Update BudgetDataDisplay to import and use BudgetTask with readonly=true
6. ✅ Test both edit and readonly modes

## Expected Result

When viewing a completed/pending budget:
- Shows exact same layout as edit mode
- All tabs visible (Materials, Labour, Expenses, Logistics, Summary)
- All data displayed in tables
- Inputs are disabled/readonly
- No Save/Submit buttons
- Can still expand/collapse sections
- Can still switch between tabs

This provides the best user experience with minimal code duplication.
