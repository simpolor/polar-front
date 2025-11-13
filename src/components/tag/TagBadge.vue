<template>
  <router-link
    :to="`/tags/${encodeURIComponent(tag)}`"
    class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-colors"
    :class="colorClass"
  >
    #{{ tag }}
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  tag: string
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const colorClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
    case 'secondary':
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    case 'success':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
    default:
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
  }
})
</script>
