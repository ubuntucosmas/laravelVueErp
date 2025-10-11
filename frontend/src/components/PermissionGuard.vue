<template>
  <slot v-if="hasPermission && !loading" />
  <slot v-else-if="loading" name="loading">
    <div class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span class="ml-2 text-sm text-gray-600">Checking permissions...</span>
    </div>
  </slot>
  <slot v-else name="denied">
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Access Denied
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>You don't have permission to access this feature.</p>
            <p class="mt-1">Required permission: <code class="bg-red-100 px-1 rounded">{{ permission }}</code></p>
          </div>
        </div>
      </div>
    </div>
  </slot>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { permissionCache } from '../services/PermissionCache'
import { PERMISSIONS } from '../services/PermissionService'
import { useAuth } from '../composables/useAuth'

interface Props {
  permission: keyof typeof PERMISSIONS | string
  requireAll?: (keyof typeof PERMISSIONS | string)[]
  requireAny?: (keyof typeof PERMISSIONS | string)[]
  fallback?: boolean // If true, show denied slot instead of hiding content
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: () => [],
  requireAny: () => [],
  fallback: false
})

const { permissions: authPermissions } = useAuth()

const hasPermission = ref(false)
const loading = ref(true)

const checkPermissions = async () => {
  loading.value = true

  try {
    // Check if user is Super Admin (bypass all permission checks)
    if (authPermissions.value?.roles?.includes('Super Admin')) {
      hasPermission.value = true
      loading.value = false
      return
    }

    // Use new dynamic permission system
    const dynamicPermissions = authPermissions.value?.permissions?.permissions || {}

    // Check main permission
    if (props.permission) {
      const perm = PERMISSIONS[props.permission as keyof typeof PERMISSIONS] || props.permission
      hasPermission.value = dynamicPermissions[perm] || false
    }

    // Check requireAll permissions
    if (props.requireAll.length > 0 && hasPermission.value) {
      const allPerms = props.requireAll.map(p =>
        PERMISSIONS[p as keyof typeof PERMISSIONS] || p
      )
      hasPermission.value = allPerms.every(perm => dynamicPermissions[perm] || false)
    }

    // Check requireAny permissions
    if (props.requireAny.length > 0 && !hasPermission.value) {
      const anyPerms = props.requireAny.map(p =>
        PERMISSIONS[p as keyof typeof PERMISSIONS] || p
      )
      hasPermission.value = anyPerms.some(perm => dynamicPermissions[perm] || false)
    }
  } catch (error) {
    console.error('Permission check failed:', error)
    hasPermission.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkPermissions()
})

// Watch for permission changes (when user logs in/out or permissions update)
watch([() => authPermissions.value, () => permissionCache], () => {
  checkPermissions()
}, { deep: true })
</script>
