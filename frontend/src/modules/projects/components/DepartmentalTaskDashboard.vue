<template>
  <div class="space-y-6">
    <!-- Header with Context Info -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ context === 'enquiry' ? 'Tasks for this enquiry' : 'Tasks for this project phase' }}
        </p>
      </div>
    </div>

    <!-- Compact Task Statistics -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400">Total</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.total }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.inProgress }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400">Completed</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.completed }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400">Overdue</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ stats.overdue }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center space-x-2">
          <button
            @click="assignTasks"
            class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            title="Assign/handover tasks to team members"
          >
            <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            ASSIGN
          </button>

          <button
            @click="createNewTask"
            class="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
            title="Create a new task"
          >
            <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            NEW
          </button>

          <button
            @click="exportTasks"
            class="px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
            title="Export tasks to CSV"
          >
            <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            EXPORT
          </button>

          <button
            @click="showFilters = !showFilters"
            class="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            title="Toggle filters"
          >
            <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            FILTER
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Filters (Collapsible) -->
    <div v-if="showFilters" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select
            v-model="filterPriority"
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
          <select
            v-model="filterAssignee"
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            <!-- Add dynamic options based on available users -->
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>


    <!-- Tabbed Layout -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex overflow-x-auto">
          <button
            v-for="phase in workflowPhases"
            :key="phase.id"
            @click="selectedPhase = phase.id"
            :class="[
              'flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              selectedPhase === phase.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <div class="flex items-center space-x-2">
              <span>{{ phase.name }}</span>
              <span v-if="getPhaseTaskCount(phase.id) > 0"
                    :class="[
                      'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium min-w-[1.25rem] h-4',
                      selectedPhase === phase.id
                        ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                    ]"
              >
                {{ getPhaseTaskCount(phase.id) }}
              </span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-for="phase in workflowPhases" :key="phase.id" v-show="selectedPhase === phase.id" class="p-4">
        <!-- Phase Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ phase.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ phase.description }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-center">
              <div class="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">{{ getPhaseTaskCount(phase.id) }}</div>
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ getPhaseCompletedCount(phase.id) }}</div>
            </div>
          </div>
        </div>

        <!-- Task List -->
        <div v-if="getPhaseTasks(phase.id).length > 0" class="space-y-3">
          <div
            v-for="task in getPhaseTasks(phase.id)"
            :key="task.id"
            class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            @click="handleTaskSelect(task)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ task.task_name }}</h4>
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      task.status === 'completed' && task.notes?.startsWith('SKIPPED:') ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    ]"
                  >
                    {{ task.status === 'completed' && task.notes?.startsWith('SKIPPED:') ? 'skipped' : task.status.replace('_', ' ') }}
                  </span>
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    ]"
                  >
                    {{ task.priority }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ task.task_description }}</p>
                <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div class="flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>Due: {{ formatDate(task.due_date) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ task.estimated_hours }}h</span>
                  </div>
                  <div v-if="task.assigned_user" class="flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>{{ task.assigned_user.name }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click.stop="assignSingleTask(task)"
                  class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-xs font-medium"
                  :title="'Assign/handover task: ' + task.task_name"
                >
                  HANDOVER
                </button>
                <button
                  @click.stop="handleViewTaskDetails(task)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-medium"
                >
                  Details
                </button>
                <button
                  @click.stop="openSkipTaskModal(task)"
                  class="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 text-xs font-medium"
                >
                  {{ task.notes?.startsWith('SKIPPED:') ? 'Unskip' : 'Skip' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks in this phase</h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Tasks for {{ phase.name.toLowerCase() }} will appear here when assigned.
          </p>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <DepartmentalTaskModal
      :visible="showTaskModal"
      :task="selectedTask"
      @close="showTaskModal = false"
      @task-updated="handleTaskUpdate"
    />

    <!-- Site Survey Modal -->
    <SiteSurveyModal
      :is-visible="showSiteSurveyModal"
      :enquiry="enquiry as unknown as Enquiry || null"
      @close="showSiteSurveyModal = false"
      @save="handleSiteSurveySave"
    />

    <!-- Materials Modal -->
    <MaterialsModal
      :is-visible="showMaterialsModal"
      :enquiry="enquiry as unknown as Enquiry || null"
      :department="department"
      @close="showMaterialsModal = false"
      @save="handleMaterialsSave"
    />

    <!-- Budget Modal -->
    <BudgetModal
      :is-visible="showBudgetModal"
      :enquiry="enquiry as unknown as Enquiry || null"
      :material-costs="savedMaterials"
      :material-elements="savedMaterialElements"
      @close="showBudgetModal = false"
      @save="handleBudgetSave"
    />

    <!-- Quote Modal -->
    <QuoteModal
      :is-visible="showQuoteModal"
      :enquiry="enquiry as unknown as Enquiry || null"
      :material-elements="savedMaterialElements"
      @close="showQuoteModal = false"
      @save="handleQuoteSave"
    />

    <!-- Task Details Modal -->
    <TaskDetailsModal
      :is-visible="showTaskDetailsModal"
      :task="selectedTask"
      :enquiry="enquiry"
      @close="showTaskDetailsModal = false"
    />

    <!-- Task Assignment Modal -->
    <TaskAssignmentModal
      :is-visible="showTaskAssignmentModal"
      :tasks="assignmentModalTasks"
      :enquiry="enquiry"
      @close="closeTaskAssignmentModal"
      @save="handleTaskAssignmentsSave"
    />

    <!-- Task Assignment Notification Modal -->
    <TaskAssignmentNotification
      :is-visible="showTaskAssignmentNotification"
      :notifications="taskAssignmentNotifications"
      @close="showTaskAssignmentNotification = false"
    />

    <!-- Skip Task Modal -->
    <div v-if="showSkipTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {{ isTaskSkipped ? 'Unskip Task' : 'Skip Task' }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ isTaskSkipped
            ? `Are you sure you want to unskip the task "${selectedTask?.task_name}"? This will make it available again.`
            : `Are you sure you want to skip the task "${selectedTask?.task_name}"?`
          }}
        </p>

        <div v-if="!isTaskSkipped" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for skipping (required)
          </label>
          <textarea
            v-model="skipReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Please provide a reason for skipping this task..."
            required
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="showSkipTaskModal = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmSkipTask"
            :disabled="!isTaskSkipped && !skipReason.trim()"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isTaskSkipped ? 'Unskip Task' : 'Skip Task' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { DepartmentalTask, Enquiry, SiteSurvey } from '../types'
