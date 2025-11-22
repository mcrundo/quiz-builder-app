import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultsView from '../ResultsView.vue'
import type { Quiz, Answer } from '@/types'

const mockQuiz: Quiz = {
  version: '1.0',
  questions: [
    {
      id: 1,
      text: 'What color is the sky?',
      choices: [
        { label: 'A', text: 'Blue' },
        { label: 'B', text: 'Purple' },
        { label: 'C', text: 'None of the above' },
        { label: 'D', text: 'It depends' },
      ],
    },
    {
      id: 2,
      text: 'What is 2 + 2?',
      choices: [
        { label: 'A', text: '3' },
        { label: 'B', text: '4' },
        { label: 'C', text: '5' },
        { label: 'D', text: 'Fish' },
      ],
    },
    {
      id: 3,
      text: 'Is testing important?',
      choices: [
        { label: 'A', text: 'Yes' },
        { label: 'B', text: 'No' },
        { label: 'C', text: 'Maybe' },
        { label: 'D', text: 'Sometimes' },
      ],
    },
  ],
}

const mockAnswers: Answer[] = [
  { questionId: 1, selectedLabel: 'A' },
  { questionId: 2, selectedLabel: 'B' },
  { questionId: 3, selectedLabel: 'A' },
]

describe('ResultsView', () => {
  it('renders quiz completion header', () => {
    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: mockAnswers,
      },
    })

    expect(wrapper.text()).toContain('Quiz Complete!')
  })

  it('displays total number of questions', () => {
    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: mockAnswers,
      },
    })

    expect(wrapper.text()).toContain(`You've answered all ${mockQuiz.questions.length} questions`)
  })

  it('renders all questions', () => {
    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: mockAnswers,
      },
    })

    expect(wrapper.text()).toContain('Question 1: What color is the sky?')
    expect(wrapper.text()).toContain('Question 2: What is 2 + 2?')
    expect(wrapper.text()).toContain('Question 3: Is testing important?')
  })

  it('displays user answers correctly with full text', () => {
    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: mockAnswers,
      },
    })

    const resultItems = wrapper.findAll('.result-item')
    expect(resultItems).toHaveLength(3)

    // Check that answers are displayed with label and text
    const answerValues = wrapper.findAll('.answer-value')
    expect(answerValues[0]?.text()).toBe('A. Blue')
    expect(answerValues[1]?.text()).toBe('B. 4')
    expect(answerValues[2]?.text()).toBe('A. Yes')
  })

  it('shows "N/A" for unanswered questions', () => {
    const partialAnswers: Answer[] = [{ questionId: 1, selectedLabel: 'A' }]

    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: partialAnswers,
      },
    })

    const answerValues = wrapper.findAll('.answer-value')
    expect(answerValues[0]?.text()).toBe('A. Blue')
    expect(answerValues[1]?.text()).toBe('N/A')
    expect(answerValues[2]?.text()).toBe('N/A')
  })

  it('renders restart button', () => {
    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: mockAnswers,
      },
    })

    const button = wrapper.find('.btn-primary')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Start Over')
  })

  it('emits restart event when button is clicked', async () => {
    const wrapper = mount(ResultsView, {
      props: {
        quiz: mockQuiz,
        answers: mockAnswers,
      },
    })

    const button = wrapper.find('.btn-primary')
    await button.trigger('click')

    expect(wrapper.emitted('restart')).toBeTruthy()
    expect(wrapper.emitted('restart')?.[0]).toEqual([])
  })

  it('handles empty quiz gracefully', () => {
    const emptyQuiz: Quiz = {
      version: '1.0',
      questions: [],
    }

    const wrapper = mount(ResultsView, {
      props: {
        quiz: emptyQuiz,
        answers: [],
      },
    })

    expect(wrapper.text()).toContain('Quiz Complete!')
    expect(wrapper.text()).toContain("You've answered all 0 questions")
  })
})
