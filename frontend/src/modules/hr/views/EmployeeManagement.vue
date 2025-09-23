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
            <router-link to="/hr" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              HR
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Employees</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage employee records, salaries, and organizational details</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add Employee
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search employees..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.department"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Departments</option>
          <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
          <option v-if="availableDepartments.length === 0" value="" disabled>
            No departments available
          </option>
        </select>
        <select
          v-model="filters.employment_type"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="intern">Intern</option>
        </select>
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
          <option value="on-leave">On Leave</option>
        </select>
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Employees Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading employees...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employee
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Position
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Salary
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
            <tr v-for="employee in employees" :key="employee.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">{{ employee.first_name.charAt(0) }}{{ employee.last_name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ employee.first_name }} {{ employee.last_name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ employee.employee_id }} • {{ employee.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.position }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.department?.name || 'No Department' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ employee.salary.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : employee.status === 'inactive'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : employee.status === 'terminated'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  ]"
                >
                  {{ employee.status.replace('-', ' ').toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewEmployee(employee)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  View
                </button>
                <button
                  @click="editEmployee(employee)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="deleteEmployee(employee)"
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

    <!-- Employee Detail Modal (View/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ modalMode === 'view' ? 'Employee Details' : 'Edit Employee' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedEmployee" class="space-y-4">
          <!-- View Mode -->
          <div v-if="modalMode === 'view'" class="space-y-4">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.employee_id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.first_name }} {{ selectedEmployee.last_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.phone || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.position }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.department?.name || 'No Department' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                <p class="text-sm text-gray-900 dark:text-white">${{ selectedEmployee.salary.toLocaleString() }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Type</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.employment_type.replace('-', ' ').toUpperCase() }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hire Date</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedEmployee.hire_date) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedEmployee.status.replace('-', ' ').toUpperCase() }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
         <form v-else-if="modalMode === 'edit'" @submit.prevent="handleUpdateEmployee" class="space-y-4">
           <!-- Basic Information -->
           <div class="space-y-3">
             <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                 <input
                   v-model="editFormData.employee_id"
                   type="text"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                 <input
                   v-model="editFormData.first_name"
                   type="text"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                 <input
                   v-model="editFormData.last_name"
                   type="text"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                 <input
                   v-model="editFormData.phone"
                   type="tel"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                 />
               </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                 <input
                   v-model="editFormData.email"
                   type="email"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hire Date *</label>
                 <input
                   v-model="editFormData.hire_date"
                   type="date"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
             </div>
           </div>

            <!-- Employment Details -->
            <div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Employment Details</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position *</label>
                    <input
                      v-model="editFormData.position"
                      type="text"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                    <select
                      v-model="editFormData.department_id"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      required
                    >
                      <option value="">Select Department</option>
                      <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">
                        {{ dept.name }}
                      </option>
                      <option v-if="availableDepartments.length === 0" value="" disabled>
                        No departments available
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary *</label>
                    <input
                      v-model.number="editFormData.salary"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Type *</label>
                    <select
                      v-model="editFormData.employment_type"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      required
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>
                </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                    <select
                      v-model="editFormData.status"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="terminated">Terminated</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
                    <select
                      v-model="editFormData.manager_id"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">Select Manager (Optional)</option>
                      <option v-for="emp in availableEmployees" :key="emp.id" :value="emp.id">
                        {{ emp.first_name }} {{ emp.last_name }} - {{ emp.position }}
                      </option>
                    </select>
                  </div>
                </div>
            </div>

            <!-- Additional Information -->
            <div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input
                      v-model="editFormData.date_of_birth"
                      type="date"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <textarea
                      v-model="editFormData.address"
                      rows="2"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Employee address"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
                    <input
                      v-model="editFormData.emergency_contact_name"
                      type="text"
                      placeholder="Contact Name"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Phone</label>
                    <input
                      v-model="editFormData.emergency_contact_phone"
                      type="tel"
                      placeholder="Contact Phone"
                      class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="editFormError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {{ editFormError }}
            </div>

            <div v-if="editFormSuccess" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {{ editFormSuccess }}
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
                class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
                :disabled="updating"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="updating"
                class="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <span v-if="updating" class="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                {{ updating ? 'Updating...' : 'Update Employee' }}
              </button>
            </div>
          </form>

          <!-- Manager Information -->
          <div v-if="selectedEmployee.manager" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manager</h3>
            <p class="text-sm text-gray-900 dark:text-white">
              {{ selectedEmployee.manager.first_name }} {{ selectedEmployee.manager.last_name }} - {{ selectedEmployee.manager.position }}
            </p>
          </div>

          <!-- Performance Information -->
          <div v-if="selectedEmployee.performance_rating" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance</h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-900 dark:text-white">Rating: {{ selectedEmployee.performance_rating }}/5</span>
              <span v-if="selectedEmployee.last_review_date" class="text-sm text-gray-600 dark:text-gray-400">
                (Last reviewed: {{ formatDate(selectedEmployee.last_review_date) }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Employee Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Create New Employee</h2>
          <button
            @click="closeCreateModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        <form @submit.prevent="handleCreateEmployee" class="space-y-4">
           <!-- Basic Information -->
           <div class="space-y-3">
             <h3 class="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>

             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                 <input
                   v-model="newEmployee.employee_id"
                   type="text"
                   placeholder="Auto-generated if empty"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                 <input
                   v-model="newEmployee.first_name"
                   type="text"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                 <input
                   v-model="newEmployee.last_name"
                   type="text"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                 <input
                   v-model="newEmployee.phone"
                   type="tel"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                 />
               </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                 <input
                   v-model="newEmployee.email"
                   type="email"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hire Date *</label>
                 <input
                   v-model="newEmployee.hire_date"
                   type="date"
                   class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                   required
                 />
               </div>
             </div>
           </div>

          <!-- Employment Details -->
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Employment Details</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position *</label>
                <input
                  v-model="newEmployee.position"
                  type="text"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                <select
                  v-model="newEmployee.department_id"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in availableDepartments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                  <option v-if="availableDepartments.length === 0" value="" disabled>
                    No departments available
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary *</label>
                <input
                  v-model.number="newEmployee.salary"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Type *</label>
                <select
                  v-model="newEmployee.employment_type"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                <select
                  v-model="newEmployee.status"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager</label>
                <select
                  v-model="newEmployee.manager_id"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">Select Manager (Optional)</option>
                  <option v-for="emp in availableEmployees" :key="emp.id" :value="emp.id">
                    {{ emp.first_name }} {{ emp.last_name }} - {{ emp.position }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input
                  v-model="newEmployee.date_of_birth"
                  type="date"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  v-model="newEmployee.address"
                  rows="2"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="Employee address"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
                <input
                  v-model="newEmployee.emergency_contact_name"
                  type="text"
                  placeholder="Contact Name"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Phone</label>
                <input
                  v-model="newEmployee.emergency_contact_phone"
                  type="tel"
                  placeholder="Contact Phone"
                  class="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="formError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ formError }}
          </div>

          <div v-if="formSuccess" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {{ formSuccess }}
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
              :disabled="saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span v-if="saving" class="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
              {{ saving ? 'Creating...' : 'Create Employee' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Employee, EmployeeFilters } from '../types/employee'
import { useEmployees } from '../composables/useEmployees'
import { useApi } from '../../admin/shared/composables/useApi'

console.log('EmployeeManagement component script loaded')

const { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee: deleteEmployeeApi } = useEmployees()
const { get } = useApi()
const filters = ref<EmployeeFilters>({})
const availableDepartments = ref<Array<{id: number, name: string}>>([])
const availableEmployees = ref<Array<{id: number, first_name: string, last_name: string, position: string}>>([])
const showModal = ref(false)
const showCreateModal = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const modalMode = ref<'view' | 'edit'>('view')
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const updating = ref(false)
const editFormError = ref('')
const editFormSuccess = ref('')

const newEmployee = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  department_id: undefined as number | undefined,
  salary: 0,
  employment_type: 'full-time' as const,
  status: 'active' as const,
  hire_date: new Date().toISOString().split('T')[0],
  manager_id: undefined as number | undefined,
  address: '',
  date_of_birth: '',
  emergency_contact_name: '',
  emergency_contact_phone: ''
})

