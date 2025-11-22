<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuiz } from './composables/useQuiz'
import QuestionCard from './components/QuestionCard.vue'
import QuizProgress from './components/QuizProgress.vue'
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
      <div v-else-if="state.isComplete && quiz" class="results">
        <h2>Quiz Complete!</h2>
        <p class="results-text">You've answered all {{ totalQuestions }} questions.</p>

        <div class="results-list">
          <div v-for="question in quiz.questions" :key="question.id" class="result-item">
            <h3>Question {{ question.id }}: {{ question.text }}</h3>
            <p class="answer">
              Your answer:
              <strong>
                {{
                  state.answers.find((a) => a.questionId === question.id)?.selectedLabel || 'N/A'
                }}
              </strong>
            </p>
          </div>
        </div>

        <button @click="restart" class="btn btn-primary">Start Over</button>
      </div>

      <!-- Quiz In Progress -->
      <div v-else-if="currentQuestion" class="quiz">
        <QuizProgress :current="state.currentQuestionIndex" :total="totalQuestions" :progress="progress" />

        <QuestionCard
          :question="currentQuestion"
          :selected-answer="currentAnswer"
          @select="selectAnswer"
        />

        <div class="navigation">
          <button @click="previousQuestion" :disabled="!canGoPrevious" class="btn btn-secondary">
            Previous
          </button>
          <button @click="nextQuestion" class="btn btn-primary">
            {{ canGoNext ? 'Next' : 'Finish' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
