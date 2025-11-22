import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuizView from '../QuizView.vue'
import QuestionCard from '../QuestionCard.vue'
import QuizProgress from '../QuizProgress.vue'
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

describe('QuizView', () => {
  it('renders QuizProgress component with correct props', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: null,
        currentIndex: 2,
        totalQuestions: 5,
        progress: 60,
        canGoNext: true,
        canGoPrevious: true,
      },
    })

    const progress = wrapper.findComponent(QuizProgress)
    expect(progress.exists()).toBe(true)
    expect(progress.props('current')).toBe(2)
    expect(progress.props('total')).toBe(5)
    expect(progress.props('progress')).toBe(60)
  })

  it('renders QuestionCard component with correct props', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 0,
        totalQuestions: 3,
        progress: 33,
        canGoNext: true,
        canGoPrevious: false,
      },
    })

    const questionCard = wrapper.findComponent(QuestionCard)
    expect(questionCard.exists()).toBe(true)
    expect(questionCard.props('question')).toEqual(mockQuestion)
    expect(questionCard.props('selectedAnswer')).toBe('A')
  })

  it('emits select event when QuestionCard emits select', async () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: null,
        currentIndex: 0,
        totalQuestions: 3,
        progress: 0,
        canGoNext: false,
        canGoPrevious: false,
      },
    })

    const questionCard = wrapper.findComponent(QuestionCard)
    await questionCard.vm.$emit('select', 'B')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual(['B'])
  })

  it('renders navigation buttons', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: null,
        currentIndex: 1,
        totalQuestions: 3,
        progress: 33,
        canGoNext: true,
        canGoPrevious: true,
      },
    })

    const buttons = wrapper.find('.navigation').findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]?.text()).toBe('Previous')
    expect(buttons[1]?.text()).toBe('Next')
  })

  it('disables Previous button when canGoPrevious is false', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: null,
        currentIndex: 0,
        totalQuestions: 3,
        progress: 0,
        canGoNext: false,
        canGoPrevious: false,
      },
    })

    const previousButton = wrapper.find('.navigation').findAll('button')[0]
    expect(previousButton?.attributes('disabled')).toBeDefined()
  })

  it('enables Previous button when canGoPrevious is true', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 1,
        totalQuestions: 3,
        progress: 33,
        canGoNext: true,
        canGoPrevious: true,
      },
    })

    const previousButton = wrapper.find('.navigation').findAll('button')[0]
    expect(previousButton?.attributes('disabled')).toBeUndefined()
  })

  it('shows "Next" text when canGoNext is true', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 0,
        totalQuestions: 3,
        progress: 33,
        canGoNext: true,
        canGoPrevious: false,
      },
    })

    const nextButton = wrapper.find('.navigation').findAll('button')[1]
    expect(nextButton?.text()).toBe('Next')
  })

  it('shows "Finish" text when canGoNext is false (last question)', () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 2,
        totalQuestions: 3,
        progress: 100,
        canGoNext: false,
        canGoPrevious: true,
      },
    })

    const nextButton = wrapper.find('.navigation').findAll('button')[1]
    expect(nextButton?.text()).toBe('Finish')
  })

  it('emits previous event when Previous button is clicked', async () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 1,
        totalQuestions: 3,
        progress: 33,
        canGoNext: true,
        canGoPrevious: true,
      },
    })

    const previousButton = wrapper.find('.navigation').findAll('button')[0]
    await previousButton?.trigger('click')

    expect(wrapper.emitted('previous')).toBeTruthy()
    expect(wrapper.emitted('previous')?.[0]).toEqual([])
  })

  it('emits next event when Next button is clicked', async () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 0,
        totalQuestions: 3,
        progress: 33,
        canGoNext: true,
        canGoPrevious: false,
      },
    })

    const nextButton = wrapper.find('.navigation').findAll('button')[1]
    await nextButton?.trigger('click')

    expect(wrapper.emitted('next')).toBeTruthy()
    expect(wrapper.emitted('next')?.[0]).toEqual([])
  })

  it('emits next event when Finish button is clicked', async () => {
    const wrapper = mount(QuizView, {
      props: {
        currentQuestion: mockQuestion,
        selectedAnswer: 'A',
        currentIndex: 2,
        totalQuestions: 3,
        progress: 100,
        canGoNext: false,
        canGoPrevious: true,
      },
    })

    const finishButton = wrapper.find('.navigation').findAll('button')[1]
    await finishButton?.trigger('click')

    expect(wrapper.emitted('next')).toBeTruthy()
    expect(wrapper.emitted('next')?.[0]).toEqual([])
  })
})
