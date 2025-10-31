<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <!-- Loading State -->
    <div v-if="isLoading" class="p-6">
      <div class="animate-pulse">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
            <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div class="mt-6 flex space-x-3">
          <div class="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div class="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
          <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Failed to load balance</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ error }}</p>
        <div class="mt-6">
          <button
            @click="handleRetry"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Content State -->
    <div v-else-if="showContent" class="p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-md flex items-center justify-center" :class="iconBgColor">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              Current Balance
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ balanceDisplay }}
              </div>
              <div class="ml-2 flex items-baseline text-sm font-semibold" :class="statusTextColor">
                <span class="sr-only">{{ statusLabel }}</span>
                {{ statusLabel }}
              </div>
            </dd>
          </dl>
        </div>
        <div class="flex-shrink-0">
          <div class="w-3 h-3 rounded-full" :class="statusIndicatorColor"></div>
        </div>
      </div>
      
      <!-- Balance Details -->
      <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt class="text-gray-500 dark:text-gray-400">Low Threshold</dt>
          <dd class="font-medium text-gray-900 dark:text-white">
            {{ lowThresholdDisplay }}
          </dd>
        </div>
        <div>
          <dt class="text-gray-500 dark:text-gray-400">Critical Threshold</dt>
          <dd class="font-medium text-gray-900 dark:text-white">
            {{ criticalThresholdDisplay }}
          </dd>
        </div>
      </div>

      <!-- Last Transaction -->
      <div v-if="hasLastTransaction && lastTransactionDisplay" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Last Transaction</h4>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="getTransactionIconBg(lastTransactionDisplay.type)">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="lastTransactionDisplay.type === 'top_up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ lastTransactionDisplay.typeLabel }}
                <span v-if="lastTransactionDisplay.receiver"> to {{ lastTransactionDisplay.receiver }}</span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ lastTransactionDisplay.createdAt }}
              </p>
            </div>
          </div>
          <div class="text-sm font-medium" :class="getTransactionAmountColor(lastTransactionDisplay.type)">
            {{ lastTransactionDisplay.type === 'top_up' ? '+' : '-' }}{{ lastTransactionDisplay.amount }}
          </div>
        </div>
      </div>

      <!-- No Transaction State -->
      <div v-else-if="!hasLastTransaction" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-center py-4">
          <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
        </div>
      </div>

      <!-- Health Indicators -->
      <div v-if="needsAttention" class="mt-4 p-3 rounded-md" :class="warningBgColor">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5" :class="warningIconColor" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium" :class="warningTextColor">
              {{ warningTitle }}
            </h3>
            <div class="mt-2 text-sm" :class="warningTextColor">
              <p>{{ warningMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex space-x-3">
        <button
          v-if="canAddTopUp"
          @click="emit('add-topup')"
          class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Top-up
        </button>
        <button
          v-if="canCreateDisbursement"
          @click="emit('new-disbursement')"
          class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
          </svg>
          New Disbursement
        </button>
        
        <!-- Fallback when no actions are available -->
        <div v-if="!canAddTopUp && !canCreateDisbursement" class="flex-1 text-center py-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">No actions available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PettyCashBalance } from '../types/pettyCash'
import { defaultBalance, mergeWithDefaults } from '../utils/defaults'
import { useErrorHandler } from '../composables/useErrorHandler'

interface Props {
  balance: PettyCashBalance | null
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'add-topup'): void
  (e: 'new-disbursement'): void
  (e: 'refresh'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<Emits>()

// Error handling
const { handleError, clearError } = useErrorHandler()

// Safe balance data with defaults
const safeBalance = computed(() => {
  if (!props.balance) {
    return defaultBalance
  }
  return mergeWithDefaults(defaultBalance, props.balance)
})

// Loading and error states
const isLoading = computed(() => props.loading)
const hasError = computed(() => !!props.error)
const showContent = computed(() => !isLoading.value && !hasError.value)

// Retry functionality
const handleRetry = () => {
  clearError()
  emit('retry')
}

// Safe computed properties for styling
const statusLabel = computed(() => {
  const balance = safeBalance.value
  return balance.status?.label || 'Unknown'
})

const statusTextColor = computed(() => {
  const balance = safeBalance.value
  const status = balance.status?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'text-red-600 dark:text-red-400'
    case 'low': return 'text-yellow-600 dark:text-yellow-400'
    default: return 'text-green-600 dark:text-green-400'
  }
})

const statusIndicatorColor = computed(() => {
  const balance = safeBalance.value
  const status = balance.status?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'bg-red-500'
    case 'low': return 'bg-yellow-500'
    default: return 'bg-green-500'
  }
})

