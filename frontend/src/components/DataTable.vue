<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50">
          <th 
            v-for="column in columns" 
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="column.headerClass"
            @click="handleSort(column.key)"
          >
            <div class="flex items-center cursor-pointer">
              {{ column.header }}
              <span v-if="internalSortBy === column.key" class="ml-1">
                {{ internalSortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="(row, rowIndex) in paginatedData" 
          :key="rowIndex"
          class="hover:bg-gray-50"
        >
          <td 
            v-for="column in columns" 
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            :class="column.cellClass"
          >
            <template v-if="column.cell">
              <component 
                :is="column.cell(row).component" 
                v-bind="column.cell(row).props"
              >
                {{ column.cell(row).text }}
              </component>
            </template>
            <template v-else>
              {{ row[column.key] }}
            </template>
          </td>
        </tr>
        <tr v-if="!paginatedData.length">
          <td :colspan="columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
            No data available
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Pagination -->
    <div v-if="pagination" class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div class="flex-1 flex justify-between sm:hidden">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredData.length) }}</span> of 
            <span class="font-medium">{{ filteredData.length }}</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <!-- Page numbers -->
            <template v-for="page in visiblePages" :key="page">
              <button
                @click="goToPage(page)"
                :class="{
                  'bg-blue-50 border-blue-500 text-blue-600': currentPage === page,
                  'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page
                }"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {{ page }}
              </button>
            </template>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';

export interface Column {
  key: string;
  header: string;
  headerClass?: string;
  cellClass?: string;
  cell?: (row: any) => { component: any; props: any; text: string };
}

const props = withDefaults(defineProps<{
  columns: Column[];
  data: any[];
  pagination?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}>(), {
  pagination: true,
  pageSize: 10,
  sortBy: '',
  sortDirection: 'asc'
});

const emit = defineEmits<{
  (e: 'sort', { sortBy, sortDirection }: { sortBy: string; sortDirection: 'asc' | 'desc' }): void;
  (e: 'page-change', page: number): void;
}>();

// State
const currentPage = ref(1);
const internalSortBy = ref(props.sortBy || (props.columns[0]?.key || ''));
const internalSortDirection = ref<'asc' | 'desc'>(props.sortDirection || 'asc');

// Computed
const pageSize = computed(() => props.pageSize || 10);

const sortedData = computed(() => {
  if (!internalSortBy.value) return [...props.data];
  
  return [...props.data].sort((a, b) => {
    let valueA = a[internalSortBy.value];
    let valueB = b[internalSortBy.value];
    
    if (internalSortBy.value.includes('.')) {
      const keys = internalSortBy.value.split('.');
      valueA = keys.reduce((obj, key) => obj?.[key], a);
      valueB = keys.reduce((obj, key) => obj?.[key], b);
    }
    
    if (valueA === valueB) return 0;
    
    const direction = internalSortDirection.value === 'asc' ? 1 : -1;
    return valueA > valueB ? direction : -direction;
  });
});

const filteredData = computed(() => sortedData.value);

const totalPages = computed(() => {
  return props.pagination ? Math.ceil(filteredData.value.length / pageSize.value) : 1;
});

const paginatedData = computed(() => {
  if (!props.pagination) return filteredData.value;
  
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

const visiblePages = computed(() => {
  const maxVisiblePages = 5;
  const pages: number[] = [];
  
  if (totalPages.value <= maxVisiblePages) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;
  
  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const handleSort = (key: string) => {
  if (internalSortBy.value === key) {
    internalSortDirection.value = internalSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    internalSortBy.value = key;
    internalSortDirection.value = 'asc';
  }
  
  emit('sort', { 
    sortBy: internalSortBy.value, 
    sortDirection: internalSortDirection.value 
  });
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emitPageChange();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    emitPageChange();
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    emitPageChange();
  }
};

const emitPageChange = () => {
  emit('page-change', currentPage.value);
};

// Watchers
watch(() => props.sortBy, (newVal) => {
  if (newVal) internalSortBy.value = newVal;
});

watch(() => props.sortDirection, (newVal) => {
  if (newVal) internalSortDirection.value = newVal;
});

// Reset to first page when data changes
watch(() => props.data, () => {
  currentPage.value = 1;
});

// Emit page change event
watch(currentPage, (newPage) => {
  emit('page-change', newPage);
});

// Initialize
if (props.sortBy) {
  internalSortBy.value = props.sortBy;
}
if (props.sortDirection) {
  internalSortDirection.value = props.sortDirection;
}
</script>
