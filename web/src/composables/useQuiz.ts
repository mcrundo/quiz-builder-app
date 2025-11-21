/**
 * Main quiz state management composable.
 * Handles quiz data loading, navigation, answer tracking, and persistence.
 */
import { ref, computed } from 'vue'
import type { Quiz, Question, QuizState, ChoiceLabel } from '@/types'
import { useLocalStorage } from './useLocalStorage'

function getInitialState(): QuizState {
  return {
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
  }
}

export function useQuiz() {
  const quiz = ref<Quiz | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Quiz state with localStorage persistence
  const { state, clear: clearStorage } = useLocalStorage(getInitialState(), true)

  // Computed properties
  const currentQuestion = computed<Question | null>(() => {
    if (!quiz.value || state.value.currentQuestionIndex >= quiz.value.questions.length) {
      return null
    }
    return quiz.value.questions[state.value.currentQuestionIndex] ?? null
  })

  const totalQuestions = computed(() => quiz.value?.questions.length ?? 0)

  const progress = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((state.value.answers.length / totalQuestions.value) * 100)
  })

  const canGoNext = computed(() => {
    return state.value.currentQuestionIndex < totalQuestions.value - 1
  })

  const canGoPrevious = computed(() => {
    return state.value.currentQuestionIndex > 0
  })

  const currentAnswer = computed<ChoiceLabel | null>(() => {
    if (!currentQuestion.value) return null
    const answer = state.value.answers.find((a) => a.questionId === currentQuestion.value!.id)
    return answer?.selectedLabel ?? null
  })

  // Methods
  async function loadQuiz(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/quiz.json')
      if (!response.ok) {
        throw new Error(`Failed to load quiz: ${response.statusText}`)
      }

      quiz.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quiz'
      console.error('Error loading quiz:', err)
    } finally {
      loading.value = false
    }
  }

  function selectAnswer(label: ChoiceLabel): void {
    const question = currentQuestion.value
    if (!question) return

    const questionId = question.id
    const existingIndex = state.value.answers.findIndex((a) => a.questionId === questionId)

    if (existingIndex >= 0) {
      // Update existing answer
      const existingAnswer = state.value.answers[existingIndex]
      if (existingAnswer) {
        existingAnswer.selectedLabel = label
      }
    } else {
      // Add new answer
      state.value.answers.push({ questionId, selectedLabel: label })
    }
  }

  function nextQuestion(): void {
    if (canGoNext.value) {
      state.value.currentQuestionIndex++
    } else if (state.value.currentQuestionIndex === totalQuestions.value - 1) {
      // Last question, mark as complete
      state.value.isComplete = true
    }
  }

  function previousQuestion(): void {
    if (canGoPrevious.value) {
      state.value.currentQuestionIndex--
    }
  }

  function restart(): void {
    clearStorage()
    Object.assign(state.value, getInitialState())
  }

  function goToQuestion(index: number): void {
    if (index >= 0 && index < totalQuestions.value) {
      state.value.currentQuestionIndex = index
    }
  }

  return {
    // State
    quiz,
    loading,
    error,
    state,
    currentQuestion,
    currentAnswer,
    totalQuestions,
    progress,
    canGoNext,
    canGoPrevious,

    // Methods
    loadQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    restart,
    goToQuestion,
  }
}