import DepartmentalTaskModal from './DepartmentalTaskModal.vue'
import SiteSurveyModal from './SiteSurveyModal.vue'
import MaterialsModal from './MaterialsModal.vue'
import BudgetModal from './BudgetModal.vue'
import QuoteModal from './QuoteModal.vue'
import TaskDetailsModal from './TaskDetailsModal.vue'
import TaskAssignmentModal from './TaskAssignmentModal.vue'
import TaskAssignmentNotification from './TaskAssignmentNotification.vue'

// Props
interface Props {
  context: 'enquiry' | 'project'
  contextId: number
  title?: string
  enquiry?: Record<string, unknown> // For enquiry context
  department?: string // Department name
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Departmental Tasks'
})

// Emits
const emit = defineEmits<{
  taskCreated: [task: DepartmentalTask]
  taskUpdated: [task: DepartmentalTask]
  taskAssigned: [data: {
    userId: number
    userName: string
    userEmail: string
    taskCount: number
    taskNames: string
    message: string
    tasks: DepartmentalTask[]
  }]
  quoteApproved: [data: {
    enquiryId: number
    quotationData: any
  }]
}>()

// Reactive data
const tasks = ref<DepartmentalTask[]>([])
const loading = ref(false)
const selectedTask = ref<DepartmentalTask | null>(null)
const showTaskModal = ref(false)
const showSiteSurveyModal = ref(false)
const showMaterialsModal = ref(false)
const showBudgetModal = ref(false)
const showQuoteModal = ref(false)
const showTaskDetailsModal = ref(false)
const showTaskAssignmentModal = ref(false)
const showTaskAssignmentNotification = ref(false)
const showSkipTaskModal = ref(false)
const selectedPhase = ref('site-survey')
const savedMaterials = ref<any[]>([])
const savedMaterialElements = ref<any[]>([])
const taskAssignmentNotifications = ref<Array<{
  userId: number
  userName: string
  userEmail: string
  taskCount: number
  tasks: DepartmentalTask[]
}>>([])

