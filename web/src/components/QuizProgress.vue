<script setup lang="ts">
interface Props {
  current: number
  total: number
  progress: number
}

defineProps<Props>()
</script>

<template>
  <div class="quiz-progress">
    <div class="progress-text">
      Question {{ current + 1 }} of {{ total }}
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }" />
    </div>
    <div class="progress-percentage">{{ progress }}% complete</div>
  </div>
</template>

<style scoped>
.quiz-progress {
  width: 100%;
  margin-bottom: 2rem;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s ease;
  border-radius: 9999px;
}

.progress-percentage {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
  text-align: right;
}
</style>
