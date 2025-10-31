<template>
  <div class="empty-state" :class="containerClass">
    <div class="text-center" :class="contentClass">
      <!-- Icon -->
      <div class="mx-auto flex items-center justify-center" :class="iconContainerClass">
        <!-- Custom icon slot -->
        <slot name="icon">
          <!-- Default icons based on type -->
          <svg v-if="type === 'no-data'" class="text-gray-400" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          
          <svg v-else-if="type === 'no-results'" class="text-gray-400" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          
          <svg v-else-if="type === 'error'" class="text-red-400" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          
          <svg v-else-if="type === 'permission'" class="text-yellow-400" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          
          <svg v-else-if="type === 'network'" class="text-orange-400" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
          </svg>
          
          <svg v-else class="text-gray-400" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
        </slot>
      </div>

      <!-- Title -->
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        <slot name="title">
          {{ displayTitle }}
        </slot>
      </h3>

      <!-- Description -->
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        <slot name="description">
          {{ displayDescription }}
        </slot>
      </p>

      <!-- Additional content slot -->
      <div v-if="$slots.content" class="mt-4">
        <slot name="content" />
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <!-- Primary action -->
        <button
          v-if="primaryAction"
          @click="handlePrimaryAction"
          :disabled="primaryAction.disabled"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <component 
            v-if="primaryAction.icon" 
            :is="primaryAction.icon" 
            class="-ml-1 mr-2 h-4 w-4" 
          />
          {{ primaryAction.label }}
        </button>

        <!-- Secondary action -->
        <button
          v-if="secondaryAction"
          @click="handleSecondaryAction"
          :disabled="secondaryAction.disabled"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <component 
            v-if="secondaryAction.icon" 
            :is="secondaryAction.icon" 
            class="-ml-1 mr-2 h-4 w-4" 
          />
          {{ secondaryAction.label }}
        </button>

        <!-- Custom actions slot -->
        <slot name="actions" />
      </div>

      <!-- Help text -->
      <div v-if="helpText || $slots.help" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <slot name="help">
          <p class="text-xs text-gray-400 dark:text-gray-500">
            {{ helpText }}
          </p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type EmptyStateType = 'no-data' | 'no-results' | 'error' | 'permission' | 'network' | 'custom'
export type EmptyStateSize = 'sm' | 'md' | 'lg'

interface ActionConfig {
  label: string
  icon?: any
  disabled?: boolean
}

interface Props {
  // Empty state type
  type?: EmptyStateType
  size?: EmptyStateSize
  
  // Content
  title?: string
  description?: string
  helpText?: string
  
  // Actions
  primaryAction?: ActionConfig
  secondaryAction?: ActionConfig
  showActions?: boolean
  
  // Styling
  fullHeight?: boolean
  centered?: boolean
  
  // Custom classes
  containerClass?: string
}

interface Emits {
  (e: 'primary-action'): void
  (e: 'secondary-action'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'no-data',
  size: 'md',
  showActions: true,
  fullHeight: false,
  centered: true
})

const emit = defineEmits<Emits>()

// Default content based on type
const displayTitle = computed(() => {
  if (props.title) return props.title
  
  switch (props.type) {
    case 'no-data':
      return 'No data available'
    case 'no-results':
      return 'No results found'
    case 'error':
      return 'Something went wrong'
    case 'permission':
      return 'Access denied'
    case 'network':
      return 'Connection error'
    default:
      return 'Nothing to show'
  }
})

const displayDescription = computed(() => {
  if (props.description) return props.description
  
  switch (props.type) {
    case 'no-data':
      return 'There is no data to display at the moment. Try adding some content or check back later.'
    case 'no-results':
      return 'We couldn\'t find any results matching your criteria. Try adjusting your search or filters.'
    case 'error':
      return 'An error occurred while loading the content. Please try again or contact support if the problem persists.'
    case 'permission':
      return 'You don\'t have permission to view this content. Please contact your administrator for access.'
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    default:
      return 'There\'s nothing to display here right now.'
  }
})

// Computed classes
const containerClass = computed(() => {
  const classes = ['empty-state', 'w-full']
  
  if (props.fullHeight) classes.push('min-h-full')
  if (props.centered) classes.push('flex items-center justify-center')
  
  return classes.join(' ')
})

const contentClass = computed(() => {
  const classes = []
  
  switch (props.size) {
    case 'sm':
      classes.push('max-w-sm', 'py-8')
      break
    case 'lg':
      classes.push('max-w-2xl', 'py-16')
      break
    default:
      classes.push('max-w-lg', 'py-12')
  }
  
  return classes.join(' ')
})

const iconContainerClass = computed(() => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20'
  }
  
  return `${sizeClasses[props.size]} rounded-full bg-gray-100 dark:bg-gray-800`
})

const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }
  
  return sizeClasses[props.size]
})

// Action handlers
const handlePrimaryAction = () => {
  emit('primary-action')
}

const handleSecondaryAction = () => {
  emit('secondary-action')
}
</script>

<style scoped>
.empty-state {
  @apply w-full;
}

/* Ensure proper spacing and alignment */
.empty-state .text-center {
  @apply px-4;
}

/* Icon animation on hover */
.empty-state svg {
  @apply transition-transform duration-200;
}

.empty-state:hover svg {
  @apply scale-105;
}
</style>