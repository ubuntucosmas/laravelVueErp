<template>
  <!-- Add Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@200;300;400;500&display=swap" rel="stylesheet">
  <div class="min-h-screen mt-2 mb-4 flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 transition-all duration-300 font-sans">
    <!-- Left Panel - Only visible on large screens -->
    <div class="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-green-500 via-blue-500 to-gray-700 p-12 text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay"></div>
      <div class="absolute -left-20 bottom-0 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay"></div>
      <div class="absolute right-1/2 top-1/3 w-32 h-32 bg-white/15 rounded-full mix-blend-overlay"></div>

      <!-- Company Name at Top -->
      <div class="text-center mb-8">
        <div class="text-5xl font-poppins font-thin tracking-tight mb-2 text-white/200">Woodnork Green</div>
        <div class="relative inline-block">
          <span class="text-sm font-arial font-medium tracking-widest text-black/100 uppercase mt-1 relative z-10">Branding and Events Excellence</span>
          <div class="h-[2px] bg-gradient-to-r from-green-400 via-blue-400 to-transparent absolute -bottom-1 left-0 right-0"></div>
        </div>
      </div>

      <!-- Centered Content -->
      <div class="flex-1 flex flex-col items-center justify-center text-center -mt-12">
        <h1 class="text-4xl font-poppins font-light leading-tight mb-6 tracking-normal text-white">Welcome to Our Platform</h1>
        <p class="text-white/95 text-lg max-w-md font-light leading-relaxed tracking-wide">"Creating unforgettable experiences through innovative events and powerful branding that tells your unique story."</p>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <div class="flex items-center justify-center space-x-4 mb-6">
          <div class="w-12 h-1 bg-green-400 rounded-full"></div>
          <div class="w-8 h-1 bg-blue-400 rounded-full opacity-50"></div>
          <div class="w-8 h-1 bg-gray-300 rounded-full opacity-50"></div>
        </div>
        <p class="text-white/90 text-sm">© 2025 Woodnork Green. All rights reserved.</p>
      </div>
    </div>

    <!-- Right Panel - Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Logo for mobile -->
        <div class="lg:hidden text-center mb-8">
          <div class="text-3xl font-thin text-gray-800 dark:text-white">Woodnork Green</div>
        </div>

        <div class="text-center mb-8">
          <p class="text-gray-600 dark:text-gray-300">Sign in to your account</p>
        </div>

        <form @submit.prevent="login" class="space-y-6 animate-fade-in">
          <div>
            <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
              Email Address
            </label>
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
            <label :class="['block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700']">
              Password
            </label>
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

          <div class="flex items-center justify-between">
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
              >
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
              theme === 'dark'
                ? 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-green-400 focus:ring-offset-gray-800'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-green-400',
              isLoading ? 'opacity-75 cursor-not-allowed' : '',
            ]"
          >
            <span v-if="isLoading" class="inline-flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div
          v-if="errorMessage"
          class="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'
import { useRouteGuard } from '@/composables/useRouteGuard'

const { theme } = useTheme()
const { login: authLogin } = useAuth()
const { redirectToAppropriateRoute } = useRouteGuard()
const email = ref('')
const password = ref('')
const remember = ref(false)
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
      redirectToAppropriateRoute()
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}

/* Scoped styles */
/* Smooth transitions for theme changes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for the form container */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-track {
  background: #2d3748;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

/* Animation for the login form */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
