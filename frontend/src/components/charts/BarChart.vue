<template>
  <div class="h-full w-full">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import type { ChartData, ChartOptions, ChartTypeRegistry } from 'chart.js';

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
          position: 'top' as const,
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    })
  }
});

// Register Chart.js components
Chart.register(...registerables);

const chartData = ref<ChartData>({
  labels: [],
  datasets: []
});

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart<keyof ChartTypeRegistry> | null = null;

const renderChart = (): void => {
  if (!chartRef.value) return;
  
  if (chart) {
    chart.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  try {
    // Ensure data has the required structure
    const chartData: ChartData = {
      labels: props.data?.labels || [],
      datasets: Array.isArray(props.data?.datasets) ? props.data.datasets : []
    };

    // Ensure options has the correct type
    const chartOptions: ChartOptions = {
      ...props.options,
      responsive: true,
      maintainAspectRatio: false,
    };

    chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  } catch (error) {
    console.error('Error rendering chart:', error);
  }
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
