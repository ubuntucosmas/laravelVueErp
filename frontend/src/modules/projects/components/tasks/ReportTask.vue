<template>
  <div class="report-task bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>

      <!-- Task Completion Toggle -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-600 dark:text-gray-400">Status:</span>
        <div class="flex items-center space-x-2">
          <span :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-500'" class="text-sm font-medium">
            {{ task.status === 'completed' ? 'Completed' : 'In Progress' }}
          </span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="isCompleted"
              type="checkbox"
              class="sr-only peer"
              @change="toggleTaskCompletion"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
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
      <!-- Project Summary -->
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <h4 class="text-md font-medium mb-2 text-blue-800 dark:text-blue-200">Project Summary</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Project Name:</strong> {{ projectSummary.name }}</div>
          <div><strong>Completion Date:</strong> {{ projectSummary.completion_date }}</div>
          <div><strong>Budget:</strong> ${{ projectSummary.budget }}</div>
          <div><strong>Actual Cost:</strong> ${{ projectSummary.actual_cost }}</div>
          <div :class="budgetVarianceClass"><strong>Variance:</strong> ${{ budgetVariance }}</div>
          <div><strong>Status:</strong> {{ projectSummary.status }}</div>
        </div>
      </div>
    </div>

    <!-- Report Tab -->
    <div v-if="activeTab === 'report'">
      <!-- Report Generation -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Report Generation</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">Report Sections</h5>

            <div class="space-y-3">
              <div v-for="section in reportSections" :key="section.id" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded">
                <div class="flex items-center">
                  <input
                    :id="`section-${section.id}`"
                    v-model="section.include"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label :for="`section-${section.id}`" class="ml-2 text-sm text-gray-900 dark:text-white">
                    {{ section.title }}
                  </label>
                </div>
                <span :class="section.status === 'completed' ? 'text-green-600' : 'text-gray-500'" class="text-xs">
                  {{ section.status }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h5 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">Report Details</h5>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Title</label>
                <input
                  v-model="reportData.title"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Final Project Report"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Author</label>
                <input
                  v-model="reportData.author"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Date</label>
                <input
                  v-model="reportData.report_date"
                  type="date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Format</label>
                <select
                  v-model="reportData.format"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="word">Word Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="powerpoint">PowerPoint Presentation</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis Tab -->
    <div v-if="activeTab === 'analysis'">
      <!-- Lessons Learned & Metrics -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Lessons Learned</h4>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">What went well</label>
              <textarea
                v-model="reportData.lessons_positive"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Key successes and positive outcomes..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Areas for improvement</label>
              <textarea
                v-model="reportData.lessons_improvements"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Challenges faced and improvement opportunities..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations</label>
              <textarea
                v-model="reportData.recommendations"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Future recommendations and best practices..."
              ></textarea>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Final Metrics</h4>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Timeline Variance</label>
                <input
                  v-model="reportData.timeline_variance"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+2 days"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Variance %</label>
                <input
                  v-model="reportData.budget_variance_percent"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="5.2%"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Satisfaction (1-5)</label>
              <div class="flex space-x-2 mt-1">
                <button
                  v-for="rating in 5"
                  :key="rating"
                  @click="reportData.client_satisfaction = rating"
                  :class="reportData.client_satisfaction >= rating ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-200 text-gray-600'"
                  class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  {{ rating }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Performance Indicators</label>
              <div class="space-y-2">
                <input
                  v-model="reportData.kpi_1"
                  type="text"
                  placeholder="KPI 1: Description and value"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  v-model="reportData.kpi_2"
                  type="text"
                  placeholder="KPI 2: Description and value"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  v-model="reportData.kpi_3"
                  type="text"
                  placeholder="KPI 3: Description and value"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonial Tab -->
    <div v-if="activeTab === 'testimonial'">
      <!-- Client Testimonial -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Client Testimonial</h4>

        <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Representative</label>
              <input
                v-model="reportData.testimonial_author"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Name and position"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Testimonial Date</label>
              <input
                v-model="reportData.testimonial_date"
                type="date"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Testimonial Content</label>
            <textarea
              v-model="reportData.testimonial_content"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Client testimonial and feedback..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Archival Tab -->
    <div v-if="activeTab === 'archival'">
      <!-- Archival & Distribution -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Archival Information</h4>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Archive Location</label>
              <select
                v-model="reportData.archive_location"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select archive location</option>
                <option value="digital_archive">Digital Archive</option>
                <option value="physical_archive">Physical Archive</option>
                <option value="cloud_storage">Cloud Storage</option>
                <option value="project_folder">Project Folder</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Retention Period</label>
              <select
                v-model="reportData.retention_period"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select retention period</option>
                <option value="5_years">5 Years</option>
                <option value="7_years">7 Years</option>
                <option value="10_years">10 Years</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Archive Reference</label>
              <input
                v-model="reportData.archive_reference"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Archive reference number/path"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Report Distribution</h4>

          <div class="space-y-3">
            <div v-for="recipient in distributionList" :key="recipient.id" class="flex items-center">
              <input
                :id="`dist-${recipient.id}`"
                v-model="recipient.selected"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label :for="`dist-${recipient.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                {{ recipient.name }} ({{ recipient.role }})
              </label>
            </div>
          </div>

          <button
            @click="addDistributionRecipient"
            class="mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Recipient
          </button>
        </div>
      </div>

      <!-- Archival Checklist -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3 text-gray-900 dark:text-white">Archival Checklist</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="category in archivalChecklist" :key="category.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h5 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{{ category.category }}</h5>

            <div class="space-y-2">
              <div v-for="item in category.items" :key="item.id" class="flex items-center">
                <input
                  :id="`archive-${category.id}-${item.id}`"
                  v-model="item.completed"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label :for="`archive-${category.id}-${item.id}`" class="ml-2 block text-sm text-gray-900 dark:text-white">
                  {{ item.label }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion Tab -->
    <div v-if="activeTab === 'completion'">
      <!-- Final Sign-off -->
      <div class="mb-6 p-4 border-2 border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
        <h4 class="text-md font-medium mb-3 text-green-800 dark:text-green-200">Report Completion Sign-off</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Report Completed By</label>
            <input
              v-model="reportData.completed_by"
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-green-700 dark:text-green-300">Completion Date</label>
            <input
              v-model="reportData.completion_date"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-4 flex items-center">
          <input
            id="report_signoff"
            v-model="reportData.report_signoff"
            type="checkbox"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
          />
          <label for="report_signoff" class="ml-2 block text-sm text-green-800 dark:text-green-200">
            I confirm that the final report is complete and ready for archival and distribution
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
          Start Report Generation
        </button>
        <button
          v-if="task.status === 'in_progress' && reportData.report_signoff"
          @click="updateStatus('completed')"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Complete Report
        </button>
      </div>
      <button
        @click="handleSubmit"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
      >
        Save Report Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EnquiryTask } from '../../types/enquiry'

interface ReportSection {
  id: string
  title: string
  include: boolean
  status: string
}

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface ChecklistCategory {
  id: string
  category: string
  items: ChecklistItem[]
}

interface DistributionRecipient {
  id: string
  name: string
  role: string
  selected: boolean
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
  { id: 'report', label: 'Report Details', icon: '📄' },
  { id: 'analysis', label: 'Analysis', icon: '📈' },
  { id: 'testimonial', label: 'Testimonial', icon: '💬' },
  { id: 'archival', label: 'Archival', icon: '📁' },
  { id: 'completion', label: 'Completion', icon: '✅' }
]

const isCompleted = computed({
  get: () => props.task.status === 'completed',
  set: (value) => {
    if (value && props.task.status !== 'completed') {
      toggleTaskCompletion()
    }
  }
})

const toggleTaskCompletion = async () => {
  try {
    const response = await fetch(`/api/projects/enquiry-tasks/${props.task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        status: 'completed'
      })
    })

    if (response.ok) {
      const result = await response.json()
      emit('update-status', 'completed')

      // Show success notification
      alert(`Task "${props.task.title}" has been marked as completed! All users have been notified.`)

      // Refresh notifications (if notification system is available)
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('task-completed', {
          detail: { task: props.task }
        }))
      }
    } else {
      throw new Error('Failed to update task status')
    }
  } catch (error) {
    console.error('Error updating task status:', error)
    alert('Failed to mark task as completed. Please try again.')
  }
}

const projectSummary = ref({
  name: 'Annual Conference 2025',
  completion_date: '2025-10-25',
  budget: 50000,
  actual_cost: 48500,
  status: 'completed'
})

const budgetVariance = computed(() => {
  return projectSummary.value.actual_cost - projectSummary.value.budget
})

const budgetVarianceClass = computed(() => {
  return budgetVariance.value <= 0 ? 'text-green-600' : 'text-red-600'
})

const reportSections = ref<ReportSection[]>([
  { id: 'executive_summary', title: 'Executive Summary', include: true, status: 'completed' },
  { id: 'project_overview', title: 'Project Overview', include: true, status: 'completed' },
  { id: 'financial_summary', title: 'Financial Summary', include: true, status: 'pending' },
  { id: 'timeline_analysis', title: 'Timeline Analysis', include: true, status: 'pending' },
  { id: 'lessons_learned', title: 'Lessons Learned', include: true, status: 'in_progress' },
  { id: 'recommendations', title: 'Recommendations', include: true, status: 'pending' },
  { id: 'appendices', title: 'Appendices & Photos', include: true, status: 'pending' }
])

const archivalChecklist = ref<ChecklistCategory[]>([
  {
    id: 'documentation',
    category: 'Documentation',
    items: [
      { id: 'final_report', label: 'Final report archived', completed: false },
      { id: 'supporting_docs', label: 'Supporting documents filed', completed: false },
      { id: 'contracts', label: 'Contracts and agreements stored', completed: false },
      { id: 'correspondence', label: 'Project correspondence archived', completed: false }
    ]
  },
  {
    id: 'digital_assets',
    category: 'Digital Assets',
    items: [
      { id: 'photos', label: 'Event photos organized and stored', completed: false },
      { id: 'videos', label: 'Videos and recordings archived', completed: false },
      { id: 'designs', label: 'Design files and mockups saved', completed: false },
      { id: 'data_backup', label: 'Project data backed up', completed: false }
    ]
  },
  {
    id: 'records',
    category: 'Records Management',
    items: [
      { id: 'retention_labels', label: 'Retention period labels applied', completed: false },
      { id: 'access_permissions', label: 'Access permissions set', completed: false },
      { id: 'indexing', label: 'Documents properly indexed', completed: false },
      { id: 'verification', label: 'Archival completeness verified', completed: false }
    ]
  }
])

const distributionList = ref<DistributionRecipient[]>([
  { id: '1', name: 'John Doe', role: 'Project Manager', selected: true },
  { id: '2', name: 'Jane Smith', role: 'Finance Director', selected: true },
  { id: '3', name: 'Mike Johnson', role: 'Operations Manager', selected: false },
  { id: '4', name: 'Sarah Wilson', role: 'Client Representative', selected: true }
])

const reportData = ref({
  title: 'Annual Conference 2025 - Final Project Report',
  author: '',
  report_date: new Date().toISOString().split('T')[0],
  format: 'pdf',
  lessons_positive: '',
  lessons_improvements: '',
  recommendations: '',
  timeline_variance: '',
  budget_variance_percent: '',
  client_satisfaction: 0,
  kpi_1: '',
  kpi_2: '',
  kpi_3: '',
  testimonial_author: '',
  testimonial_date: '',
  testimonial_content: '',
  archive_location: '',
  retention_period: '',
  archive_reference: '',
  completed_by: '',
  completion_date: '',
  report_signoff: false
})

const updateStatus = (status: EnquiryTask['status']) => {
  emit('update-status', status)
  if (status === 'completed') {
    emit('complete')
  }
}

const addDistributionRecipient = () => {
  const newId = (distributionList.value.length + 1).toString()
  distributionList.value.push({
    id: newId,
    name: 'New Recipient',
    role: 'Staff',
    selected: false
  })
}

const handleSubmit = () => {
  // Here you would typically save the report data
  console.log('Report data:', {
    reportSections: reportSections.value,
    archivalChecklist: archivalChecklist.value,
    distributionList: distributionList.value,
    reportData: reportData.value
  })
  // For now, just mark as completed if not already
  if (props.task.status !== 'completed') {
    updateStatus('completed')
  }
}

// Watch for task changes to reset data if needed
watch(() => props.task.id, () => {
  // Reset report data for new task
  reportSections.value.forEach(section => {
    section.include = true
    section.status = 'pending'
  })
  archivalChecklist.value.forEach(category => {
    category.items.forEach(item => item.completed = false)
  })
  distributionList.value.forEach(recipient => recipient.selected = false)
  reportData.value = {
    title: 'Project Final Report',
    author: '',
    report_date: new Date().toISOString().split('T')[0],
    format: 'pdf',
    lessons_positive: '',
    lessons_improvements: '',
    recommendations: '',
    timeline_variance: '',
    budget_variance_percent: '',
    client_satisfaction: 0,
    kpi_1: '',
    kpi_2: '',
    kpi_3: '',
    testimonial_author: '',
    testimonial_date: '',
    testimonial_content: '',
    archive_location: '',
    retention_period: '',
    archive_reference: '',
    completed_by: '',
    completion_date: '',
    report_signoff: false
  }
})
</script>
