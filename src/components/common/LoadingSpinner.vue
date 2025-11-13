<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative" :style="{ width: size, height: size }">
      <div
        class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-transparent animate-spin"
        :class="spinnerClass"
      ></div>
    </div>
    <span v-if="message" class="ml-3 text-gray-600 dark:text-gray-400">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullscreen: false
})

const sizeMap = {
  sm: '24px',
  md: '48px',
  lg: '64px'
}

const size = computed(() => sizeMap[props.size])

const spinnerClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'border-blue-500'
    case 'lg':
      return 'border-blue-600'
    default:
      return 'border-blue-500'
  }
})

const containerClass = computed(() => {
  if (props.fullscreen) {
    return 'fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50'
  }
  return 'py-8'
})
</script>