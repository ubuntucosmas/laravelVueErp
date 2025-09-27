<template>
  <div v-if="user" :class="avatarClasses" :title="user.name">
    <img
      v-if="user.avatar"
      :src="user.avatar"
      :alt="user.name"
      class="w-full h-full object-cover rounded-full"
    />
    <span v-else class="text-xs font-medium text-white">
      {{ user.name.charAt(0).toUpperCase() }}
    </span>
  </div>
  <div v-else :class="avatarClasses" title="Unassigned">
    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '../types'

interface Props {
  user?: User | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm'
})

const avatarClasses = computed(() => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  return `${sizeClasses[props.size]} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0`
})
</script>
