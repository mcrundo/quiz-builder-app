import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useQuiz } from '../useQuiz'
import type { Quiz } from '@/types'

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
      text: 'What is 2+2?',
      choices: [
        { label: 'A', text: '3' },
        { label: 'B', text: '4' },
        { label: 'C', text: '5' },
        { label: 'D', text: '22' },
      ],
    },
    {
      id: 3,
      text: 'Which is a fruit?',
      choices: [
        { label: 'A', text: 'Carrot' },
        { label: 'B', text: 'Apple' },
        { label: 'C', text: 'Potato' },
        { label: 'D', text: 'Onion' },
      ],
    },
  ],
}

describe('useQuiz', () => {
  beforeEach(() => {
    localStorage.clear()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  describe('loadQuiz', () => {
    it('should load quiz from /quiz.json', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuiz,
      } as Response)

      const { loadQuiz, quiz, loading, error } = useQuiz()

      expect(loading.value).toBe(false)

      const loadPromise = loadQuiz()
      expect(loading.value).toBe(true)

      await loadPromise

      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(quiz.value).toEqual(mockQuiz)
    })

    it('should handle fetch errors', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response)

      const { loadQuiz, quiz, error } = useQuiz()

      await loadQuiz()

      expect(error.value).toContain('Failed to load quiz')
      expect(quiz.value).toBeNull()
    })

    it('should handle network errors', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))

      const { loadQuiz, error } = useQuiz()

      await loadQuiz()

      expect(error.value).toBe('Network error')
    })
  })

  describe('navigation', () => {
    beforeEach(async () => {
      localStorage.clear()
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockQuiz,
      } as Response)
    })

    it('should start at first question', async () => {
      localStorage.clear()
      const { loadQuiz, currentQuestion, state } = useQuiz()
      await loadQuiz()

      expect(state.value.currentQuestionIndex).toBe(0)
      expect(currentQuestion.value?.id).toBe(1)
    })

    it('should navigate to next question', async () => {
      localStorage.clear()
      const { loadQuiz, nextQuestion, currentQuestion, state } = useQuiz()
      await loadQuiz()

      nextQuestion()

      expect(state.value.currentQuestionIndex).toBe(1)
      expect(currentQuestion.value?.id).toBe(2)
    })

    it('should navigate to previous question', async () => {
      localStorage.clear()
      const { loadQuiz, nextQuestion, previousQuestion, currentQuestion, state } = useQuiz()
      await loadQuiz()

      nextQuestion()
      nextQuestion()
      expect(state.value.currentQuestionIndex).toBe(2)

      previousQuestion()

      expect(state.value.currentQuestionIndex).toBe(1)
      expect(currentQuestion.value?.id).toBe(2)
    })

    it('should not go before first question', async () => {
      localStorage.clear()
      const { loadQuiz, previousQuestion, state } = useQuiz()
      await loadQuiz()

      previousQuestion()

      expect(state.value.currentQuestionIndex).toBe(0)
    })

    it('should mark as complete when advancing past last question', async () => {
      localStorage.clear()
      const { loadQuiz, nextQuestion, state } = useQuiz()
      await loadQuiz()

      nextQuestion()
      nextQuestion()
      expect(state.value.isComplete).toBe(false)

      nextQuestion()

      expect(state.value.isComplete).toBe(true)
      expect(state.value.currentQuestionIndex).toBe(2)
    })

    it('should allow goToQuestion', async () => {
      localStorage.clear()
      const { loadQuiz, goToQuestion, currentQuestion, state } = useQuiz()
      await loadQuiz()

      goToQuestion(2)

      expect(state.value.currentQuestionIndex).toBe(2)
      expect(currentQuestion.value?.id).toBe(3)
    })

    it('should ignore invalid goToQuestion index', async () => {
      localStorage.clear()
      const { loadQuiz, goToQuestion, state } = useQuiz()
      await loadQuiz()

      goToQuestion(10)
      expect(state.value.currentQuestionIndex).toBe(0)

      goToQuestion(-1)
      expect(state.value.currentQuestionIndex).toBe(0)
    })
  })

  describe('answer tracking', () => {
    beforeEach(async () => {
      localStorage.clear()
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockQuiz,
      } as Response)
    })

    it('should track selected answers', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, state } = useQuiz()
      await loadQuiz()

      selectAnswer('A')

      expect(state.value.answers).toHaveLength(1)
      expect(state.value.answers[0]).toEqual({
        questionId: 1,
        selectedLabel: 'A',
      })
    })

    it('should update existing answer', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, state } = useQuiz()
      await loadQuiz()

      selectAnswer('A')
      selectAnswer('B')

      expect(state.value.answers).toHaveLength(1)
      expect(state.value.answers[0]?.selectedLabel).toBe('B')
    })

    it('should track multiple answers for different questions', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, nextQuestion, state } = useQuiz()
      await loadQuiz()

      selectAnswer('A')
      nextQuestion()
      selectAnswer('B')
      nextQuestion()
      selectAnswer('C')

      expect(state.value.answers).toHaveLength(3)
      expect(state.value.answers[0]?.selectedLabel).toBe('A')
      expect(state.value.answers[1]?.selectedLabel).toBe('B')
      expect(state.value.answers[2]?.selectedLabel).toBe('C')
    })

    it('should show current answer', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, currentAnswer } = useQuiz()
      await loadQuiz()

      expect(currentAnswer.value).toBeNull()

      selectAnswer('C')

      expect(currentAnswer.value).toBe('C')
    })
  })

  describe('computed properties', () => {
    beforeEach(async () => {
      localStorage.clear()
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockQuiz,
      } as Response)
    })

    it('should calculate total questions', async () => {
      localStorage.clear()
      const { loadQuiz, totalQuestions } = useQuiz()

      expect(totalQuestions.value).toBe(0)

      await loadQuiz()

      expect(totalQuestions.value).toBe(3)
    })

    it('should calculate progress', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, nextQuestion, progress } = useQuiz()
      await loadQuiz()

      expect(progress.value).toBe(0)

      selectAnswer('A')
      expect(progress.value).toBe(33)

      nextQuestion()
      selectAnswer('B')
      expect(progress.value).toBe(67)

      nextQuestion()
      selectAnswer('C')
      expect(progress.value).toBe(100)
    })

    it('should track navigation availability', async () => {
      localStorage.clear()
      const { loadQuiz, nextQuestion, canGoNext, canGoPrevious } = useQuiz()
      await loadQuiz()

      expect(canGoPrevious.value).toBe(false)
      expect(canGoNext.value).toBe(true)

      nextQuestion()
      expect(canGoPrevious.value).toBe(true)
      expect(canGoNext.value).toBe(true)

      nextQuestion()
      expect(canGoPrevious.value).toBe(true)
      expect(canGoNext.value).toBe(false)
    })
  })

  describe('restart', () => {
    beforeEach(async () => {
      localStorage.clear()
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockQuiz,
      } as Response)
    })

    it('should reset quiz state', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, nextQuestion, restart, state } = useQuiz()
      await loadQuiz()

      selectAnswer('A')
      nextQuestion()
      selectAnswer('B')

      restart()

      expect(state.value.currentQuestionIndex).toBe(0)
      expect(state.value.answers).toHaveLength(0)
      expect(state.value.isComplete).toBe(false)
    })

    it('should clear localStorage', async () => {
      localStorage.clear()
      const { loadQuiz, selectAnswer, restart } = useQuiz()
      await loadQuiz()

      selectAnswer('A')

      // Wait for auto-save
      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(localStorage.getItem('quiz-state')).toBeTruthy()

      restart()

      expect(localStorage.getItem('quiz-state')).toBeNull()
    })
  })

  describe('localStorage persistence', () => {
    it('should restore state from localStorage', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockQuiz,
      } as Response)

      // First instance
      const quiz1 = useQuiz()
      await quiz1.loadQuiz()
      quiz1.selectAnswer('A')
      quiz1.nextQuestion()
      quiz1.selectAnswer('B')

      // Wait for auto-save
      await new Promise((resolve) => setTimeout(resolve, 10))

      // Second instance (simulating page refresh)
      const quiz2 = useQuiz()
      await quiz2.loadQuiz()

      expect(quiz2.state.value.currentQuestionIndex).toBe(1)
      expect(quiz2.state.value.answers).toHaveLength(2)
      expect(quiz2.state.value.answers[0]?.selectedLabel).toBe('A')
      expect(quiz2.state.value.answers[1]?.selectedLabel).toBe('B')
    })
  })
})
