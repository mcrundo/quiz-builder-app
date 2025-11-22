import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizProgress from '../QuizProgress.vue'

describe('QuizProgress', () => {
  it('displays current question and total', () => {
    const wrapper = mount(QuizProgress, {
      props: {
        current: 0,
        total: 3,
        progress: 0,
      },
    })

    expect(wrapper.text()).toContain('Question 1 of 3')
  })

  it('displays progress percentage', () => {
    const wrapper = mount(QuizProgress, {
      props: {
        current: 1,
        total: 3,
        progress: 67,
      },
    })

    expect(wrapper.text()).toContain('67% complete')
  })

  it('updates progress bar width', () => {
    const wrapper = mount(QuizProgress, {
      props: {
        current: 1,
        total: 3,
        progress: 67,
      },
    })

    const progressFill = wrapper.find('.progress-fill')
    expect(progressFill.attributes('style')).toContain('width: 67%')
  })

  it('shows 0% progress at start', () => {
    const wrapper = mount(QuizProgress, {
      props: {
        current: 0,
        total: 5,
        progress: 0,
      },
    })

    expect(wrapper.text()).toContain('0% complete')
    expect(wrapper.find('.progress-fill').attributes('style')).toContain('width: 0%')
  })

  it('shows 100% progress when complete', () => {
    const wrapper = mount(QuizProgress, {
      props: {
        current: 2,
        total: 3,
        progress: 100,
      },
    })

    expect(wrapper.text()).toContain('100% complete')
    expect(wrapper.find('.progress-fill').attributes('style')).toContain('width: 100%')
  })
})
