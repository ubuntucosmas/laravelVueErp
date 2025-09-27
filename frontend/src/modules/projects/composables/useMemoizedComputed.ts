import { computed, ref, watch, type Ref } from 'vue'

interface MemoizedComputedOptions<T> {
  key?: string
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum cache size
}

export function useMemoizedComputed<T>(
  computeFn: () => T,
  deps: Ref<any>[],
  options: MemoizedComputedOptions<T> = {}
) {
  const {
    key = 'default',
    ttl = 5 * 60 * 1000, // 5 minutes default
    maxSize = 100
  } = options

  const cache = ref<Map<string, { value: T; timestamp: number; deps: any[] }>>(new Map())
  const result = ref<T>() as Ref<T>

  // Generate cache key from dependencies
  const generateCacheKey = (currentDeps: any[]) => {
    return `${key}-${JSON.stringify(currentDeps)}`
  }

  // Clean expired entries
  const cleanExpiredEntries = () => {
    const now = Date.now()
    const entries = Array.from(cache.value.entries())

    entries.forEach(([cacheKey, cached]) => {
      if (now - cached.timestamp > ttl) {
        cache.value.delete(cacheKey)
      }
    })
  }

  // Enforce max cache size
  const enforceMaxSize = () => {
    if (cache.value.size > maxSize) {
      const entries = Array.from(cache.value.entries())
      // Remove oldest entries (simple LRU approximation)
      const toRemove = entries.slice(0, cache.value.size - maxSize)
      toRemove.forEach(([cacheKey]) => {
        cache.value.delete(cacheKey)
      })
    }
  }

  // Watch dependencies and update cached result
  watch(
    deps,
    (newDeps) => {
      const cacheKey = generateCacheKey(newDeps)
      const now = Date.now()

      // Check cache
      const cached = cache.value.get(cacheKey)
      if (cached && (now - cached.timestamp) < ttl) {
        result.value = cached.value
        return
      }

      // Compute new value
      const newValue = computeFn()

      // Cache the result
      cache.value.set(cacheKey, {
        value: newValue,
        timestamp: now,
        deps: [...newDeps]
      })

      result.value = newValue

      // Maintenance
      cleanExpiredEntries()
      enforceMaxSize()
    },
    { immediate: true, deep: true }
  )

  // Computed property that returns the memoized value
  const memoizedComputed = computed(() => result.value)

  // Cache management methods
  const clearCache = () => {
    cache.value.clear()
  }

  const clearCacheKey = (cacheKey: string) => {
    cache.value.delete(cacheKey)
  }

  const getCacheStats = () => {
    return {
      size: cache.value.size,
      maxSize,
      ttl,
      entries: Array.from(cache.value.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        deps: value.deps
      }))
    }
  }

  return {
    value: memoizedComputed,
    clearCache,
    clearCacheKey,
    getCacheStats
  }
}

// Specialized memoized computed for expensive calculations
export function useMemoizedExpensiveComputed<T>(
  computeFn: () => T,
  deps: Ref<any>[],
  options: MemoizedComputedOptions<T> & {
    debounceMs?: number
  } = {}
) {
  const { debounceMs = 300, ...memoOptions } = options

  let debounceTimer: NodeJS.Timeout | null = null
  const pendingComputation = ref(false)

  const debouncedCompute = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    pendingComputation.value = true

    debounceTimer = setTimeout(() => {
      // The actual computation will happen in the memoized computed
      pendingComputation.value = false
    }, debounceMs)
  }

  const memoized = useMemoizedComputed(computeFn, deps, memoOptions)

  // Watch for dependency changes and debounce
  watch(
    deps,
    () => {
      debouncedCompute()
    },
    { deep: true }
  )

  return {
    ...memoized,
    pendingComputation,
    cancelPending: () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        pendingComputation.value = false
      }
    }
  }
}
