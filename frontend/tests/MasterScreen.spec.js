import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MasterScreen from '../src/components/MasterScreen.vue'

describe('MasterScreen.vue', () => {
  it('renders initial task monitoring when currentTab is "init"', () => {
    const wrapper = mount(MasterScreen, {
      props: {
        currentTab: 'init'
      }
    })

    expect(wrapper.text()).toContain('ACTIVE_PLAYER_TASKS')
    expect(wrapper.text()).toContain('TERMINAL_DECRYPTION')
    expect(wrapper.text()).toContain('MASTER_QUICK_GUIDE')
  })

  it('renders manual documentation when currentTab is "manual"', () => {
    const wrapper = mount(MasterScreen, {
      props: {
        currentTab: 'manual'
      }
    })

    expect(wrapper.text()).toContain('MASTER_SYSTEM_DOCUMENTATION & SOLUTIONS')
    expect(wrapper.text()).toContain('FULL_GUIDE_INDEX')
    expect(wrapper.text()).toContain('EMERGENCY_OVERRIDE')
  })

  it('defaults to "init" view if no tab is provided', () => {
    const wrapper = mount(MasterScreen)

    expect(wrapper.text()).toContain('ACTIVE_PLAYER_TASKS')
  })
})