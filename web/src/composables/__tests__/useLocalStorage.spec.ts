import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'
import type { QuizState } from '@/types'

describe('useLocalStorage', () => {
  const initialState: QuizState = {
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
  }

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('should use initial state when no saved state exists', () => {
      const { state } = useLocalStorage(initialState, false)
      expect(state.value).toEqual(initialState)
    })

    it('should load saved state if it exists', () => {
      const savedState: QuizState = {
        currentQuestionIndex: 2,
        answers: [
          { questionId: 1, selectedLabel: 'A' },
          { questionId: 2, selectedLabel: 'B' },
        ],
        isComplete: false,
      }

      localStorage.setItem(
        'quiz-state',
        JSON.stringify({
          version: '1.0',
          state: savedState,
        })
      )

      const { state } = useLocalStorage(initialState, false)
      expect(state.value).toEqual(savedState)
    })
  })

  describe('save and load', () => {
    it('should save state manually', () => {
      const { state, save } = useLocalStorage(initialState, false)

      state.value.currentQuestionIndex = 1
      state.value.answers.push({ questionId: 1, selectedLabel: 'C' })

      save()

      const stored = localStorage.getItem('quiz-state')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.version).toBe('1.0')
      expect(parsed.state.currentQuestionIndex).toBe(1)
      expect(parsed.state.answers).toHaveLength(1)
    })

    it('should load state manually', () => {
      const savedState: QuizState = {
        currentQuestionIndex: 3,
        answers: [],
        isComplete: true,
      }

      localStorage.setItem(
        'quiz-state',
        JSON.stringify({
          version: '1.0',
          state: savedState,
        })
      )

      const { state, load } = useLocalStorage(initialState, false)
      const loaded = load()

      expect(loaded).toEqual(savedState)
      expect(state.value).toEqual(savedState)
    })
  })

  describe('clear', () => {
    it('should clear state and reset to initial', () => {
      const { state, save, clear } = useLocalStorage(initialState, false)

      state.value.currentQuestionIndex = 2
      save()

      expect(localStorage.getItem('quiz-state')).toBeTruthy()

      clear()

      expect(localStorage.getItem('quiz-state')).toBeNull()
      expect(state.value).toEqual(initialState)
    })
  })

  describe('versioning', () => {
    it('should ignore data with different version', () => {
      localStorage.setItem(
        'quiz-state',
        JSON.stringify({
          version: '0.5',
          state: {
            currentQuestionIndex: 5,
            answers: [],
            isComplete: false,
          },
        })
      )

      const { state } = useLocalStorage(initialState, false)
      expect(state.value).toEqual(initialState)
      expect(localStorage.getItem('quiz-state')).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem('quiz-state', 'invalid json {')

      const { state } = useLocalStorage(initialState, false)
      expect(state.value).toEqual(initialState)
      expect(localStorage.getItem('quiz-state')).toBeNull()
    })

    it('should handle missing state in stored data', () => {
      localStorage.setItem(
        'quiz-state',
        JSON.stringify({
          version: '1.0',
          // missing state field
        })
      )

      const { state } = useLocalStorage(initialState, false)
      expect(state.value).toEqual(initialState)
    })
  })

  describe('auto-save', () => {
    it('should auto-save when state changes', async () => {
      const { state } = useLocalStorage(initialState, true)

      state.value.currentQuestionIndex = 1

      // Wait for watcher to trigger
      await new Promise((resolve) => setTimeout(resolve, 10))

      const stored = localStorage.getItem('quiz-state')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.state.currentQuestionIndex).toBe(1)
    })

    it('should not auto-save when disabled', async () => {
      const { state } = useLocalStorage(initialState, false)

      state.value.currentQuestionIndex = 1

      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(localStorage.getItem('quiz-state')).toBeNull()
    })
  })
})
