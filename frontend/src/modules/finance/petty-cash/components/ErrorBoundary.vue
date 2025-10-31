<template>
  <div class="error-boundary">
    <!-- Error State -->
    <div v-if="hasError" class="error-boundary__error">
      <div class="min-h-[200px] flex items-center justify-center p-6">
        <div class="text-center max-w-md">
          <!-- Error Icon -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" :class="errorIconBg">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>

          <!-- Error Title -->
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ errorTitle }}
          </h3>

          <!-- Error Message -->
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ errorMessage }}
          </p>

          <!-- Error Details (Development Only) -->
          <div v-if="showDetails && errorDetails" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
            <details class="text-xs">
              <summary class="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details
              </summary>
              <pre class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto max-h-32">{{ errorDetails }}</pre>
            </details>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              v-if="canRetry"
              @click="handleRetry"
              :disabled="isRetrying"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isRetrying" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ isRetrying ? 'Retrying...' : 'Try Again' }}
            </button>

            <button
              v-if="canReset"
              @click="handleReset"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              Reset
            </button>

            <button
              v-if="canReload"
              @click="handleReload"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reload Page
            </button>
          </div>

          <!-- Support Information -->
          <div v-if="showSupport" class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-400 dark:text-gray-500">
              If this problem persists, please contact support with error ID: 
              <code class="bg-gray-100 dark:bg-gray-600 px-1 rounded">{{ errorId }}</code>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Normal Content -->
    <div v-else class="error-boundary__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured, onMounted, nextTick } from 'vue'
import { useErrorHandler } from '../composables/useErrorHandler'

// Error types for different error scenarios
export type ErrorBoundaryType = 'component' | 'network' | 'permission' | 'validation' | 'unknown'

interface Props {
  // Error boundary configuration
  fallbackComponent?: string
  showDetails?: boolean
  showSupport?: boolean
  canRetry?: boolean
  canReset?: boolean
  canReload?: boolean
  
  // Error handling options
  maxRetries?: number
  retryDelay?: number
  logErrors?: boolean
  
  // Custom error messages
  title?: string
  message?: string
  
  // Error boundary type
  type?: ErrorBoundaryType
}

interface Emits {
  (e: 'error', error: Error, errorInfo?: any): void
  (e: 'retry'): void
  (e: 'reset'): void
  (e: 'reload'): void
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
  showSupport: true,
  canRetry: true,
  canReset: true,
  canReload: false,
  maxRetries: 3,
  retryDelay: 1000,
  logErrors: true,
  type: 'unknown'
})

const emit = defineEmits<Emits>()

// Error handling composable
const { handleError, clearError } = useErrorHandler()

// Error state
const hasError = ref(false)
const currentError = ref<Error | null>(null)
const errorInfo = ref<any>(null)
const retryCount = ref(0)
const isRetrying = ref(false)
const errorId = ref('')

// Generate unique error ID
const generateErrorId = (): string => {
  return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Error display properties
const errorTitle = computed(() => {
  if (props.title) return props.title
  
  switch (props.type) {
    case 'component':
      return 'Component Error'
    case 'network':
      return 'Connection Error'
    case 'permission':
      return 'Access Denied'
    case 'validation':
      return 'Data Error'
    default:
      return 'Something went wrong'
  }
})

const errorMessage = computed(() => {
  if (props.message) return props.message
  
  if (currentError.value) {
    // Try to get user-friendly message from error handler
    try {
      return handleError(currentError.value).message
    } catch {
      return currentError.value.message || 'An unexpected error occurred'
    }
  }
  
  switch (props.type) {
    case 'component':
      return 'A component failed to render properly. Please try refreshing the page.'
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    case 'permission':
      return 'You do not have permission to access this resource. Please contact your administrator.'
    case 'validation':
      return 'The data could not be processed due to validation errors. Please try again.'
    default:
      return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
  }
})

const errorDetails = computed(() => {
  if (!currentError.value) return ''
  
  const details = {
    message: currentError.value.message,
    stack: currentError.value.stack,
    name: currentError.value.name,
    timestamp: new Date().toISOString(),
    errorId: errorId.value,
    retryCount: retryCount.value,
    type: props.type,
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  return JSON.stringify(details, null, 2)
})

const errorIconBg = computed(() => {
  switch (props.type) {
    case 'network':
      return 'bg-orange-500'
    case 'permission':
      return 'bg-red-500'
    case 'validation':
      return 'bg-yellow-500'
    case 'component':
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
})

// Error capture
onErrorCaptured((error: Error, instance, info) => {
  console.error('ErrorBoundary caught error:', error, info)
  
  captureError(error, { instance, info })
  
  // Prevent the error from propagating further
  return false
})

// Error handling methods
const captureError = (error: Error, info?: any) => {
  hasError.value = true
  currentError.value = error
  errorInfo.value = info
  errorId.value = generateErrorId()
  
  // Log error if enabled
  if (props.logErrors) {
    console.error(`[ErrorBoundary:${errorId.value}]`, {
      error,
      info,
      type: props.type,
      timestamp: new Date().toISOString()
    })
  }
  
  // Emit error event
  emit('error', error, info)
  
  // Handle error with error handler
  try {
    handleError(error, {
      errorBoundary: true,
      type: props.type,
      errorId: errorId.value,
      retryCount: retryCount.value
    })
  } catch (handlerError) {
    console.warn('Error handler failed:', handlerError)
  }
}

// Action handlers
const handleRetry = async () => {
  if (retryCount.value >= props.maxRetries) {
    console.warn('Max retries reached')
    return
  }
  
  isRetrying.value = true
  retryCount.value++
  
  try {
    // Wait for retry delay
    await new Promise(resolve => setTimeout(resolve, props.retryDelay))
    
    // Clear error state
    hasError.value = false
    currentError.value = null
    errorInfo.value = null
    clearError()
    
    // Wait for next tick to ensure DOM updates
    await nextTick()
    
    emit('retry')
  } catch (error) {
    console.error('Retry failed:', error)
    if (error instanceof Error) {
      captureError(error)
    }
  } finally {
    isRetrying.value = false
  }
}

const handleReset = () => {
  hasError.value = false
  currentError.value = null
  errorInfo.value = null
  retryCount.value = 0
  errorId.value = ''
  clearError()
  
  emit('reset')
}

const handleReload = () => {
  emit('reload')
  window.location.reload()
}

// Global error handler for unhandled errors
const handleGlobalError = (event: ErrorEvent) => {
  if (!hasError.value) {
    captureError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      source: 'global'
    })
  }
}

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  if (!hasError.value) {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason))
    
    captureError(error, {
      source: 'unhandledRejection',
      reason: event.reason
    })
  }
}

// Lifecycle
onMounted(() => {
  // Add global error listeners
  window.addEventListener('error', handleGlobalError)
  window.addEventListener('unhandledrejection', handleUnhandledRejection)
})

// Cleanup is handled automatically by Vue when component unmounts

// Expose methods for parent components
defineExpose({
  captureError,
  reset: handleReset,
  retry: handleRetry,
  hasError: computed(() => hasError.value),
  errorId: computed(() => errorId.value),
  retryCount: computed(() => retryCount.value)
})
</script>

<style scoped>
.error-boundary {
  @apply w-full h-full;
}

.error-boundary__error {
  @apply w-full h-full;
}

.error-boundary__content {
  @apply w-full h-full;
}

/* Ensure error boundary takes full space */
.error-boundary,
.error-boundary__error,
.error-boundary__content {
  min-height: inherit;
  max-height: inherit;
}
</style>