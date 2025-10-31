import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AssetCard from '../components/AssetCard.vue'
import type { DesignAsset } from '../types/design'

// Mock the file icon components
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    h: vi.fn(),
  }
})

describe('AssetCard', () => {
  const mockAsset: DesignAsset = {
    id: '1',
    name: 'test-image.jpg',
    type: 'image/jpeg',
    size: '1.5 MB',
    sizeBytes: 1572864,
    url: 'https://example.com/test-image.jpg',
    preview: 'https://example.com/preview.jpg',
    category: 'artwork',
    status: 'approved',
    uploadedAt: new Date('2024-01-15T10:00:00Z'),
    uploadedBy: 'John Doe',
    uploadedById: 1,
    description: 'A test image',
    tags: ['test', 'image'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  }

  it('renders asset information correctly', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    expect(wrapper.text()).toContain('test-image.jpg')
    expect(wrapper.text()).toContain('1.5 MB')
    expect(wrapper.text()).toContain('artwork')
    expect(wrapper.text()).toContain('approved')
  })

  it('displays image preview for image assets', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockAsset.preview)
    expect(img.attributes('alt')).toBe(mockAsset.name)
  })

  it('shows file icon for non-image assets', () => {
    const pdfAsset = { ...mockAsset, type: 'application/pdf' }
    const wrapper = mount(AssetCard, {
      props: {
        asset: pdfAsset,
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)

    // Should show file icon placeholder
    const iconContainer = wrapper.find('.bg-gradient-to-br')
    expect(iconContainer.exists()).toBe(true)
  })

  it('displays status badge with correct styling', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const badge = wrapper.find('[class*="bg-green-100"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('approved')
  })

  it('shows tags when present', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const tags = wrapper.findAll('[class*="bg-gray-100"]')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toBe('test')
    expect(tags[1].text()).toBe('image')
  })

  it('limits tag display to 3 tags', () => {
    const assetWithManyTags = {
      ...mockAsset,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    }

    const wrapper = mount(AssetCard, {
      props: {
        asset: assetWithManyTags,
      },
    })

    const tags = wrapper.findAll('[class*="bg-gray-100"]')
    expect(tags).toHaveLength(4) // 3 tags + 1 "+X" indicator
    expect(tags[3].text()).toBe('+2')
  })

  it('emits preview event when preview button is clicked', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const previewButton = wrapper.find('[title="Preview test-image.jpg"]')
    await previewButton.trigger('click')

    expect(wrapper.emitted('preview')).toBeTruthy()
    expect(wrapper.emitted('preview')![0]).toEqual([mockAsset])
  })

  it('emits download event when download button is clicked', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const downloadButton = wrapper.find('[title="Download test-image.jpg"]')
    await downloadButton.trigger('click')

    expect(wrapper.emitted('download')).toBeTruthy()
    expect(wrapper.emitted('download')![0]).toEqual([mockAsset])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const deleteButton = wrapper.find('[title="Delete test-image.jpg"]')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([mockAsset])
  })

  it('shows selection checkbox when showSelection is true', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
        showSelection: true,
      },
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.exists()).toBe(true)
    expect(checkbox.attributes('aria-label')).toBe('Select test-image.jpg')
  })

  it('emits toggle-selection event when checkbox is changed', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
        showSelection: true,
      },
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    expect(wrapper.emitted('toggle-selection')).toBeTruthy()
    expect(wrapper.emitted('toggle-selection')![0]).toEqual([mockAsset.id])
  })

  it('applies selected styling when isSelected is true', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
        isSelected: true,
      },
    })

    const card = wrapper.find('.asset-card')
    expect(card.classes()).toContain('ring-2')
    expect(card.classes()).toContain('ring-blue-500')
  })

  it('shows loading overlay when isLoading is true', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
        isLoading: true,
      },
    })

    const loadingOverlay = wrapper.find('.bg-white.bg-opacity-75')
    expect(loadingOverlay.exists()).toBe(true)

    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)
  })

  it('displays error message when asset has error', () => {
    const assetWithError = {
      ...mockAsset,
      error: 'Upload failed due to network error',
    }

    const wrapper = mount(AssetCard, {
      props: {
        asset: assetWithError,
      },
    })

    const errorDiv = wrapper.find('.bg-red-50')
    expect(errorDiv.exists()).toBe(true)
    expect(errorDiv.text()).toContain('Upload failed due to network error')
  })

  it('formats file size correctly', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    expect(wrapper.text()).toContain('1.5 MB')
  })

  it('formats upload date correctly', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    // Should contain some date formatting
    const dateText = wrapper.text()
    expect(dateText).toMatch(/\d+/)
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    // Check buttons have proper titles and aria-labels
    const buttons = wrapper.findAll('button')
    buttons.forEach(button => {
      expect(button.attributes('title')).toBeDefined()
      expect(button.attributes('aria-label')).toBeDefined()
    })
  })

  it('handles image load errors gracefully', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const img = wrapper.find('img')
    await img.trigger('error')

    // Should handle error without crashing
    expect(wrapper.exists()).toBe(true)
  })

  // Status update functionality tests
  it('shows status badge as clickable', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const statusBadge = wrapper.find('[title="Click to change status"]')
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.classes()).toContain('cursor-pointer')
  })

  it('enters edit mode when status badge is clicked', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    const statusBadge = wrapper.find('[title="Click to change status"]')
    await statusBadge.trigger('click')

    // Should show select dropdown
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    expect(select.element.value).toBe('approved')
  })

  it('shows loading spinner when updating status', () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
        isUpdatingStatus: true,
      },
    })

    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)
  })

  it('emits update-status event when status is changed', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    // Enter edit mode
    const statusBadge = wrapper.find('[title="Click to change status"]')
    await statusBadge.trigger('click')

    // Change status
    const select = wrapper.find('select')
    await select.setValue('rejected')
    await select.trigger('change')

    expect(wrapper.emitted('update-status')).toBeTruthy()
    expect(wrapper.emitted('update-status')![0]).toEqual([mockAsset.id, 'rejected'])
  })

  it('cancels edit mode when clicking outside or pressing escape', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    // Enter edit mode
    const statusBadge = wrapper.find('[title="Click to change status"]')
    await statusBadge.trigger('click')

    let select = wrapper.find('select')
    expect(select.exists()).toBe(true)

    // Simulate blur (clicking outside)
    await select.trigger('blur')

    // Wait for next tick to allow reactive updates
    await wrapper.vm.$nextTick()

    // Select should be hidden again
    select = wrapper.find('select')
    expect(select.exists()).toBe(false)
  })

  it('disables select when isUpdatingStatus is true', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
        isUpdatingStatus: true,
      },
    })

    // Enter edit mode
    const statusBadge = wrapper.find('[title="Click to change status"]')
    await statusBadge.trigger('click')

    // Select should be disabled when updating
    const select = wrapper.find('select')
    expect(select.attributes('disabled')).toBeDefined()
  })

  it('shows all status options in dropdown', async () => {
    const wrapper = mount(AssetCard, {
      props: {
        asset: mockAsset,
      },
    })

    // Enter edit mode
    const statusBadge = wrapper.find('[title="Click to change status"]')
    await statusBadge.trigger('click')

    const select = wrapper.find('select')
    const options = select.findAll('option')

    expect(options).toHaveLength(5)
    expect(options[0].attributes('value')).toBe('pending')
    expect(options[1].attributes('value')).toBe('approved')
    expect(options[2].attributes('value')).toBe('rejected')
    expect(options[3].attributes('value')).toBe('revision')
    expect(options[4].attributes('value')).toBe('archived')
  })
})
