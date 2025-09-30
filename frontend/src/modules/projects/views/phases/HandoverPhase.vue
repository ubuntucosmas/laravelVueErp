<template>
  <div class="handover-phase">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Client Handover</h2>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            Complete Handover
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Handover Checklist -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Handover Checklist</h3>
          </div>
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="(item, index) in handoverChecklist" :key="index" class="p-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input 
                    :id="'checklist-' + item.id" 
                    v-model="item.completed" 
                    type="checkbox" 
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    @change="updateChecklistItem(item)"
                  >
                </div>
                <div class="ml-3">
                  <label :for="'checklist-' + item.id" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ item.title }}
                  </label>
                  <p v-if="item.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ item.description }}
                  </p>
                  <div v-if="item.completed" class="mt-2 text-xs text-green-600 dark:text-green-400">
                    Completed on {{ formatDate(item.completedDate) }}
                  </div>
                </div>
                <div class="ml-auto">
                  <span :class="getStatusBadgeClass(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ item.status }}
                  </span>
                </div>
              </div>
              <div v-if="item.requiresSignature && item.completed" class="mt-3 ml-7 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    Signed by {{ item.signedBy || 'Client' }} on {{ formatDate(item.completedDate) }}
                  </span>
                </div>
                <div v-if="item.signatureNotes" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ item.signatureNotes }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Handover Documents -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Handover Documents</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(doc, index) in handoverDocuments" :key="index" class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div class="p-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 p-2 rounded-md">
                      <svg class="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ doc.name }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ doc.size }} • {{ doc.type }}</p>
                    </div>
                  </div>
                  <div class="mt-4 flex justify-between items-center">
                    <span :class="getDocumentStatusClass(doc.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ doc.status }}
                    </span>
                    <div class="flex space-x-2">
                      <button @click="previewDocument(doc)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button @click="downloadDocument(doc)" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6">
              <button @click="uploadDocument" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Upload Document
              </button>
            </div>
          </div>
        </div>

        <!-- Client Feedback -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Client Feedback</h3>
          </div>
          <div class="p-6">
            <div v-if="clientFeedback">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                    {{ clientFeedback.clientName.charAt(0) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="flex items-center">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ clientFeedback.clientName }}</h4>
                    <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(clientFeedback.date) }}
                    </span>
                  </div>
                  <div class="mt-1 flex items-center">
                    <div class="flex items-center">
                      <template v-for="i in 5" :key="i">
                        <svg v-if="i <= clientFeedback.rating" class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg v-else class="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </template>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {{ clientFeedback.comments }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No feedback yet</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Client feedback will appear here once submitted.</p>
              <div class="mt-6">
                <button @click="requestFeedback" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Request Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  phase: {
    type: Object,
    default: () => ({
      id: 'handover',
      name: 'Handover',
      status: 'pending',
      startDate: '',
      endDate: '',
      progress: 0
    })
  }
});

const emit = defineEmits(['update:phase']);

const localPhase = ref({
  ...props.phase,
  status: props.phase.status || 'pending',
  progress: props.phase.progress || 0
});

// Sample data - in a real app, this would come from an API
const handoverChecklist = ref([
  {
    id: 1,
    title: 'Final inspection completed',
    description: 'Ensure all work has been inspected and approved',
    completed: true,
    completedDate: '2023-12-01',
    status: 'Completed',
    requiresSignature: true,
    signedBy: 'John Smith',
    signatureNotes: 'All work completed to satisfaction'
  },
  {
    id: 2,
    title: 'Warranty information provided',
    description: 'Provide warranty documents and information',
    completed: true,
    completedDate: '2023-12-01',
    status: 'Completed',
    requiresSignature: true,
    signedBy: 'Jane Doe'
  },
  {
    id: 3,
    title: 'Operation and maintenance manuals',
    description: 'Provide all necessary manuals and documentation',
    completed: false,
    completedDate: null,
    status: 'Pending',
    requiresSignature: true
  },
  {
    id: 4,
    title: 'Training session completed',
    description: 'Conduct training session for client staff',
    completed: false,
    completedDate: null,
    status: 'Pending',
    requiresSignature: true
  },
  {
    id: 5,
    title: 'Final payment received',
    description: 'Confirm receipt of final payment',
    completed: false,
    completedDate: null,
    status: 'Pending',
    requiresSignature: true
  }
]);

const handoverDocuments = ref([
  {
    id: 1,
    name: 'Final Inspection Report.pdf',
    type: 'PDF',
    size: '2.4 MB',
    status: 'Signed',
    uploadedDate: '2023-12-01',
    url: '#'
  },
  {
    id: 2,
    name: 'Warranty Certificate.pdf',
    type: 'PDF',
    size: '1.8 MB',
    status: 'Signed',
    uploadedDate: '2023-12-01',
    url: '#'
  },
  {
    id: 3,
    name: 'Operation Manual.docx',
    type: 'Word',
    size: '3.2 MB',
    status: 'Draft',
    uploadedDate: '2023-11-30',
    url: '#'
  },
  {
    id: 4,
    name: 'Maintenance Schedule.xlsx',
    type: 'Excel',
    size: '1.1 MB',
    status: 'Draft',
    uploadedDate: '2023-11-30',
    url: '#'
  },
  {
    id: 5,
    name: 'Training Materials.zip',
    type: 'ZIP',
    size: '15.7 MB',
    status: 'In Review',
    uploadedDate: '2023-11-29',
    url: '#'
  },
  {
    id: 6,
    name: 'Final Invoice.pdf',
    type: 'PDF',
    size: '0.8 MB',
    status: 'Pending Approval',
    uploadedDate: '2023-11-28',
    url: '#'
  }
]);

const clientFeedback = ref({
  clientName: 'Sarah Johnson',
  date: '2023-12-02',
  rating: 4,
  comments: 'Overall very satisfied with the project. The team was professional and the work was completed on time. There were a few minor issues that needed addressing, but they were resolved quickly.',
  improvements: 'Better communication about the project timeline would be appreciated.'
});

// Computed properties
const completionPercentage = computed(() => {
  const totalItems = handoverChecklist.value.length;
  const completedItems = handoverChecklist.value.filter(item => item.completed).length;
  return Math.round((completedItems / totalItems) * 100);
});

// Methods
const updateChecklistItem = (item: any) => {
  if (item.completed) {
    item.status = 'Completed';
    item.completedDate = new Date().toISOString().split('T')[0];
    
    if (item.requiresSignature) {
      // In a real app, this would open a signature modal
      console.log('Requesting signature for:', item.title);
      item.signedBy = 'Client Name';
    }
  } else {
    item.status = 'Pending';
    item.completedDate = null;
    item.signedBy = null;
  }
};

const previewDocument = (doc: any) => {
  // In a real app, this would open a document preview
  console.log('Preview document:', doc.name);
};

const downloadDocument = (doc: any) => {
  // In a real app, this would trigger a file download
  console.log('Download document:', doc.name);
};

const uploadDocument = () => {
  // In a real app, this would open a file upload dialog
  console.log('Upload document');
};

const requestFeedback = () => {
  // In a real app, this would send a feedback request to the client
  console.log('Request feedback');
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusBadgeClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'Completed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Signed': 'bg-purple-100 text-purple-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getDocumentStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    'Signed': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800',
    'In Review': 'bg-blue-100 text-blue-800',
    'Pending Approval': 'bg-purple-100 text-purple-800',
    'Rejected': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

// Watch for changes in local phase and emit updates
watch(localPhase, (newVal) => {
  emit('update:phase', newVal);
}, { deep: true });
</script>

<style scoped>
.handover-phase {
  @apply space-y-6;
}
</style>
