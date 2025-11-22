import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnswerChoice from '../AnswerChoice.vue'
import type { Choice } from '@/types'

describe('AnswerChoice', () => {
  const mockChoice: Choice = {
    label: 'A',
    text: 'Blue',
  }

  it('renders choice label and text', () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: false,
      },
    })

    expect(wrapper.text()).toContain('A.')
    expect(wrapper.text()).toContain('Blue')
  })

  it('applies selected class when selected', () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: true,
      },
    })

    expect(wrapper.find('.answer-choice').classes()).toContain('selected')
  })

  it('does not apply selected class when not selected', () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: false,
      },
    })

    expect(wrapper.find('.answer-choice').classes()).not.toContain('selected')
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: false,
        disabled: true,
      },
    })

    expect(wrapper.find('.answer-choice').classes()).toContain('disabled')
  })

  it('emits select event with label on click', async () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: false,
      },
    })

    await wrapper.find('.answer-choice').trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual(['A'])
  })

  it('does not emit select event when disabled', async () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: false,
        disabled: true,
      },
    })

    await wrapper.find('.answer-choice').trigger('click')

    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('sets aria-pressed attribute correctly', () => {
    const wrapper = mount(AnswerChoice, {
      props: {
        choice: mockChoice,
        selected: true,
      },
    })

    expect(wrapper.find('.answer-choice').attributes('aria-pressed')).toBe('true')
  })
})