// Quick actions and filters
const showFilters = ref(false)
const filterStatus = ref('')
const filterPriority = ref('')
const filterAssignee = ref('')

// Workflow phases definition
const workflowPhases = ref([
  {
    id: 'site-survey',
    name: 'Site Survey',
    description: 'Site assessment and survey activities',
    order: 1
  },
  {
    id: 'creatives-design',
    name: 'Creatives & Design',
    description: 'Design concept development and material specifications',
    order: 2
  },
  {
    id: 'finance-costing',
    name: 'Finance & Costing',
    description: 'Budget creation and quotation preparation',
    order: 3
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Material sourcing and supplier management',
    order: 4
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Manufacturing and quality control',
    order: 5
  },
  {
    id: 'event-setup',
    name: 'Event Setup & Execution',
    description: 'On-site delivery and installation',
    order: 6
  },
  {
    id: 'client-handover',
    name: 'Client Handover & Feedback',
    description: 'Project delivery and client review',
    order: 7
  },
  {
    id: 'set-down-return',
    name: 'Set Down & Return',
    description: 'Post-event cleanup and equipment return',
    order: 8
  },
  {
    id: 'archival-reporting',
    name: 'Archival & Reporting',
    description: 'Project closure and analytics',
    order: 9
  }
])

// Computed

const stats = computed(() => {
  const total = tasks.value.length
  const inProgress = tasks.value.filter(task => task.status === 'in_progress').length
  const completed = tasks.value.filter(task => task.status === 'completed').length
  const overdue = tasks.value.filter(task => {
    return task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
  }).length

  return { total, inProgress, completed, overdue }
})

