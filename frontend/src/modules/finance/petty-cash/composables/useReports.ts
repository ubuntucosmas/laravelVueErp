import { ref, computed } from 'vue'
import type { 
  TransactionSummary,
  SpendingAnalytics,
  RecentTransaction,
  ChartData,
  DisbursementFilters
} from '../types/pettyCash'
import api from '@/plugins/axios'

const summary = ref<TransactionSummary | null>(null)
const analytics = ref<SpendingAnalytics | null>(null)
const recentTransactions = ref<RecentTransaction[]>([])
const chartData = ref<ChartData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useReports() {
  const fetchSummary = async (filters?: DisbursementFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/summary', { params })
      
      if (response.data.success) {
        summary.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch summary')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch summary'
      summary.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchAnalytics = async (filters?: DisbursementFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = { ...filters }
      const response = await api.get('/api/finance/petty-cash/analytics', { params })
      
      if (response.data.success) {
        analytics.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch analytics'
      analytics.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchRecentTransactions = async (limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      const params = { limit }
      const response = await api.get('/api/finance/petty-cash/recent', { params })
      
      if (response.data.success) {
        recentTransactions.value = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch recent transactions')
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch recent transactions'
      recentTransactions.value = []
    } finally {
      loading.value = false
    }
  }

  const generateChartData = async (filters?: DisbursementFilters) => {
    loading.value = true
    error.value = null

    try {
      // For now, we'll generate chart data from analytics
      // In a real implementation, this might be a separate endpoint
      await fetchAnalytics(filters)
      
      if (analytics.value) {
        chartData.value = {
          classification_pie: {
            labels: analytics.value.by_classification.map(item => item.classification),
            data: analytics.value.by_classification.map(item => item.total_amount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          },
          payment_method_doughnut: {
            labels: analytics.value.by_payment_method.map(item => item.payment_method),
            data: analytics.value.by_payment_method.map(item => item.total_amount),
            backgroundColor: ['#FF9F40', '#FF6384', '#4BC0C0', '#9966FF']
          }
        }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to generate chart data'
      chartData.value = null
    } finally {
      loading.value = false
    }
  }

  const exportData = async (type: 'disbursements' | 'top_ups' | 'summary', filters?: DisbursementFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = { type, ...filters }
      const response = await api.get('/api/finance/petty-cash/export', { 
        params,
        responseType: 'blob' // For file downloads
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Set filename based on type and current date
      const date = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `petty-cash-${type}-${date}.xlsx`)
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to export data'
      throw err
    } finally {
      loading.value = false
    }
  }

  const generatePDFReport = async (filters?: DisbursementFilters) => {
    loading.value = true
    error.value = null

    try {
      const params = { format: 'pdf', ...filters }
      const response = await api.get('/api/finance/petty-cash/report', { 
        params,
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      
      const date = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `petty-cash-report-${date}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to generate PDF report'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const totalSpending = computed(() => summary.value?.total_disbursements || 0)
  
  const totalTopUps = computed(() => summary.value?.total_top_ups || 0)
  
  const netBalance = computed(() => summary.value?.net_balance || 0)
  
  const transactionCount = computed(() => 
    (summary.value?.top_up_count || 0) + (summary.value?.disbursement_count || 0)
  )

  const averageTransactionAmount = computed(() => {
    const count = transactionCount.value
    return count > 0 ? (totalSpending.value + totalTopUps.value) / count : 0
  })

  const spendingByClassification = computed(() => 
    analytics.value?.by_classification || []
  )

  const spendingByPaymentMethod = computed(() => 
    analytics.value?.by_payment_method || []
  )

  const topSpendingClassification = computed(() => {
    const classifications = spendingByClassification.value
    return classifications.length > 0 
      ? classifications.reduce((prev, current) => 
          prev.total_amount > current.total_amount ? prev : current
        )
      : null
  })

  const topPaymentMethod = computed(() => {
    const methods = spendingByPaymentMethod.value
    return methods.length > 0 
      ? methods.reduce((prev, current) => 
          prev.total_amount > current.total_amount ? prev : current
        )
      : null
  })

  const hasData = computed(() => 
    summary.value !== null || analytics.value !== null || recentTransactions.value.length > 0
  )

  // Clear functions
  const clearError = () => {
    error.value = null
  }

  const clearReports = () => {
    summary.value = null
    analytics.value = null
    recentTransactions.value = []
    chartData.value = null
  }

  const refreshAllReports = async (filters?: DisbursementFilters) => {
    await Promise.all([
      fetchSummary(filters),
      fetchAnalytics(filters),
      fetchRecentTransactions(),
      generateChartData(filters)
    ])
  }

  return {
    // State
    summary,
    analytics,
    recentTransactions,
    chartData,
    loading,
    error,

    // Actions
    fetchSummary,
    fetchAnalytics,
    fetchRecentTransactions,
    generateChartData,
    exportData,
    generatePDFReport,
    refreshAllReports,

    // Computed
    totalSpending,
    totalTopUps,
    netBalance,
    transactionCount,
    averageTransactionAmount,
    spendingByClassification,
    spendingByPaymentMethod,
    topSpendingClassification,
    topPaymentMethod,
    hasData,

    // Helpers
    clearError,
    clearReports
  }
}