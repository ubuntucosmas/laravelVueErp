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
import QuoteApprovalTask from './QuoteApprovalTask.vue'
import ProcurementTask from './ProcurementTask.vue'
import ConversionTask from './ConversionTask.vue'
import ProductionTask from './ProductionTask.vue'
import LogisticsTask from './LogisticsTask.vue'
import SetupTask from './SetupTask.vue'
import HandoverTask from './HandoverTask.vue'
import SetdownTask from './SetdownTask.vue'
import ReportTask from './ReportTask.vue'
import DefaultTask from './DefaultTask.vue'

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
    case 'quote_approval':
      return QuoteApprovalTask
    case 'procurement':
      return ProcurementTask
    case 'conversion':
      return ConversionTask
    case 'production':
      return ProductionTask
    case 'logistics':
      return LogisticsTask
    case 'setup':
      return SetupTask
    case 'handover':
      return HandoverTask
    case 'setdown':
      return SetdownTask
    case 'report':
      return ReportTask
    default:
      return DefaultTask
  }
})

const handleStatusUpdate = (status: EnquiryTask['status']) => {
  emit('update-status', status)
}

const handleComplete = () => {
  emit('complete')
}
</script>
