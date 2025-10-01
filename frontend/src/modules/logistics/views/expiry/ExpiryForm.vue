<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                {{ formTitle }}
              </DialogTitle>
              
              <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Document Type -->
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Document Type <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="formData.type"
                      required
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select document type</option>
                      <option value="insurance">Insurance</option>
                      <option value="inspection">Inspection</option>
                      <option value="tracking">Car Tracking</option>
                      <option value="license">License</option>
                    </select>
                  </div>

                  <!-- Document Number -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Document Number <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.documentNumber"
                      type="text"
                      required
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <!-- Vehicle -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Vehicle <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="formData.vehicleId"
                      required
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      @change="updateVehicleInfo"
                    >
                      <option value="">Select vehicle</option>
                      <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                        {{ vehicle.registration }} - {{ vehicle.model }}
                      </option>
                    </select>
                  </div>

                  <!-- Issue Date -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Issue Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.issueDate"
                      type="date"
                      required
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <!-- Expiry Date -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.expiryDate"
                      type="date"
                      required
                      :min="formData.issueDate"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <!-- Notes -->
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      v-model="formData.notes"
                      rows="3"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                  </div>

                  <!-- Document Upload -->
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload Document
                    </label>
                    <div class="mt-1 flex items-center">
                      <input
                        type="file"
                        ref="fileInput"
                        class="hidden"
                        @change="handleFileUpload"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <button
                        type="button"
                        @click="fileInput?.click()"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                      >
                        <svg
                          class="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ formData.documentFile ? formData.documentFile.name : 'Choose file' }}
                      </button>
                      <span v-if="formData.documentFile" class="ml-2 text-sm text-gray-500 dark:text-gray-300">
                        {{ formatFileSize(formData.documentFile.size) }}
                      </span>
                    </div>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PDF, JPG, or PNG (max. 5MB)
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {{ isEditing ? 'Update' : 'Save' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import type { ExpiryItem, Vehicle } from '../../types/logistics';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object as () => ExpiryItem | null,
    default: null
  },
  vehicles: {
    type: Array as () => Vehicle[],
    required: true
  }
});

const emit = defineEmits(['save', 'close']);

// Refs
const fileInput = ref<HTMLInputElement | null>(null);

// Form data
const formData = ref<Partial<ExpiryItem>>({
  type: undefined,
  documentNumber: '',
  vehicleId: 0,
  vehicleRegistration: '',
  vehicleModel: '',
  issueDate: '',
  expiryDate: '',
  notes: '',
  documentFile: undefined
});

// Computed properties
const formTitle = computed(() => {
  return props.item ? 'Edit Expiry Record' : 'Add New Expiry Record';
});

const isEditing = computed(() => !!props.item);

// Methods
const resetForm = () => {
  formData.value = {
    type: undefined,
    documentNumber: '',
    vehicleId: 0,
    vehicleRegistration: '',
    vehicleModel: '',
    issueDate: '',
    expiryDate: '',
    notes: '',
    documentFile: undefined
  };
};

const updateVehicleInfo = () => {
  if (formData.value.vehicleId) {
    const vehicle = props.vehicles.find(v => v.id === formData.value.vehicleId);
    if (vehicle) {
      formData.value.vehicleRegistration = vehicle.registration;
      formData.value.vehicleModel = vehicle.model;
    }
  } else {
    formData.value.vehicleRegistration = '';
    formData.value.vehicleModel = '';
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    formData.value.documentFile = file;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleSubmit = () => {
  // In a real app, you would validate the form data here
  emit('save', { ...formData.value });
};

const closeModal = () => {
  resetForm();
  emit('close');
};

// Lifecycle hooks
onMounted(() => {
  if (props.item) {
    // If editing, populate form with item data
    formData.value = { ...props.item };
  }
});
</script>
