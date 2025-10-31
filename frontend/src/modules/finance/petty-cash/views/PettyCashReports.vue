<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Petty Cash Reports
            </h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Generate detailed reports and analyze spending patterns
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <router-link
              to="/finance/petty-cash"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Dashboard
            </router-link>
          </div>
        </div>

        <!-- Reports Panel -->
        <ReportsPanel />

        <!-- Recent Transactions Summary -->
        <div v-if="recentTransactions.length > 0" class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
          </div>
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div
                v-for="transaction in recentTransactions.slice(0, 10)"
                :key="`${transaction.type}-${transaction.id}`"
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getTransactionIconBg(transaction.type)">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="transaction.type === 'top_up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transaction.type === 'top_up' ? 'Top-up' : 'Disbursement' }}
                      <span v-if="transaction.receiver"> to {{ transaction.receiver }}</span>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ transaction.description }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      by {{ transaction.creator }} • {{ formatDate(transaction.created_at) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium" :class="getTransactionAmountColor(transaction.type)">
                    {{ transaction.type === 'top_up' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useReports } from '../composables/useReports'
import ReportsPanel from '../components/ReportsPanel.vue'

const reportsComposable = useReports()

// Computed properties
const recentTransactions = computed(() => reportsComposable.recentTransactions.value)

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionIconBg = (type: string): string => {
  return type === 'top_up' ? 'bg-green-500' : 'bg-red-500'
}

const getTransactionAmountColor = (type: string): string => {
  return type === 'top_up' 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
}

// Lifecycle
onMounted(() => {
  reportsComposable.fetchRecentTransactions(20)
})
</script>