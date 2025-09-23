<template>
  <aside :class="[
    'sticky top-0 border-r shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden',
    collapsed ? 'w-16' : 'w-64'
  ]" style="transition: width 0.3s ease-in-out;">
    <div :class="[
      'mb-8 transition-all duration-300',
      collapsed ? 'p-4' : 'p-6'
    ]">
      <h2 :class="[
        'font-bold mb-2 text-gray-900 dark:text-white',
        collapsed ? 'text-lg opacity-0' : 'text-2xl opacity-100'
      ]" style="transition: opacity 0.3s ease-in-out 0.1s;">
        {{ getSidebarTitle() }}
      </h2>
      <p :class="[
        'text-sm text-gray-600 dark:text-gray-400',
        collapsed ? 'opacity-0' : 'opacity-100'
      ]" style="transition: opacity 0.3s ease-in-out 0.2s;">
        {{ getSidebarSubtitle() }}
      </p>
    </div>

    <nav class="space-y-2 px-3">
      <!-- Navigation Items -->
      <div v-for="item in navigationItems" :key="item.path">
        <RouterLink
          :to="item.path"
          :class="[
            'flex items-center rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-primary',
            collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3 space-x-3',
            $route.path === item.path ? 'bg-primary text-white' : ''
          ]"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span :class="[
            'font-medium',
            collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          ]" style="transition: opacity 0.3s ease-in-out 0.1s, width 0.3s ease-in-out;">
            {{ item.label }}
          </span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouteGuard } from '@/composables/useRouteGuard'

interface NavigationItem {
  path: string
  label: string
  icon: string
}

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:collapsed'])

const { getAllowedRoutes, getPanelTitle, getPanelSubtitle } = useRouteGuard()

const navigationItems = computed((): NavigationItem[] => {
  const routes = getAllowedRoutes()
  return routes.map(route => ({
    path: route.path,
    label: route.label,
    icon: route.icon
  }))
})

const getSidebarTitle = (): string => {
  return getPanelTitle()
}

const getSidebarSubtitle = (): string => {
  return getPanelSubtitle()
}
</script>
