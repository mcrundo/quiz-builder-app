<script setup lang="ts">
import type { Quiz, Answer, Question } from '@/types'

interface Props {
  quiz: Quiz
  answers: Answer[]
}

defineProps<Props>()

const emit = defineEmits<{
  restart: []
}>()

function getAnswerText(question: Question, answers: Answer[]): string {
  const answer = answers.find((a) => a.questionId === question.id)
  if (!answer) return 'N/A'

  const choice = question.choices.find((c) => c.label === answer.selectedLabel)
  return choice ? `${choice.label}. ${choice.text}` : 'N/A'
}
</script>

<template>
  <div class="results-view">
    <div class="results-header">
      <h2>Quiz Complete!</h2>
      <p class="results-summary">You've answered all {{ quiz.questions.length }} questions.</p>
    </div>

    <div class="results-list">
      <div v-for="question in quiz.questions" :key="question.id" class="result-item">
        <div class="result-question">
          <h3>Question {{ question.id }}: {{ question.text }}</h3>
        </div>
        <div class="result-answer">
          <span class="answer-label">Your answer:</span>
          <span class="answer-value">{{ getAnswerText(question, answers) }}</span>
        </div>
      </div>
    </div>

    <div class="results-actions">
      <button @click="emit('restart')" class="btn btn-primary">Start Over</button>
    </div>
  </div>
</template>

<style scoped>
.results-view {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
}

.results-header {
  text-align: center;
  margin-bottom: 2rem;
}

.results-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.results-summary {
  font-size: 1.125rem;
  color: #6b7280;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-item {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.result-question h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.result-answer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.answer-label {
  color: #6b7280;
}

.answer-value {
  font-weight: 600;
  color: #3b82f6;
}

.results-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}
</style>
