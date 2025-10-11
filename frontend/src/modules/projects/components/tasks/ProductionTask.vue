<template>
  <div class="production-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-sans leading-normal tracking-normal antialiased">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap font-semibold text-base leading-tight tracking-wide',
          activeTab === tab.id
            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm shadow-lg border border-gray-300'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md'
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h4 class="text-md font-medium mb-2 text-gray-900 dark:text-white">Overall Production Progress</h4>
      <div class="flex justify-between items-center mb-2">
        <span class="text-lg font-semibold text-blue-600">{{ overallProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
        <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: overallProgress + '%' }"></div>
      </div>
    </div>

    <!-- Milestones Tab -->
    <div v-if="activeTab === 'milestones'">
      <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Production Milestones</h4>
      <div class="space-y-3">
        <div v-for="milestone in milestones" :key="milestone.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <input
                :id="`milestone-${milestone.id}`"
                v-model="milestone.completed"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label :for="`milestone-${milestone.id}`" class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ milestone.title }}
              </label>
            </div>
            <span :class="milestone.completed ? 'text-green-600' : 'text-gray-500'" class="text-sm">
              {{ milestone.progress }}%
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ milestone.description }}</p>
          <div class="flex items-center space-x-4">
            <input
              v-model="milestone.progress"
              type="range"
              min="0"
              max="100"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
            <span class="text-xs text-gray-500">{{ milestone.due_date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quality Tab -->
    <div v-if="activeTab === 'quality'">
      <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Quality Control Checkpoints</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="checkpoint in qualityCheckpoints" :key="checkpoint.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ checkpoint.title }}</span>
            <span :class="getStatusClass(checkpoint.status)" class="px-2 py-1 text-xs rounded-full">
              {{ checkpoint.status }}
            </span>
          </div>
          <select
            v-model="checkpoint.status"
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Resources Tab -->
    <div v-if="activeTab === 'resources'">
      <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Resource Allocation</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Personnel</label>
          <div class="space-y-2">
            <div v-for="person in assignedPersonnel" :key="person.id" class="flex items-center">
              <input
                :id="`person-${person.id}`"
                v-model="person.assigned"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="`person-${person.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                {{ person.name }} - {{ person.role }}
              </label>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Equipment Status</label>
          <div class="space-y-2">
            <div v-for="equipment in equipmentList" :key="equipment.id" class="flex items-center justify-between">
              <span class="text-sm text-gray-900 dark:text-white">{{ equipment.name }}</span>
              <select
                v-model="equipment.status"
                class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issues Tab -->
    <div v-if="activeTab === 'issues'">
      <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Issues & Problems</h4>
      <div class="space-y-3">
        <div v-for="(issue, index) in productionIssues" :key="index" class="border border-red-200 dark:border-red-700 rounded-lg p-3 bg-red-50 dark:bg-red-900/20">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-medium text-red-800 dark:text-red-200">{{ issue.title }}</span>
            <select
              v-model="issue.status"
              class="text-xs border border-red-300 dark:border-red-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <p class="text-sm text-red-700 dark:text-red-300">{{ issue.description }}</p>
          <p class="text-xs text-red-600 dark:text-red-400 mt-1">Reported: {{ issue.reported_date }}</p>
        </div>
      </div>
      <div class="mt-4">
        <button @click="addNewIssue" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Add New Issue</button>
      </div>
    </div>

    <!-- Completion Tab -->
    <div v-if="activeTab === 'completion'">
      <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Completion Criteria</h4>
      <div class="space-y-2">
        <div v-for="criteria in completionCriteria" :key="criteria.id" class="flex items-center">
          <input
            :id="`criteria-${criteria.id}`"
            v-model="criteria.met"
            type="checkbox"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label :for="`criteria-${criteria.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
            {{ criteria.description }}
          </label>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
        <button
          v-if="task.status === 'pending'"
          @click="updateStatus('in_progress')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Production
        </button>
        <button
          v-if="task.status === 'in_progress'"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Production
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Production Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface Milestone {
  id: string
  title: string
  description: string
  progress: number
  completed: boolean
  due_date: string
}

interface QualityCheckpoint {
  id: string
  title: string
  status: string
}

interface Personnel {
  id: string
  name: string
  role: string
  assigned: boolean
}

interface Equipment {
  id: string
  name: string
  status: string
}

interface Issue {
  title: string
  description: string
  status: string
  reported_date: string
}

interface CompletionCriteria {
  id: string
  description: string
  met: boolean
}

interface Props {
  task: EnquiryTask
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-status': [status: EnquiryTask['status']]
  'complete': []
  'save': [data: {
    milestones: Milestone[]
    qualityCheckpoints: QualityCheckpoint[]
    assignedPersonnel: Personnel[]
    equipmentList: Equipment[]
    productionIssues: Issue[]
    completionCriteria: CompletionCriteria[]
  }]
}>()

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'milestones', label: '🏁 Milestones' },
  { id: 'quality', label: '✅ Quality' },
  { id: 'resources', label: '🔧 Resources' },
  { id: 'issues', label: '🚨 Issues' },
  { id: 'completion', label: '🎯 Completion' }
]

