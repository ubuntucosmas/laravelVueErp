import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Sidebar from '../Sidebar.vue'

describe('Sidebar', () => {
  it('renders properly', () => {
    const wrapper = mount(Sidebar)
    expect(wrapper.exists()).toBe(true)
  })
})