const editFormData = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  position: '',
  department_id: undefined as number | undefined,
  salary: 0,
  employment_type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern',
  status: 'active' as 'active' | 'inactive' | 'terminated' | 'on-leave',
  hire_date: '',
  manager_id: undefined as number | undefined,
  address: '',
  date_of_birth: '',
  emergency_contact_name: '',
  emergency_contact_phone: ''
})

const viewEmployee = (employee: Employee) => {
  selectedEmployee.value = employee
  modalMode.value = 'view'
  showModal.value = true
}

const openCreateModal = () => {
  // Open modal immediately
  showCreateModal.value = true

  // Load departments in background if not loaded
  if (availableDepartments.value.length === 0) {
    fetchDepartments().catch(error => {
      console.error('Failed to load departments:', error)
    })
  }
}

const editEmployee = async (employee: Employee) => {
  selectedEmployee.value = employee
  modalMode.value = 'edit'
  showModal.value = true

  // Ensure departments are loaded
  if (availableDepartments.value.length === 0) {
    await fetchDepartments()
  }

  editFormData.value = {
    employee_id: employee.employee_id || '',
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone || '',
    position: employee.position,
    department_id: employee.department_id || undefined,
    salary: employee.salary,
    employment_type: employee.employment_type,
    status: employee.status,
    hire_date: employee.hire_date.split('T')[0], // Format for date input
    manager_id: employee.manager_id || undefined,
    address: employee.address || '',
    date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
    emergency_contact_name: employee.emergency_contact?.name || '',
    emergency_contact_phone: employee.emergency_contact?.phone || ''
  }
  editFormError.value = ''
  editFormSuccess.value = ''
}

