<template>
  <div class="financial-analytics">
    <div class="page-header">
      <h1>Financial Analytics</h1>
      <p>Advanced analytics and forecasting for financial insights</p>
    </div>

    <div class="analytics-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="analytics-content">
      <!-- Financial Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="tab-content">
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Revenue Trends</h3>
            <div class="chart-placeholder">
              <p>Interactive revenue chart</p>
            </div>
          </div>

          <div class="chart-card">
            <h3>Cost Analysis</h3>
            <div class="chart-placeholder">
              <p>Cost breakdown visualization</p>
            </div>
          </div>

          <div class="chart-card">
            <h3>Profit Margins</h3>
            <div class="chart-placeholder">
              <p>Margin analysis chart</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Analysis Tab -->
      <div v-if="activeTab === 'trends'" class="tab-content">
        <div class="trend-analysis">
          <h3>Historical Trends</h3>
          <div class="chart-placeholder large">
            <p>Trend analysis visualization</p>
          </div>
        </div>
      </div>

      <!-- Forecasting Tab -->
      <div v-if="activeTab === 'forecasting'" class="tab-content">
        <div class="forecasting">
          <h3>Financial Forecasting</h3>
          <div class="forecast-controls">
            <div class="control-group">
              <label>Forecast Period:</label>
              <select>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>

            <div class="control-group">
              <label>Confidence Level:</label>
              <select>
                <option>80%</option>
                <option>90%</option>
                <option>95%</option>
              </select>
            </div>

            <button class="btn-primary">Generate Forecast</button>
          </div>

          <div class="chart-placeholder large">
            <p>Forecast visualization</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('analytics')

const tabs = [
  { id: 'analytics', label: 'Financial Analytics' },
  { id: 'trends', label: 'Trend Analysis' },
  { id: 'forecasting', label: 'Forecasting' }
]
</script>

<style scoped>
.financial-analytics {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header h1 {
  color: #1f2937;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #6b7280;
}

.analytics-tabs {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.analytics-content {
  margin-top: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
}

.chart-placeholder.large {
  height: 400px;
}

.forecast-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.control-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

@media (max-width: 768px) {
  .analytics-tabs {
    flex-direction: column;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .forecast-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
