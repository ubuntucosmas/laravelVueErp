import type { ValidationResult } from '../types/design'

/**
 * Validates file uploads for design assets
 */
export function useDesignValidation() {
  const config = {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Design files
      'application/pdf',
      'application/postscript', // AI files
      'image/vnd.adobe.photoshop', // PSD files
      'application/illustrator', // AI files
      // Other design tools
      'application/x-sketch', // Sketch files
      'application/figma', // Figma files
      'application/xd', // Adobe XD files
    ],
    allowedExtensions: ['.sketch', '.fig', '.xd', '.ai', '.psd'],
    maxFilenameLength: 255,
  }

  /**
   * Validates a single file
   */
  const validateFile = (file: File): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Check file size
    if (file.size > config.maxFileSize) {
      errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(config.maxFileSize)})`)
    }

    // Check file type
    const isValidType = config.allowedTypes.includes(file.type) ||
                       config.allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!isValidType) {
      errors.push(`File type "${file.type || getFileExtension(file.name)}" is not supported`)
    }

    // Check filename length
    if (file.name.length > config.maxFilenameLength) {
      errors.push(`Filename is too long (maximum ${config.maxFilenameLength} characters)`)
    }

    // Check for invalid characters in filename
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/g
    if (invalidChars.test(file.name)) {
      errors.push('Filename contains invalid characters')
    }

    // Warnings for large files
    if (file.size > 10 * 1024 * 1024) { // 10MB
      warnings.push('Large file detected - upload may take longer')
    }

    // Warnings for unusual file extensions
    const extension = getFileExtension(file.name).toLowerCase()
    if (['.exe', '.bat', '.cmd', '.scr', '.pif'].includes(extension)) {
      warnings.push('Executable files are not recommended for design assets')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Validates multiple files
   */
  const validateFiles = (files: File[]): ValidationResult => {
    const allErrors: string[] = []
    const allWarnings: string[] = []
    let hasValidFiles = false

    files.forEach((file, index) => {
      const result = validateFile(file)
      if (!result.isValid) {
        allErrors.push(`File ${index + 1} (${file.name}): ${result.errors.join(', ')}`)
      } else {
        hasValidFiles = true
      }
      if (result.warnings.length > 0) {
        allWarnings.push(`File ${index + 1} (${file.name}): ${result.warnings.join(', ')}`)
      }
    })

    // Check for duplicate filenames
    const filenames = files.map(f => f.name.toLowerCase())
    const duplicates = filenames.filter((name, index) => filenames.indexOf(name) !== index)
    if (duplicates.length > 0) {
      allWarnings.push(`Duplicate filenames detected: ${[...new Set(duplicates)].join(', ')}`)
    }

    return {
      isValid: hasValidFiles && allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    }
  }

  /**
   * Validates asset metadata
   */
  const validateAssetMetadata = (metadata: Record<string, unknown>): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate required fields
    if (!metadata.name || typeof metadata.name !== 'string' || metadata.name.trim().length === 0) {
      errors.push('Asset name is required')
    }

    if (!metadata.category || typeof metadata.category !== 'string') {
      errors.push('Asset category is required')
    }

    // Validate optional fields
    if (metadata.description && typeof metadata.description === 'string' && metadata.description.length > 1000) {
      warnings.push('Description is quite long, consider keeping it under 1000 characters')
    }

    if (metadata.tags && Array.isArray(metadata.tags)) {
      const invalidTags = metadata.tags.filter(tag => typeof tag !== 'string' || tag.length > 50)
      if (invalidTags.length > 0) {
        errors.push('Some tags are invalid (must be strings under 50 characters)')
      }
      if (metadata.tags.length > 20) {
        warnings.push('Many tags detected, consider using fewer than 20 tags')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Gets file extension from filename
   */
  const getFileExtension = (filename: string): string => {
    const lastDotIndex = filename.lastIndexOf('.')
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ''
  }

  /**
   * Formats file size for display
   */
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Checks if file type is supported
   */
  const isSupportedFileType = (file: File): boolean => {
    return config.allowedTypes.includes(file.type) ||
           config.allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  /**
   * Gets recommended category based on file type
   */
  const getRecommendedCategory = (file: File): string => {
    const extension = getFileExtension(file.name).toLowerCase()
    const type = file.type.toLowerCase()

    if (type.startsWith('image/') || ['.psd', '.ai'].includes(extension)) {
      return 'artwork'
    }
    if (['.sketch', '.fig', '.xd'].includes(extension)) {
      return 'prototype'
    }
    if (type === 'application/pdf') {
      return 'presentation'
    }

    return 'other'
  }

  return {
    validateFile,
    validateFiles,
    validateAssetMetadata,
    isSupportedFileType,
    getRecommendedCategory,
    formatFileSize,
    config,
  }
}
