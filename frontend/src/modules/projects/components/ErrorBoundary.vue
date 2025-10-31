<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-display p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center space-x-2 mb-2">
        <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-sm font-medium text-red-800 dark:text-red-200">Something went wrong</span>
      </div>
      <p class="text-sm text-red-700 dark:text-red-300 mb-3">{{ errorMessage }}</p>
      <div class="flex space-x-2">
        <button
          @click="retry"
          class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
        >
          Try Again
        </button>
        <button
          @click="reset"
          class="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

interface Props {
  fallbackMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: 'An unexpected error occurred. Please try refreshing the page.'
})

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref<Error | null>(null)

const emit = defineEmits(['error', 'retry', 'reset'])

const handleError = (error: Error) => {
  hasError.value = true
  errorMessage.value = error.message || props.fallbackMessage
  errorDetails.value = error

  console.error('ErrorBoundary caught error:', error)

  emit('error', {
    error,
    message: errorMessage.value,
    stack: error.stack
  })
}

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = null
  emit('retry')
}

const reset = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = null
  emit('reset')
}

// Capture errors from child components
onErrorCaptured((error, instance, info) => {
  handleError(error)
  return false // Prevent error from propagating further
})

// Expose methods for parent components
defineExpose({
  hasError,
  errorMessage,
  errorDetails,
  retry,
  reset
})
</script>
