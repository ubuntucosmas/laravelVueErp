<template>
  <header class="border-b px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
    <div class="flex items-center space-x-4">
      <button @click="$emit('toggle-sidebar')" class="p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-blue-100 dark:hover:bg-gray-700">
        <span class="text-lg">☰</span>
      </button>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-primary to-primary-light">
        <span class="text-white font-bold text-sm">E</span>
      </div>
      <div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Welcome, {{ user?.name || 'ERP User' }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ user?.email || 'Administrator' }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <button @click="toggleTheme" class="p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-warning hover:bg-blue-100 dark:hover:bg-gray-700" :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <span class="text-lg">{{ theme === 'dark' ? '☀️' : '🌙' }}</span>
      </button>
      <button class="p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-blue-100 dark:hover:bg-gray-700">
        <span class="text-lg">🔔</span>
      </button>
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-primary-light">
          <span class="text-white font-bold text-sm">U</span>
        </div>
        <div v-if="isLoggedIn" class="text-right">
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user?.name || 'User' }}</p>
          <button @click="logout" class="text-sm transition-colors text-gray-600 dark:text-gray-400 hover:text-error">Logout</button>
        </div>
        <div v-else class="flex space-x-3">
          <RouterLink class="font-medium transition-colors text-primary hover:text-primary-light" to="/login">Login</RouterLink>
          <RouterLink class="font-medium transition-colors text-primary hover:text-primary-light" to="/register">Register</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'

const { isLoggedIn, user, logout } = useAuth()
const { theme, toggleTheme } = useTheme()
</script>