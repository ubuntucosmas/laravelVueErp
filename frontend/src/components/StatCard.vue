<template>
  <div class="h-full w-full rounded-lg border p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-muted-foreground">{{ title }}</h3>
      <div 
        v-if="iconName" 
        class="rounded-md p-2"
        :class="iconContainerClass"
      >
        <component 
          class="h-4 w-4"
          :class="iconClass"
        />
      </div>
    </div>
    
    <div class="mt-2">
      <div class="text-2xl font-bold">
        {{ value }}
        <span v-if="subtext" class="text-sm font-normal text-muted-foreground">
          {{ subtext }}
        </span>
      </div>
      
      <div 
        v-if="change !== undefined" 
        class="mt-1 flex items-center text-xs"
        :class="change >= 0 ? 'text-green-600' : 'text-red-600'"
      >
        <ArrowUpIcon 
          v-if="change >= 0"
          class="h-3 w-3 mr-1"
        />
        <ArrowDownIcon 
          v-else
          class="h-3 w-3 mr-1"
        />
        {{ Math.abs(change) }}% from last period
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  Package as PackageIcon,
  CheckCircle as CheckCircleIcon,
  Truck as TruckIcon,
  ClipboardList as ClipboardListIcon
} from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtext: {
    type: String,
    default: ''
  },
  change: {
    type: Number,
    default: undefined
  },
  iconName: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => {
      return ['default', 'success', 'info', 'warning', 'danger'].includes(value);
    }
  }
});

const variantClasses = {
  default: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  info: 'bg-blue-100 text-blue-600',
  warning: 'bg-yellow-100 text-yellow-600',
  danger: 'bg-red-100 text-red-600'
};

const iconComponents = {
  'package': PackageIcon,
  'check-circle': CheckCircleIcon,
  'truck': TruckIcon,
  'clipboard-list': ClipboardListIcon
};

const getIconComponent = (name) => {
  return iconComponents[name.toLowerCase()] || null;
};

const iconContainerClass = computed(() => {
  return variantClasses[props.variant] || variantClasses.default;
});

const iconClass = computed(() => ({
  'text-blue-600': props.variant === 'default' || !props.variant,
  'text-green-600': props.variant === 'success',
  'text-blue-600': props.variant === 'info',
  'text-yellow-600': props.variant === 'warning',
  'text-red-600': props.variant === 'danger'
}));
</script>
