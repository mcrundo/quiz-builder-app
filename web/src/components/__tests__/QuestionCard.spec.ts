import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionCard from '../QuestionCard.vue'
import AnswerChoice from '../AnswerChoice.vue'
import type { Question } from '@/types'

const mockQuestion: Question = {
  id: 1,
  text: 'What color is the sky?',
  choices: [
    { label: 'A', text: 'Blue' },
    { label: 'B', text: 'Purple' },
    { label: 'C', text: 'None of the above' },
    { label: 'D', text: 'It depends' },
  ],
}

describe('QuestionCard', () => {
  it('renders question text', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        selectedAnswer: null,
      },
    })

    expect(wrapper.text()).toContain('What color is the sky?')
  })

  it('renders all answer choices', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        selectedAnswer: null,
      },
    })

    const choices = wrapper.findAllComponents(AnswerChoice)
    expect(choices).toHaveLength(4)
  })

  it('passes correct props to AnswerChoice components', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        selectedAnswer: 'A',
      },
    })

    const choices = wrapper.findAllComponents(AnswerChoice)

    expect(choices[0]?.props('choice')).toEqual({ label: 'A', text: 'Blue' })
    expect(choices[0]?.props('selected')).toBe(true)

    expect(choices[1]?.props('choice')).toEqual({ label: 'B', text: 'Purple' })
    expect(choices[1]?.props('selected')).toBe(false)
  })

  it('emits select event when answer choice is selected', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        selectedAnswer: null,
      },
    })

    const firstChoice = wrapper.findAllComponents(AnswerChoice)[0]
    await firstChoice?.vm.$emit('select', 'A')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual(['A'])
  })

  it('passes disabled prop to answer choices', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        selectedAnswer: null,
        disabled: true,
      },
    })

    const choices = wrapper.findAllComponents(AnswerChoice)
    choices.forEach((choice) => {
      expect(choice.props('disabled')).toBe(true)
    })
  })

  it('does not emit select when disabled', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: mockQuestion,
        selectedAnswer: null,
        disabled: true,
      },
    })

    const firstChoice = wrapper.findAllComponents(AnswerChoice)[0]
    await firstChoice?.vm.$emit('select', 'A')

    expect(wrapper.emitted('select')).toBeFalsy()
  })
})
