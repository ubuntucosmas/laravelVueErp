<template>
  <div class="h-full w-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      datasets: []
    })
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right' as const,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
      },
      cutout: '70%',
    })
  },
  height: {
    type: Number,
    default: 300
  }
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const renderChart = () => {
  if (!chartRef.value) return;
  
  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: props.data,
    options: {
      ...props.options,
      responsive: true,
      maintainAspectRatio: false,
    }
  });
};

// Watch for changes in data
watch(() => props.data, () => {
  renderChart();
}, { deep: true });

// Watch for changes in options
watch(() => props.options, () => {
  renderChart();
}, { deep: true });

// Lifecycle hooks
onMounted(() => {
  renderChart();
  window.addEventListener('resize', renderChart);
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
  window.removeEventListener('resize', renderChart);
});
</script>
