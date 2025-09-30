<template>
  <div class="projects-matrix">
    <div class="header">
      <div class="header-content">
        <h1>Projects Matrix</h1>
        <p>Overview of all projects from enquiries</p>
      </div>
      <div class="actions">
        <button @click="fetchProjects" class="refresh-btn">
          <span>↻</span> Refresh
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-content">
        <div class="search-container">
          <input
            v-model="search"
            type="text"
            placeholder="Search projects..."
            class="search-input"
          />
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.key">
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td :colspan="headers.length" class="loading-cell">
                  Loading projects...
                </td>
              </tr>
              <tr v-else-if="filteredProjects.length === 0">
                <td :colspan="headers.length" class="no-data">
                  No projects found
                </td>
              </tr>
              <tr v-for="item in filteredProjects" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.enquiry?.client?.name || 'N/A' }}</td>
                <td>
                  <span class="status" :class="getStatusClass(item.status)">
                    {{ item.status }}
                  </span>
                </td>
                <td>{{ formatDate(item.start_date) }}</td>
                <td>{{ formatDate(item.end_date) }}</td>
                <td>
                  <router-link 
                    :to="{ name: 'projects-projectoverview', params: { id: item.id } }"
                    class="view-details"
                  >
                    View Details
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

interface Project {
  id: string
  name: string
  status: string
  start_date: string
  end_date: string
  enquiry: {
    client: {
      name: string
      id: string
    }
  }
}

const router = useRouter()
const loading = ref(false)
const search = ref('')
const projects = ref<Project[]>([])
let isMounted = true

// Table headers
const headers = [
  { title: 'Project Name', key: 'name' },
  { title: 'Client', key: 'client_name' },
  { title: 'Status', key: 'status' },
  { title: 'Start Date', key: 'start_date' },
  { title: 'End Date', key: 'end_date' },
  { title: 'Actions', key: 'actions' },
]

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (e) {
    return 'Invalid Date'
  }
}

// Get status class for styling
const getStatusClass = (status: string) => {
  if (!status) return 'default'
  
  const statusMap: Record<string, string> = {
    'in progress': 'in-progress',
    'completed': 'completed',
    'pending': 'pending',
    'on hold': 'on-hold',
    'cancelled': 'cancelled',
  }
  return statusMap[status.toLowerCase()] || 'default'
}

// Fetch projects from the API
const fetchProjects = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    
    // Simulate API call
    const data: Project[] = await new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Project Alpha',
            status: 'In Progress',
            start_date: '2023-10-01',
            end_date: '2023-12-31',
            enquiry: {
              client: {
                name: 'Acme Corp',
                id: '1'
              }
            }
          },
          {
            id: '2',
            name: 'Project Beta',
            status: 'Completed',
            start_date: '2023-09-15',
            end_date: '2023-11-30',
            enquiry: {
              client: {
                name: 'Globex Corp',
                id: '2'
              }
            }
          },
          {
            id: '3',
            name: 'Project Gamma',
            status: 'Pending',
            start_date: '2023-11-01',
            end_date: '2024-01-15',
            enquiry: {
              client: {
                name: 'Stark Industries',
                id: '3'
              }
            }
          },
        ])
      }, 1000)
    })

    if (isMounted) {
      projects.value = data
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    if (isMounted) {
      // Handle error state if needed
      projects.value = []
    }
  } finally {
    if (isMounted) {
      loading.value = false
    }
  }
}

// Filter projects based on search query
const filteredProjects = computed(() => {
  if (!search.value) return projects.value
  
  const searchTerm = search.value.toLowerCase()
  return projects.value.filter(project => 
    project.name.toLowerCase().includes(searchTerm) ||
    (project.enquiry?.client?.name?.toLowerCase() || '').includes(searchTerm) ||
    project.status.toLowerCase().includes(searchTerm)
  )
})

// Fetch projects when component is mounted
onMounted(() => {
  isMounted = true
  fetchProjects()
})

// Clean up
onBeforeUnmount(() => {
  isMounted = false
})
</script>

<style scoped>
.projects-matrix {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 12px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.refresh-btn:hover {
  background-color: #4338ca;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-content {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status.in-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status.completed {
  background-color: #dcfce7;
  color: #166534;
}

.status.pending {
  background-color: #fef9c3;
  color: #854d0e;
}

.status.on-hold {
  background-color: #fee2e2;
  color: #991b1b;
}

.status.cancelled {
  background-color: #f3f4f6;
  color: #6b7280;
  text-decoration: line-through;
}

.view-details {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-details:hover {
  color: #4338ca;
  text-decoration: underline;
}

.loading-cell,
.no-data {
  text-align: center;
  padding: 24px;
  color: #6b7280;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .header h1 {
    color: #f3f4f6;
  }
  
  .header p {
    color: #9ca3af;
  }
  
  .card {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .data-table th,
  .data-table td {
    border-bottom-color: #374151;
  }
  
  .data-table th {
    background-color: #111827;
    color: #9ca3af;
  }
  
  .data-table tbody tr:hover {
    background-color: #1f2937;
  }
  
  .search-input {
    background-color: #1f2937;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  .search-input::placeholder {
    color: #6b7280;
  }
  
  .status.in-progress {
    background-color: #1e3a8a;
    color: #bfdbfe;
  }
  
  .status.completed {
    background-color: #14532d;
    color: #bbf7d0;
  }
  
  .status.pending {
    background-color: #713f12;
    color: #fde68a;
  }
  
  .status.on-hold {
    background-color: #7f1d1d;
    color: #fecaca;
  }
  
  .status.cancelled {
    background-color: #374151;
    color: #9ca3af;
  }
  
  .view-details {
    color: #818cf8;
  }
  
  .view-details:hover {
    color: #a5b4fc;
  }
  
  .loading-cell,
  .no-data {
    color: #9ca3af;
  }
}
</style>
