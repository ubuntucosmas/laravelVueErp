<template>
  <div class="production-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ task.title }}</h3>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          ]"
        >
          <span class="mr-2">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'">
      <!-- Overall Progress -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-md font-medium text-gray-900 dark:text-white">Overall Production Progress</h4>
          <span class="text-lg font-semibold text-blue-600">{{ overallProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: overallProgress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Milestones Tab -->
    <div v-if="activeTab === 'milestones'">
      <!-- Production Milestones -->
      <div class="mb-6">
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
                  @change="updateProgress"
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
              <div class="flex-1">
                <input
                  v-model="milestone.progress"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                  @input="updateProgress"
                />
              </div>
              <span class="text-xs text-gray-500">{{ milestone.due_date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quality Tab -->
    <div v-if="activeTab === 'quality'">
      <!-- Quality Control Checkpoints -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Quality Control Checkpoints</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="checkpoint in qualityCheckpoints" :key="checkpoint.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ checkpoint.title }}</span>
              <span :class="getCheckpointStatusClass(checkpoint.status)" class="px-2 py-1 text-xs rounded-full">
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
    </div>

    <!-- Resources Tab -->
    <div v-if="activeTab === 'resources'">
      <!-- Resource Allocation -->
      <div class="mb-6">
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
    </div>

    <!-- Issues Tab -->
    <div v-if="activeTab === 'issues'">
      <!-- Issues/Problems Section -->
      <div class="mb-6">
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

        <button
          @click="addNewIssue"
          class="mt-3 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Report New Issue
        </button>
      </div>
    </div>

    <!-- Completion Tab -->
    <div v-if="activeTab === 'completion'">
      <!-- Completion Criteria -->
      <div class="mb-6">
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
}>()

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'milestones', label: 'Milestones', icon: '🎯' },
  { id: 'quality', label: 'Quality', icon: '✅' },
  { id: 'resources', label: 'Resources', icon: '⚙️' },
  { id: 'issues', label: 'Issues', icon: '🚨' },
  { id: 'completion', label: 'Completion', icon: '🏁' }
]

const milestones = ref<Milestone[]>([
  {
    id: 'design_finalization',
    title: 'Design Finalization',
    description: 'Complete all design specifications and approvals',
    progress: 100,
    completed: true,
    due_date: '2025-10-05'
  },
  {
    id: 'material_preparation',
    title: 'Material Preparation',
    description: 'Prepare and organize all required materials',
    progress: 80,
    completed: false,
    due_date: '2025-10-10'
  },
  {
    id: 'assembly',
    title: 'Assembly Phase',
    description: 'Main assembly and construction work',
    progress: 45,
    completed: false,
    due_date: '2025-10-20'
  },
  {
    id: 'testing',
    title: 'Testing & Quality Check',
    description: 'Final testing and quality assurance',
    progress: 0,
    completed: false,
    due_date: '2025-10-25'
  }
])

const qualityCheckpoints = ref<QualityCheckpoint[]>([
  { id: 'material_quality', title: 'Material Quality', status: 'passed' },
  { id: 'assembly_accuracy', title: 'Assembly Accuracy', status: 'in_progress' },
  { id: 'safety_standards', title: 'Safety Standards', status: 'pending' },
  { id: 'performance_test', title: 'Performance Test', status: 'pending' }
])

const assignedPersonnel = ref<Personnel[]>([
  { id: '1', name: 'John Doe', role: 'Lead Technician', assigned: true },
  { id: '2', name: 'Jane Smith', role: 'Quality Inspector', assigned: true },
  { id: '3', name: 'Mike Johnson', role: 'Assembler', assigned: false }
])

const equipmentList = ref<Equipment[]>([
  { id: '1', name: 'CNC Machine', status: 'in_use' },
  { id: '2', name: 'Welding Station', status: 'available' },
  { id: '3', name: 'Testing Equipment', status: 'maintenance' }
])

const productionIssues = ref<Issue[]>([
  {
    title: 'Material Delay',
    description: 'LED panels delayed by supplier',
    status: 'resolved',
    reported_date: '2025-10-01'
  }
])

const completionCriteria = ref<CompletionCriteria[]>([
  { id: 'all_milestones', description: 'All production milestones completed', met: false },
  { id: 'quality_passed', description: 'All quality checkpoints passed', met: false },
  { id: 'testing_complete', description: 'Final testing completed successfully', met: false },
  { id: 'documentation', description: 'Production documentation completed', met: false }
])

const overallProgress = computed(() => {
  const totalProgress = milestones.value.reduce((sum, milestone) => sum + milestone.progress, 0)
  return Math.round(totalProgress / milestones.value.length)
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const updateProgress = () => {
  // Progress is automatically updated via computed property
}

const getCheckpointStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'passed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const addNewIssue = () => {
  productionIssues.value.push({
    title: 'New Issue',
    description: 'Description of the issue',
    status: 'open',
    reported_date: new Date().toISOString().split('T')[0]
  })
}

const handleSubmit = () => {
  // Here you would typically save the production data
  console.log('Production data:', {
    milestones: milestones.value,
    qualityCheckpoints: qualityCheckpoints.value,
    assignedPersonnel: assignedPersonnel.value,
    equipmentList: equipmentList.value,
    productionIssues: productionIssues.value,
    completionCriteria: completionCriteria.value
  })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset production data for new task
  milestones.value.forEach(m => {
    m.progress = 0
    m.completed = false
  })
  qualityCheckpoints.value.forEach(c => c.status = 'pending')
  assignedPersonnel.value.forEach(p => p.assigned = false)
  equipmentList.value.forEach(e => e.status = 'available')
  productionIssues.value = []
  completionCriteria.value.forEach(c => c.met = false)
})
</script>