// Methods
const fetchTasks = async () => {
  loading.value = true
  try {
    // TODO: Implement API call based on context
    if (props.context === 'enquiry') {
      // Fetch enquiry departmental tasks
      console.log('Fetching enquiry tasks for:', props.contextId, 'department:', props.department)
      // tasks.value = await api.get(`/api/enquiries/${props.contextId}/departmental-tasks`)

      // Generate mock tasks based on department
      tasks.value = generateDepartmentalTasks()
    } else {
      // Fetch project phase departmental tasks
      console.log('Fetching project tasks for:', props.contextId)
      // tasks.value = await api.get(`/api/projects/${props.contextId}/departmental-tasks`)

      // Mock data for now
      tasks.value = []
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    loading.value = false
  }
}

const generateDepartmentalTasks = (): DepartmentalTask[] => {
  const department = props.department?.toLowerCase() || ''
  const baseTasks: DepartmentalTask[] = []
  const now = new Date()

  // For enquiry context, always show the core tasks regardless of department
  if (props.context === 'enquiry') {
    // Get department ID based on department name
    const deptId = department === 'creatives' || department === 'design' ? 2 : 1
    const deptName = department === 'creatives' || department === 'design' ? 'creatives' : 'projects'
    const displayName = department === 'creatives' || department === 'design' ? 'Creatives' : 'Projects'
    const description = department === 'creatives' || department === 'design'
      ? 'Creative design and development'
      : 'Project management and coordination'

    // Always show these core tasks for enquiries
    baseTasks.push(
      {
        id: 1,
        project_phase_id: 1,
        department_id: deptId,
        task_name: 'Conduct Site Survey',
        task_description: 'Perform on-site assessment and data collection for the project location',
        status: 'pending',
        priority: 'high',
        estimated_hours: 8,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 1,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 2,
        project_phase_id: 1,
        department_id: deptId,
        task_name: 'Design Assets and Material Specification',
        task_description: 'Create design mockups, renders, artworks, 3D designs and define detailed material requirements and specifications for the project',
        status: 'pending',
        priority: 'medium',
        estimated_hours: 16,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 2,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 3,
        project_phase_id: 3,
        department_id: deptId,
        task_name: 'Budget Generation',
        task_description: 'Create comprehensive project budget with cost breakdowns and financial planning',
        status: 'pending',
        priority: 'high',
        estimated_hours: 10,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 3,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 4,
        project_phase_id: 3,
        department_id: deptId,
        task_name: 'Quote & Invoice Management',
        task_description: 'Prepare client quotes, manage invoicing, and handle payment processing',
        status: 'pending',
        priority: 'high',
        estimated_hours: 8,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 4,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      // Procurement Phase Tasks
      {
        id: 5,
        project_phase_id: 4,
        department_id: deptId,
        task_name: 'Material Requests',
        task_description: 'Create and submit material requests based on project specifications and requirements',
        status: 'pending',
        priority: 'high',
        estimated_hours: 12,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 5,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 6,
        project_phase_id: 4,
        department_id: deptId,
        task_name: 'Purchase Orders',
        task_description: 'Generate and process purchase orders for approved materials and services',
        status: 'pending',
        priority: 'medium',
        estimated_hours: 8,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 6,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      // Production Phase Tasks
      {
        id: 7,
        project_phase_id: 5,
        department_id: deptId,
        task_name: 'Execute Production',
        task_description: 'Carry out the production process according to specifications and quality standards',
        status: 'pending',
        priority: 'high',
        estimated_hours: 40,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 7,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 8,
        project_phase_id: 5,
        department_id: deptId,
        task_name: 'Quality Control',
        task_description: 'Perform quality inspections and ensure all components meet specifications',
        status: 'pending',
        priority: 'high',
        estimated_hours: 16,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 8,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      // Event Setup Phase Tasks
      {
        id: 9,
        project_phase_id: 6,
        department_id: deptId,
        task_name: 'Site Delivery',
        task_description: 'Deliver and transport all equipment and materials to the event site',
        status: 'pending',
        priority: 'high',
        estimated_hours: 20,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 9,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 10,
        project_phase_id: 6,
        department_id: deptId,
        task_name: 'Setup Execution',
        task_description: 'Execute the complete setup process including installation and final preparations',
        status: 'pending',
        priority: 'high',
        estimated_hours: 16,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 47 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 10,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      // Client Handover Phase Tasks
      {
        id: 11,
        project_phase_id: 7,
        department_id: deptId,
        task_name: 'Final Handover',
        task_description: 'Complete the final handover of project deliverables and documentation to the client',
        status: 'pending',
        priority: 'high',
        estimated_hours: 8,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 11,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 12,
        project_phase_id: 7,
        department_id: deptId,
        task_name: 'Feedback Collection',
        task_description: 'Collect client feedback and document any final requirements or adjustments',
        status: 'pending',
        priority: 'medium',
        estimated_hours: 4,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 52 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 12,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      // Set Down & Return Phase Tasks
      {
        id: 13,
        project_phase_id: 8,
        department_id: deptId,
        task_name: 'Dismantling',
        task_description: 'Carefully dismantle all equipment and materials from the event site',
        status: 'pending',
        priority: 'high',
        estimated_hours: 12,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 13,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 14,
        project_phase_id: 8,
        department_id: deptId,
        task_name: 'Returns & Storage',
        task_description: 'Handle equipment returns to suppliers and organize storage of reusable materials',
        status: 'pending',
        priority: 'medium',
        estimated_hours: 10,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 58 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 14,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      // Archival & Reporting Phase Tasks
      {
        id: 15,
        project_phase_id: 9,
        department_id: deptId,
        task_name: 'Close Project',
        task_description: 'Complete all project closure activities and finalize project records',
        status: 'pending',
        priority: 'medium',
        estimated_hours: 8,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 15,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      },
      {
        id: 16,
        project_phase_id: 9,
        department_id: deptId,
        task_name: 'Analytics & Reports',
        task_description: 'Generate performance analytics, final reports, and update project metrics',
        status: 'pending',
        priority: 'low',
        estimated_hours: 12,
        actual_hours: undefined,
        due_date: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        started_at: undefined,
        completed_at: undefined,
        notes: undefined,
        order: 16,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        project_phase: undefined,
        department: {
          id: deptId,
          name: deptName,
          display_name: displayName,
          description: description,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        },
        assigned_user: undefined
      }
    )
  } else {
    // For project context, use department-specific logic
    if (department === 'project' || department === 'projects') {
      // For project department: site survey, material specification, budget creation
      baseTasks.push(
        {
          id: 1,
          project_phase_id: 1,
          department_id: 1,
          task_name: 'Conduct Site Survey',
          task_description: 'Perform on-site assessment and data collection for the project location',
          status: 'pending',
          priority: 'high',
          estimated_hours: 8,
          actual_hours: undefined,
          due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          started_at: undefined,
          completed_at: undefined,
          notes: undefined,
          order: 1,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          project_phase: undefined,
          department: {
            id: 1,
            name: 'projects',
            display_name: 'Projects',
            description: 'Project management and coordination',
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          },
          assigned_user: undefined
        },
        {
          id: 2,
          project_phase_id: 1,
          department_id: 1,
          task_name: 'Create Material Specifications',
          task_description: 'Define detailed material requirements and specifications for the project',
          status: 'pending',
          priority: 'medium',
          estimated_hours: 12,
          actual_hours: undefined,
          due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          started_at: undefined,
          completed_at: undefined,
          notes: undefined,
          order: 2,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          project_phase: undefined,
          department: {
            id: 1,
            name: 'projects',
            display_name: 'Projects',
            description: 'Project management and coordination',
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          },
          assigned_user: undefined
        },
        {
          id: 3,
          project_phase_id: 1,
          department_id: 1,
          task_name: 'Prepare Budget & Costing',
          task_description: 'Calculate project costs, prepare budget breakdown and financial estimates',
          status: 'pending',
          priority: 'high',
          estimated_hours: 10,
          actual_hours: undefined,
          due_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          started_at: undefined,
          completed_at: undefined,
          notes: undefined,
          order: 3,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          project_phase: undefined,
          department: {
            id: 1,
            name: 'projects',
            display_name: 'Projects',
            description: 'Project management and coordination',
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          },
          assigned_user: undefined
        }
      )
    } else if (department === 'creatives' || department === 'design') {
      // For creatives/design department: material specification and budget creation
      baseTasks.push(
        {
          id: 4,
          project_phase_id: 1,
          department_id: 2,
          task_name: 'Create Material Specifications',
          task_description: 'Design and specify materials needed for creative execution',
          status: 'pending',
          priority: 'high',
          estimated_hours: 16,
          actual_hours: undefined,
          due_date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          started_at: undefined,
          completed_at: undefined,
          notes: undefined,
          order: 1,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          project_phase: undefined,
          department: {
            id: 2,
            name: 'creatives',
            display_name: 'Creatives',
            description: 'Creative design and development',
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          },
          assigned_user: undefined
        },
        {
          id: 5,
          project_phase_id: 1,
          department_id: 2,
          task_name: 'Prepare Budget & Costing',
          task_description: 'Calculate costs for materials, labor, and creative execution',
          status: 'pending',
          priority: 'medium',
          estimated_hours: 8,
          actual_hours: undefined,
          due_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          started_at: undefined,
          completed_at: undefined,
          notes: undefined,
          order: 2,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          project_phase: undefined,
          department: {
            id: 2,
            name: 'creatives',
            display_name: 'Creatives',
            description: 'Creative design and development',
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          },
          assigned_user: undefined
        }
      )
    }
  }

  return baseTasks
}


const assignTasks = () => {
  // Clear selected task to show all tasks for bulk assignment
  selectedTask.value = null
  // Show task assignment recommendations
  showTaskAssignmentModal.value = true
}

const createNewTask = () => {
  // Create a new task - for now, just show a placeholder
  console.log('Create new task functionality would be implemented here')
  // In a real implementation, this would open a task creation modal
  alert('New task creation functionality would be implemented here')
}

const exportTasks = () => {
  // Export tasks to CSV
  const csvContent = generateTasksCSV()
  downloadCSV(csvContent, `tasks-${new Date().toISOString().split('T')[0]}.csv`)
}

const clearFilters = () => {
  filterStatus.value = ''
  filterPriority.value = ''
  filterAssignee.value = ''
}

const generateTasksCSV = (): string => {
  const headers = ['Task Name', 'Description', 'Status', 'Priority', 'Due Date', 'Estimated Hours', 'Assigned User', 'Department']
  const rows = tasks.value.map(task => [
    task.task_name,
    task.task_description,
    task.status.replace('_', ' '),
    task.priority,
    formatDate(task.due_date),
    (task.estimated_hours || 0).toString(),
    task.assigned_user?.name || 'Unassigned',
    task.department?.display_name || 'Unknown'
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  return csvContent
}

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const assignSingleTask = (task: DepartmentalTask) => {
  // Set the selected task for assignment
  selectedTask.value = task
  // Show task assignment modal with just this single task
  showTaskAssignmentModal.value = true
}

const closeTaskAssignmentModal = () => {
  // Clear selected task and close modal
  selectedTask.value = null
  showTaskAssignmentModal.value = false
}

const handleTaskUpdate = (task: DepartmentalTask) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value[index] = task
  }
  emit('taskUpdated', task)
}

const handleTaskSelect = (task: DepartmentalTask) => {
  selectedTask.value = task

  // Check if this is the "Conduct Site Survey" task
  if (task.task_name === 'Conduct Site Survey') {
    showSiteSurveyModal.value = true
  } else if (task.task_name === 'Design Assets and Material Specification') {
    // Check if this is the "Design Assets and Material Specification" task
    showMaterialsModal.value = true
  } else if (task.task_name === 'Budget Generation') {
    // Open budget modal for finance task
    showBudgetModal.value = true
  } else if (task.task_name === 'Quote & Invoice Management') {
    // Open quote modal for finance task
    showQuoteModal.value = true
  } else {
    // For other tasks, open the regular task modal
    showTaskModal.value = true
  }
}

const handleSiteSurveySave = (survey: SiteSurvey) => {
  // Update the "Conduct Site Survey" task status to completed
  if (selectedTask.value && selectedTask.value.task_name === 'Conduct Site Survey') {
    const updatedTask = {
      ...selectedTask.value,
      status: 'completed' as const,
      completed_at: new Date().toISOString()
    }
    handleTaskUpdate(updatedTask)
  }

  // Close the modal
  showSiteSurveyModal.value = false
}

const handleMaterialsSave = (materials: any[], files: any[], notes: string) => {
  // Store the materials data for use in budget creation
  savedMaterials.value = materials
  savedMaterialElements.value = materials // Assuming materials array contains the elements

  // Update the "Design Assets and Material Specification" task status to completed
  if (selectedTask.value && selectedTask.value.task_name === 'Design Assets and Material Specification') {
    const updatedTask = {
      ...selectedTask.value,
      status: 'completed' as const,
      completed_at: new Date().toISOString()
    }
    handleTaskUpdate(updatedTask)
  }

  // Close the modal
  showMaterialsModal.value = false
}

const handleBudgetSave = (budgetData: any) => {
  // Update the "Budget Generation" task status to completed
  if (selectedTask.value && selectedTask.value.task_name === 'Budget Generation') {
    const updatedTask = {
      ...selectedTask.value,
      status: 'completed' as const,
      completed_at: new Date().toISOString()
    }
    handleTaskUpdate(updatedTask)
  }

  // Close the modal
  showBudgetModal.value = false
}

const handleQuoteSave = (quotationData: any) => {
  // Update the "Quote & Invoice Management" task status to completed
  if (selectedTask.value && selectedTask.value.task_name === 'Quote & Invoice Management') {
    const updatedTask = {
      ...selectedTask.value,
      status: 'completed' as const,
      completed_at: new Date().toISOString()
    }
    handleTaskUpdate(updatedTask)

    // Emit quote approved event for project creation
    emit('quoteApproved', {
      enquiryId: props.contextId,
      quotationData
    })
  }

  // Close the modal
  showQuoteModal.value = false
}

const openSkipTaskModal = (task: DepartmentalTask) => {
  selectedTask.value = task
  // Only reset skip reason if we're skipping (not unskipping)
  if (!task.notes?.startsWith('SKIPPED:')) {
    skipReason.value = ''
  }
  showSkipTaskModal.value = true
}

const skipReason = ref('')

// Computed property to check if task is skipped
const isTaskSkipped = computed(() => {
  return selectedTask.value?.notes?.startsWith('SKIPPED:') || false
})

// Computed property for assignment modal tasks
const assignmentModalTasks = computed(() => {
  // If we have a selected task for single assignment, return just that task
  // Otherwise return all tasks for bulk assignment
  return selectedTask.value && showTaskAssignmentModal.value ? [selectedTask.value] : tasks.value
})

const confirmSkipTask = () => {
  if (!selectedTask.value) return

  let updatedTask

  if (isTaskSkipped.value) {
    // Unskip the task - remove SKIPPED prefix and set status to pending
    const originalNotes = selectedTask.value.notes?.replace(/^SKIPPED:\s*/, '') || ''
    updatedTask = {
      ...selectedTask.value,
      status: 'pending' as const,
      notes: originalNotes,
      completed_at: undefined
    }
  } else {
    // Skip the task - add SKIPPED prefix and set status to completed
    if (!skipReason.value.trim()) return

    updatedTask = {
      ...selectedTask.value,
      status: 'completed' as const,
      notes: `SKIPPED: ${skipReason.value}`,
      completed_at: new Date().toISOString()
    }
  }

  handleTaskUpdate(updatedTask)

  // Close the modal
  showSkipTaskModal.value = false
  skipReason.value = ''
}

const handleViewTaskDetails = (task: DepartmentalTask) => {
  selectedTask.value = task
  showTaskDetailsModal.value = true
}

const handleTaskAssignmentsSave = (updatedTasks: DepartmentalTask[]) => {
  // Update the tasks with new priorities and due dates
  updatedTasks.forEach(updatedTask => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask }
      handleTaskUpdate(tasks.value[index])
    }
  })

  // Generate notifications for assigned users
  const notifications = generateTaskAssignmentNotifications(updatedTasks)
  taskAssignmentNotifications.value = notifications

  // Send notifications to global notification center
  sendNotificationsToCenter(updatedTasks)

  // Clear selected task and close the assignment modal
  selectedTask.value = null
  showTaskAssignmentModal.value = false
  showTaskAssignmentNotification.value = true
}

const generateTaskAssignmentNotifications = (updatedTasks: DepartmentalTask[]) => {
  // Group tasks by assigned user
  const userTaskMap = new Map<number, DepartmentalTask[]>()

  updatedTasks.forEach(task => {
    if (task.assigned_user_id) {
      if (!userTaskMap.has(task.assigned_user_id)) {
        userTaskMap.set(task.assigned_user_id, [])
      }
      userTaskMap.get(task.assigned_user_id)!.push(task)
    }
  })

  // Generate notification objects
  const notifications = Array.from(userTaskMap.entries()).map(([userId, tasks]) => {
    const user = getUserById(userId)
    return {
      userId,
      userName: user?.name || 'Unknown User',
      userEmail: user?.email || 'unknown@example.com',
      taskCount: tasks.length,
      tasks
    }
  })

  return notifications
}

const getUserById = (userId: number) => {
  // Mock user lookup - in a real app, this would fetch from API
  const allUsers = [
    { id: 1, name: 'John Smith', email: 'john.smith@company.com' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    { id: 3, name: 'Mike Davis', email: 'mike.davis@company.com' },
    { id: 4, name: 'Emily Chen', email: 'emily.chen@company.com' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@company.com' },
    { id: 6, name: 'Lisa Brown', email: 'lisa.brown@company.com' },
    { id: 7, name: 'Robert Taylor', email: 'robert.taylor@company.com' },
    { id: 8, name: 'Anna Martinez', email: 'anna.martinez@company.com' }
  ]

  return allUsers.find(user => user.id === userId)
}

const sendNotificationsToCenter = (updatedTasks: DepartmentalTask[]) => {
  // Get assigned tasks (tasks that have been assigned to users)
  const assignedTasks = updatedTasks.filter(task => task.assigned_user_id)

  // Group by user
  const userTaskMap = new Map<number, DepartmentalTask[]>()
  assignedTasks.forEach(task => {
    if (task.assigned_user_id) {
      if (!userTaskMap.has(task.assigned_user_id)) {
        userTaskMap.set(task.assigned_user_id, [])
      }
      userTaskMap.get(task.assigned_user_id)!.push(task)
    }
  })

  // Send notification for each user
  userTaskMap.forEach((tasks, userId) => {
    const user = getUserById(userId)
    if (user) {
      const taskNames = tasks.map(t => t.task_name).join(', ')
      const notificationMessage = `You have been assigned ${tasks.length} task${tasks.length !== 1 ? 's' : ''}: ${taskNames}`

      // Add to global notification center
      // Note: In a real app, this would be handled by a global notification service
      // For now, we'll emit an event that can be caught by the notification center
      emit('taskAssigned', {
        userId,
        userName: user.name,
        userEmail: user.email,
        taskCount: tasks.length,
        taskNames,
        message: notificationMessage,
        tasks
      })
    }
  })
}

// Tab-related methods
const getPhaseTasks = (phaseId: string): DepartmentalTask[] => {
  // Map phase IDs to task groupings
  const phaseMappings: Record<string, string[]> = {
    'site-survey': ['Conduct Site Survey'],
    'creatives-design': ['Design Assets and Material Specification'],
    'finance-costing': ['Budget Generation', 'Quote & Invoice Management'],
    'procurement': ['Material Requests', 'Purchase Orders'],
    'production': ['Execute Production', 'Quality Control'],
    'event-setup': ['Site Delivery', 'Setup Execution'],
    'client-handover': ['Final Handover', 'Feedback Collection'],
    'set-down-return': ['Dismantling', 'Returns & Storage'],
    'archival-reporting': ['Close Project', 'Analytics & Reports']
  }

  const taskNames = phaseMappings[phaseId] || []
  return tasks.value.filter(task => taskNames.includes(task.task_name))
}

const getPhaseTaskCount = (phaseId: string): number => {
  return getPhaseTasks(phaseId).length
}

const getPhaseCompletedCount = (phaseId: string): number => {
  return getPhaseTasks(phaseId).filter(task => task.status === 'completed').length
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No due date'
  return new Date(dateString).toLocaleDateString()
}


// Task save logic is handled by the modal component

// Lifecycle
onMounted(() => {
  fetchTasks()
})

watch(() => props.contextId, () => {
  fetchTasks()
})
</script>
