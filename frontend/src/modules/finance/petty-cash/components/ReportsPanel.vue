<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
        Reports & Analytics
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Generate reports and analyze petty cash spending patterns
      </p>
    </div>

    <div class="p-6">
      <!-- Report Filters -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Report Filters</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Date Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              v-model="filters.start_date"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              v-model="filters.end_date"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Classification Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Classification</label>
            <select
              v-model="filters.classification"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Classifications</option>
              <option value="agencies">Agencies</option>
              <option value="admin">Administration</option>
              <option value="operations">Operations</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Project Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
            <input
              v-model="filters.project_name"
              type="text"
              placeholder="Project name"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-4 flex justify-end space-x-3">
          <button
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
          <button
            @click="generateReport"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Generating...' : 'Generate Report' }}
          </button>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div v-if="summary" class="mb-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Summary Statistics</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Top-ups</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatAmount(summary.total_top_ups) }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400">
              {{ summary.top_up_count }} transactions
            </dd>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Disbursements</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatAmount(summary.total_disbursements) }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400">
              {{ summary.disbursement_count }} transactions
            </dd>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Net Balance</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatAmount(summary.net_balance) }}
            </dd>
            <dd class="text-sm" :class="summary.net_balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ summary.net_balance >= 0 ? 'Positive' : 'Negative' }} balance
            </dd>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Disbursement</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formatAmount(summary.average_disbursement) }}
            </dd>
            <dd class="text-sm text-gray-500 dark:text-gray-400">
              Per transaction
            </dd>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div v-if="analytics" class="mb-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Spending Analysis</h4>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Classification Chart -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Spending by Classification</h5>
            <div v-if="analytics.by_classification.length > 0" class="space-y-3">
              <div
                v-for="item in analytics.by_classification"
                :key="item.classification"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 rounded-full" :class="getClassificationColor(item.classification)"></div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {{ item.classification }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatAmount(item.total_amount) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.percentage.toFixed(1) }}% ({{ item.transaction_count }} txns)
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          </div>

          <!-- Payment Method Chart -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Spending by Payment Method</h5>
            <div v-if="analytics.by_payment_method.length > 0" class="space-y-3">
              <div
                v-for="item in analytics.by_payment_method"
                :key="item.payment_method"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 rounded-full" :class="getPaymentMethodColor(item.payment_method)"></div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ getPaymentMethodLabel(item.payment_method) }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatAmount(item.total_amount) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ item.percentage.toFixed(1) }}% ({{ item.transaction_count }} txns)
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
              No data available
            </div>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Export Options</h4>
        <div class="flex flex-wrap gap-3">
          <button
            @click="exportExcel"
            :disabled="isExporting"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="-ml-1 mr-2 h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ isExporting ? 'Exporting...' : 'Export to Excel' }}
          </button>

          <button
            @click="exportPDF"
            :disabled="isExporting"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="-ml-1 mr-2 h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ isExporting ? 'Generating...' : 'Export to PDF' }}
          </button>

          <button
            @click="exportCSV"
            :disabled="isExporting"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="-ml-1 mr-2 h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ isExporting ? 'Exporting...' : 'Export to CSV' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useReports } from '../composables/useReports'
import { pettyCashService } from '../services/pettyCashService'
import type { DisbursementFilters } from '../types/pettyCash'

const reportsComposable = useReports()
const isExporting = ref(false)

// Reactive filters
const filters = reactive<DisbursementFilters>({
  start_date: '',
  end_date: '',
  classification: '',
  project_name: ''
})

// Computed properties
const summary = computed(() => reportsComposable.summary.value)
const analytics = computed(() => reportsComposable.analytics.value)
const loading = computed(() => reportsComposable.loading.value)

// Methods
const formatAmount = (amount: number): string => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const getClassificationColor = (classification: string): string => {
  const colors = {
    agencies: 'bg-purple-500',
    admin: 'bg-blue-500',
    operations: 'bg-green-500',
    other: 'bg-gray-500'
  }
  return colors[classification as keyof typeof colors] || colors.other
}

const getPaymentMethodColor = (method: string): string => {
  const colors = {
    cash: 'bg-green-500',
    mpesa: 'bg-yellow-500',
    bank_transfer: 'bg-blue-500',
    other: 'bg-gray-500'
  }
  return colors[method as keyof typeof colors] || colors.other
}

const getPaymentMethodLabel = (method: string): string => {
  const labels = {
    cash: 'Cash',
    mpesa: 'M-Pesa',
    bank_transfer: 'Bank Transfer',
    other: 'Other'
  }
  return labels[method as keyof typeof labels] || method
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key as keyof DisbursementFilters] = ''
  })
}

const generateReport = async () => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '')
  )
  
  await Promise.all([
    reportsComposable.fetchSummary(activeFilters),
    reportsComposable.fetchAnalytics(activeFilters)
  ])
}

const exportExcel = async () => {
  if (isExporting.value) return
  
  isExporting.value = true
  try {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    
    await pettyCashService.downloadExcelExport('summary', activeFilters)
  } catch (error) {
    console.error('Export failed:', error)
    // You might want to show a toast notification here
  } finally {
    isExporting.value = false
  }
}

const exportPDF = async () => {
  if (isExporting.value) return
  
  isExporting.value = true
  try {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    
    await pettyCashService.downloadPDFReport(activeFilters)
  } catch (error) {
    console.error('PDF export failed:', error)
    // You might want to show a toast notification here
  } finally {
    isExporting.value = false
  }
}

const exportCSV = async () => {
  if (isExporting.value) return
  
  isExporting.value = true
  try {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    )
    
    await pettyCashService.downloadCSVExport('summary', activeFilters)
  } catch (error) {
    console.error('CSV export failed:', error)
    // You might want to show a toast notification here
  } finally {
    isExporting.value = false
  }
}
</script>