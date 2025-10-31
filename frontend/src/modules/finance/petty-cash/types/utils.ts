import type { 
  ApiErrorType, 
  NullableString, 
  NullableNumber, 
  LoadingState, 
  ComponentState 
} from './pettyCash'

// Utility types for better type safety and null handling

// Strict readonly utility types
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>

// Safe array and object types
export type SafeArray<T> = ReadonlyArray<T> | []
export type SafeRecord<K extends string | number | symbol, V> = Record<K, V> | Record<string, never>

// Enhanced error handling types
export interface TypedError<T extends ApiErrorType = ApiErrorType> {
  readonly type: T
  readonly message: string
  readonly code?: NullableString
  readonly timestamp: Date
  readonly context?: Record<string, unknown>
  readonly stack?: NullableString
}

export interface NetworkError extends TypedError<'network'> {
  readonly url?: NullableString
  readonly method?: string
  readonly timeout?: boolean
  readonly offline?: boolean
}

export interface ValidationError extends TypedError<'validation'> {
  readonly field?: NullableString
  readonly value?: unknown
  readonly rule?: string
  readonly expected?: unknown
}

export interface PermissionError extends TypedError<'permission'> {
  readonly required_permission: string
  readonly user_permissions: ReadonlyArray<string>
  readonly resource?: NullableString
  readonly action?: NullableString
}

export interface ServerError extends TypedError<'server'> {
  readonly status_code: number
  readonly response_body?: unknown
  readonly request_id?: NullableString
}

// Union type for all error types
export type AppError = NetworkError | ValidationError | PermissionError | ServerError | TypedError

// Result type for operations that can fail
export type Result<T, E = AppError> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Option type for nullable values
export type Option<T> = T | null | undefined

// Safe getter type for nested object access
export type SafeGet<T, K extends keyof T> = T[K] extends undefined ? never : T[K]

// Type guards for runtime type checking
export interface TypeGuards {
  isString(value: unknown): value is string
  isNumber(value: unknown): value is number
  isBoolean(value: unknown): value is boolean
  isArray<T>(value: unknown): value is T[]
  isObject(value: unknown): value is Record<string, unknown>
  isNull(value: unknown): value is null
  isUndefined(value: unknown): value is undefined
  isNullish(value: unknown): value is null | undefined
  isDefined<T>(value: T | null | undefined): value is T
  isNonEmpty(value: string | null | undefined): value is string
  isPositiveNumber(value: unknown): value is number
  isValidDate(value: unknown): value is Date
  isValidEmail(value: unknown): value is string
}

// Async operation state management
export interface AsyncState<T, E = AppError> {
  readonly status: LoadingState
  readonly data?: T | null
  readonly error?: E | null
  readonly loading: boolean
  readonly lastFetch?: Date | null
  readonly retryCount: number
}

// Component state management
export interface ComponentStateManager<T> {
  readonly state: ComponentState
  readonly data: T | null
  readonly error: AppError | null
  readonly loading: boolean
  readonly initialized: boolean
  readonly retryable: boolean
}

// Form field state for enhanced form management
export interface FieldState<T = unknown> {
  readonly value: T
  readonly error?: NullableString
  readonly warning?: NullableString
  readonly touched: boolean
  readonly dirty: boolean
  readonly validating: boolean
  readonly valid: boolean
}

// Enhanced pagination state
export interface PaginationState {
  readonly current_page: number
  readonly per_page: number
  readonly total: number
  readonly last_page: number
  readonly from: number
  readonly to: number
  readonly has_more: boolean
  readonly loading: boolean
  readonly error?: AppError | null
}

// Search state management
export interface SearchState<T> {
  readonly query: string
  readonly results: ReadonlyArray<T>
  readonly total_results: number
  readonly loading: boolean
  readonly error?: AppError | null
  readonly suggestions: ReadonlyArray<string>
  readonly recent_searches: ReadonlyArray<string>
  readonly search_time?: NullableNumber
}

// Cache state for API responses
export interface CacheState<T> {
  readonly data: T
  readonly timestamp: Date
  readonly ttl: number
  readonly expired: boolean
  readonly key: string
}

// Event types for component communication
export interface ComponentEvent<T = unknown> {
  readonly type: string
  readonly payload?: T
  readonly timestamp: Date
  readonly source: string
}

// Notification types
export interface NotificationData {
  readonly id: string
  readonly type: 'success' | 'error' | 'warning' | 'info'
  readonly title: string
  readonly message: string
  readonly duration?: NullableNumber
  readonly actions?: ReadonlyArray<{
    readonly label: string
    readonly action: () => void
  }>
  readonly timestamp: Date
}

// Modal state management
export interface ModalState {
  readonly isOpen: boolean
  readonly title?: NullableString
  readonly size?: 'sm' | 'md' | 'lg' | 'xl'
  readonly closable: boolean
  readonly loading: boolean
  readonly error?: AppError | null
}

// Theme and UI state
export interface UIState {
  readonly theme: 'light' | 'dark' | 'auto'
  readonly sidebar_collapsed: boolean
  readonly mobile_menu_open: boolean
  readonly notifications_open: boolean
  readonly loading_overlay: boolean
}

// User preferences
export interface UserPreferences {
  readonly language: string
  readonly timezone: string
  readonly date_format: string
  readonly currency_format: string
  readonly items_per_page: number
  readonly auto_refresh: boolean
  readonly notifications_enabled: boolean
}

// Utility functions type definitions
export interface UtilityFunctions {
  formatCurrency(amount: number, currency?: string): string
  formatDate(date: Date | string, format?: string): string
  formatRelativeTime(date: Date | string): string
  debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T
  throttle<T extends (...args: unknown[]) => unknown>(fn: T, limit: number): T
  deepClone<T>(obj: T): T
  deepEqual<T>(a: T, b: T): boolean
  isEmpty(value: unknown): boolean
  isEqual<T>(a: T, b: T): boolean
  pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
  omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>
}

// Constants for type safety
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export const COMPONENT_STATES = {
  INITIALIZING: 'initializing',
  READY: 'ready',
  LOADING: 'loading',
  ERROR: 'error',
  EMPTY: 'empty'
} as const

export const API_ERROR_TYPES = {
  NETWORK: 'network',
  PERMISSION: 'permission',
  VALIDATION: 'validation',
  SERVER: 'server',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
} as const

// Type assertion helpers
export const assertIsString = (value: unknown): asserts value is string => {
  if (typeof value !== 'string') {
    throw new Error(`Expected string, got ${typeof value}`)
  }
}

export const assertIsNumber = (value: unknown): asserts value is number => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Expected number, got ${typeof value}`)
  }
}

export const assertIsArray = <T>(value: unknown): asserts value is T[] => {
  if (!Array.isArray(value)) {
    throw new Error(`Expected array, got ${typeof value}`)
  }
}

export const assertIsObject = (value: unknown): asserts value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Expected object, got ${typeof value}`)
  }
}

// Safe access helpers
export const safeGet = <T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined => {
  return obj?.[key]
}

export const safeGetNested = <T>(obj: unknown, path: string): T | undefined => {
  return path.split('.').reduce((current: unknown, key: string) => {
    return current && typeof current === 'object' && key in current 
      ? (current as Record<string, unknown>)[key] 
      : undefined
  }, obj) as T | undefined
}

// Default value helpers
export const withDefault = <T>(value: T | null | undefined, defaultValue: T): T => {
  return value ?? defaultValue
}

export const withDefaultAsync = async <T>(
  promise: Promise<T | null | undefined>, 
  defaultValue: T
): Promise<T> => {
  const result = await promise
  return result ?? defaultValue
}