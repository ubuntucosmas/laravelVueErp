<template>
  <div class="financial-reports">
    <div class="page-header">
      <h1>Financial Reports</h1>
      <p>Generate and view comprehensive financial reports</p>
    </div>

    <div class="reports-grid">
      <div class="report-card" @click="generateReport('profit-loss')">
        <div class="report-icon">💹</div>
        <h3>Profit & Loss</h3>
        <p>Income statement with revenue and expenses</p>
      </div>

      <div class="report-card" @click="generateReport('balance-sheet')">
        <div class="report-icon">⚖️</div>
        <h3>Balance Sheet</h3>
        <p>Assets, liabilities, and equity overview</p>
      </div>

      <div class="report-card" @click="generateReport('cash-flow')">
        <div class="report-icon">💰</div>
        <h3>Cash Flow</h3>
        <p>Cash inflows and outflows analysis</p>
      </div>

      <div class="report-card" @click="generateReport('budget-variance')">
        <div class="report-icon">📊</div>
        <h3>Budget Variance</h3>
        <p>Compare budgeted vs actual performance</p>
      </div>
    </div>

    <div class="report-filters">
      <div class="filter-group">
        <label>Date Range:</label>
        <select>
          <option>Last Month</option>
          <option>Last Quarter</option>
          <option>Last Year</option>
          <option>Custom</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Format:</label>
        <select>
          <option>PDF</option>
          <option>Excel</option>
          <option>CSV</option>
        </select>
      </div>

      <button class="btn-primary">Generate Report</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const generateReport = (type: string) => {
  console.log('Generating report:', type)
  // Report generation logic will be implemented here
}
</script>

<style scoped>
.financial-reports {
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

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.report-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.report-card h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.25rem;
}

.report-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.report-filters {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.filter-group select {
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
  .report-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }
}
</style>
