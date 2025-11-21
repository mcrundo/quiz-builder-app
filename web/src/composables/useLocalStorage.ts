/**
 * Composable for persisting quiz state to browser localStorage.
 * Handles versioning and corrupted data gracefully.
 */
import { ref, watch, type Ref } from 'vue'
import type { QuizState } from '@/types'
import { QUIZ_VERSION } from '@/constants/quiz'

const STORAGE_KEY = 'quiz-state'
const STORAGE_VERSION = QUIZ_VERSION

interface StorageData {
  version: string
  state: QuizState
}

/**
 * Load quiz state from localStorage.
 * Returns null if data is missing, corrupted, or version mismatch.
 */
function loadState(): QuizState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const data: StorageData = JSON.parse(stored)

    // Version check
    if (data.version !== STORAGE_VERSION) {
      console.warn('Quiz state version mismatch, clearing old data')
      localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return data.state
  } catch (error) {
    console.error('Failed to load quiz state from localStorage:', error)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

/**
 * Save quiz state to localStorage.
 */
function saveState(state: QuizState): void {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      state,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save quiz state to localStorage:', error)
  }
}

/**
 * Clear quiz state from localStorage.
 */
function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Composable for managing quiz state with localStorage persistence.
 *
 * @param initialState - Initial state if no saved state exists
 * @param autoSave - Whether to automatically save on state changes (default: true)
 * @returns Reactive quiz state and utility functions
 */
export function useLocalStorage(initialState: QuizState, autoSave = true) {
  // Try to load existing state, fallback to initial state
  const savedState = loadState()
  const state: Ref<QuizState> = ref(savedState ?? initialState)

  // Auto-save on state changes
  if (autoSave) {
    watch(
      state,
      (newState) => {
        saveState(newState)
      },
      { deep: true }
    )
  }

  return {
    state,
    save: () => saveState(state.value),
    clear: () => {
      clearState()
      state.value = initialState
    },
    load: () => {
      const loaded = loadState()
      if (loaded) {
        state.value = loaded
      }
      return loaded
    },
  }
}
