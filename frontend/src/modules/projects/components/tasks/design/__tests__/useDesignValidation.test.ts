import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDesignValidation } from '../composables/useDesignValidation'

// Mock File constructor
global.File = class MockFile {
  name: string
  size: number
  type: string
  lastModified: number

  constructor(parts: any[], filename: string, options: any = {}) {
    this.name = filename
    this.size = options.size || 0
    this.type = options.type || ''
    this.lastModified = Date.now()
  }
}

describe('useDesignValidation', () => {
  let validation: ReturnType<typeof useDesignValidation>

  beforeEach(() => {
    validation = useDesignValidation()
  })

  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg', size: 1024 * 1024 }) // 1MB

      const result = validation.validateFile(file)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('should reject file that is too large', () => {
      const file = new File([''], 'large.jpg', {
        type: 'image/jpeg',
        size: 100 * 1024 * 1024 // 100MB
      })

      const result = validation.validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File size (100 MB) exceeds maximum allowed size (50 MB)')
    })

    it('should reject unsupported file type', () => {
      const file = new File([''], 'test.exe', { type: 'application/x-msdownload' })

      const result = validation.validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File type "application/x-msdownload" is not supported')
    })

    it('should accept design files with correct extensions', () => {
      const file = new File([''], 'design.ai', { type: 'application/postscript' })

      const result = validation.validateFile(file)

      expect(result.isValid).toBe(true)
    })

    it('should warn about large files', () => {
      const file = new File([''], 'large.jpg', {
        type: 'image/jpeg',
        size: 15 * 1024 * 1024 // 15MB
      })

      const result = validation.validateFile(file)

      expect(result.warnings).toContain('Large file detected - upload may take longer')
    })

    it('should reject files with invalid characters in name', () => {
      const file = new File([''], 'test<file>.jpg', { type: 'image/jpeg' })

      const result = validation.validateFile(file)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Filename contains invalid characters')
    })
  })

  describe('validateFiles', () => {
    it('should validate multiple valid files', () => {
      const files = [
        new File([''], 'test1.jpg', { type: 'image/jpeg', size: 1024 }),
        new File([''], 'test2.png', { type: 'image/png', size: 2048 }),
      ]

      const result = validation.validateFiles(files)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle mixed valid and invalid files', () => {
      const files = [
        new File([''], 'valid.jpg', { type: 'image/jpeg', size: 1024 }),
        new File([''], 'invalid.exe', { type: 'application/x-msdownload', size: 1024 }),
      ]

      const result = validation.validateFiles(files)

      expect(result.isValid).toBe(true) // At least one valid file
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('invalid.exe')
    })

    it('should detect duplicate filenames', () => {
      const files = [
        new File([''], 'duplicate.jpg', { type: 'image/jpeg', size: 1024 }),
        new File([''], 'duplicate.jpg', { type: 'image/jpeg', size: 2048 }),
      ]

      const result = validation.validateFiles(files)

      expect(result.warnings).toContain('Duplicate filenames detected: duplicate.jpg')
    })
  })

  describe('validateAssetMetadata', () => {
    it('should validate valid metadata', () => {
      const metadata = {
        name: 'Test Asset',
        category: 'concept' as const,
        description: 'A test description',
        tags: ['tag1', 'tag2'],
      }

      const result = validation.validateAssetMetadata(metadata)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject missing required fields', () => {
      const metadata = {
        description: 'Missing name and category',
      }

      const result = validation.validateAssetMetadata(metadata)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Asset name is required')
      expect(result.errors).toContain('Asset category is required')
    })

    it('should warn about long descriptions', () => {
      const metadata = {
        name: 'Test',
        category: 'concept' as const,
        description: 'A'.repeat(1001), // Over 1000 characters
      }

      const result = validation.validateAssetMetadata(metadata)

      expect(result.warnings).toContain('Description is quite long, consider keeping it under 1000 characters')
    })

    it('should validate tags', () => {
      const metadata = {
        name: 'Test',
        category: 'concept' as const,
        tags: ['valid', 'tag', 'A'.repeat(51)], // One tag too long
      }

      const result = validation.validateAssetMetadata(metadata)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Some tags are invalid')
    })
  })

  describe('isSupportedFileType', () => {
    it('should return true for supported image types', () => {
      expect(validation.isSupportedFileType(new File([''], 'test.jpg', { type: 'image/jpeg' }))).toBe(true)
      expect(validation.isSupportedFileType(new File([''], 'test.png', { type: 'image/png' }))).toBe(true)
    })

    it('should return true for supported design files', () => {
      expect(validation.isSupportedFileType(new File([''], 'test.pdf', { type: 'application/pdf' }))).toBe(true)
      expect(validation.isSupportedFileType(new File([''], 'test.ai', { type: 'application/postscript' }))).toBe(true)
    })

    it('should return false for unsupported types', () => {
      expect(validation.isSupportedFileType(new File([''], 'test.exe', { type: 'application/x-msdownload' }))).toBe(false)
      expect(validation.isSupportedFileType(new File([''], 'test.txt', { type: 'text/plain' }))).toBe(false)
    })
  })

  describe('getRecommendedCategory', () => {
    it('should recommend artwork for images', () => {
      const file = new File([''], 'design.jpg', { type: 'image/jpeg' })
      expect(validation.getRecommendedCategory(file)).toBe('artwork')
    })

    it('should recommend prototype for design tools', () => {
      const file = new File([''], 'design.sketch', { type: '' })
      expect(validation.getRecommendedCategory(file)).toBe('prototype')
    })

    it('should recommend presentation for PDFs', () => {
      const file = new File([''], 'presentation.pdf', { type: 'application/pdf' })
      expect(validation.getRecommendedCategory(file)).toBe('presentation')
    })

    it('should default to other category', () => {
      const file = new File([''], 'unknown.xyz', { type: 'application/octet-stream' })
      expect(validation.getRecommendedCategory(file)).toBe('other')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(validation.formatFileSize(0)).toBe('0 Bytes')
      expect(validation.formatFileSize(1024)).toBe('1 KB')
      expect(validation.formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(validation.formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })
  })
})
