<script setup lang="ts">
import type { Question, ChoiceLabel } from '@/types'
import AnswerChoice from './AnswerChoice.vue'

interface Props {
  question: Question
  selectedAnswer: ChoiceLabel | null
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [label: ChoiceLabel]
}>()

function handleSelect(label: ChoiceLabel) {
  if (!props.disabled) {
    emit('select', label)
  }
}
</script>

<template>
  <div class="question-card">
    <h2 class="question-text">{{ question.text }}</h2>
    <div class="choices">
      <AnswerChoice
        v-for="choice in question.choices"
        :key="choice.label"
        :choice="choice"
        :selected="selectedAnswer === choice.label"
        :disabled="disabled"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.question-card {
  width: 100%;
}

.question-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
