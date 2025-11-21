import { describe, it, expect } from 'vitest'
import type { Choice, Question, Quiz, Answer, QuizState } from '../quiz'

describe('Quiz Types', () => {
  describe('Choice', () => {
    it('should accept valid choice with A-D labels', () => {
      const choice: Choice = {
        label: 'A',
        text: 'Blue',
      }
      expect(choice.label).toBe('A')
      expect(choice.text).toBe('Blue')
    })

    it('should accept all valid labels', () => {
      const labels: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D']
      labels.forEach((label) => {
        const choice: Choice = { label, text: 'Test' }
        expect(choice.label).toBe(label)
      })
    })
  })

  describe('Question', () => {
    it('should accept question with 4 choices', () => {
      const question: Question = {
        id: 1,
        text: 'What color is the sky?',
        choices: [
          { label: 'A', text: 'Blue' },
          { label: 'B', text: 'Purple' },
          { label: 'C', text: 'None of the above' },
          { label: 'D', text: 'It depends' },
        ],
      }
      expect(question.id).toBe(1)
      expect(question.choices).toHaveLength(4)
    })
  })

  describe('Quiz', () => {
    it('should accept quiz with version and questions', () => {
      const quiz: Quiz = {
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
        ],
      }
      expect(quiz.version).toBe('1.0')
      expect(quiz.questions).toHaveLength(1)
    })
  })

  describe('Answer', () => {
    it('should accept answer with question ID and selected label', () => {
      const answer: Answer = {
        questionId: 1,
        selectedLabel: 'A',
      }
      expect(answer.questionId).toBe(1)
      expect(answer.selectedLabel).toBe('A')
    })
  })

  describe('QuizState', () => {
    it('should accept quiz state with all fields', () => {
      const state: QuizState = {
        currentQuestionIndex: 0,
        answers: [{ questionId: 1, selectedLabel: 'A' }],
        isComplete: false,
      }
      expect(state.currentQuestionIndex).toBe(0)
      expect(state.answers).toHaveLength(1)
      expect(state.isComplete).toBe(false)
    })

    it('should accept empty answers array', () => {
      const state: QuizState = {
        currentQuestionIndex: 0,
        answers: [],
        isComplete: false,
      }
      expect(state.answers).toHaveLength(0)
    })
  })
})
