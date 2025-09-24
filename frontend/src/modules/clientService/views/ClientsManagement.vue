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
            <router-link to="/client-service" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">
              Client Service
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Clients</span>
          </div>
        </li>
      </ol>
    </nav>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Client Management</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Register and manage client information</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add Client
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search clients..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Clients</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          v-model="filters.company"
          type="text"
          placeholder="Filter by company..."
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          @click="applyFilters"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Filter
        </button>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading clients...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center text-red-600">
        Error: {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th @click="sortClients('companyName')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                Company
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
            <tr v-for="client in clients" :key="client.id" :class="{ 'opacity-50 text-gray-500': !client.isActive }">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">{{ client.FullName.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ client.FullName }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ client.registration_date }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div>{{ client.ContactPerson }}</div>
                <div class="text-gray-500 dark:text-gray-400">{{ client.Email }}</div>
                <div class="text-gray-500 dark:text-gray-400">{{ client.Phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ client.companyName || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ client.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  v-if="client.isActive"
                  @click="editClient(client)"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                >
                  Edit
                </button>
                <button
                  @click="viewClientDetails(client)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                >
                  View
                </button>
                <button
                  @click="handleToggleClick(client)"
                  :class="client.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                  class="mr-3"
                >
                  {{ client.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Client Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editingClient ? 'Edit Client' : 'Create New Client' }}
        </h2>

        <form @submit.prevent="handleFormSubmit" class="space-y-6">
          <!-- Row 1: Client Name, Contact Person, Email -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name *</label>
              <input
                v-model="clientFormData.FullName"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person *</label>
              <input
                v-model="clientFormData.ContactPerson"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
              <input
                v-model="clientFormData.Email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- Row 2: Phone, Alternative Contact, Lead Source -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
              <input
                v-model="clientFormData.Phone"
                type="tel"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Alternative Contact</label>
              <input
                v-model="clientFormData.AltContact"
                type="tel"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lead Source *</label>
              <input
                v-model="clientFormData.LeadSource"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- Row 3: Address (Full Width - spans all 3 columns) -->
          <div class="col-span-full">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address *</label>
            <textarea
              v-model="clientFormData.Address"
              required
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          <!-- Row 4: City, County, Postal Address -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">City *</label>
              <input
                v-model="clientFormData.City"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">County *</label>
              <input
                v-model="clientFormData.County"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Address</label>
              <input
                v-model="clientFormData.PostalAddress"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <!-- Row 4.5: Company Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</label>
            <input
              v-model="clientFormData.companyName"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Row 5: Preferred Contact, Customer Type, Industry -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Contact *</label>
              <select
                v-model="clientFormData.PreferredContact"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Type *</label>
              <select
                v-model="clientFormData.CustomerType"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              >
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
              <input
                v-model="clientFormData.Industry"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </form>

        <div v-if="formError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ formError }}
        </div>

        <div v-if="formSuccess" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          {{ formSuccess }}
        </div>

        <div class="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
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
            {{ saving ? 'Saving...' : (editingClient ? 'Update Client' : 'Create Client') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Action</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to {{ clientToToggle?.isActive ? 'deactivate' : 'activate' }} this client?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showConfirmDialog = false; clientToToggle = null"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmToggle"
            :disabled="loading"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- View Client Details Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div v-if="viewLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading client details...</p>
        </div>

        <div v-else-if="viewingClient">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Client Details</h2>
            <button
              @click="showViewModal = false; viewingClient = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Basic Information</h3>

              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.FullName }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.ContactPerson || 'N/A' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.Email }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.Phone }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Alternative Contact</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.AltContact || 'N/A' }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.companyName || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Address & Additional Info -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Address & Additional Information</h3>

              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.Address }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.City }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">County</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.County }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Postal Address</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.PostalAddress || 'N/A' }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Type</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white capitalize">{{ viewingClient.CustomerType }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Contact</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white capitalize">{{ viewingClient.PreferredContact }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lead Source</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.LeadSource }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.Industry || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Status & Dates -->
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span
                  :class="viewingClient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-1"
                >
                  {{ viewingClient.status }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Date</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ viewingClient.registration_date }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ new Date(viewingClient.created_at).toLocaleDateString() }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Updated At</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ new Date(viewingClient.updated_at).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Client, CreateClientData, UpdateClientData } from '../types/client'
