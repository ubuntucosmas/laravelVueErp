import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import type { MaterialList, MaterialItem, MaterialCategory } from '../types'

export function useMaterials() {
  const materialLists = ref<MaterialList[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all material lists with optional filtering
  const fetchMaterialLists = async (filters?: { project_id?: number; enquiry_id?: number; status?: string }) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      if (filters) {
        if (filters.project_id) params.append('project_id', filters.project_id.toString())
        if (filters.enquiry_id) params.append('enquiry_id', filters.enquiry_id.toString())
        if (filters.status) params.append('status', filters.status)
      }

      const response = await axios.get(`/creatives/materials?${params}`)
      materialLists.value = response.data.data || response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch material lists'
      console.error('Error fetching material lists:', err)
    } finally {
      loading.value = false
    }
  }

  // Get single material list by ID
  const fetchMaterialList = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`/creatives/materials/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch material list'
      console.error('Error fetching material list:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create new material list
  const createMaterialList = async (materialListData: Partial<MaterialList>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/creatives/materials', materialListData)
      materialLists.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create material list'
      console.error('Error creating material list:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update material list
  const updateMaterialList = async (id: number, materialListData: Partial<MaterialList>) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.put(`/creatives/materials/${id}`, materialListData)
      const index = materialLists.value.findIndex(m => m.id === id)
      if (index !== -1) {
        materialLists.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update material list'
      console.error('Error updating material list:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete material list
  const deleteMaterialList = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await axios.delete(`/creatives/materials/${id}`)
      materialLists.value = materialLists.value.filter(m => m.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete material list'
      console.error('Error deleting material list:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add item to material list
  const addMaterialItem = async (materialListId: number, item: Omit<MaterialItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.post(`/creatives/materials/${materialListId}/items`, item)
      const materialList = materialLists.value.find(m => m.id === materialListId)
      if (materialList) {
        materialList.items.push(response.data)
        materialList.totalCost = materialList.items.reduce((sum, item) => sum + item.totalPrice, 0)
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add material item'
      console.error('Error adding material item:', err)
      throw err
    }
  }

  // Update material item
  const updateMaterialItem = async (materialListId: number, itemId: number, item: Partial<MaterialItem>) => {
    try {
      const response = await axios.put(`/creatives/materials/${materialListId}/items/${itemId}`, item)
      const materialList = materialLists.value.find(m => m.id === materialListId)
      if (materialList) {
        const itemIndex = materialList.items.findIndex(i => i.id === itemId)
        if (itemIndex !== -1) {
          materialList.items[itemIndex] = response.data
          materialList.totalCost = materialList.items.reduce((sum, item) => sum + item.totalPrice, 0)
        }
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update material item'
      console.error('Error updating material item:', err)
      throw err
    }
  }

  // Delete material item
  const deleteMaterialItem = async (materialListId: number, itemId: number) => {
    try {
      await axios.delete(`/creatives/materials/${materialListId}/items/${itemId}`)
      const materialList = materialLists.value.find(m => m.id === materialListId)
      if (materialList) {
        materialList.items = materialList.items.filter(i => i.id !== itemId)
        materialList.totalCost = materialList.items.reduce((sum, item) => sum + item.totalPrice, 0)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete material item'
      console.error('Error deleting material item:', err)
      throw err
    }
  }

  // Get material categories
  const getMaterialCategories = (): MaterialCategory[] => {
    return [
      { id: 'production', name: 'Production Items', icon: 'bi-gear', color: 'blue' },
      { id: 'hire', name: 'Items for Hire', icon: 'bi-calendar-check', color: 'green' }
    ]
  }

  // Computed properties
  const draftMaterialLists = computed(() =>
    materialLists.value.filter(m => m.status === 'draft')
  )

  const approvedMaterialLists = computed(() =>
    materialLists.value.filter(m => m.status === 'approved')
  )

  const finalizedMaterialLists = computed(() =>
    materialLists.value.filter(m => m.status === 'finalized')
  )

  const productionItems = computed(() => {
    const allItems: MaterialItem[] = []
    materialLists.value.forEach(list => {
      allItems.push(...list.items.filter(item => item.category === 'production'))
    })
    return allItems
  })

  const hireItems = computed(() => {
    const allItems: MaterialItem[] = []
    materialLists.value.forEach(list => {
      allItems.push(...list.items.filter(item => item.category === 'hire'))
    })
    return allItems
  })

  return {
    // State
    materialLists,
    loading,
    error,

    // Actions
    fetchMaterialLists,
    fetchMaterialList,
    createMaterialList,
    updateMaterialList,
    deleteMaterialList,
    addMaterialItem,
    updateMaterialItem,
    deleteMaterialItem,
    getMaterialCategories,

    // Computed
    draftMaterialLists,
    approvedMaterialLists,
    finalizedMaterialLists,
    productionItems,
    hireItems
  }
}
