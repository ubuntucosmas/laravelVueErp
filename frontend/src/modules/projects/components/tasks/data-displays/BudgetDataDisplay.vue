<template>
  <div class="budget-data-display">
    <BudgetTask :task="task" :readonly="true" />
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

<style scoped>
.budget-data-display {
  max-width: none;
}
</style>
