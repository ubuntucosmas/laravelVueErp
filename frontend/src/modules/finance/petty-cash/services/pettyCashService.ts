import api from '@/plugins/axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { usePermissions, type PettyCashPermission, type PermissionError } from '../composables/usePermissions'
// Simplified service without external logging dependencies
import type {
  // Core types
  PettyCashTopUp,
  PettyCashDisbursement,
  PettyCashBalance,
  DisbursementFilters,
  TopUpFilters,
  TransactionFilters
} from '../types/pettyCash'

import type {
  CreateTopUpFormData,
  CreateDisbursementFormData,
  UpdateDisbursementFormData,
  VoidDisbursementFormData
} from '../types/forms'

import type {
  // API response types
  ApiResponse,
  PaginatedResponse,
  SearchResponse,
  DisbursementListResponse,
  TopUpListResponse,
  TransactionListResponse,
  DisbursementResponse,
  TopUpResponse,
  BalanceResponse,
  SummaryResponse,
  AnalyticsResponse,
  RecentTransactionsResponse,
  StatisticsResponse,
  PaymentMethodsResponse,
  BalanceCheckResponse,
  AvailableTopUpsResponse,
  AvailableBalanceResponse,
  ValidationResponse,
  RecalculateBalanceResponse,
  TrendsResponse,
  ApiError,
  ApiResult,
  RequestConfig
} from '../types/api'

// Enhanced error types for better error handling
interface EnhancedApiError extends ApiError {
  status?: number
  statusText?: string
  code?: string
  context?: Record<string, any>
  timestamp: Date
  retryable: boolean
}

class PettyCashService {
  private readonly baseUrl = '/api/finance/petty-cash'
  private readonly defaultTimeout = 30000 // 30 seconds
  private readonly maxRetries = 3
  private readonly retryDelay = 1000 // 1 second
  private permissions = usePermissions()

  // Permission validation before API calls
  private validatePermission(permission: PettyCashPermission, operation: string): void {
    try {
      this.permissions.requirePermission(permission)
    } catch (error) {
      const permissionError = error as PermissionError
      console.warn(`Permission denied for ${operation}:`, permissionError.message)
      
      // Transform permission error to API error format
      const apiError: EnhancedApiError = {
        success: false,
        status: 403,
        statusText: 'Forbidden',
        code: 'PERMISSION_DENIED',
        message: permissionError.message,
        error: `Permission '${permission}' required for ${operation}`,
        timestamp: new Date(),
        retryable: false,
        context: {
          operation,
          requiredPermission: permission,
          userRole: this.permissions.userRole.value,
          suggestedAction: permissionError.suggestedAction
        }
      }
      
      throw apiError
    }
  }

  private validateAnyPermission(permissions: PettyCashPermission[], operation: string): void {
    try {
      this.permissions.requireAnyPermission(permissions)
    } catch (error) {
      const permissionError = error as PermissionError
      console.warn(`Permission denied for ${operation}:`, permissionError.message)
      
      // Transform permission error to API error format
      const apiError: EnhancedApiError = {
        success: false,
        status: 403,
        statusText: 'Forbidden',
        code: 'PERMISSION_DENIED',
        message: permissionError.message,
        error: `One of permissions [${permissions.join(', ')}] required for ${operation}`,
        timestamp: new Date(),
        retryable: false,
        context: {
          operation,
          requiredPermissions: permissions,
          userRole: this.permissions.userRole.value,
          suggestedAction: permissionError.suggestedAction
        }
      }
      
      throw apiError
    }
  }