const iconBgColor = computed(() => {
  const balance = safeBalance.value
  const status = balance.status?.value || 'normal'
  
  switch (status) {
    case 'critical': return 'bg-red-500'
    case 'low': return 'bg-yellow-500'
    default: return 'bg-green-500'
  }
})

// Safe balance display
const balanceDisplay = computed(() => {
  const balance = safeBalance.value
  console.log('🔍 BalanceCard balanceDisplay:', {
    balance,
    currentBalance: balance.current_balance,
    formatted: balance.current_balance?.formatted,
    raw: balance.current_balance?.raw,
    propsBalance: props.balance
  })
  return balance.current_balance?.formatted || 
         `KES ${(balance.current_balance?.raw || 0).toLocaleString('en-KE', { 
           minimumFractionDigits: 2, 
           maximumFractionDigits: 2 
         })}`
})

// Safe threshold displays
const lowThresholdDisplay = computed(() => {
  const balance = safeBalance.value
  return balance.thresholds?.low_threshold?.formatted || 'KES 1,000.00'
})

const criticalThresholdDisplay = computed(() => {
  const balance = safeBalance.value
  return balance.thresholds?.critical_threshold?.formatted || 'KES 500.00'
})

// Safe last transaction data
const hasLastTransaction = computed(() => {
  const balance = safeBalance.value
  return !!(balance.last_transaction && balance.last_transaction.id)
})

const lastTransactionDisplay = computed(() => {
  const balance = safeBalance.value
  const transaction = balance.last_transaction
  
  if (!transaction) return null
  
  return {
    typeLabel: transaction.type_label || 'Transaction',
    receiver: transaction.receiver || '',
    createdAt: transaction.created_at?.human || 'Unknown time',
    amount: transaction.amount?.formatted || 'KES 0.00',
    type: transaction.type || 'top_up'
  }
})

// Safe health indicators
const needsAttention = computed(() => {
  const balance = safeBalance.value
  return balance.health_indicators?.needs_attention || false
})

// Safe permissions
const canAddTopUp = computed(() => {
  const balance = safeBalance.value
  return balance.can_add_top_up || false
})

const canCreateDisbursement = computed(() => {
  const balance = safeBalance.value
  return balance.can_create_disbursement || false
})

// Safe warning styling
const warningTitle = computed(() => {
  const balance = safeBalance.value
  const isCritical = balance.status?.is_critical || balance.status?.value === 'critical'
  return isCritical ? 'Critical Balance Alert' : 'Low Balance Warning'
})

const warningMessage = computed(() => {
  const balance = safeBalance.value
  const isCritical = balance.status?.is_critical || balance.status?.value === 'critical'
  return isCritical 
    ? 'Your petty cash balance is critically low. Please add a top-up immediately.'
    : 'Your petty cash balance is running low. Consider adding a top-up soon.'
})

const warningBgColor = computed(() => {
  const balance = safeBalance.value
  const isCritical = balance.status?.is_critical || balance.status?.value === 'critical'
  return isCritical 
    ? 'bg-red-50 dark:bg-red-900/20' 
    : 'bg-yellow-50 dark:bg-yellow-900/20'
})

const warningIconColor = computed(() => {
  const balance = safeBalance.value
  const isCritical = balance.status?.is_critical || balance.status?.value === 'critical'
  return isCritical ? 'text-red-400' : 'text-yellow-400'
})

const warningTextColor = computed(() => {
  const balance = safeBalance.value
  const isCritical = balance.status?.is_critical || balance.status?.value === 'critical'
  return isCritical 
    ? 'text-red-800 dark:text-red-200' 
    : 'text-yellow-800 dark:text-yellow-200'
})

// Safe transaction styling methods
const getTransactionIconBg = (type?: string): string => {
  return (type === 'top_up') ? 'bg-green-500' : 'bg-red-500'
}

const getTransactionAmountColor = (type?: string): string => {
  return (type === 'top_up') 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
}
</script>