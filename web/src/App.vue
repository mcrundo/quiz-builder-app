<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuiz } from './composables/useQuiz'
import QuizView from './components/QuizView.vue'
import ResultsView from './components/ResultsView.vue'
import './assets/app.css'

const {
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
  loadQuiz,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  restart,
} = useQuiz()

onMounted(() => {
  loadQuiz()
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Quiz App</h1>
    </header>

    <main class="main">
      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading quiz...</div>

      <!-- Error State -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="loadQuiz" class="btn btn-primary">Retry</button>
      </div>

      <!-- Quiz Completed -->
      <ResultsView v-if="state.isComplete && quiz" :quiz="quiz" :answers="state.answers" @restart="restart" />

      <!-- Quiz In Progress -->
      <QuizView
        v-else-if="currentQuestion"
        :current-question="currentQuestion"
        :selected-answer="currentAnswer"
        :current-index="state.currentQuestionIndex"
        :total-questions="totalQuestions"
        :progress="progress"
        :can-go-next="canGoNext"
        :can-go-previous="canGoPrevious"
        @select="selectAnswer"
        @next="nextQuestion"
        @previous="previousQuestion"
      />
    </main>
  </div>
</template>
