import { ref, computed } from 'vue'
import type { ApiError } from '../types/api'

// Error types for better categorization
export type ErrorType = 'validation' | 'permission' | 'server' | 'network' | 'unknown'

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Error state interface
export interface ErrorState {
  hasError: boolean
  type: ErrorType
  severity: ErrorSeverity
  message: string
  details?: string
  code?: string | number
  timestamp: Date
  context?: Record<string, any>
}

// Default error state
const createDefaultErrorState = (): ErrorState => ({
  hasError: false,
  type: 'unknown',
  severity: 'low',
  message: '',
  timestamp: new Date()
})

export function useErrorHandler() {
  // Reactive error state
  const errorState = ref<ErrorState>(createDefaultErrorState())
  const isLoading = ref(false)
  const retryCount = ref(0)
  const maxRetries = ref(3)

  // Computed properties
  const hasError = computed(() => errorState.value.hasError)
  const errorMessage = computed(() => errorState.value.message)
  const errorType = computed(() => errorState.value.type)
  const errorSeverity = computed(() => errorState.value.severity)
  const canRetry = computed(() => retryCount.value < maxRetries.value)

  // Error type detection
  const detectErrorType = (error: any): ErrorType => {
    if (error.response?.status === 403 || error.code === 'PERMISSION_DENIED') {
      return 'permission'
    }
    if (error.response?.status >= 500 || error.code === 'SERVER_ERROR') {
      return 'server'
    }
    if (error.response?.status === 422 || error.errors) {
      return 'validation'
    }
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
      return 'network'
    }
    return 'unknown'
  }

  // Error severity detection
  const detectErrorSeverity = (error: any, type: ErrorType): ErrorSeverity => {
    if (type === 'server' && error.response?.status >= 500) {
      return 'critical'
    }
    if (type === 'permission') {
      return 'high'
    }
    if (type === 'network') {
      return 'medium'
    }
    if (type === 'validation') {
      return 'low'
    }
    return 'medium'
  }

  // Get user-friendly error message
  const getUserFriendlyMessage = (error: any, type: ErrorType): string => {
    // Check for specific error codes first
    if (error.response?.status) {
      const statusMessages: Record<number, string> = {
        400: 'Bad request - please check your input',
        401: 'Authentication required',
        403: 'Access denied - insufficient permissions',
        404: 'Resource not found',
        422: 'Validation failed',
        500: 'Internal server error',
        502: 'Bad gateway',
        503: 'Service unavailable'
      }
      const statusMessage = statusMessages[error.response.status]
      if (statusMessage) return statusMessage
    }

    // Check for API error messages
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    // Check for direct error messages
    if (error.message && typeof error.message === 'string') {
      return error.message
    }

    // Type-based fallbacks
    switch (type) {
      case 'permission':
        return 'You do not have permission to perform this action'
      case 'server':
        return 'Server error occurred. Please try again later'
      case 'validation':
        return 'Please check your input and try again'
      case 'network':
        return 'Network error. Please check your connection'
      default:
        return 'An unexpected error occurred'
    }
  }

  // Main error handler
  const handleError = (error: any, context?: Record<string, any>) => {
    const type = detectErrorType(error)
    const severity = detectErrorSeverity(error, type)
    const message = getUserFriendlyMessage(error, type)

    errorState.value = {
      hasError: true,
      type,
      severity,
      message,
      details: error.response?.data?.message || error.message,
      code: error.response?.status || error.code,
      timestamp: new Date(),
      context
    }

    console.error('Error handled:', error)
  }

  // Clear error
  const clearError = () => {
    errorState.value = createDefaultErrorState()
  }

  // Reset retry count
  const resetRetryCount = () => {
    retryCount.value = 0
  }

  // Set loading state
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Simplified error handling wrapper
  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    try {
      setLoading(true)
      clearError()
      
      const result = await operation()
      resetRetryCount()
      
      return result
    } catch (error) {
      handleError(error, context)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Simplified retry wrapper
  const withRetry = async <T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> => {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries.value; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt}/${maxRetries.value}`)
        }
        
        setLoading(true)
        
        const result = await operation()
        
        clearError()
        return result
      } catch (error) {
        lastError = error
        retryCount.value = attempt + 1
        
        if (attempt === maxRetries.value) {
          handleError(error, context)
          break
        }
        
        // Wait before next retry
        const delay = 1000 * Math.pow(2, attempt) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      } finally {
        setLoading(false)
      }
    }
    
    return null
  }

  return {
    // State
    errorState,
    isLoading,
    retryCount,
    maxRetries,

    // Computed
    hasError,
    errorMessage,
    errorType,
    errorSeverity,
    canRetry,

    // Methods
    handleError,
    clearError,
    resetRetryCount,
    setLoading,
    withErrorHandling,
    withRetry
  }
}