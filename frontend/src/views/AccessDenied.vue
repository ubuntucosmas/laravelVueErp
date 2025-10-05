<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <svg class="h-12 w-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Access Denied
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          You don't have permission to access this resource.
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Why am I seeing this?
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This page is restricted to authorized users only. You may not have the required permissions or department access to view this content.
            </p>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Required Access:
            </h4>
            <ul class="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Super Admin privileges</li>
              <li>• Projects department membership</li>
              <li>• Project-specific roles (Project Officer, Project Lead, Project Manager)</li>
            </ul>
          </div>

          <div class="flex space-x-3">
            <button
              @click="goToAppropriateRoute"
              class="flex-1 bg-primary hover:bg-primary-light text-white py-2 px-4 rounded-md text-sm font-medium text-center transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              @click="goBack"
              class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRouteGuard } from '@/composables/useRouteGuard'

const router = useRouter()
const { redirectToAppropriateRoute } = useRouteGuard()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    redirectToAppropriateRoute()
  }
}

const goToAppropriateRoute = () => {
  redirectToAppropriateRoute()
}
</script>
