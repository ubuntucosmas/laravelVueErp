<template>
  <div class="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-blue-50 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <div class="rounded-xl p-8 shadow-lg border transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div class="text-center mb-8">
          <div :class="[
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
            theme === 'dark' ? 'bg-primary' : 'bg-primary'
          ]">
            <span class="text-white text-2xl">👔</span>
          </div>
          <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Create Account</h2>
          <p class="text-base text-gray-600 dark:text-gray-300">Join our ERP system</p>
        </div>
        <form @submit.prevent="register" class="space-y-6">
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            ]">Full Name</label>
            <input
              v-model="name"
              type="text"
              placeholder="Enter your full name"
              :class="[
                'w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              ]"
            />
          </div>
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            ]">Email Address</label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :class="[
                'w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              ]"
            />
          </div>
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            ]">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Create a password"
              :class="[
                'w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              ]"
            />
          </div>
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            ]">Confirm Password</label>
            <input
              v-model="passwordConfirmation"
              type="password"
              placeholder="Confirm your password"
              :class="[
                'w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              ]"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              theme === 'dark'
                ? 'bg-primary hover:bg-primary-light text-white focus:ring-offset-gray-800'
                : 'bg-primary hover:bg-primary-light text-white',
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="isLoading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
          {{ successMessage }}
        </div>
        <div class="mt-6 text-center">
          <p :class="[
            'text-base',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          ]">Already have an account? <RouterLink to="/login" :class="[
            'font-medium transition-colors',
            theme === 'dark'
              ? 'text-primary hover:text-primary-light'
              : 'text-primary hover:text-primary-light'
          ]">Sign in</RouterLink></p>
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
const { register: authRegister } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const register = async () => {
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authRegister(name.value, email.value, password.value, passwordConfirmation.value)
    successMessage.value = 'Account created successfully! Redirecting...'
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    console.error('Registration failed:', error)
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>