const milestones = ref<Milestone[]>([
  { id: '1', title: 'Planning Phase', description: 'Complete project planning', progress: 80, completed: false, due_date: '2023-10-15' },
  { id: '2', title: 'Material Procurement', description: 'Acquire all necessary materials', progress: 60, completed: false, due_date: '2023-10-20' },
  { id: '3', title: 'Production Start', description: 'Begin actual production work', progress: 0, completed: false, due_date: '2023-10-25' }
])
const qualityCheckpoints = ref<QualityCheckpoint[]>([
  { id: '1', title: 'Material Quality Check', status: 'passed' },
  { id: '2', title: 'Assembly Inspection', status: 'in_progress' },
  { id: '3', title: 'Final Quality Review', status: 'pending' }
])
const assignedPersonnel = ref<Personnel[]>([
  { id: '1', name: 'John Doe', role: 'Production Manager', assigned: true },
  { id: '2', name: 'Jane Smith', role: 'Quality Inspector', assigned: false },
  { id: '3', name: 'Bob Johnson', role: 'Technician', assigned: true }
])
const equipmentList = ref<Equipment[]>([
  { id: '1', name: 'CNC Machine', status: 'available' },
  { id: '2', name: 'Assembly Line', status: 'in_use' },
  { id: '3', name: 'Quality Scanner', status: 'maintenance' }
])
const productionIssues = ref<Issue[]>([
  { title: 'Material Delay', description: 'Materials arrived late', status: 'resolved', reported_date: '2023-10-10' },
  { title: 'Equipment Malfunction', description: 'CNC machine broke down', status: 'in_progress', reported_date: '2023-10-12' }
])
const completionCriteria = ref<CompletionCriteria[]>([
  { id: '1', description: 'All milestones completed', met: false },
  { id: '2', description: 'Quality checks passed', met: false },
  { id: '3', description: 'Client approval received', met: false }
])

// Redundant watchers
watch(milestones, (newVal) => {
  console.log('Milestones changed', newVal)
})

watch(qualityCheckpoints, (newVal) => {
  console.log('Quality checkpoints changed', newVal)
})

watch(productionIssues, (newVal) => {
  console.log('Production issues changed', newVal)
})

const overallProgress = computed(() => {
  if (milestones.value.length === 0) return 0
  const total = milestones.value.reduce((sum, m) => sum + m.progress, 0)
  return Math.round(total / milestones.value.length)
})

// Redundant methods
const redundantUpdateStatus = (status: EnquiryTask['status']) => {
  // Redundant duplicate of updateStatus
  emit('update-status', status)
}

const unusedMethod = () => {
  // This method is never used
  return 'unused'
}

const anotherRedundantMethod = () => {
  // Another redundant method
  console.log('This is redundant')
}

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}


const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'passed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const addNewIssue = () => {
  // Incomplete feature - just adds a basic issue without proper form
  productionIssues.value.push({
    title: 'New Issue',
    description: 'Please describe the issue',
    status: 'open',
    reported_date: new Date().toISOString().split('T')[0]
  })
}

const handleSubmit = () => {
  // Original implementation - incomplete, just logs and updates status
  console.log('Submitting production data - original version')
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
  // Note: Original version didn't properly save data
}
</script>
