import type { 
  PettyCashTopUp, 
  PettyCashDisbursement, 
  PettyCashBalance,
  TransactionSummary,
  SpendingAnalytics,
  RecentTransaction,
  ChartData,
  TopUpStatistics,
  PaymentMethodBreakdown,
  BalanceCheck,
  ApiErrorType,
  NullableString,
  NullableNumber
} from './pettyCash'

// Enhanced pagination metadata with strict typing
export interface PaginationMeta {
  readonly current_page: number
  readonly last_page: number
  readonly per_page: number
  readonly total: number
  readonly from: number
  readonly to: number
  readonly has_more_pages: boolean
}

// Enhanced API Response wrapper interfaces with strict null safety
export interface ApiResponse<T> {
  readonly success: true
  readonly data: T
  readonly message?: NullableString
  readonly timestamp?: string
  readonly request_id?: NullableString
}

export interface PaginatedResponse<T> {
  readonly success: true
  readonly data: ReadonlyArray<T>
  readonly meta: PaginationMeta
  readonly filters?: Record<string, unknown> | null
  readonly sort?: {
    readonly field: string
    readonly direction: 'asc' | 'desc'
  } | null
}

export interface SearchResponse<T> extends PaginatedResponse<T> {
  readonly query: string
  readonly search_meta: {
    readonly total_results: number
    readonly search_time_ms: number
    readonly highlighted_fields: ReadonlyArray<string>
  }
}

// Enhanced specific API response types with strict typing
export interface DisbursementListResponse extends PaginatedResponse<PettyCashDisbursement> {}
export interface TopUpListResponse extends PaginatedResponse<PettyCashTopUp> {}
export interface TransactionListResponse extends PaginatedResponse<PettyCashTopUp> {}

export interface DisbursementResponse extends ApiResponse<PettyCashDisbursement> {}
export interface TopUpResponse extends ApiResponse<PettyCashTopUp> {}
export interface BalanceResponse extends ApiResponse<PettyCashBalance> {}

export interface SummaryResponse extends ApiResponse<TransactionSummary> {
  readonly filters?: Record<string, unknown> | null
  readonly generated_at: string
}

export interface AnalyticsResponse extends ApiResponse<SpendingAnalytics> {
  readonly filters?: Record<string, unknown> | null
  readonly period: {
    readonly start_date: string
    readonly end_date: string
    readonly days_included: number
  }
}

export interface RecentTransactionsResponse extends ApiResponse<ReadonlyArray<RecentTransaction>> {
  readonly limit: number
  readonly total_available: number
}

export interface ChartDataResponse extends ApiResponse<ChartData> {}
export interface StatisticsResponse extends ApiResponse<TopUpStatistics> {}
export interface PaymentMethodsResponse extends ApiResponse<PaymentMethodBreakdown> {}
export interface BalanceCheckResponse extends ApiResponse<BalanceCheck> {}

export interface AvailableTopUpsResponse extends ApiResponse<ReadonlyArray<PettyCashTopUp>> {
  readonly total_available_balance: number
  readonly count: number
}

export interface AvailableBalanceResponse extends ApiResponse<{
  readonly top_up_id: number
  readonly available_balance: number
  readonly last_updated: string
}> {}

export interface ValidationResponse extends ApiResponse<null> {
  readonly errors?: Record<string, ReadonlyArray<string>> | null
  readonly warnings?: Record<string, ReadonlyArray<string>> | null
}

export interface RecalculateBalanceResponse extends ApiResponse<{
  readonly old_balance: number
  readonly new_balance: number
  readonly difference: number
  readonly recalculated_at: string
  readonly transactions_processed: number
}> {}

export interface TrendsResponse extends ApiResponse<{
  readonly current: PettyCashBalance
  readonly trend: 'increasing' | 'decreasing' | 'stable'
  readonly days_analyzed: number
  readonly trend_percentage: number
}> {}

// Enhanced error response interface with comprehensive error information
export interface ApiError {
  readonly success: false
  readonly message: string
  readonly error?: NullableString
  readonly errors?: Record<string, ReadonlyArray<string>> | null
  readonly code?: NullableString
  readonly status?: NullableNumber
  readonly timestamp: string
  readonly request_id?: NullableString
  readonly trace_id?: NullableString
}

// Enhanced API error with additional context for debugging
export interface EnhancedApiError extends ApiError {
  readonly error_type: ApiErrorType
  readonly retryable: boolean
  readonly context?: Record<string, unknown>
  readonly stack_trace?: NullableString
  readonly user_message: string
  readonly technical_message: string
}

// Union type for API responses
export type ApiResult<T> = ApiResponse<T> | ApiError
export type EnhancedApiResult<T> = ApiResponse<T> | EnhancedApiError

// Generic API function return type with proper error handling
export type ApiPromise<T> = Promise<ApiResponse<T>>
export type EnhancedApiPromise<T> = Promise<ApiResponse<T> | never>

// Enhanced request configuration interface
export interface RequestConfig {
  readonly timeout?: number
  readonly retries?: number
  readonly headers?: Record<string, string>
  readonly cache?: boolean
  readonly cache_ttl?: number
  readonly priority?: 'low' | 'normal' | 'high'
  readonly abort_signal?: AbortSignal
}

// Type guards for API responses
export interface ApiTypeGuards {
  isApiResponse<T>(response: unknown): response is ApiResponse<T>
  isApiError(response: unknown): response is ApiError
  isEnhancedApiError(response: unknown): response is EnhancedApiError
  isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T>
  isSearchResponse<T>(response: unknown): response is SearchResponse<T>
}

// Utility types for API operations
export type ApiOperation = 'create' | 'read' | 'update' | 'delete' | 'list' | 'search'
export type ApiResource = 'disbursement' | 'topup' | 'balance' | 'transaction' | 'analytics'

// API endpoint configuration
export interface ApiEndpoint {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  readonly path: string
  readonly operation: ApiOperation
  readonly resource: ApiResource
  readonly requires_auth: boolean
  readonly requires_permission?: string
  readonly cache_enabled?: boolean
  readonly rate_limited?: boolean
}