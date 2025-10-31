// Enums with strict typing
export type PaymentMethod = 'cash' | 'mpesa' | 'bank_transfer' | 'other'
export type Classification = 'agencies' | 'admin' | 'operations' | 'other'
export type DisbursementStatus = 'active' | 'voided'
export type BalanceStatus = 'normal' | 'low' | 'critical'
export type TransactionType = 'top_up' | 'disbursement'

// Error state union types for better error handling
export type ApiErrorType = 'network' | 'permission' | 'validation' | 'server' | 'timeout' | 'unknown'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type ComponentState = 'initializing' | 'ready' | 'loading' | 'error' | 'empty'

// Nullable types for optional data
export type NullableString = string | null
export type NullableNumber = number | null
export type NullableDate = Date | string | null

// Enhanced amount interface with strict null safety
export interface AmountData {
  readonly raw: number
  readonly formatted: string
}

// Enhanced date interface with strict null safety
export interface DateData {
  readonly raw: string
  readonly formatted: string
  readonly human: string
  readonly date_only?: string
}

// Enhanced user interface with optional properties
export interface UserData {
  readonly id: number
  readonly name: string
  readonly email?: NullableString
}

// Enhanced payment method interface
export interface PaymentMethodData {
  readonly value: PaymentMethod
  readonly label: string
  readonly requires_transaction_code?: boolean
}

// Enhanced classification interface
export interface ClassificationData {
  readonly value: Classification
  readonly label: string
  readonly requires_project?: boolean
}

// Enhanced status interface
export interface StatusData {
  readonly value: DisbursementStatus
  readonly label: string
  readonly is_active: boolean
  readonly is_voided: boolean
}

// Enhanced balance status interface
export interface BalanceStatusData {
  readonly value: BalanceStatus
  readonly label: string
  readonly color: string
  readonly is_low: boolean
  readonly is_critical: boolean
  readonly is_normal: boolean
}

// Base interfaces matching API resource structure with enhanced type safety
export interface PettyCashTopUp {
  readonly id: number
  readonly amount: AmountData
  readonly payment_method: PaymentMethodData
  readonly transaction_code?: NullableString
  readonly description?: NullableString
  readonly created_at: DateData
  readonly updated_at: DateData

  // Calculated fields with strict typing
  readonly remaining_balance: AmountData
  readonly total_disbursed: AmountData
  readonly utilization_percentage: number
  readonly is_fully_disbursed: boolean
  readonly has_available_balance: boolean

  // Optional relationships with null safety
  readonly creator?: UserData | null
  readonly disbursements?: PettyCashDisbursement[] | null
  readonly active_disbursements?: PettyCashDisbursement[] | null

  // Optional summary data with null safety
  readonly disbursements_summary?: {
    readonly total_count: number
    readonly active_count: number
    readonly voided_count: number
    readonly total_amount: AmountData
    readonly classifications: ReadonlyArray<{
      readonly classification: string
      readonly count: number
      readonly total_amount: AmountData
    }>
  } | null

  // Permissions with default values
  readonly can_create_disbursement: boolean
  readonly can_view_details: boolean
  readonly can_view_disbursements: boolean
}

export interface PettyCashDisbursement {
  readonly id: number
  readonly top_up_id: number
  readonly receiver: string
  readonly account: string
  readonly amount: AmountData
  readonly description: string
  readonly project_name?: NullableString
  readonly classification: ClassificationData
  readonly job_number?: NullableString
  readonly payment_method: PaymentMethodData
  readonly transaction_code?: NullableString
  readonly status: StatusData
  readonly void_reason?: NullableString
  readonly voided_at?: DateData | null
  readonly created_at: DateData
  readonly updated_at: DateData

  // Optional relationships with null safety
  readonly top_up?: PettyCashTopUp | null
  readonly creator?: UserData | null
  readonly voided_by?: UserData | null

  // Permissions with default values
  readonly can_edit: boolean
  readonly can_void: boolean
  readonly can_view_details: boolean
}

// Enhanced threshold interface
export interface ThresholdData {
  readonly low_threshold: AmountData
  readonly critical_threshold: AmountData
}

// Enhanced last transaction interface
export interface LastTransactionData {
  readonly id: number
  readonly type: TransactionType
  readonly type_label: string
  readonly amount: AmountData
  readonly description?: NullableString
  readonly receiver?: NullableString
  readonly created_at: DateData
}

// Enhanced health indicators interface
export interface HealthIndicators {
  readonly days_since_last_top_up?: NullableNumber
  readonly average_daily_spending?: NullableNumber
  readonly estimated_days_remaining?: NullableNumber
  readonly needs_attention: boolean
}

