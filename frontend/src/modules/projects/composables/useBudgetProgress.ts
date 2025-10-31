import { ref } from 'vue'
import type { ProgressCallback } from '../services/budgetService'

export interface ProgressState {
  isActive: boolean
  message: string
  progress: number
  step: string
  totalSteps: number
  currentStep: number
}

export function useBudgetProgress() {
  const progressState = ref<ProgressState>({
    isActive: false,
    message: '',
    progress: 0,
    step: '',
    totalSteps: 0,
    currentStep: 0,
  })

  const startProgress = (totalSteps: number, initialMessage: string = 'Starting...') => {
    progressState.value = {
      isActive: true,
      message: initialMessage,
      progress: 0,
      step: initialMessage,
      totalSteps,
      currentStep: 0,
    }
  }

  const updateProgress = (step: number, message: string, progress?: number) => {
    progressState.value.currentStep = step
    progressState.value.step = message
    progressState.value.message = message
    if (progress !== undefined) {
      progressState.value.progress = progress
    } else {
      // Calculate progress based on steps
      progressState.value.progress = Math.round((step / progressState.value.totalSteps) * 100)
    }
  }

  const incrementProgress = (message: string) => {
    progressState.value.currentStep++
    progressState.value.step = message
    progressState.value.message = message
    progressState.value.progress = Math.round((progressState.value.currentStep / progressState.value.totalSteps) * 100)
  }

  const completeProgress = (message: string = 'Completed successfully') => {
    progressState.value.message = message
    progressState.value.progress = 100
    progressState.value.step = message

    // Auto-hide after a delay
    setTimeout(() => {
      resetProgress()
    }, 2000)
  }

  const errorProgress = (message: string) => {
    progressState.value.message = `Error: ${message}`
    progressState.value.step = 'Error occurred'
  }

  const resetProgress = () => {
    progressState.value = {
      isActive: false,
      message: '',
      progress: 0,
      step: '',
      totalSteps: 0,
      currentStep: 0,
    }
  }

  // Create a progress callback function for API calls
  const createProgressCallback = (): ProgressCallback => {
    return (progress: number, message: string) => {
      updateProgress(progressState.value.currentStep, message, progress)
    }
  }

  return {
    progressState,
    startProgress,
    updateProgress,
    incrementProgress,
    completeProgress,
    errorProgress,
    resetProgress,
    createProgressCallback,
  }
}
