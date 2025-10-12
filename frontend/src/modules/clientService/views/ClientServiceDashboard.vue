<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Client Service & Marketing Dashboard
      </h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 min-h-[120px] flex flex-col justify-between">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalClients }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Clients</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeClients.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">New Enquiries</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ newEnquiries.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enquiries</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalEnquiries }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ projectsStore.activeProjects.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Enquiries -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Enquiries</h3>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
        <div v-else-if="recentEnquiries.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
          No enquiries found
        </div>
        <div v-else class="space-y-4">
          <div v-for="enquiry in recentEnquiries" :key="enquiry.id"
               class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ enquiry.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ enquiry.client?.full_name || enquiry.client?.FullName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {{ new Date(enquiry.created_at).toLocaleDateString() }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(enquiry.status)
              ]">
                {{ getStatusLabel(enquiry.status) }}
              </span>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getPriorityColor(enquiry.priority)
              ]">
                {{ enquiry.priority }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useClients } from '../composables/useClients'
import { useEnquiries } from '../composables/useEnquiries'
import { useProjects } from '../composables/useProjects'
import { useProjectsStore } from '@/stores/projects'

const { totalClients, activeClients, fetchClients } = useClients()
const { totalEnquiries, newEnquiries, enquiries, loading, fetchEnquiries } = useEnquiries()
const { fetchProjects } = useProjects()
const projectsStore = useProjectsStore()

const recentEnquiries = computed(() => enquiries.value.slice(0, 5))

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'client_registered': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'enquiry_logged': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'site_survey_completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'design_completed': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'design_approved': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'materials_specified': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'budget_created': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'quote_prepared': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    'quote_approved': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    'converted_to_project': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'client_registered': 'Client Registered',
    'enquiry_logged': 'Enquiry Logged',
    'site_survey_completed': 'Site Survey Done',
    'design_completed': 'Design Completed',
    'design_approved': 'Design Approved',
    'materials_specified': 'Materials Specified',
    'budget_created': 'Budget Created',
    'quote_prepared': 'Quote Prepared',
    'quote_approved': 'Quote Approved',
    'converted_to_project': 'Converted to Project',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

onMounted(async () => {
   await fetchClients()
   await fetchEnquiries()
   await fetchProjects()
})
</script>
