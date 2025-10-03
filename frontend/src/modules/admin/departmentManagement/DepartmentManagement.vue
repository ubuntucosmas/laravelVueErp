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
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Departments</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Department Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage company departments and organizational structure</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add Department
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search departments..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.has_manager"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Departments</option>
          <option :value="true">Has Manager</option>
          <option :value="false">No Manager</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Departments Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading departments...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Manager
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employees
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="department in departments" :key="department.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ department.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ department.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ department.manager ? `${department.manager.first_name} ${department.manager.last_name}` : 'No Manager' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ department.user_count || 0 }} employees
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                {{ department.description || 'No description' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editDepartment(department)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="viewEmployees(department)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  View Employees
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Department Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ editingDepartment ? 'Edit Department' : 'Create New Department' }}
        </h2>

        <DepartmentForm
          v-model="departmentFormData"
          :error-message="formError"
          :success-message="formSuccess"
          @submit="handleFormSubmit"
        />

        <div v-if="formError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ formError }}
        </div>

        <div v-if="formSuccess" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          {{ formSuccess }}
        </div>

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
            {{ saving ? 'Saving...' : (editingDepartment ? 'Update Department' : 'Create Department') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Department, CreateDepartmentData, UpdateDepartmentData } from './types/department'
import { useDepartments } from './composables/useDepartments'
import DepartmentForm from './components/DepartmentForm.vue'

const { departments, loading, error, fetchDepartments, createDepartment, updateDepartment } = useDepartments()
const filters = ref({ search: '', has_manager: undefined as boolean | undefined })
const showCreateModal = ref(false)
const editingDepartment = ref<Department | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const departmentFormData = ref<CreateDepartmentData | UpdateDepartmentData>({
  name: '',
  description: '',
  manager_id: undefined,
  budget: undefined,
  location: ''
})

const applyFilters = () => {
  fetchDepartments(filters.value)
}

const editDepartment = (department: Department) => {
  editingDepartment.value = department
  departmentFormData.value = {
    name: department.name,
    description: department.description || '',
    manager_id: department.manager_id || undefined,
    budget: department.budget ? parseFloat(String(department.budget)) : undefined,
    location: department.location || ''
  }
  showCreateModal.value = true
}

const viewEmployees = (department: Department) => {
  console.log('View employees for department:', department.name)
  // Could navigate to employee list filtered by department
}

const closeModal = () => {
  showCreateModal.value = false
  editingDepartment.value = null
  formError.value = ''
  formSuccess.value = ''
  departmentFormData.value = {
    name: '',
    description: '',
    manager_id: undefined,
    budget: undefined,
    location: ''
  }
}

const handleFormSubmit = async () => {
  // Basic validation
  if (!departmentFormData.value.name) {
    formError.value = 'Department name is required'
    return
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    if (editingDepartment.value) {
      // Update existing department
      await updateDepartment(editingDepartment.value.id, departmentFormData.value as UpdateDepartmentData)
      formSuccess.value = 'Department updated successfully!'
    } else {
      // Create new department
      await createDepartment(departmentFormData.value as CreateDepartmentData)
      formSuccess.value = 'Department created successfully!'
    }

    // Refresh department list
    await fetchDepartments()

    // Close modal after a short delay
    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      formError.value = axiosError.response?.data?.message || 'An error occurred'
    } else if (err instanceof Error) {
      formError.value = err.message
    } else {
      formError.value = 'An error occurred'
    }
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchDepartments()
})
</script>
