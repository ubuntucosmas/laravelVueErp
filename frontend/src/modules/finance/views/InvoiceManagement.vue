<template>
  <div class="invoice-management">
    <div class="page-header">
      <h1>Invoice Management</h1>
      <p>Create, manage, and track client invoices and payments</p>
    </div>

    <div class="action-bar">
      <router-link to="/finance/invoicing/create" class="btn-primary">
        <span class="btn-icon">➕</span>
        Create Invoice
      </router-link>
    </div>

    <div class="invoices-table">
      <table>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>INV-2024-001</td>
            <td>Client A</td>
            <td>KES 250,000</td>
            <td><span class="status-paid">Paid</span></td>
            <td>2024-09-15</td>
            <td><button class="btn-secondary">View</button></td>
          </tr>
          <tr>
            <td>INV-2024-002</td>
            <td>Client B</td>
            <td>KES 180,000</td>
            <td><span class="status-pending">Pending</span></td>
            <td>2024-09-30</td>
            <td><button class="btn-secondary">View</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Invoice management logic will be implemented here
</script>

<style scoped>
.invoice-management {
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

.action-bar {
  margin: 2rem 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
}

.btn-icon {
  font-size: 1.1rem;
}

.invoices-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.status-paid {
  background: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}
</style>
