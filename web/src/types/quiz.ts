/**
 * Type definitions for quiz data structures.
 * These types match the Python Pydantic models in the parser.
 */

import type { LABEL_CHOICES } from '@/constants/quiz'

/**
 * Valid choice labels from shared config.
 */
export type ChoiceLabel = (typeof LABEL_CHOICES)[number]

/**
 * A single answer choice for a question.
 * Labels are always A, B, C, or D.
 */
export interface Choice {
  label: ChoiceLabel
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
  selectedLabel: ChoiceLabel
}

/**
 * Quiz state for localStorage persistence.
 */
export interface QuizState {
  currentQuestionIndex: number
  answers: Answer[]
  isComplete: boolean
}
