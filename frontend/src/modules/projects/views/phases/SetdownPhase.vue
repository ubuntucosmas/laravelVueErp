<template>
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-3xl font-medium">Project Set Down</h2>
          <div class="text-sm text-gray-500">
            Manage dismantling and removal of temporary structures
          </div>
        </div>
        <v-btn color="primary" @click="openNewTaskDialog">
          <v-icon start>mdi-plus</v-icon>
          Add Task
        </v-btn>
      </div>

      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3" v-for="(stat, i) in stats" :key="i">
          <v-card :color="stat.color" theme="dark" class="h-100">
            <v-card-text class="d-flex align-center">
              <v-avatar :color="stat.color" size="56" class="me-3">
                <v-icon size="32">{{ stat.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 text-uppercase">{{ stat.title }}</div>
                <div class="text-h6 font-weight-bold">{{ stat.value }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-6">
            <v-card-title>Set Down Tasks</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="taskHeaders"
                :items="tasks"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.raw.status)" size="small">
                    {{ item.raw.status }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" @click="editTask(item.raw)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Team Members</v-card-title>
            <v-card-text>
              <v-list lines="two">
                <v-list-item
                  v-for="member in teamMembers"
                  :key="member.id"
                  :title="member.name"
                  :subtitle="member.role"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-bottom-navigation class="mt-8" color="primary">
        <v-btn @click="$emit('navigate', 'handover')">
          <v-icon>mdi-arrow-left</v-icon>
          Previous: Handover
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="completeSetDown">
          <v-icon start>mdi-check</v-icon>
          Complete Set Down
        </v-btn>
      </v-bottom-navigation>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const projectId = route.params.id

  // Data
  const tasks = ref([
    {
      id: 1,
      name: 'Remove temporary fencing',
      status: 'completed',
      assignedTo: 'John Doe',
      dueDate: '2023-11-15'
    },
    {
      id: 2,
      name: 'Dismantle site office',
      status: 'in_progress',
      assignedTo: 'Jane Smith',
      dueDate: '2023-11-20'
    },
    {
      id: 3,
      name: 'Remove storage containers',
      status: 'pending',
      assignedTo: 'Mike Johnson',
      dueDate: '2023-11-25'
    }
  ])

  const teamMembers = ref([
    { id: 1, name: 'John Doe', role: 'Site Supervisor' },
    { id: 2, name: 'Jane Smith', role: 'Site Manager' },
    { id: 3, name: 'Mike Johnson', role: 'Laborer' }
  ])

  const stats = ref([
    {
      title: 'Tasks',
      value: `${tasks.value.length}`,
      icon: 'mdi-format-list-checks',
      color: 'primary'
    },
    {
      title: 'Completed',
      value: `${tasks.value.filter(t => t.status === 'completed').length}`,
      icon: 'mdi-check-circle',
      color: 'success'
    },
    {
      title: 'In Progress',
      value: `${tasks.value.filter(t => t.status === 'in_progress').length}`,
      icon: 'mdi-progress-clock',
      color: 'warning'
    },
    {
      title: 'Pending',
      value: `${tasks.value.filter(t => t.status === 'pending').length}`,
      icon: 'mdi-alert-circle',
      color: 'error'
    }
  ])

  const taskHeaders = [
    { title: 'Task', key: 'name' },
    { title: 'Status', key: 'status' },
    { title: 'Assigned To', key: 'assignedTo' },
    { title: 'Due Date', key: 'dueDate' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]

  // Methods
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: 'success',
      in_progress: 'warning',
      pending: 'error'
    }
    return statusMap[status] || 'grey'
  }

  const openNewTaskDialog = () => {
    // Implementation for opening task dialog
    console.log('Opening new task dialog')
  }

  const editTask = (task: any) => {
    // Implementation for editing task
    console.log('Editing task:', task)
  }

  const completeSetDown = () => {
    // Implementation for completing set down
    console.log('Completing set down')
  }

  // Lifecycle hooks
  onMounted(() => {
    console.log('SetdownPhase mounted for project:', projectId)
  })
</script>