export interface PettyCashBalance {
  readonly id: number
  readonly current_balance: AmountData
  readonly status: BalanceStatusData
  readonly thresholds: ThresholdData
  readonly last_transaction?: LastTransactionData | null
  readonly updated_at: DateData

  // Health indicators with null safety
  readonly health_indicators: HealthIndicators

  // Permissions with default values
  readonly can_add_top_up: boolean
  readonly can_create_disbursement: boolean
  readonly can_recalculate: boolean
}

// Enhanced analytics interfaces with strict typing
export interface ClassificationAnalytics {
  readonly classification: Classification
  readonly total_amount: number
  readonly transaction_count: number
  readonly percentage: number
}

export interface PaymentMethodAnalytics {
  readonly payment_method: PaymentMethod
  readonly total_amount: number
  readonly transaction_count: number
  readonly percentage: number
}

// Summary and analytics interfaces with enhanced type safety
export interface TransactionSummary {
  readonly total_top_ups: number
  readonly total_disbursements: number
  readonly net_balance: number
  readonly top_up_count: number
  readonly disbursement_count: number
  readonly average_top_up: number
  readonly average_disbursement: number
  readonly current_balance: number
  readonly balance_status: BalanceStatus
}

export interface SpendingAnalytics {
  readonly by_classification: ReadonlyArray<ClassificationAnalytics>
  readonly by_payment_method: ReadonlyArray<PaymentMethodAnalytics>
}

export interface RecentTransaction {
  readonly id: number
  readonly type: TransactionType
  readonly amount: number
  readonly description: string
  readonly receiver?: NullableString
  readonly created_at: string
  readonly creator: string
}

// Enhanced chart data interfaces with strict typing
export interface ChartDataset {
  readonly labels: ReadonlyArray<string>
  readonly data: ReadonlyArray<number>
  readonly backgroundColor: ReadonlyArray<string>
}

export interface ChartData {
  readonly classification_pie: ChartDataset
  readonly payment_method_doughnut: ChartDataset
}

// Enhanced filter interfaces with strict null safety
export interface DisbursementFilters {
  readonly status?: DisbursementStatus | null
  readonly classification?: Classification | null
  readonly payment_method?: PaymentMethod | null
  readonly project_name?: NullableString
  readonly creator_id?: NullableNumber
  readonly start_date?: NullableString
  readonly end_date?: NullableString
  readonly search?: NullableString
}

export interface TopUpFilters {
  readonly payment_method?: PaymentMethod | null
  readonly creator_id?: NullableNumber
  readonly start_date?: NullableString
  readonly end_date?: NullableString
  readonly search?: NullableString
}

export interface TransactionFilters extends DisbursementFilters {
  readonly disbursement_status?: DisbursementStatus | null
}

// Enhanced statistics interfaces with strict typing
export interface PaymentMethodStats {
  readonly count: number
  readonly total_amount: number
  readonly average_amount: number
}

export interface TopUpStatistics {
  readonly total_amount: number
  readonly count: number
  readonly average_amount: number
  readonly current_balance: number
  readonly balance_status: BalanceStatus
}

export type PaymentMethodBreakdown = {
  readonly [K in PaymentMethod]: PaymentMethodStats
}

// Enhanced balance check interface with strict null safety
export interface BalanceCheck {
  readonly amount_requested: number
  readonly current_balance: number
  readonly has_sufficient_balance: boolean
  readonly remaining_after_disbursement?: NullableNumber
  readonly balance_status: BalanceStatus
}

// Error state interfaces for better error handling
export interface ErrorState {
  readonly hasError: boolean
  readonly errorType: ApiErrorType
  readonly message: string
  readonly code?: NullableString
  readonly timestamp: Date
  readonly retryable: boolean
  readonly context?: Record<string, unknown>
}

// Loading state interface
export interface LoadingStates {
  readonly balance: boolean
  readonly summary: boolean
  readonly analytics: boolean
  readonly transactions: boolean
  readonly topUps: boolean
  readonly disbursements: boolean
  readonly recent: boolean
  readonly charts: boolean
  readonly statistics: boolean
}

// Error states interface
export interface ErrorStates {
  readonly balance: ErrorState | null
  readonly summary: ErrorState | null
  readonly analytics: ErrorState | null
  readonly transactions: ErrorState | null
  readonly topUps: ErrorState | null
  readonly disbursements: ErrorState | null
  readonly recent: ErrorState | null
  readonly charts: ErrorState | null
  readonly statistics: ErrorState | null
  readonly general: ErrorState | null
}