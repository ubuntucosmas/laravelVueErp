import axios from '@/plugins/axios'

export interface MaterialsTaskData {
  projectInfo: ProjectInfo
  projectElements: ProjectElement[]
  availableElements: ElementTemplate[]
}

export interface ProjectInfo {
  projectId: string
  enquiryTitle: string
  clientName: string
  eventVenue: string
  setupDate: string
  setDownDate: string
}

export interface ProjectElement {
  id: string
  templateId?: string
  elementType: string
  name: string
  category: 'production' | 'hire' | 'outsourced'
  dimensions: {
    length: string
    width: string
    height: string
  }
  isIncluded: boolean
  materials: MaterialItem[]
  notes?: string
  addedAt: Date
}

export interface MaterialItem {
  id: string
  description: string
  unitOfMeasurement: string
  quantity: number
  isIncluded: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ElementTemplate {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  color: string
  order: number
  defaultMaterials: MaterialTemplate[]
}

export interface MaterialTemplate {
  id: string
  description: string
  unitOfMeasurement: string
  defaultQuantity: number
  isDefaultIncluded: boolean
  order: number
}

export interface CreateElementTemplateData {
  name: string
  displayName: string
  description?: string
  category: string
  color?: string
  defaultMaterials: Omit<MaterialTemplate, 'id'>[]
}

export class MaterialsService {
  /**
    * Get materials data for a task
    */
  static async getMaterialsData(taskId: number): Promise<MaterialsTaskData> {
    const response = await axios.get(`/api/projects/tasks/${taskId}/materials`)
    return response.data.data
  }

  /**
    * Save materials data for a task
    */
  static async saveMaterialsData(taskId: number, data: MaterialsTaskData): Promise<MaterialsTaskData> {
    // Validate data before sending
    const validation = this.validateMaterialsData(data)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    // Transform data for backend
    const transformedData = this.transformDataForBackend(data)

    const response = await axios.post(`/api/projects/tasks/${taskId}/materials`, transformedData)
    return response.data.data
  }

  /**
   * Validate materials data before submission
   */
  private static validateMaterialsData(data: MaterialsTaskData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate project info
    if (!data.projectInfo) {
      errors.push('Project information is required')
    }

    // Validate project elements
    if (!data.projectElements || !Array.isArray(data.projectElements)) {
      errors.push('Project elements must be an array')
    } else {
      data.projectElements.forEach((element, index) => {
        if (!element.id || typeof element.id !== 'string') {
          errors.push(`Element ${index + 1}: ID is required and must be a string`)
        }
        if (!element.elementType || typeof element.elementType !== 'string') {
          errors.push(`Element ${index + 1}: Element type is required`)
        }
        if (!element.name || typeof element.name !== 'string') {
          errors.push(`Element ${index + 1}: Name is required`)
        }
        if (!['production', 'hire', 'outsourced'].includes(element.category)) {
          errors.push(`Element ${index + 1}: Category must be production, hire, or outsourced`)
        }
        if (!element.materials || !Array.isArray(element.materials)) {
          errors.push(`Element ${index + 1}: Materials must be an array`)
        } else {
          element.materials.forEach((material, materialIndex) => {
            if (!material.description || typeof material.description !== 'string') {
              errors.push(`Element ${index + 1}, Material ${materialIndex + 1}: Description is required`)
            }
            if (!material.unitOfMeasurement || typeof material.unitOfMeasurement !== 'string') {
              errors.push(`Element ${index + 1}, Material ${materialIndex + 1}: Unit of measurement is required`)
            }
            if (typeof material.quantity !== 'number' || material.quantity < 0) {
              errors.push(`Element ${index + 1}, Material ${materialIndex + 1}: Quantity must be a non-negative number`)
            }
          })
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Transform frontend data to match backend expectations
   */
  private static transformDataForBackend(data: MaterialsTaskData): any {
    return {
      projectInfo: data.projectInfo,
      projectElements: data.projectElements.map(element => ({
        id: element.id,
        elementType: element.elementType,
        templateId: element.templateId || null,
        name: element.name,
        category: element.category,
        dimensions: element.dimensions || {},
        isIncluded: element.isIncluded,
        notes: element.notes || null,
        materials: element.materials.map(material => ({
          id: material.id,
          description: material.description,
          unitOfMeasurement: material.unitOfMeasurement,
          quantity: material.quantity,
          isIncluded: material.isIncluded,
          notes: material.notes || null
        }))
      })),
      availableElements: data.availableElements || []
    }
  }

  /**
   * Get available element templates
   */
  static async getElementTemplates(): Promise<ElementTemplate[]> {
    const response = await axios.get('/api/projects/element-templates')
    return response.data.data
  }

  /**
   * Create a new element template
   */
  static async createElementTemplate(data: CreateElementTemplateData): Promise<ElementTemplate> {
    const response = await axios.post('/api/projects/element-templates', data)
    return response.data.data
  }
}
