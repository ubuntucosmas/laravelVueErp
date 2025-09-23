import { ref, computed } from 'vue'
import type { ElementTemplate, ElementTemplateFilter, ElementTemplateStats } from '../types'

export function useElementTemplates() {
  const templates = ref<ElementTemplate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const mockTemplates: ElementTemplate[] = [
    {
      id: '1',
      name: 'Exhibition Booth 3x3m Standard',
      description: 'Complete exhibition booth setup with standard components',
      category: 'production',
      tags: ['exhibition', 'booth', 'standard'],
      created_by: 1,
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T10:00:00Z',
      usage_count: 15,
      elements: [
        {
          id: '1-1',
          elementName: 'Aluminum Frame Structure',
          description: 'Main structural frame for the booth',
          category: 'production',
          subItems: [
            {
              id: '1-1-1',
              name: 'Aluminum Frame 2x3m',
              quantity: 4,
              unit: 'pcs',
              unitPrice: 15000,
              category: 'hire',
              comment: 'Main structural frame'
            }
          ]
        },
        {
          id: '1-2',
          elementName: 'Display Panels',
          description: 'LED display panels and graphics',
          category: 'production',
          subItems: [
            {
              id: '1-2-1',
              name: 'LED Panel 50"',
              quantity: 2,
              unit: 'pcs',
              unitPrice: 25000,
              category: 'hire',
              comment: 'High-brightness display panels'
            }
          ]
        },
        {
          id: '1-3',
          elementName: 'Flooring',
          description: 'Carpet tiles for the booth floor',
          category: 'production',
          subItems: [
            {
              id: '1-3-1',
              name: 'Carpet Tiles',
              quantity: 20,
              unit: 'sqm',
              unitPrice: 5000,
              category: 'production',
              comment: 'Premium carpet flooring'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Conference Room Setup',
      description: 'Standard conference room equipment and materials',
      category: 'hire',
      tags: ['conference', 'meeting', 'room'],
      created_by: 1,
      created_at: '2025-02-01T14:30:00Z',
      updated_at: '2025-02-01T14:30:00Z',
      usage_count: 8,
      elements: [
        {
          id: '2-1',
          elementName: 'AV Equipment',
          description: 'Audio-visual equipment for presentations',
          category: 'hire',
          subItems: [
            {
              id: '2-1-1',
              name: 'Projector HD',
              quantity: 1,
              unit: 'pcs',
              unitPrice: 10000,
              category: 'hire',
              comment: 'High-definition projector'
            },
            {
              id: '2-1-2',
              name: 'Wireless Microphone',
              quantity: 2,
              unit: 'pcs',
              unitPrice: 3000,
              category: 'hire',
              comment: 'Wireless lapel microphones'
            }
          ]
        }
      ]
    }
  ]

  const fetchTemplates = async (filter?: ElementTemplateFilter) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/api/creatives/element-templates', { params: filter })

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredTemplates = [...mockTemplates]

      if (filter) {
        if (filter.search) {
          const searchTerm = filter.search.toLowerCase()
          filteredTemplates = filteredTemplates.filter(template =>
            template.name.toLowerCase().includes(searchTerm) ||
            template.description?.toLowerCase().includes(searchTerm) ||
            template.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
          )
        }

        if (filter.category) {
          filteredTemplates = filteredTemplates.filter(template => template.category === filter.category)
        }

        if (filter.tags && filter.tags.length > 0) {
          filteredTemplates = filteredTemplates.filter(template =>
            filter.tags!.some(tag => template.tags?.includes(tag))
          )
        }

        // Sort
        const sortBy = filter.sortBy || 'name'
        const sortOrder = filter.sortOrder || 'asc'

        filteredTemplates.sort((a, b) => {
          let aValue: string | number = a[sortBy as keyof ElementTemplate] as string | number
          let bValue: string | number = b[sortBy as keyof ElementTemplate] as string | number

          if (sortBy === 'usage_count') {
            aValue = a.usage_count || 0
            bValue = b.usage_count || 0
          }

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase()
            bValue = (bValue as string).toLowerCase()
          }

          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }

      templates.value = filteredTemplates
    } catch (err) {
      error.value = 'Failed to fetch element templates'
      console.error('Error fetching templates:', err)
    } finally {
      loading.value = false
    }
  }

  const createTemplate = async (templateData: Omit<ElementTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/api/creatives/element-templates', templateData)

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newTemplate: ElementTemplate = {
        ...templateData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0
      }

      templates.value.push(newTemplate)
      return newTemplate
    } catch (err) {
      error.value = 'Failed to create element template'
      console.error('Error creating template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTemplate = async (id: string, templateData: Partial<ElementTemplate>) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/api/creatives/element-templates/${id}`, templateData)

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = templates.value.findIndex(t => t.id === id)
      if (index >= 0) {
        templates.value[index] = {
          ...templates.value[index],
          ...templateData,
          updated_at: new Date().toISOString()
        }
      }
    } catch (err) {
      error.value = 'Failed to update element template'
      console.error('Error updating template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTemplate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // await api.delete(`/api/creatives/element-templates/${id}`)

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = templates.value.findIndex(t => t.id === id)
      if (index >= 0) {
        templates.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete element template'
      console.error('Error deleting template:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const duplicateTemplate = async (id: string, newName?: string) => {
    const originalTemplate = templates.value.find(t => t.id === id)
    if (!originalTemplate) {
      throw new Error('Template not found')
    }

    const duplicatedTemplate = {
      ...originalTemplate,
      name: newName || `${originalTemplate.name} (Copy)`,
      id: '', // Will be set by createTemplate
      created_at: '',
      updated_at: '',
      usage_count: 0
    }

    return await createTemplate(duplicatedTemplate)
  }

  const incrementUsageCount = async (id: string) => {
    const template = templates.value.find(t => t.id === id)
    if (template) {
      template.usage_count = (template.usage_count || 0) + 1
      // TODO: Update via API
    }
  }

  const stats = computed<ElementTemplateStats>(() => {
    const total = templates.value.length
    const production = templates.value.filter(t => t.category === 'production').length
    const hire = templates.value.filter(t => t.category === 'hire').length

    const mostUsed = templates.value.reduce((prev, current) => {
      const prevCount = prev?.usage_count || 0
      const currentCount = current?.usage_count || 0
      return currentCount > prevCount ? current : prev
    }, null as ElementTemplate | null)

    return {
      total,
      production,
      hire,
      mostUsed
    }
  })

  return {
    templates: computed(() => templates.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    stats,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    incrementUsageCount
  }
}