const deleteEmployee = async (employee: Employee) => {
  if (confirm(`Are you sure you want to terminate ${employee.first_name} ${employee.last_name}?`)) {
    try {
      await deleteEmployeeApi(employee.id)
      await fetchEmployees()
    } catch (err) {
      console.error('Error deleting employee:', err)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  selectedEmployee.value = null
}

const closeCreateModal = () => {
  showCreateModal.value = false
  formError.value = ''
  formSuccess.value = ''
  newEmployee.value = {
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department_id: undefined,
    salary: 0,
    employment_type: 'full-time',
    status: 'active',
    hire_date: new Date().toISOString().split('T')[0],
    manager_id: undefined,
    address: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  }
}

const handleCreateEmployee = async () => {
  // Basic validation
  if (!newEmployee.value.first_name || !newEmployee.value.last_name || !newEmployee.value.email ||
      !newEmployee.value.position || !newEmployee.value.department_id || !newEmployee.value.hire_date) {
    formError.value = 'Please fill in all required fields'
    return
  }

  if (newEmployee.value.salary <= 0) {
    formError.value = 'Salary must be greater than 0'
    return
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    // Prepare emergency contact data
    let emergencyContact = undefined
    if (newEmployee.value.emergency_contact_name || newEmployee.value.emergency_contact_phone) {
      emergencyContact = {
        name: newEmployee.value.emergency_contact_name,
        relationship: 'Emergency Contact', // Default relationship
        phone: newEmployee.value.emergency_contact_phone
      }
    }

    // Prepare employee data
    const employeeData = {
      employee_id: newEmployee.value.employee_id || undefined,
      first_name: newEmployee.value.first_name,
      last_name: newEmployee.value.last_name,
      email: newEmployee.value.email,
      phone: newEmployee.value.phone || undefined,
      position: newEmployee.value.position,
      department_id: newEmployee.value.department_id,
      hire_date: newEmployee.value.hire_date,
      salary: newEmployee.value.salary,
      employment_type: newEmployee.value.employment_type,
      status: newEmployee.value.status,
      manager_id: newEmployee.value.manager_id || undefined,
      address: newEmployee.value.address || undefined,
      date_of_birth: newEmployee.value.date_of_birth || undefined,
      emergency_contact: emergencyContact
    }

    await createEmployee(employeeData)

    formSuccess.value = 'Employee created successfully!'
    await fetchEmployees()

    // Close modal after a short delay
    setTimeout(() => {
      closeCreateModal()
    }, 1500)

  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Failed to create employee'
  } finally {
    saving.value = false
  }
}

const handleUpdateEmployee = async () => {
  if (!selectedEmployee.value) return

  // Basic validation
  if (!editFormData.value.first_name || !editFormData.value.last_name || !editFormData.value.email ||
      !editFormData.value.position || !editFormData.value.department_id || !editFormData.value.hire_date) {
    editFormError.value = 'Please fill in all required fields'
    return
  }

  if (editFormData.value.salary <= 0) {
    editFormError.value = 'Salary must be greater than 0'
    return
  }

  updating.value = true
  editFormError.value = ''
  editFormSuccess.value = ''

  try {
    // Prepare emergency contact data
    let emergencyContact = undefined
    if (editFormData.value.emergency_contact_name || editFormData.value.emergency_contact_phone) {
      emergencyContact = {
        name: editFormData.value.emergency_contact_name,
        relationship: 'Emergency Contact',
        phone: editFormData.value.emergency_contact_phone
      }
    }

    // Prepare employee data
    const employeeData = {
      employee_id: editFormData.value.employee_id || undefined,
      first_name: editFormData.value.first_name,
      last_name: editFormData.value.last_name,
      email: editFormData.value.email,
      phone: editFormData.value.phone || undefined,
      position: editFormData.value.position,
      department_id: editFormData.value.department_id,
      hire_date: editFormData.value.hire_date,
      salary: editFormData.value.salary,
      employment_type: editFormData.value.employment_type,
      status: editFormData.value.status,
      manager_id: editFormData.value.manager_id || undefined,
      address: editFormData.value.address || undefined,
      date_of_birth: editFormData.value.date_of_birth || undefined,
      emergency_contact: emergencyContact
    }

    await updateEmployee(selectedEmployee.value.id, employeeData)

    editFormSuccess.value = 'Employee updated successfully!'
    await fetchEmployees()

    // Close modal after a short delay
    setTimeout(() => {
      closeModal()
    }, 1500)

  } catch (err) {
    editFormError.value = err instanceof Error ? err.message : 'Failed to update employee'
  } finally {
    updating.value = false
  }
}

const applyFilters = () => {
  fetchEmployees(filters.value)
}

const fetchDepartments = async () => {
  try {
    console.log('Fetching departments...')
    const response = await get('/api/hr/departments')
    console.log('Departments response:', response)
    console.log('Departments data received:', response.data)

    // Handle different response structures
    let departmentsArray: Array<{id: number, name: string}> = []

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      // Paginated response
      const responseData = response.data as { data: Array<{id: number, name: string}>, meta: Record<string, unknown> }
      departmentsArray = responseData.data
    } else if (Array.isArray(response.data)) {
      // Direct array response
      departmentsArray = response.data as Array<{id: number, name: string}>
    } else {
      console.warn('Unexpected departments response structure:', response.data)
      availableDepartments.value = []
      return
    }

    availableDepartments.value = departmentsArray.map((dept) => ({
      id: dept.id,
      name: dept.name
    }))
    console.log('Available departments set:', availableDepartments.value)
  } catch (error) {
    console.error('Error fetching departments:', error)
    // Show user-friendly error message
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 403) {
      console.warn('Access denied to departments. User may not have proper permissions.')
    }
    availableDepartments.value = []
  }
}

