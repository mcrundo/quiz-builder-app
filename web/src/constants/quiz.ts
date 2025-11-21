/**
 * Quiz constants loaded from shared config.json
 * This ensures consistency between Python parser and Vue app.
 */
import config from '../../../config.json'

export const CHOICES_PER_QUESTION = config.CHOICES_PER_QUESTION
// Note: Hardcoded for TypeScript literal type inference. Must match config.json.
export const LABEL_CHOICES = ['A', 'B', 'C', 'D'] as const
export const QUIZ_VERSION = config.QUIZ_VERSION
export const QUESTION_ID_START = config.QUESTION_ID_START
export const QUESTION_KEYWORD = config.QUESTION_KEYWORD