import { useClients } from '../composables/useClients'

const { clients, loading, error, fetchClients, createClient, updateClient, toggleClientStatus, fetchClient } = useClients()
const filters = ref({ search: '', status: '', company: '' })
const showCreateModal = ref(false)
const editingClient = ref<Client | null>(null)
const saving = ref(false)
const formError = ref('')
const formSuccess = ref('')
const sortKey = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const showConfirmDialog = ref(false)
const clientToToggle = ref<Client | null>(null)
const showViewModal = ref(false)
const viewingClient = ref<Client | null>(null)
const viewLoading = ref(false)

const sortClients = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
  clients.value.sort((a: Client, b: Client) => {
    const aVal = a.companyName || ''
    const bVal = b.companyName || ''
    const aStr = aVal.toLowerCase()
    const bStr = bVal.toLowerCase()
    if (aStr < bStr) return sortDirection.value === 'asc' ? -1 : 1
    if (aStr > bStr) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
}

const clientFormData = ref<CreateClientData>({
  FullName: '',
  ContactPerson: '',
  Email: '',
  Phone: '',
  AltContact: '',
  Address: '',
  City: '',
  County: '',
  PostalAddress: '',
  CustomerType: 'individual',
  LeadSource: '',
  PreferredContact: 'email',
  Industry: '',
  companyName: ''
})

const applyFilters = () => {
  fetchClients(filters.value)
}

const editClient = (client: Client) => {
  editingClient.value = client
  clientFormData.value = {
    FullName: client.FullName,
    ContactPerson: client.ContactPerson,
    Email: client.Email,
    Phone: client.Phone,
    AltContact: client.AltContact || '',
    Address: client.Address,
    City: client.City,
    County: client.County,
    PostalAddress: client.PostalAddress || '',
    CustomerType: client.CustomerType,
    LeadSource: client.LeadSource,
    PreferredContact: client.PreferredContact,
    Industry: client.Industry || '',
    companyName: client.companyName || ''
  }
  showCreateModal.value = true
}

const viewClientDetails = async (client: Client) => {
  viewLoading.value = true
  showViewModal.value = true
  try {
    viewingClient.value = await fetchClient(client.id)
  } catch (err) {
    console.error('Error fetching client details:', err)
    viewingClient.value = client // fallback to the list data
  } finally {
    viewLoading.value = false
  }
}

const handleToggleClick = (client: Client) => {
  clientToToggle.value = client
  showConfirmDialog.value = true
}

const confirmToggle = async () => {
  if (!clientToToggle.value) return
  try {
    await toggleClientStatus(clientToToggle.value.id)
    await fetchClients()
  } catch (err) {
    console.error('Error toggling client status:', err)
  } finally {
    showConfirmDialog.value = false
    clientToToggle.value = null
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingClient.value = null
  formError.value = ''
  formSuccess.value = ''
  clientFormData.value = {
    FullName: '',
    ContactPerson: '',
    Email: '',
    Phone: '',
    AltContact: '',
    Address: '',
    City: '',
    County: '',
    PostalAddress: '',
    CustomerType: 'individual',
    LeadSource: '',
    PreferredContact: 'email',
    Industry: '',
    companyName: ''
  }
}

const handleFormSubmit = async () => {
  // Basic validation
  if (!clientFormData.value.FullName || !clientFormData.value.ContactPerson ||
      !clientFormData.value.Email || !clientFormData.value.Phone ||
      !clientFormData.value.Address || !clientFormData.value.City ||
      !clientFormData.value.County || !clientFormData.value.LeadSource ||
      !clientFormData.value.companyName) {
    formError.value = 'Please fill in all required fields'
    return
  }

  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    if (editingClient.value) {
      // Update existing client
      await updateClient(editingClient.value.id, clientFormData.value as UpdateClientData)
      formSuccess.value = 'Client updated successfully!'
    } else {
      // Create new client
      await createClient(clientFormData.value)
      formSuccess.value = 'Client created successfully!'
    }

    // Refresh client list
    await fetchClients()

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
  fetchClients()
})
</script>
