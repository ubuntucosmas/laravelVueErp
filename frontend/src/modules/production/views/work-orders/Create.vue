<template>
  <transition name="fade-scale">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center" @keydown.esc="handleClose" tabindex="0">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click.self="handleClose"></div>
      <div class="relative w-full max-w-5xl mx-auto my-6 sm:my-10">
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col p-0 sm:p-0 animate-scale-in max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <button @click="handleClose" aria-label="Close" class="absolute top-2 right-2 z-10 rounded-full bg-white dark:bg-gray-800 p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="h-5 w-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Header/Info Section -->
    <div class="bg-gray-600 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-2">
      <div class="flex-1">
        <div class="text-xs uppercase tracking-wider font-semibold opacity-80">Production Order</div>
        <div class="text-xl font-bold">{{ enquiry?.title }}</div>
        <div class="text-sm opacity-90 mt-1">{{ enquiry?.description }}</div>
      </div>
      <div class="flex flex-col gap-1 text-right sm:ml-6">
        <span class="text-xs font-medium">Client:</span>
        <span class="font-semibold">{{ enquiry?.client?.name }}</span>
        <span class="text-xs font-medium mt-2">Priority:</span>
        <span class="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">{{ enquiry?.priority }}</span>
        <span class="text-xs font-medium mt-2">Status:</span>
        <span class="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold">{{ enquiry?.status }}</span>
      </div>
    </div>

    <!-- Briefing Section -->
    <div class="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Briefing</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Briefing Date</label>
          <input type="date" v-model="briefingDate" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Briefed By</label>
          <input type="text" v-model="briefedBy" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white" placeholder="Name" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Instructions / Special Considerations</label>
        <textarea v-model="briefingNotes" rows="3" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white" placeholder="Any special instructions or considerations..."></textarea>
      </div>
    </div>

    <!-- Materials Section -->
    <div class="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Materials</h3>
        <button @click="addMaterial" class="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Add Material
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Material</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
              <th class="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Notes</th>
              <th class="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mat, idx) in materials" :key="idx" class="border-b last:border-b-0">
              <td class="px-3 py-2">
                <select v-model="mat.material_id" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white">
                  <option value="">Select...</option>
                  <option v-for="m in availableMaterials" :key="m.id" :value="m.id">{{ m.name }} ({{ m.sku }})</option>
                </select>
              </td>
              <td class="px-3 py-2">
                <input type="number" min="1" v-model.number="mat.quantity" class="w-20 rounded border-gray-300 dark:bg-gray-700 dark:text-white" />
              </td>
              <td class="px-3 py-2">
                <input type="text" v-model="mat.notes" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white" placeholder="Notes" />
              </td>
              <td class="px-3 py-2 text-right">
                <button @click="removeMaterial(idx)" class="text-red-600 hover:text-red-800 text-xs font-semibold">Remove</button>
              </td>
            </tr>
            <tr v-if="materials.length === 0">
              <td colspan="4" class="text-center text-gray-400 py-4">No materials added.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tasks Section -->
    <div class="px-6 py-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
        <button @click="addTask" class="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Add Task
        </button>
      </div>
      <div class="space-y-4">
        <div v-for="(task, idx) in tasks" :key="idx" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start">
          <div class="flex-1">
            <input v-model="task.title" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white mb-2" placeholder="Task Title" />
            <textarea v-model="task.description" rows="2" class="w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white" placeholder="Description"></textarea>
          </div>
          <div class="flex flex-col gap-2 min-w-[130px]">
            <select v-model="task.status" class="rounded border-gray-300 dark:bg-gray-700 dark:text-white">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
            <input v-model="task.assigned_to" class="rounded border-gray-300 dark:bg-gray-700 dark:text-white" placeholder="Assigned To" />
            <div class="flex gap-2">
              <input v-model="task.start_date" type="date" class="rounded border-gray-300 dark:bg-gray-700 dark:text-white" />
              <input v-model="task.due_date" type="date" class="rounded border-gray-300 dark:bg-gray-700 dark:text-white" />
            </div>
            <button @click="removeTask(idx)" class="text-red-600 hover:text-red-800 text-xs mt-2">Remove</button>
          </div>
        </div>
        <div v-if="tasks.length === 0" class="text-center text-gray-400 py-4">No tasks added.</div>
      </div>
    </div>
    <!-- Sticky Save Button -->
    <div class="sticky bottom-0 left-0 w-full bg-gradient-to-t from-white/90 dark:from-gray-900/90 to-transparent px-6 py-4 flex justify-end z-20 border-t border-gray-200 dark:border-gray-700">
      <button @click="saveAll" class="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition">
        Save
      </button>
    </div>
    </div>      
    </div>
    </div>
   
  </transition>
</template>



<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const briefingDate = ref<string>('')
const briefedBy = ref<string>('')
const briefingNotes = ref<string>('')

const props = defineProps<{ enquiry: any }>()
const emit = defineEmits(['close'])

// Modal visibility (always true when used as modal)
const visible = true

function handleClose() {
  emit('close')
}

// Demo available materials
const availableMaterials = [
  { id: 1, name: 'Oak Wood Plank', sku: 'WOOD-OAK-01' },
  { id: 2, name: 'MDF Board', sku: 'MDF-18MM' },
  { id: 3, name: 'Varnish - Clear', sku: 'VARN-CLEAR-1L' }
]

const materials = ref<{ material_id: string | number; quantity: number; notes: string }[]>([])
const tasks = ref<{ title: string; description: string; status: string; assigned_to: string; start_date: string; due_date: string }[]>([])

function addMaterial() {
  materials.value.push({ material_id: '', quantity: 1, notes: '' })
}
function removeMaterial(idx: number) {
  materials.value.splice(idx, 1)
}
function addTask() {
  tasks.value.push({
    title: '', description: '', status: 'pending', assigned_to: '', start_date: '', due_date: ''
  })
}
function removeTask(idx: number) {
  tasks.value.splice(idx, 1)
}
function saveAll() {
  // TODO: Integrate with backend or parent modal handler
  alert('Save action triggered!')
}
</script>

