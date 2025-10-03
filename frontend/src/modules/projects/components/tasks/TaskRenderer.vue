<template>
  <div class="task-renderer">
    <component
      :is="taskComponent"
      :task="task"
      @update-status="handleStatusUpdate"
      @complete="handleComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'
import SurveyTask from './SurveyTask.vue'
import DesignTask from './DesignTask.vue'
import MaterialsTask from './MaterialsTask.vue'
import BudgetTask from './BudgetTask.vue'
import QuoteTask from './QuoteTask.vue'

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
}>()

const taskComponent = computed(() => {
  switch (props.task.type) {
    case 'survey':
      return SurveyTask
    case 'design':
      return DesignTask
    case 'materials':
      return MaterialsTask
    case 'budget':
      return BudgetTask
    case 'quote':
      return QuoteTask
    default:
      return null
  }
})

const handleStatusUpdate = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const handleComplete = () => {
  emit('complete')
}
</script>
