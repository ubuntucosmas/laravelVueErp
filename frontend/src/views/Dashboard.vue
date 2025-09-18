<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="rounded-xl p-6 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">ERP Dashboard</h1>
      <p class="text-base text-gray-600 dark:text-gray-300">Comprehensive overview of all ERP modules and key performance indicators</p>
      <div v-if="user" class="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Logged in as:</h2>
        <p class="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {{ user.name }}</p>
        <p class="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {{ user.email }}</p>
        <p v-if="user.role" class="text-gray-700 dark:text-gray-300"><strong>Role:</strong> {{ user.role }}</p>
      </div>
    </div>

    <!-- Key Metrics Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500">
            <span class="text-xl text-white">💰</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+12%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Total Revenue</h3>
        <p :class="[
          'text-3xl font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">$2.4M</p>
        <p :class="[
          'text-sm mt-1',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        ]">This month</p>
      </div>

      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500">
            <span class="text-xl text-white">📈</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+8%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Profit Margin</h3>
        <p :class="[
          'text-3xl font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">24.5%</p>
        <p :class="[
          'text-sm mt-1',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        ]">Operating margin</p>
      </div>

      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500">
            <span class="text-xl text-white">👥</span>
          </div>
          <span class="text-blue-500 text-sm font-medium">+5%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Active Employees</h3>
        <p :class="[
          'text-3xl font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">1,247</p>
        <p :class="[
          'text-sm mt-1',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        ]">Across all departments</p>
      </div>

      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500">
            <span class="text-xl text-white">📋</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+15%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Active Projects</h3>
        <p :class="[
          'text-3xl font-bold',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">67</p>
        <p :class="[
          'text-sm mt-1',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        ]">In progress</p>
      </div>
    </div>

    <!-- ERP Modules Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Project Management Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-teal-600">
            <span class="text-xl text-white">📊</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+10%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Project Management</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Active Projects</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">45</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">On-time Delivery</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">87%</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Budget Adherence</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">92%</span>
          </div>
        </div>
      </div>

      <!-- Finance Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-600">
            <span class="text-xl text-white">💰</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+7%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Finance</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Cash Flow</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">$1.2M</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Outstanding Invoices</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">23</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Budget Utilization</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">78%</span>
          </div>
        </div>
      </div>

      <!-- HR Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-600">
            <span class="text-xl text-white">👥</span>
          </div>
          <span class="text-blue-500 text-sm font-medium">+3%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Human Resources</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Open Positions</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">12</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Training Programs</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">8</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Employee Satisfaction</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">4.2/5</span>
          </div>
        </div>
      </div>

      <!-- Production Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-red-600">
            <span class="text-xl text-white">🏭</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+11%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Production</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Units Produced</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">15,420</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Quality Rate</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">98.5%</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Efficiency</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">92%</span>
          </div>
        </div>
      </div>

      <!-- Logistics Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-yellow-600">
            <span class="text-xl text-white">🚚</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+6%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Logistics</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">On-time Delivery</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">94.2%</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Active Shipments</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">156</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Warehouse Capacity</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">78%</span>
          </div>
        </div>
      </div>

      <!-- Procurement Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-600">
            <span class="text-xl text-white">🛒</span>
          </div>
          <span class="text-red-500 text-sm font-medium">-2%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Procurement</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Pending Orders</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">34</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Supplier Performance</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">4.1/5</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Cost Savings</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">$45K</span>
          </div>
        </div>
      </div>

      <!-- Design Module -->
      <div :class="[
        'rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-200',
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 hover:shadow-lg'
          : 'bg-white border-gray-200'
      ]">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-pink-600">
            <span class="text-xl text-white">🎨</span>
          </div>
          <span class="text-green-500 text-sm font-medium">+9%</span>
        </div>
        <h3 :class="[
          'text-lg font-semibold mb-2',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]">Design</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Active Projects</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">23</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Client Approvals</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">89%</span>
          </div>
          <div class="flex justify-between">
            <span :class="['text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">Avg. Completion Time</span>
            <span :class="['font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">14 days</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div :class="[
      'rounded-xl p-6 shadow-sm border',
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    ]">
      <h2 :class="[
        'text-xl font-semibold mb-4',
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      ]">Recent Activity</h2>
      <div class="space-y-3">
        <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span class="text-sm text-white">💰</span>
          </div>
          <div class="flex-1">
            <p :class="['text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">New invoice generated</p>
            <p :class="['text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">2 hours ago</p>
          </div>
        </div>
        <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span class="text-sm text-white">👥</span>
          </div>
          <div class="flex-1">
            <p :class="['text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">Employee onboarding completed</p>
            <p :class="['text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">4 hours ago</p>
          </div>
        </div>
        <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span class="text-sm text-white">📋</span>
          </div>
          <div class="flex-1">
            <p :class="['text-sm font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900']">Project milestone achieved</p>
            <p :class="['text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">6 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const { theme } = useTheme()
const { user, fetchUser, isLoggedIn } = useAuth()
const router = useRouter()

onMounted(async () => {
  await fetchUser()
  if (!isLoggedIn.value) {
    router.push('/login')
  }
})

watch(isLoggedIn, (newVal) => {
  if (!newVal) {
    router.push('/login')
  }
})
</script>