import { ref, onMounted, nextTick } from 'vue'

export function useLazyLoading() {
  const loadedComponents = ref<Set<string>>(new Set())
  const loadingStates = ref<Map<string, boolean>>(new Map())

  // Lazy load a component
  const lazyLoadComponent = async (componentName: string, componentLoader: () => Promise<any>) => {
    if (loadedComponents.value.has(componentName)) {
      return true // Already loaded
    }

    if (loadingStates.value.get(componentName)) {
      return false // Currently loading
    }

    try {
      loadingStates.value.set(componentName, true)

      // Simulate loading delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 100))

      // In a real implementation, you would do:
      // const component = await componentLoader()
      // Register the component globally or return it

      loadedComponents.value.add(componentName)
      loadingStates.value.set(componentName, false)

      return true
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error)
      loadingStates.value.set(componentName, false)
      return false
    }
  }

  // Check if component is loaded
  const isComponentLoaded = (componentName: string) => {
    return loadedComponents.value.has(componentName)
  }

  // Check if component is loading
  const isComponentLoading = (componentName: string) => {
    return loadingStates.value.get(componentName) || false
  }

  // Preload multiple components
  const preloadComponents = async (components: Array<{ name: string; loader: () => Promise<any> }>) => {
    const promises = components.map(component =>
      lazyLoadComponent(component.name, component.loader)
    )

    const results = await Promise.allSettled(promises)
    return results.map((result, index) => ({
      name: components[index].name,
      success: result.status === 'fulfilled' ? result.value : false
    }))
  }

  // Lazy load components on viewport intersection
  const useIntersectionObserver = (element: HTMLElement, componentName: string, componentLoader: () => Promise<any>) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isComponentLoaded(componentName)) {
            lazyLoadComponent(componentName, componentLoader)
            observer.disconnect() // Stop observing once loaded
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before the element comes into view
      }
    )

    if (element) {
      observer.observe(element)
    }

    // Return cleanup function
    return () => observer.disconnect()
  }

  // Lazy load based on user interaction
  const loadOnInteraction = (componentName: string, componentLoader: () => Promise<any>) => {
    return async () => {
      return await lazyLoadComponent(componentName, componentLoader)
    }
  }

  // Performance monitoring
  const getLoadingStats = () => {
    return {
      loadedCount: loadedComponents.value.size,
      loadingCount: Array.from(loadingStates.value.values()).filter(Boolean).length,
      loadedComponents: Array.from(loadedComponents.value),
      loadingComponents: Array.from(loadingStates.value.entries())
        .filter(([, loading]) => loading)
        .map(([name]) => name)
    }
  }

  return {
    loadedComponents,
    loadingStates,
    lazyLoadComponent,
    isComponentLoaded,
    isComponentLoading,
    preloadComponents,
    useIntersectionObserver,
    loadOnInteraction,
    getLoadingStats
  }
}
