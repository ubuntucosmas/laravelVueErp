<template>
  <div class="cost-analysis">
    <div class="page-header">
      <h1>Cost Analysis</h1>
      <p>Analyze and control project costs with detailed breakdowns</p>
    </div>

    <div class="analysis-grid">
      <div class="analysis-card">
        <h3>Cost Breakdown by Category</h3>
        <div class="chart-placeholder">
          <p>Cost breakdown chart</p>
        </div>
      </div>

      <div class="analysis-card">
        <h3>Budget vs Actual Costs</h3>
        <div class="chart-placeholder">
          <p>Budget vs actual comparison</p>
        </div>
      </div>
    </div>

    <div class="cost-table">
      <h3>Detailed Cost Items</h3>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Category</th>
            <th>Budgeted</th>
            <th>Actual</th>
            <th>Variance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Project Alpha</td>
            <td>Labor</td>
            <td>KES 200,000</td>
            <td>KES 180,000</td>
            <td class="positive">+KES 20,000</td>
          </tr>
          <tr>
            <td>Project Beta</td>
            <td>Materials</td>
            <td>KES 150,000</td>
            <td>KES 165,000</td>
            <td class="negative">-KES 15,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Cost analysis logic will be implemented here
</script>

<style scoped>
.cost-analysis {
  padding: 2rem;
  max-width: 1200px;
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

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.analysis-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.analysis-card h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
}

.cost-table {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cost-table h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  color: #374151;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}
</style>
