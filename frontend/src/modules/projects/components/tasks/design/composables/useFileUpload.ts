import { ref, computed } from 'vue'
import type {
  FileUpload,
  DesignAsset,
  UploadResult,
  UploadConfig,
  AssetMetadata
} from '../types/design'

/**
 * Composable for handling file uploads with progress tracking and error recovery
 */
export function useFileUpload(config: UploadConfig) {
  const uploads = ref<FileUpload[]>([])
  const isUploading = ref(false)

  // Computed properties
  const activeUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'uploading')
  )

  const completedUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'completed')
  )

  const failedUploads = computed(() =>
    uploads.value.filter(upload => upload.status === 'failed')
  )

  const totalProgress = computed(() => {
    if (uploads.value.length === 0) return 0
    const total = uploads.value.reduce((sum, upload) => sum + upload.progress, 0)
    return Math.round(total / uploads.value.length)
  })

  /**
   * Uploads multiple files with concurrency control
   */
  const uploadFiles = async (
    files: File[],
    onProgress?: (upload: FileUpload) => void,
    onComplete?: (result: UploadResult) => void
  ): Promise<UploadResult[]> => {
    isUploading.value = true
    const results: UploadResult[] = []

    try {
      // Create upload objects
      const fileUploads = files.map(file => createUploadObject(file))
      uploads.value.push(...fileUploads)

      // Process uploads with concurrency limit
      const batches = chunkArray(fileUploads, config.maxConcurrentUploads)

      for (const batch of batches) {
        const batchPromises = batch.map(upload =>
          uploadFile(upload, onProgress, onComplete)
        )
        const batchResults = await Promise.allSettled(batchPromises)

        batchResults.forEach((result) => {
          const uploadResult = result.status === 'fulfilled'
            ? result.value
            : { success: false, error: result.reason?.message || 'Upload failed', retryable: true }

          results.push(uploadResult)
        })
      }

      return results
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Uploads a single file with progress tracking
   */
  const uploadFile = async (
    upload: FileUpload,
    onProgress?: (upload: FileUpload) => void,
    onComplete?: (result: UploadResult) => void
  ): Promise<UploadResult> => {
    upload.status = 'uploading'
    upload.abortController = new AbortController()

    try {
      const result = await uploadWithRetry(upload, onProgress)
      upload.status = 'completed'
      upload.progress = 100
      upload.asset = result.asset

      const uploadResult: UploadResult = {
        success: true,
        asset: result.asset,
      }

      onComplete?.(uploadResult)
      return uploadResult

    } catch (error) {
      upload.status = 'failed'
      upload.error = error instanceof Error ? error.message : 'Upload failed'

      const uploadResult: UploadResult = {
        success: false,
        error: upload.error,
        retryable: isRetryableError(error),
      }

      onComplete?.(uploadResult)
      return uploadResult
    }
  }

  /**
   * Uploads file with retry logic
   */
  const uploadWithRetry = async (
    upload: FileUpload,
    onProgress?: (upload: FileUpload) => void,
    attempt = 1
  ): Promise<{ asset: DesignAsset }> => {
    try {
      return await performUpload(upload, onProgress)
    } catch (error) {
      if (attempt < config.retryAttempts && isRetryableError(error)) {
        await delay(getRetryDelay(attempt))
        return uploadWithRetry(upload, onProgress, attempt + 1)
      }
      throw error
    }
  }

  /**
   * Performs the actual file upload
   */
  const performUpload = async (
    upload: FileUpload,
    onProgress?: (upload: FileUpload) => void
  ): Promise<{ asset: DesignAsset }> => {
    const formData = new FormData()
    formData.append('file', upload.file)
    formData.append('taskId', 'current-task-id') // TODO: Get from props
    formData.append('category', 'artwork') // TODO: Get from metadata

    const response = await fetch('/api/design-assets/upload', {
      method: 'POST',
      body: formData,
      signal: upload.abortController?.signal,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()

    // Simulate progress updates (in real implementation, use server-sent events or polling)
    for (let progress = 0; progress <= 100; progress += 10) {
      await delay(100)
      upload.progress = progress
      onProgress?.(upload)
    }

    return {
      asset: {
        id: result.id,
        name: upload.file.name,
        type: upload.file.type,
        size: formatFileSize(upload.file.size),
        sizeBytes: upload.file.size,
        url: result.url,
        preview: result.preview,
        thumbnail: result.thumbnail,
        category: 'artwork', // TODO: Get from metadata
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User', // TODO: Get from auth
        uploadedById: 1, // TODO: Get from auth
        metadata: await extractMetadata(upload.file),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  }

  /**
   * Cancels an upload
   */
  const cancelUpload = (uploadId: string): void => {
    const upload = uploads.value.find(u => u.id === uploadId)
    if (upload && upload.abortController) {
      upload.abortController.abort()
      upload.status = 'cancelled'
    }
  }

  /**
   * Retries a failed upload
   */
  const retryUpload = async (
    uploadId: string,
    onProgress?: (upload: FileUpload) => void,
    onComplete?: (result: UploadResult) => void
  ): Promise<UploadResult> => {
    const upload = uploads.value.find(u => u.id === uploadId)
    if (!upload || upload.status !== 'failed') {
      throw new Error('Upload not found or not in failed state')
    }

    upload.status = 'pending'
    upload.error = undefined
    upload.progress = 0

    return uploadFile(upload, onProgress, onComplete)
  }

  /**
   * Clears completed uploads from the list
   */
  const clearCompletedUploads = (): void => {
    uploads.value = uploads.value.filter(upload => upload.status !== 'completed')
  }

  /**
   * Creates upload object from file
   */
  const createUploadObject = (file: File): FileUpload => ({
    id: generateId(),
    file,
    progress: 0,
    status: 'pending',
  })

  /**
   * Extracts metadata from file
   */
  const extractMetadata = async (file: File): Promise<AssetMetadata> => {
    const metadata: AssetMetadata = {}

    if (file.type.startsWith('image/')) {
      try {
        const img = new Image()
        const url = URL.createObjectURL(file)

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = url
        })

        metadata.width = img.width
        metadata.height = img.height
        URL.revokeObjectURL(url)
      } catch (error) {
        console.warn('Failed to extract image metadata:', error)
      }
    }

    return metadata
  }

  /**
   * Checks if error is retryable
   */
  const isRetryableError = (error: unknown): boolean => {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('network') ||
             message.includes('timeout') ||
             message.includes('500') ||
             message.includes('502') ||
             message.includes('503') ||
             message.includes('504')
    }
    return false
  }

  /**
   * Gets retry delay with exponential backoff
   */
  const getRetryDelay = (attempt: number): number => {
    return Math.min(config.retryDelay * Math.pow(2, attempt - 1), 30000)
  }

  /**
   * Utility functions
   */
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return {
    // State
    uploads,
    isUploading,
    activeUploads,
    completedUploads,
    failedUploads,
    totalProgress,

    // Methods
    uploadFiles,
    uploadFile,
    cancelUpload,
    retryUpload,
    clearCompletedUploads,
  }
}
