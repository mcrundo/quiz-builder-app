<script setup lang="ts">
import type { Choice, ChoiceLabel } from '@/types'

interface Props {
  choice: Choice
  selected: boolean
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [label: ChoiceLabel]
}>()

function handleClick() {
  if (!props.disabled) {
    emit('select', props.choice.label)
  }
}
</script>

<template>
  <button
    type="button"
    class="answer-choice"
    :class="{ selected, disabled }"
    @click="handleClick"
    :aria-pressed="selected"
  >
    <span class="label">{{ choice.label }}.</span>
    <span class="text">{{ choice.text }}</span>
  </button>
</template>

<style scoped>
.answer-choice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.answer-choice:hover:not(.disabled) {
  border-color: #3b82f6;
  background: #eff6ff;
}

.answer-choice.selected {
  border-color: #3b82f6;
  background: #dbeafe;
}

.answer-choice.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.label {
  font-weight: 600;
  color: #1f2937;
  min-width: 1.5rem;
}

.text {
  color: #374151;
  flex: 1;
}
</style>
