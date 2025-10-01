import { defineComponent, h } from 'vue';
import { cn } from '@/lib/utils';

export const Card = defineComponent({
  name: 'Card',
  setup(_, { slots }) {
    return () => h('div', { 
      class: 'rounded-lg border bg-card text-card-foreground shadow-sm' 
    }, slots.default?.());
  },
});

export const CardHeader = defineComponent({
  name: 'CardHeader',
  setup(_, { slots }) {
    return () => h('div', { 
      class: 'flex flex-col space-y-1.5 p-6' 
    }, slots.default?.());
  },
});

export const CardTitle = defineComponent({
  name: 'CardTitle',
  props: {
    class: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () => h('h3', { 
      class: cn('text-2xl font-semibold leading-none tracking-tight', props.class) 
    }, slots.default?.());
  },
});

export const CardContent = defineComponent({
  name: 'CardContent',
  props: {
    class: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () => h('div', { 
      class: cn('p-6 pt-0', props.class) 
    }, slots.default?.());
  },
});
