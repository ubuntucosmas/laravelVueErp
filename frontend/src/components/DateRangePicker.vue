<template>
  <div class="flex items-center space-x-2">
    <div class="relative">
      <input
        type="date"
        :value="formatForInput(modelValue.from)"
        @input="handleFromDate($event.target.value)"
        class="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
    <span class="text-gray-500">to</span>
    <div class="relative">
      <input
        type="date"
        :value="formatForInput(modelValue.to)"
        @input="handleToDate($event.target.value)"
        :min="formatForInput(modelValue.from)"
        class="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

const props = defineProps<{
  modelValue: DateRange;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange): void;
  (e: 'change', value: DateRange): void;
}>();

const formatForInput = (date: Date | null): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const handleFromDate = (value: string) => {
  const newFrom = value ? new Date(value) : null;
  const newTo = props.modelValue.to && newFrom && newFrom > props.modelValue.to 
    ? newFrom 
    : props.modelValue.to;
    
  const newRange = {
    from: newFrom,
    to: newTo
  };
  
  emit('update:modelValue', newRange);
  emit('change', newRange);
};

const handleToDate = (value: string) => {
  const newTo = value ? new Date(value) : null;
  const newRange = {
    from: props.modelValue.from,
    to: newTo
  };
  
  emit('update:modelValue', newRange);
  emit('change', newRange);
};
</script>