  // Simplified request method
  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      data,
      timeout: config?.timeout || this.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      ...config
    }

    let lastError: AxiosError | Error
    const retries = config?.retries || this.maxRetries

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await api(requestConfig)
        
        // Validate response structure
        if (!response.data) {
          throw new Error('Invalid response: missing data')
        }

        return response.data
      } catch (error: any) {
        lastError = error
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error) || attempt === retries) {
          break
        }

        // Wait before retrying with exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt)
        await this.sleep(delay)
        
        console.log(`Retrying request (attempt ${attempt + 2}/${retries + 1}) after ${delay}ms`)
      }
    }

    // Transform and enhance the final error
    const enhancedError = this.transformError(lastError, {
      method,
      endpoint,
      data,
      config,
      totalAttempts: retries + 1
    })

    throw enhancedError
  }

  // Determine if an error should not be retried
  private shouldNotRetry(error: AxiosError | Error): boolean {
    if (!('response' in error) || !error.response) {
      // Network errors are retryable
      return false
    }

    const status = error.response.status
    
    // Don't retry client errors (4xx) except for specific cases
    if (status >= 400 && status < 500) {
      // Retry on 408 (Request Timeout), 429 (Too Many Requests)
      return ![408, 429].includes(status)
    }

    // Retry server errors (5xx)
    return false
  }

  // Sleep utility for retry delays
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Transform errors to consistent format with enhanced information
  private transformError(error: AxiosError | Error, context: Record<string, any>): EnhancedApiError {
    const timestamp = new Date()
    
    if ('response' in error && error.response) {
      const response = error.response
      const status = response.status
      const statusText = response.statusText
      const responseData = response.data as any

      // Create enhanced error based on status code
      const enhancedError: EnhancedApiError = {
        success: false,
        status,
        statusText,
        timestamp,
        retryable: this.isRetryableError(status),
        context,
        message: this.getStatusMessage(status, responseData),
        error: responseData?.error,
        errors: responseData?.errors
      }

      // Add specific handling for different status codes
      switch (status) {
        case 400:
          enhancedError.code = 'BAD_REQUEST'
          enhancedError.message = responseData?.message || 'Invalid request data'
          break
          
        case 401:
          enhancedError.code = 'UNAUTHORIZED'
          enhancedError.message = 'Authentication required. Please log in again.'
          break
          
        case 403:
          enhancedError.code = 'FORBIDDEN'
          enhancedError.message = responseData?.message || 'You do not have permission to perform this action'
          break
          
        case 404:
          enhancedError.code = 'NOT_FOUND'
          enhancedError.message = responseData?.message || 'The requested resource was not found'
          break
          
        case 408:
          enhancedError.code = 'REQUEST_TIMEOUT'
          enhancedError.message = 'Request timed out. Please try again.'
          enhancedError.retryable = true
          break
          
        case 422:
          enhancedError.code = 'VALIDATION_ERROR'
          enhancedError.message = responseData?.message || 'Validation failed'
          enhancedError.errors = responseData?.errors || {}
          break
          
        case 429:
          enhancedError.code = 'TOO_MANY_REQUESTS'
          enhancedError.message = 'Too many requests. Please wait and try again.'
          enhancedError.retryable = true
          break
          
        case 500:
          enhancedError.code = 'INTERNAL_SERVER_ERROR'
          enhancedError.message = 'Internal server error. Please try again later.'
          enhancedError.retryable = true
          break
          
        case 502:
          enhancedError.code = 'BAD_GATEWAY'
          enhancedError.message = 'Service temporarily unavailable. Please try again.'
          enhancedError.retryable = true
          break
          
        case 503:
          enhancedError.code = 'SERVICE_UNAVAILABLE'
          enhancedError.message = 'Service temporarily unavailable. Please try again later.'
          enhancedError.retryable = true
          break
          
        case 504:
          enhancedError.code = 'GATEWAY_TIMEOUT'
          enhancedError.message = 'Request timed out. Please try again.'
          enhancedError.retryable = true
          break
          
        default:
          enhancedError.code = `HTTP_${status}`
          enhancedError.message = responseData?.message || statusText || 'An error occurred'
      }

      return enhancedError
    }

    // Handle network errors and other non-HTTP errors
    const networkError: EnhancedApiError = {
      success: false,
      timestamp,
      retryable: true,
      context,
      code: 'NETWORK_ERROR',
      message: this.getNetworkErrorMessage(error),
      error: error.message
    }

    return networkError
  }

  // Get appropriate message for status codes
  private getStatusMessage(status: number, responseData?: any): string {
    if (responseData?.message) {
      return responseData.message
    }

    const statusMessages: Record<number, string> = {
      400: 'Bad request - please check your input',
      401: 'Authentication required',
      403: 'Access denied - insufficient permissions',
      404: 'Resource not found',
      408: 'Request timeout',
      422: 'Validation failed',
      429: 'Too many requests',
      500: 'Internal server error',
      502: 'Bad gateway',
      503: 'Service unavailable',
      504: 'Gateway timeout'
    }

    return statusMessages[status] || `HTTP error ${status}`
  }

  // Get appropriate message for network errors
  private getNetworkErrorMessage(error: Error): string {
    const message = error.message.toLowerCase()
    
    if (message.includes('network')) {
      return 'Network connection failed. Please check your internet connection.'
    }
    
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }
    
    if (message.includes('abort')) {
      return 'Request was cancelled.'
    }
    
    return 'Connection failed. Please check your network and try again.'
  }

  // Check if error is retryable based on status
  private isRetryableError(status: number): boolean {
    // Retry on server errors and specific client errors
    return status >= 500 || [408, 429].includes(status)
  }

  // Enhanced error handling utilities
  getErrorMessage(error: any): string {
    if (typeof error === 'string') return error
    
    // Handle enhanced API errors
    if (this.isEnhancedApiError(error)) {
      return error.message
    }
    
    // Handle standard API errors
    if (this.isApiError(error)) {
      return error.message
    }
    
    // Handle axios errors
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.message) return error.message
    if (error?.error) return error.error
    
    return 'An unexpected error occurred'
  }

  // Get user-friendly error message based on error type
  getUserFriendlyMessage(error: any): string {
    if (this.isEnhancedApiError(error)) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'Unable to connect to the server. Please check your internet connection.'
        case 'FORBIDDEN':
          return 'You do not have permission to perform this action.'
        case 'VALIDATION_ERROR':
          return 'Please check your input and try again.'
        case 'INTERNAL_SERVER_ERROR':
          return 'A server error occurred. Please try again later.'
        case 'SERVICE_UNAVAILABLE':
          return 'The service is temporarily unavailable. Please try again later.'
        default:
          return error.message
      }
    }
    
    return this.getErrorMessage(error)
  }

  // Check if error is retryable
  isRetryableError(error: any): boolean {
    if (this.isEnhancedApiError(error)) {
      return error.retryable
    }
    
    // Default retry logic for non-enhanced errors
    if (error?.response?.status) {
      const status = error.response.status
      return status >= 500 || [408, 429].includes(status)
    }
    
    // Network errors are generally retryable
    return !error?.response
  }

  // Get error context for debugging
  getErrorContext(error: any): Record<string, any> {
    if (this.isEnhancedApiError(error)) {
      return {
        code: error.code,
        status: error.status,
        timestamp: error.timestamp,
        context: error.context,
        retryable: error.retryable
      }
    }
    
    return {
      type: 'unknown',
      message: this.getErrorMessage(error)
    }
  }

  // Type guards
  private isEnhancedApiError(error: any): error is EnhancedApiError {
    return error && 
           typeof error === 'object' && 
           error.success === false && 
           'timestamp' in error && 
           'retryable' in error
  }

  // Disbursement operations with permission validation
  async getDisbursements(filters?: DisbursementFilters & { page?: number }): Promise<DisbursementListResponse> {
    this.validatePermission('petty_cash.view', 'get disbursements')
    
    return this.makeRequest<DisbursementListResponse>('GET', '/disbursements', null, { 
      params: filters,
      timeout: 15000 // Shorter timeout for list operations
    })
  }

  async getDisbursement(id: number): Promise<DisbursementResponse> {
    this.validatePermission('petty_cash.view', 'get disbursement details')
    
    return this.makeRequest<DisbursementResponse>('GET', `/disbursements/${id}`)
  }

  async createDisbursement(data: CreateDisbursementFormData): Promise<DisbursementResponse> {
    this.validatePermission('petty_cash.create_disbursement', 'create disbursement')
    
    return this.makeRequest<DisbursementResponse>('POST', '/disbursements', data, {
      timeout: 20000, // Longer timeout for create operations
      retries: 2 // Fewer retries for create operations to avoid duplicates
    })
  }

  async updateDisbursement(id: number, data: UpdateDisbursementFormData): Promise<DisbursementResponse> {
    this.validatePermission('petty_cash.edit_disbursement', 'update disbursement')
    
    return this.makeRequest<DisbursementResponse>('PUT', `/disbursements/${id}`, data)
  }

  async voidDisbursement(id: number, data: VoidDisbursementFormData): Promise<DisbursementResponse> {
    this.validatePermission('petty_cash.void_disbursement', 'void disbursement')
    
    return this.makeRequest<DisbursementResponse>('POST', `/disbursements/${id}/void`, data)
  }

  // Top-up operations with permission validation
  async getTopUps(filters?: TopUpFilters & { page?: number }): Promise<TopUpListResponse> {
    this.validatePermission('petty_cash.view', 'get top-ups')
    
    return this.makeRequest<TopUpListResponse>('GET', '/top-ups', null, { params: filters })
  }

  async getTopUp(id: number): Promise<TopUpResponse> {
    this.validatePermission('petty_cash.view', 'get top-up details')
    
    return this.makeRequest<TopUpResponse>('GET', `/top-ups/${id}`)
  }

  async createTopUp(data: CreateTopUpFormData): Promise<TopUpResponse> {
    this.validatePermission('petty_cash.create_top_up', 'create top-up')
    
    return this.makeRequest<TopUpResponse>('POST', '/top-ups', data, {
      timeout: 20000, // Longer timeout for create operations
      retries: 2 // Fewer retries for create operations to avoid duplicates
    })
  }

  async getAvailableTopUps(): Promise<AvailableTopUpsResponse> {
    this.validatePermission('petty_cash.view', 'get available top-ups')
    
    try {
      return await this.makeRequest<AvailableTopUpsResponse>('GET', '/top-ups/available')
    } catch (error: any) {
      // Add specific handling for this endpoint's server errors
      if (error.status === 500) {
        console.warn('Available top-ups endpoint returned server error - this is a known backend issue')
        // Return a structured error response instead of throwing
        return {
          success: false,
          message: 'Server temporarily unavailable for top-ups data',
          data: [],
          status: 500
        } as any
      }
      throw error
    }
  }

  async getAvailableBalance(topUpId: number): Promise<AvailableBalanceResponse> {
    this.validatePermission('petty_cash.view_balance', 'get available balance')
    
    return this.makeRequest<AvailableBalanceResponse>('GET', `/top-ups/${topUpId}/available-balance`)
  }

  // Balance operations with permission validation
  async getCurrentBalance(): Promise<BalanceResponse> {
    this.validatePermission('petty_cash.view_balance', 'get current balance')
    
    return this.makeRequest<BalanceResponse>('GET', '/balance')
  }

  async checkBalance(amount: number): Promise<BalanceCheckResponse> {
    this.validatePermission('petty_cash.view_balance', 'check balance')
    
    return this.makeRequest<BalanceCheckResponse>('POST', '/balance/check', { amount })
  }

  async getBalanceTrends(days: number = 30): Promise<TrendsResponse> {
    this.validateAnyPermission(['petty_cash.view_balance', 'petty_cash.view_reports'], 'get balance trends')
    
    return this.makeRequest<TrendsResponse>('GET', '/balance/trends', null, { params: { days } })
  }

  async recalculateBalance(): Promise<RecalculateBalanceResponse> {
    this.validatePermission('petty_cash.recalculate_balance', 'recalculate balance')
    
    return this.makeRequest<RecalculateBalanceResponse>('POST', '/balance/recalculate')
  }

  // Transaction operations
  async getTransactions(filters?: TransactionFilters & { page?: number }): Promise<TransactionListResponse> {
    return this.makeRequest<TransactionListResponse>('GET', '/transactions', null, { params: filters })
  }

  async searchTransactions(query: string, filters?: DisbursementFilters & { page?: number }): Promise<SearchResponse<PettyCashDisbursement>> {
    return this.makeRequest<SearchResponse<PettyCashDisbursement>>('GET', '/search', null, { 
      params: { query, ...filters } 
    })
  }

  async getRecentTransactions(limit: number = 10): Promise<RecentTransactionsResponse> {
    return this.makeRequest<RecentTransactionsResponse>('GET', '/recent', null, { params: { limit } })
  }

  // Analytics and reporting with permission validation
  async getSummary(filters?: DisbursementFilters): Promise<SummaryResponse> {
    this.validateAnyPermission(['petty_cash.view', 'petty_cash.view_reports'], 'get summary')
    
    return this.makeRequest<SummaryResponse>('GET', '/summary', null, { params: filters })
  }

  async getAnalytics(filters?: DisbursementFilters): Promise<AnalyticsResponse> {
    this.validatePermission('petty_cash.view_reports', 'get analytics')
    
    return this.makeRequest<AnalyticsResponse>('GET', '/analytics', null, { params: filters })
  }

  async getStatistics(filters?: TopUpFilters): Promise<StatisticsResponse> {
    this.validatePermission('petty_cash.view_reports', 'get statistics')
    
    return this.makeRequest<StatisticsResponse>('GET', '/statistics', null, { params: filters })
  }

  async getPaymentMethodBreakdown(filters?: TopUpFilters): Promise<PaymentMethodsResponse> {
    this.validatePermission('petty_cash.view_reports', 'get payment method breakdown')
    
    return this.makeRequest<PaymentMethodsResponse>('GET', '/payment-methods', null, { params: filters })
  }

  // Validation
  async validateTopUp(data: CreateTopUpFormData): Promise<ValidationResponse> {
    return this.makeRequest<ValidationResponse>('POST', '/validate/top-up', data)
  }

  // Export and reporting with permission validation
  async exportData(
    type: 'disbursements' | 'top_ups' | 'summary',
    filters?: DisbursementFilters,
    format: 'excel' | 'csv' = 'excel'
  ): Promise<Blob> {
    this.validatePermission('petty_cash.export_data', 'export data')
    
    try {
      const response = await api.get(`${this.baseUrl}/export`, {
        params: { type, format, ...filters },
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw this.transformError(error, { operation: 'export data', type, format })
    }
  }

  async generatePDFReport(filters?: DisbursementFilters): Promise<Blob> {
    this.validatePermission('petty_cash.export_data', 'generate PDF report')
    
    try {
      const response = await api.get(`${this.baseUrl}/report`, {
        params: { format: 'pdf', ...filters },
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw this.transformError(error, { operation: 'generate PDF report' })
    }
  }

  // Generate summary report with charts (for PDF)
  async generateSummaryReport(filters?: DisbursementFilters): Promise<Blob> {
    this.validatePermission('petty_cash.export_data', 'generate summary report')
    
    try {
      const response = await api.get(`${this.baseUrl}/reports/summary`, {
        params: { format: 'pdf', ...filters },
        responseType: 'blob'
      })
      return response.data
    } catch (error: any) {
      throw this.transformError(error, { operation: 'generate summary report' })
    }
  }

  // File download helpers
  downloadFile(blob: Blob, filename: string, mimeType?: string) {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  async downloadExcelExport(
    type: 'disbursements' | 'top_ups' | 'summary',
    filters?: DisbursementFilters
  ) {
    const blob = await this.exportData(type, filters, 'excel')
    const date = new Date().toISOString().split('T')[0]
    this.downloadFile(blob, `petty-cash-${type}-${date}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  }

  async downloadCSVExport(
    type: 'disbursements' | 'top_ups' | 'summary',
    filters?: DisbursementFilters
  ) {
    const blob = await this.exportData(type, filters, 'csv')
    const date = new Date().toISOString().split('T')[0]
    this.downloadFile(blob, `petty-cash-${type}-${date}.csv`, 'text/csv')
  }

  async downloadPDFReport(filters?: DisbursementFilters) {
    const blob = await this.generatePDFReport(filters)
    const date = new Date().toISOString().split('T')[0]
    this.downloadFile(blob, `petty-cash-report-${date}.pdf`, 'application/pdf')
  }

  // Utility methods
  formatAmount(amount: number): string {
    return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  formatDateOnly(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      cash: 'Cash',
      mpesa: 'M-Pesa',
      bank_transfer: 'Bank Transfer',
      other: 'Other'
    }
    return labels[method] || method
  }

  getClassificationLabel(classification: string): string {
    const labels: Record<string, string> = {
      agencies: 'Agencies',
      admin: 'Administration',
      operations: 'Operations',
      other: 'Other'
    }
    return labels[classification] || classification
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'green',
      voided: 'red',
      normal: 'green',
      low: 'yellow',
      critical: 'red'
    }
    return colors[status] || 'gray'
  }

  // Enhanced error handling utilities
  isApiError(error: any): error is ApiError {
    return error && typeof error === 'object' && error.success === false
  }

  getValidationErrors(error: any): Record<string, string[]> {
    if (this.isEnhancedApiError(error) && error.errors) {
      return error.errors
    }
    if (this.isApiError(error) && error.errors) {
      return error.errors
    }
    return {}
  }

  // Check if error indicates permission issues
  isPermissionError(error: any): boolean {
    if (this.isEnhancedApiError(error)) {
      return error.status === 403 || error.code === 'FORBIDDEN'
    }
    return error?.response?.status === 403
  }

  // Check if error indicates authentication issues
  isAuthenticationError(error: any): boolean {
    if (this.isEnhancedApiError(error)) {
      return error.status === 401 || error.code === 'UNAUTHORIZED'
    }
    return error?.response?.status === 401
  }

  // Check if error indicates validation issues
  isValidationError(error: any): boolean {
    if (this.isEnhancedApiError(error)) {
      return error.status === 422 || error.code === 'VALIDATION_ERROR'
    }
    return error?.response?.status === 422
  }

  // Check if error indicates server issues
  isServerError(error: any): boolean {
    if (this.isEnhancedApiError(error)) {
      return (error.status && error.status >= 500) || error.code?.includes('SERVER')
    }
    return error?.response?.status >= 500
  }

  // Check if error indicates network issues
  isNetworkError(error: any): boolean {
    if (this.isEnhancedApiError(error)) {
      return error.code === 'NETWORK_ERROR'
    }
    return !error?.response
  }

  // Get suggested action for error
  getSuggestedAction(error: any): string {
    if (this.isPermissionError(error)) {
      return 'Contact your administrator for access permissions.'
    }
    
    if (this.isAuthenticationError(error)) {
      return 'Please log in again to continue.'
    }
    
    if (this.isValidationError(error)) {
      return 'Please check your input and try again.'
    }
    
    if (this.isNetworkError(error)) {
      return 'Check your internet connection and try again.'
    }
    
    if (this.isServerError(error)) {
      return 'Please try again later or contact support if the problem persists.'
    }
    
    if (this.isRetryableError(error)) {
      return 'Please try again.'
    }
    
    return 'Please contact support if the problem persists.'
  }

  // Create standardized error response
  createErrorResponse(error: any): ApiResult<never> {
    const enhancedError: EnhancedApiError = this.isEnhancedApiError(error) 
      ? error 
      : this.transformError(error, { source: 'createErrorResponse' })

    return Promise.reject(enhancedError)
  }

  // Utility method to handle common API patterns
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      // Add context to error if it's an enhanced error
      if (this.isEnhancedApiError(error) && context) {
        error.context = { ...error.context, ...context }
      }
      throw error
    }
  }
}

// Export singleton instance
export const pettyCashService = new PettyCashService()
export default pettyCashService