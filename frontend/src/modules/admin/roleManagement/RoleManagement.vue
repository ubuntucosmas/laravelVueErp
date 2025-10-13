<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Role Management</h1>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add Role
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search roles..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          @click="fetchRoles"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Roles Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading roles...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Permissions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Users Count
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="role in roles" :key="role.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ role.description || 'No description' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="permission in role.permissions.slice(0, 3)"
                    :key="permission.id"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ permission.name.split('.').pop() }}
                  </span>
                  <span
                    v-if="role.permissions.length > 3"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    +{{ role.permissions.length - 3 }} more
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ role.user_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editRole(role)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteRole(role)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Role Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-5xl w-full">
        <h2 class="text-lg font-bold mb-3 text-gray-900 dark:text-white">
          {{ editingRole ? 'Edit Role' : 'Create New Role' }}
        </h2>

        <form @submit.prevent="handleRoleSubmit" class="space-y-3">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role Name *
              </label>
              <input
                v-model="roleForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Manager, Admin, Employee"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                v-model="roleForm.description"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the role's responsibilities and access level..."
              ></textarea>
            </div>
          </div>

          <!-- Permissions Section -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Permissions</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Select the permissions this role should have. Permissions are grouped by module.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- User Management Permissions -->
              <div v-if="userPermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">👥</span>
                  User Management
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in userPermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('user.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Role Management Permissions -->
              <div v-if="rolePermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">🛡️</span>
                  Role Management
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in rolePermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('role.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Department Management Permissions -->
              <div v-if="departmentPermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">🏢</span>
                  Department Management
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in departmentPermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('department.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Employee Management Permissions -->
              <div v-if="employeePermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">👨‍💼</span>
                  Employee Management
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in employeePermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('employee.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Project Management Permissions -->
              <div v-if="projectPermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">📊</span>
                  Project Management
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in projectPermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('project.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>


              <!-- HR Permissions -->
              <div v-if="hrPermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">👔</span>
                  Human Resources
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in hrPermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('hr.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Admin Permissions -->
              <div v-if="adminPermissions.length > 0" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <span class="text-lg mr-2">🔐</span>
                  Administration
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <label v-for="permission in adminPermissions" :key="permission.id" class="flex items-center">
                    <input
                      v-model="roleForm.selectedPermissions"
                      :value="permission.id"
                      type="checkbox"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ permission.name.replace('admin.', '').replace('_', ' ').toUpperCase() }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ saving ? 'Saving...' : (editingRole ? 'Update Role' : 'Create Role') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoles } from './composables/useRoles'

const { roles, permissions, loading, error, fetchRoles, fetchPermissions, createRole, updateRole, deleteRole } = useRoles()

const filters = ref({})
const showCreateModal = ref(false)
const editingRole = ref(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')

// Role form data
const roleForm = ref({
  name: '',
  description: '',
  selectedPermissions: []
})

// Permission data grouped by modules - will be populated from API
const userPermissions = ref([])
const projectPermissions = ref([])
const hrPermissions = ref([])
const adminPermissions = ref([])
const rolePermissions = ref([])
const departmentPermissions = ref([])
const employeePermissions = ref([])

// Group permissions by module
const groupPermissionsByModule = (permissions) => {
  userPermissions.value = permissions.filter(p => p.name.startsWith('user.'))
  projectPermissions.value = permissions.filter(p => p.name.startsWith('project.'))
  hrPermissions.value = permissions.filter(p => p.name.startsWith('hr.'))
  adminPermissions.value = permissions.filter(p => p.name.startsWith('admin.'))
  rolePermissions.value = permissions.filter(p => p.name.startsWith('role.'))
  departmentPermissions.value = permissions.filter(p => p.name.startsWith('department.'))
  employeePermissions.value = permissions.filter(p => p.name.startsWith('employee.'))
}

const editRole = (role) => {
  editingRole.value = role
  // Populate form with existing role data
  roleForm.value = {
    name: role.name,
    description: role.description || '',
    selectedPermissions: role.permissions.map(p => p.id)
  }
  showCreateModal.value = true
}

const handleDeleteRole = async (role) => {
  if (confirm(`Are you sure you want to delete the role "${role.name}"? This will affect ${role.user_count || 0} users.`)) {
    try {
      await deleteRole(role.id)
    } catch (err) {
      console.error('Error deleting role:', err)
    }
  }
}

const handleRoleSubmit = async () => {
  // Basic validation
  if (!roleForm.value.name.trim()) {
    formError.value = 'Role name is required'
    return
  }

  if (roleForm.value.selectedPermissions.length === 0) {
    formError.value = 'Please select at least one permission'
    return
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    const roleData = {
      name: roleForm.value.name,
      description: roleForm.value.description,
      permission_ids: roleForm.value.selectedPermissions
    }

    if (editingRole.value) {
      // Update existing role
      await updateRole(editingRole.value.id, roleData)
      formSuccess.value = 'Role updated successfully!'
    } else {
      // Create new role
      await createRole(roleData)
      formSuccess.value = 'Role created successfully!'
    }

    // Refresh roles list
    await fetchRoles()

    // Close modal after a short delay
    setTimeout(() => {
      closeCreateModal()
    }, 1500)

  } catch (err) {
    formError.value = err.message || 'Failed to save role'
  } finally {
    saving.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingRole.value = null
  formError.value = ''
  formSuccess.value = ''
  // Reset form
  roleForm.value = {
    name: '',
    description: '',
    selectedPermissions: []
  }
}

onMounted(async () => {
  await fetchRoles()
  await fetchPermissions()
  // Group permissions by module after fetching
  if (permissions.value.length > 0) {
    groupPermissionsByModule(permissions.value)
  }
})
</script>
