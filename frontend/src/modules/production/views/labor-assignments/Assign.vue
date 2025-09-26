<!-- src/modules/production/views/labor-assignments/Assign.vue -->
<template>
    <div class="container mx-auto p-4">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Assign Labor</h1>
        <p class="text-gray-600 dark:text-gray-300">Project: {{ project?.title }}</p>
      </div>
  
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="currentTab = tab.key"
              :class="[
                currentTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
                'whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
  
        <div class="p-6">
          <div v-if="currentTab === 'workshop'" class="space-y-6">
            <LaborAssignmentForm
              category="workshop"
              :project-id="Number($route.params.id)"
              :existing-assignments="project?.workshop_labor || []"
              @assigned="handleAssigned"
            />
          </div>
  
          <div v-else-if="currentTab === 'setup'" class="space-y-6">
            <LaborAssignmentForm
              category="setup"
              :project-id="Number($route.params.id)"
              :existing-assignments="project?.setup_labor || []"
              @assigned="handleAssigned"
            />
          </div>
  
          <div v-else-if="currentTab === 'setdown'" class="space-y-6">
            <LaborAssignmentForm
              category="setdown"
              :project-id="Number($route.params.id)"
              :existing-assignments="project?.setdown_labor || []"
              @assigned="handleAssigned"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import LaborAssignmentForm from '../../components/LaborAssignmentForm.vue';
  import { useLaborAssignments } from '../../composables/useLaborAssignments';
  
  const route = useRoute();
  const { currentProject, fetchProjectAssignments } = useLaborAssignments();
  
  const tabs = [
    { name: 'Workshop Labor', key: 'workshop' },
    { name: 'Setup Labor', key: 'setup' },
    { name: 'Setdown Labor', key: 'setdown' }
  ];
  
  const currentTab = ref('workshop');
  const project = ref(currentProject);
  
  onMounted(async () => {
    const projectId = Number(route.params.id);
    if (projectId) {
      await fetchProjectAssignments(projectId);
      project.value = currentProject.value;
    }
  });
  
  const handleAssigned = (assignment: any) => {
    console.log('Assigned:', assignment);
    // Refresh project data
    fetchProjectAssignments(Number(route.params.id));
  };
  </script>