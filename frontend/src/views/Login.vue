<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-blue-50 dark:bg-gray-900"
  >
    <div class="w-full max-w-md">
      <div
        class="rounded-xl p-8 shadow-lg border transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <div class="text-center mb-8">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary"
          >
            <span class="text-white text-2xl">🏢</span>
          </div>
          <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h2>
          <p class="text-base text-gray-600 dark:text-gray-300">Sign in to your ERP account</p>
        </div>
        <form @submit.prevent="login" class="space-y-6">
          <div>
            <label
              :class="[
                'block text-sm font-medium mb-2',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
              ]"
              >Email Address</label
            >
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :class="[
                'w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
              ]"
            />
          </div>
          <div>
            <label
              :class="[
                'block text-sm font-medium mb-2',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
              ]"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              :class="[
                'w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
              ]"
            />
          </div>
          <div class="flex items-center">
            <input
              id="remember"
              v-model="remember"
              type="checkbox"
              :class="[
                'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
                theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
              ]"
            />
            <label
              for="remember"
              :class="['ml-2 block text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']"
              >Remember me</label
            >
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              theme === 'dark'
                ? 'bg-primary hover:bg-primary-light text-white focus:ring-offset-gray-800'
                : 'bg-primary hover:bg-primary-light text-white',
              isLoading ? 'opacity-75 cursor-not-allowed' : '',
            ]"
          >
            <span
              v-if="isLoading"
              class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></span>
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        <div
          v-if="errorMessage"
          class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>
        <div class="mt-6 text-center">
          <p :class="['text-base', theme === 'dark' ? 'text-gray-400' : 'text-gray-600']">
            Don't have an account?
            <RouterLink
              to="/register"
              :class="[
                'font-medium transition-colors',
                theme === 'dark'
                  ? 'text-primary hover:text-primary-light'
                  : 'text-primary hover:text-primary-light',
              ]"
              >Create one</RouterLink
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'

const { theme } = useTheme()
const { login: authLogin } = useAuth()
const email = ref('')
const password = ref('')
const remember = ref(false)
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const success = await authLogin(email.value, password.value)
    if (success) {
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Login failed: Invalid email or password'
    }
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

</script>
