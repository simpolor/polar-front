<template>
  <div
    class="rounded-lg p-4 mb-4"
    :class="alertClass"
    role="alert"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg
          class="w-5 h-5"
          :class="iconClass"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            v-if="type === 'error'"
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
          <path
            v-else-if="type === 'warning'"
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
          <path
            v-else
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="font-semibold mb-1" :class="titleClass">
          {{ title }}
        </h3>
        <p class="text-sm" :class="messageClass">
          {{ message }}
        </p>
        <button
          v-if="retryable"
          @click="$emit('retry')"
          class="mt-3 btn-secondary text-sm"
        >
          다시 시도
        </button>
      </div>
      <button
        v-if="dismissible"
        @click="$emit('dismiss')"
        class="ml-3 flex-shrink-0"
        :class="closeButtonClass"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'error' | 'warning' | 'info'
  title?: string
  message: string
  dismissible?: boolean
  retryable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  dismissible: true,
  retryable: false
})

defineEmits<{
  (e: 'dismiss'): void
  (e: 'retry'): void
}>()

const alertClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
    default:
      return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'text-red-500 dark:text-red-400'
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'info':
      return 'text-blue-500 dark:text-blue-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const titleClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'text-red-800 dark:text-red-300'
    case 'warning':
      return 'text-yellow-800 dark:text-yellow-300'
    case 'info':
      return 'text-blue-800 dark:text-blue-300'
    default:
      return 'text-gray-800 dark:text-gray-300'
  }
})

const messageClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'text-red-700 dark:text-red-400'
    case 'warning':
      return 'text-yellow-700 dark:text-yellow-400'
    case 'info':
      return 'text-blue-700 dark:text-blue-400'
    default:
      return 'text-gray-700 dark:text-gray-400'
  }
})

const closeButtonClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
    case 'warning':
      return 'text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300'
    case 'info':
      return 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
    default:
      return 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
  }
})
</script>
