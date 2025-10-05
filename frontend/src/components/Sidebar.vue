<template>
  <aside :class="[
    'border-r shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden',
    collapsed ? 'w-16' : 'w-64'
  ]" style="transition: width 0.3s ease-in-out;">
    <div :class="[
      'mb-8 transition-all duration-300',
      collapsed ? 'p-4' : 'p-6'
    ]">
      <h2 :class="[
        'font-bold mb-2 text-gray-900 dark:text-white',
        collapsed ? 'text-lg opacity-0' : 'text-2xl opacity-100'
      ]" style="transition: opacity 0.3s ease-in-out 0.1s;">{{ title }}</h2>
      <p :class="[
        'text-sm text-gray-600 dark:text-gray-400',
        collapsed ? 'opacity-0' : 'opacity-100'
      ]" style="transition: opacity 0.3s ease-in-out 0.2s;">{{ subtitle }}</p>
    </div>
    <nav class="space-y-2">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-primary',
          collapsed ? 'justify-center' : 'space-x-3'
        ]"
      >
        <span class="text-lg">{{ item.icon }}</span>
        <span :class="[
          'font-medium',
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        ]" style="transition: opacity 0.3s ease-in-out 0.1s, width 0.3s ease-in-out;">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
interface NavigationItem {
  path: string
  label: string
  icon: string
}

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'ERP System'
  },
  subtitle: {
    type: String,
    default: 'Management Dashboard'
  },
  navigationItems: {
    type: Array as () => NavigationItem[],
    default: () => [
      { path: '/hr', label: 'HR', icon: '👥' },
      { path: '/finance', label: 'Finance', icon: '💰' }
    ]
  }
})

const emit = defineEmits(['update:collapsed'])
</script>
