<template>
  <div
    :class="cardClasses"
    @click="$emit('click')"
  >
    <!-- Card Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-1">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ task.task_name }}
            </h3>
            <PriorityBadge :priority="task.priority" />
          </div>

          <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span v-if="task.department">{{ task.department.name }}</span>
            <span v-if="task.due_date" :class="dueDateClasses">
              Due {{ formatDueDate(task.due_date) }}
            </span>
          </div>
        </div>

        <div class="flex items-center space-x-2 ml-2">
          <StatusBadge :status="task.status" />
          <div v-if="task.assigned_user" class="flex items-center space-x-2">
            <AssigneeAvatar :user="task.assigned_user" size="sm" />
            <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-20">
              {{ task.assigned_user.name }}
            </span>
          </div>
          <div v-else class="flex items-center space-x-1">
            <AssigneeAvatar :user="null" size="sm" />
            <span class="text-xs text-gray-500 dark:text-gray-400">Unassigned</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
        {{ task.task_description }}
      </p>

      <!-- Progress for in-progress tasks -->
      <div v-if="task.status === 'in_progress' && task.estimated_hours" class="mb-3">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{{ task.actual_hours || 0 }}h / {{ task.estimated_hours }}h</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Time tracking info -->
      <div v-if="task.estimated_hours" class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Estimated: {{ task.estimated_hours }}h</span>
        <span v-if="task.actual_hours">Actual: {{ task.actual_hours }}h</span>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center justify-between">
        <div class="flex space-x-2">
          <QuickActionButton
            v-if="canClaim"
            @click.stop="handleAction('claim')"
            variant="primary"
            size="sm"
          >
            Claim
          </QuickActionButton>

          <QuickActionButton
            v-if="canStart"
            @click.stop="handleAction('start')"
            variant="primary"
            size="sm"
          >
            Start
          </QuickActionButton>

          <QuickActionButton
            v-if="canComplete"
            @click.stop="handleAction('complete')"
            variant="success"
            size="sm"
          >
            Complete
          </QuickActionButton>
        </div>

        <button
          @click.stop="handleViewDetails"
          :class="[
            'text-xs font-medium',
            task.status === 'completed'
              ? 'text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300'
              : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
          ]"
        >
          {{ task.status === 'completed' ? 'View Submitted Data →' : 'View Details →' }}
        </button>
      </div>
    </div>

    <!-- Card Footer (List view only) -->
    <div v-if="viewMode === 'list'" class="px-4 pb-3">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Created {{ formatDate(task.created_at) }}</span>
        <span v-if="task.started_at">Started {{ formatDate(task.started_at) }}</span>
        <span v-if="task.completed_at">Completed {{ formatDate(task.completed_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DepartmentalTask } from '../types'

// Components
import PriorityBadge from './PriorityBadge.vue'
import StatusBadge from './StatusBadge.vue'
import AssigneeAvatar from './AssigneeAvatar.vue'
import QuickActionButton from './QuickActionButton.vue'

// Props
interface Props {
  task: DepartmentalTask
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})

// Emits
const emit = defineEmits<{
  click: []
  viewDetails: [task: DepartmentalTask]
  action: [action: string, task: DepartmentalTask]
}>()

// Computed
const cardClasses = computed(() => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md'

  switch (props.task.status) {
    case 'completed':
      return `${baseClasses} border-green-200 dark:border-green-800 hover:border-green-300`
    case 'in_progress':
      return `${baseClasses} border-blue-200 dark:border-blue-800 hover:border-blue-300`
    case 'pending':
      return `${baseClasses} border-gray-200 dark:border-gray-700 hover:border-gray-300`
    default:
      return `${baseClasses} border-gray-200 dark:border-gray-700 hover:border-gray-300`
  }
})

const dueDateClasses = computed(() => {
  if (!props.task.due_date) return ''

  const now = new Date()
  const dueDate = new Date(props.task.due_date)
  const diffTime = dueDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-red-600 dark:text-red-400 font-medium'
  if (diffDays <= 1) return 'text-orange-600 dark:text-orange-400 font-medium'
  if (diffDays <= 7) return 'text-yellow-600 dark:text-yellow-400'

  return ''
})

const progressPercentage = computed(() => {
  if (!props.task.estimated_hours) return 0
  const actual = props.task.actual_hours || 0
  return Math.min((actual / props.task.estimated_hours) * 100, 100)
})

const canClaim = computed(() => {
  return !props.task.assigned_user_id && props.task.status === 'pending'
})

const canStart = computed(() => {
  return props.task.assigned_user_id && props.task.status === 'pending'
})

const canComplete = computed(() => {
  return props.task.assigned_user_id && props.task.status === 'in_progress'
})

// Methods
const handleAction = (action: string) => {
  // TODO: Implement action handling
  console.log(`Performing action: ${action} on task ${props.task.id}`)
  // $emit('action', action, props.task)
}

const handleViewDetails = () => {
  if (props.task.status === 'completed') {
    // For completed tasks, emit view-details event
    emit('viewDetails', props.task)
  } else {
    // For other tasks, emit regular click event
    emit('click')
  }
}

const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

  return date.toLocaleDateString()
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
