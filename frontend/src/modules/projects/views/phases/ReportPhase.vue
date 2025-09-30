<template>
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-h5 font-weight-medium">Project Report & Closure</h2>
          <div class="text-caption text-medium-emphasis">
            Finalize project documentation and close out the project
          </div>
        </div>
        <v-btn color="primary" @click="generateFinalReport">
          <v-icon start>mdi-file-pdf</v-icon>
          Generate Final Report
        </v-btn>
      </div>
  
      <!-- Project Summary Cards -->
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
                <div v-if="stat.change" class="text-caption">{{ stat.change }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Main Content -->
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" md="8">
          <!-- Executive Summary -->
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-text-box-outline</v-icon>
              Executive Summary
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="report.executiveSummary"
                label="Project Summary"
                rows="4"
                variant="outlined"
                auto-grow
                hide-details
                class="mb-4"
              ></v-textarea>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="report.projectName"
                    label="Project Name"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="report.projectManager"
                    label="Project Manager"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>
              
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="report.startDate"
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="report.endDate"
                    label="End Date"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
  
          <!-- Project Performance -->
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-chart-line</v-icon>
              Project Performance
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="report.performance"
                    :items="performanceOptions"
                    label="Overall Performance"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                  ></v-select>
                  
                  <v-textarea
                    v-model="report.achievements"
                    label="Key Achievements"
                    rows="3"
                    variant="outlined"
                    auto-grow
                    hide-details
                    class="mb-4"
                  ></v-textarea>
                  
                  <v-textarea
                    v-model="report.challenges"
                    label="Challenges Faced"
                    rows="3"
                    variant="outlined"
                    auto-grow
                    hide-details
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex justify-space-between mb-2">
                    <span>Budget Adherence</span>
                    <span class="font-weight-medium">{{ report.budgetAdherence }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="report.budgetAdherence"
                    color="primary"
                    height="10"
                    class="mb-4"
                  ></v-progress-linear>
                  
                  <div class="d-flex justify-space-between mb-2">
                    <span>Schedule Adherence</span>
                    <span class="font-weight-medium">{{ report.scheduleAdherence }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="report.scheduleAdherence"
                    color="primary"
                    height="10"
                    class="mb-4"
                  ></v-progress-linear>
                  
                  <div class="d-flex justify-space-between mb-2">
                    <span>Quality Standards</span>
                    <span class="font-weight-medium">{{ report.qualityStandards }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="report.qualityStandards"
                    color="primary"
                    height="10"
                  ></v-progress-linear>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
  
          <!-- Lessons Learned -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-school</v-icon>
              Lessons Learned
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="report.lessonsLearned"
                label="What worked well and what could be improved"
                rows="4"
                variant="outlined"
                auto-grow
                hide-details
                class="mb-4"
              ></v-textarea>
              
              <v-textarea
                v-model="report.recommendations"
                label="Recommendations for Future Projects"
                rows="4"
                variant="outlined"
                auto-grow
                hide-details
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Right Column -->
        <v-col cols="12" md="4">
          <!-- Project Completion -->
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-check-circle</v-icon>
              Project Completion
            </v-card-title>
            <v-card-text>
              <div class="text-center mb-4">
                <v-progress-circular
                  :model-value="report.completionPercentage"
                  :size="150"
                  :width="15"
                  color="primary"
                  class="mb-2"
                >
                  <div class="text-h5">{{ report.completionPercentage }}%</div>
                </v-progress-circular>
                <div class="text-subtitle-1 mt-2">Overall Completion</div>
              </div>
              
              <v-list density="compact">
                <v-list-item
                  v-for="(item, i) in completionItems"
                  :key="i"
                  :title="item.title"
                  :subtitle="item.subtitle"
                >
                  <template v-slot:prepend>
                    <v-icon
                      :color="item.completed ? 'success' : 'grey'"
                      :icon="item.completed ? 'mdi-check-circle' : 'mdi-circle-outline'"
                    ></v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
  
          <!-- Sign-Off -->
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="me-2">mdi-signature</v-icon>
              Project Sign-Off
            </v-card-title>
            <v-card-text>
              <v-checkbox
                v-model="report.clientApproval"
                label="Client Approval"
                hide-details
                class="mb-2"
              ></v-checkbox>
              
              <v-text-field
                v-model="report.clientName"
                label="Client Name"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :disabled="!report.clientApproval"
              ></v-text-field>
              
              <v-text-field
                v-model="report.clientPosition"
                label="Position"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :disabled="!report.clientApproval"
              ></v-text-field>
              
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="report.signatureDate ? formatDate(report.signatureDate) : ''"
                    label="Date"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    :disabled="!report.clientApproval"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="report.signatureDate"></v-date-picker>
              </v-menu>
              
              <v-btn
                color="primary"
                block
                class="mt-4"
                :disabled="!report.clientApproval"
                @click="submitFinalReport"
              >
                Submit Final Report
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Action Buttons -->
      <v-bottom-navigation class="mt-8" color="primary">
        <v-btn @click="$emit('navigate', 'handover')">
          <v-icon>mdi-arrow-left</v-icon>
          Previous: Handover
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="saveDraft">
          <v-icon start>mdi-content-save</v-icon>
          Save Draft
        </v-btn>
      </v-bottom-navigation>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const projectId = route.params.id
  
  // Report data
  const report = ref({
    projectName: 'Project Name',
    projectManager: 'John Doe',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    executiveSummary: '',
    performance: 'Met Expectations',
    achievements: '',
    challenges: '',
    budgetAdherence: 85,
    scheduleAdherence: 90,
    qualityStandards: 88,
    lessonsLearned: '',
    recommendations: '',
    completionPercentage: 95,
    clientApproval: false,
    clientName: '',
    clientPosition: '',
    signatureDate: null
  })
  
  const performanceOptions = [
    'Exceeded Expectations',
    'Met Expectations',
    'Partially Met Expectations',
    'Did Not Meet Expectations'
  ]
  
  const stats = ref([
    {
      title: 'Total Budget',
      value: '$1,250,000',
      icon: 'mdi-cash',
      color: 'primary',
      change: '5% under budget'
    },
    {
      title: 'Duration',
      value: '12 months',
      icon: 'mdi-calendar',
      color: 'secondary',
      change: '2 weeks ahead'
    },
    {
      title: 'Team Members',
      value: '24',
      icon: 'mdi-account-group',
      color: 'success',
      change: '4 teams'
    },
    {
      title: 'Deliverables',
      value: '98%',
      icon: 'mdi-check-all',
      color: 'info',
      change: '2 pending'
    }
  ])
  
  const completionItems = ref([
    { title: 'Project Planning', subtitle: 'Completed', completed: true },
    { title: 'Procurement', subtitle: 'Completed', completed: true },
    { title: 'Production', subtitle: 'Completed', completed: true },
    { title: 'Setup', subtitle: 'Completed', completed: true },
    { title: 'Handover', subtitle: 'Completed', completed: true },
    { title: 'Documentation', subtitle: 'In Progress', completed: false }
  ])
  
  // Methods
  const generateFinalReport = () => {
    console.log('Generating final report...')
    // Implementation for generating PDF report
  }
  
  const saveDraft = () => {
    console.log('Saving draft...', report.value)
    // Implementation for saving draft
  }
  
  const submitFinalReport = () => {
    console.log('Submitting final report...', report.value)
    // Implementation for submitting final report
  }
  
  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Lifecycle hooks
  onMounted(() => {
    // Load report data from API or store
    console.log('ReportPhase mounted for project:', projectId)
  })
  </script>
  
  <style scoped>
  /* Custom styles that can't be handled by Tailwind */
  .v-bottom-navigation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 12px 24px;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    background-color: white;
  }
  .v-card {
    margin-bottom: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .v-card-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  .v-card-text {
    font-size: 1rem;
  }
  .v-list-item-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  .v-list-item-subtitle {
    font-size: 1rem;
  }
  </style>