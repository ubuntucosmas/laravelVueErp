<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2A1 1 0 0 0 1 10h2v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 .707-1.707Z"/>
            </svg>
            Dashboard
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <router-link to="/admin" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Admin
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Users</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage system users and their roles</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search users..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.department_id"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Departments</option>
          <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
        <select
          v-model="filters.is_active"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option :value="true">Active</option>
          <option :value="false">Inactive</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Roles
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in paginatedUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">{{ user.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ user.department?.name || 'No Department' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ role.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editUser(user)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="assignRoles(user)"
                  class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 mr-3"
                >
                  Assign Roles
                </button>
                <button
                  @click="toggleUserStatus(user)"
                  :class="[
                    'mr-3',
                    user.is_active
                      ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                  ]"
                >
                  {{ user.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="users.length > itemsPerPage"
        :current-page="currentPage"
        :total-items="users.length"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ editingUser ? 'Edit User' : 'Create New User' }}
        </h2>

        <UserForm
          v-model="userFormData"
          :error-message="formError"
          :success-message="formSuccess"
          :is-editing="!!editingUser"
          @update:selectedEmployeeId="selectedEmployeeId = $event"
          @submit="handleFormSubmit"
        />

        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            :disabled="saving"
          >
            Cancel
          </button>
          <button
            @click="handleFormSubmit"
            :disabled="saving"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ saving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Role Assignment Modal -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Assign Roles to {{ selectedUser?.name || 'User' }}
        </h2>

        <div v-if="selectedUser" class="space-y-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">Current Roles</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="role in selectedUser.roles"
                :key="role.id"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ role.name }}
              </span>
              <span
                v-if="selectedUser.roles.length === 0"
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                No roles assigned to this user
              </span>
            </div>
          </div>

          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-3">Available Roles</h3>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <label
                v-for="role in availableRoles"
                :key="role.id"
                class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  v-model="selectedRoleIds"
                  :value="role.id"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <div class="ml-3">
                  <div class="font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ role.description }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {{ role.permissions.length }} permissions
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="closeRoleModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            @click="saveRoleAssignment"
            :disabled="savingRoles"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="savingRoles" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ savingRoles ? 'Saving...' : 'Save Roles' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User, UserFilters, CreateUserData } from './types/user'
import { useUsers } from './composables/useUsers'
import { useDepartments } from '../departmentManagement/composables/useDepartments'
import UserForm from './components/UserForm.vue'
import Pagination from '../../../components/Pagination.vue'


const { users, loading, error, fetchUsers, createUser, updateUser } = useUsers()
const { departments: availableDepartments, fetchDepartments } = useDepartments()
// HR import commented out as we now fetch employees via API
// import { useEmployees } from '../../../hr/composables/useEmployees'
// const { createEmployee } = useEmployees()
const filters = ref<UserFilters>({})
const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const selectedEmployeeId = ref<number | null>(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const userFormData = ref<CreateUserData>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  department_id: undefined,
  role_ids: []
})

// Role assignment
const showRoleModal = ref(false)
const selectedUser = ref<User | null>(null)
const selectedRoleIds = ref<number[]>([])
const savingRoles = ref(false)

interface RoleOption {
  id: number
  name: string
  description: string | null
  permissions: Array<{
    id: number
    name: string
    module: string
    description: string | null
  }>
  user_count?: number
  created_at: string
  updated_at: string
}

const availableRoles = ref<RoleOption[]>([])

const applyFilters = () => {
  fetchUsers(filters.value)
}

// Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return users.value.slice(start, end)
})

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const editUser = (user: User) => {
  editingUser.value = user
  userFormData.value = {
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    department_id: user.department_id || undefined,
    role_ids: user.roles.map(role => role.id)
  }
  showCreateModal.value = true
}

const toggleUserStatus = async (user: User) => {
  try {
    await updateUser(user.id, { is_active: !user.is_active })
    user.is_active = !user.is_active
  } catch (err) {
    console.error('Error toggling user status:', err)
  }
}

const handleFormSubmit = async () => {
  const isEditing = !!editingUser.value

  // For creation: require employee selection
  if (!isEditing && !selectedEmployeeId.value) {
    formError.value = 'Please select an employee from the database to create a user account'
    return
  }

  // For creation: require password
  if (!isEditing) {
    if (!userFormData.value.password) {
      formError.value = 'Please enter a password'
      return
    }

    if (userFormData.value.password.length < 8) {
      formError.value = 'Password must be at least 8 characters long'
      return
    }

    if (userFormData.value.password !== userFormData.value.password_confirmation) {
      formError.value = 'Passwords do not match'
      return
    }
  }

  // For editing: if password is provided, validate it
  if (isEditing && userFormData.value.password) {
    if (userFormData.value.password.length < 8) {
      formError.value = 'Password must be at least 8 characters long'
      return
    }

    if (userFormData.value.password !== userFormData.value.password_confirmation) {
      formError.value = 'Passwords do not match'
      return
    }
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    if (isEditing) {
      // Update existing user - only include password if provided
      const updateData: Record<string, unknown> = {
        name: userFormData.value.name,
        email: userFormData.value.email,
        department_id: userFormData.value.department_id,
        role_ids: userFormData.value.role_ids
      }

      // Only include password if it's provided
      if (userFormData.value.password) {
        updateData.password = userFormData.value.password
        updateData.password_confirmation = userFormData.value.password_confirmation
      }

      await updateUser(editingUser.value!.id, updateData)
      formSuccess.value = 'User updated successfully!'
    } else {
      // Create new user - include employee_id from selected employee
      const userData = {
        ...userFormData.value,
        employee_id: selectedEmployeeId.value!
      }
      await createUser(userData)
      formSuccess.value = 'User created successfully!'
    }

    // Refresh user list
    await fetchUsers()

    // Close modal after a short delay
    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  formError.value = ''
  formSuccess.value = ''
  userFormData.value = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    department_id: undefined,
    role_ids: []
  }
}


const assignRoles = async (user: User) => {
  selectedUser.value = user
  selectedRoleIds.value = user.roles.map(role => role.id)

  try {
    const response = await fetch('/api/admin/roles')
    const data = await response.json()
    availableRoles.value = data.data.map((role: {
      id: number
      name: string
      description: string | null
      permissions: Array<{id: number, name: string, description: string}>
    }) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions
    }))
  } catch (error) {
    console.error('Error fetching roles:', error)
    // Show error to user if API fails
    alert('Failed to load roles. Please try again.')
    availableRoles.value = []
  }

  showRoleModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
  selectedRoleIds.value = []
  availableRoles.value = []
}

const saveRoleAssignment = async () => {
  if (!selectedUser.value) return

  savingRoles.value = true
  try {
    // Update user's roles via API
    await updateUser(selectedUser.value.id, { role_ids: selectedRoleIds.value })

    // Update local user data
    const assignedRoles = availableRoles.value.filter(role => selectedRoleIds.value.includes(role.id))
    selectedUser.value.roles = assignedRoles

    console.log(`Assigned roles to user ${selectedUser.value.name}:`, assignedRoles.map(r => r.name))

    // Refresh user list to reflect changes
    await fetchUsers()

    // Close modal after a short delay
    setTimeout(() => {
      closeRoleModal()
    }, 1000)

  } catch (err) {
    console.error('Error saving role assignment:', err)
  } finally {
    savingRoles.value = false
  }
}


onMounted(async () => {
  await Promise.all([
    fetchUsers(),
    fetchDepartments()
  ])
})
</script>
