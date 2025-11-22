<script setup lang="ts">
import type { Question, ChoiceLabel } from '@/types'
import QuestionCard from './QuestionCard.vue'
import QuizProgress from './QuizProgress.vue'

interface Props {
  currentQuestion: Question
  selectedAnswer: ChoiceLabel | null
  currentIndex: number
  totalQuestions: number
  progress: number
  canGoNext: boolean
  canGoPrevious: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  select: [label: ChoiceLabel]
  next: []
  previous: []
}>()
</script>

<template>
  <div class="quiz-view">
    <QuizProgress :current="currentIndex" :total="totalQuestions" :progress="progress" />

    <QuestionCard
      :question="currentQuestion"
      :selected-answer="selectedAnswer"
      @select="emit('select', $event)"
    />

    <div class="navigation">
      <button @click="emit('previous')" :disabled="!canGoPrevious" class="btn btn-secondary">
        Previous
      </button>
      <button @click="emit('next')" class="btn btn-primary">
        {{ canGoNext ? 'Next' : 'Finish' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
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

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}
</style>
