// Simplified utilities without logging dependencies

// Enhanced utilities with strict typing
export * from './defaults'
export * from './validation'

// Re-export utility types for convenience
export type {
  DeepReadonly,
  PartialBy,
  RequiredBy,
  SafeArray,
  SafeRecord,
  TypedError,
  NetworkError,
  ValidationError,
  PermissionError,
  ServerError,
  AppError,
  Result,
  Option,
  TypeGuards,
  AsyncState,
  ComponentStateManager,
  FieldState,
  PaginationState,
  SearchState,
  CacheState,
  ComponentEvent,
  NotificationData,
  ModalState,
  UIState,
  UserPreferences,
  UtilityFunctions
} from '../types/utils'

export {
  LOADING_STATES,
  COMPONENT_STATES,
  API_ERROR_TYPES,
  assertIsString,
  assertIsNumber,
  assertIsArray,
  assertIsObject,
  safeGet,
  safeGetNested,
  withDefault,
  withDefaultAsync
} from '../types/utils'

// Initialization functions removed - no longer needed