const fetchAvailableEmployees = async () => {
  try {
    const response = await get('/api/hr/employees')
    const responseData = response.data

    // Handle both paginated response {data: [...], meta: ...} and direct array response [...]
    let employeesArray: Array<{id: number, first_name: string, last_name: string, position: string}> = []

    if (Array.isArray(responseData)) {
      // Direct array response
      employeesArray = responseData as Array<{id: number, first_name: string, last_name: string, position: string}>
    } else if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray((responseData as {data: unknown[]}).data)) {
      // Paginated response
      employeesArray = (responseData as {data: Array<{id: number, first_name: string, last_name: string, position: string}>}).data
    } else {
      console.warn('Unexpected response structure for employees:', responseData)
      availableEmployees.value = []
      return
    }

    availableEmployees.value = employeesArray.map((emp) => ({
      id: emp.id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      position: emp.position
    }))
  } catch (error) {
    console.error('Error fetching employees:', error)
    availableEmployees.value = []
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(async () => {
  console.log('EmployeeManagement component mounted')
  try {
    await fetchEmployees()
    console.log('Employees fetched successfully')
    await fetchDepartments()
    console.log('Departments fetched successfully')
    await fetchAvailableEmployees()
    console.log('Available employees fetched successfully')
    console.log('Component initialization complete')
  } catch (error) {
    console.error('Error during component initialization:', error)
  }
})
</script>
