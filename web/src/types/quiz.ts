/**
 * Type definitions for quiz data structures.
 * These types match the Python Pydantic models in the parser.
 */

/**
 * A single answer choice for a question.
 * Labels are always A, B, C, or D.
 */
export interface Choice {
  label: 'A' | 'B' | 'C' | 'D'
  text: string
}

/**
 * A quiz question with exactly 4 choices.
 */
export interface Question {
  id: number
  text: string
  choices: [Choice, Choice, Choice, Choice]
}

/**
 * Complete quiz data structure.
 */
export interface Quiz {
  version: string
  questions: Question[]
}

/**
 * User's answer to a question.
 */
export interface Answer {
  questionId: number
  selectedLabel: 'A' | 'B' | 'C' | 'D'
}

/**
 * Quiz state for localStorage persistence.
 */
export interface QuizState {
  currentQuestionIndex: number
  answers: Answer[]
  isComplete: boolean
}
