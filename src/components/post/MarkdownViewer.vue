<template>
  <div class="markdown-viewer prose dark:prose-invert max-w-none" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'

interface Props {
  content: string
}

const props = defineProps<Props>()
const { renderMarkdown } = useMarkdown()

const renderedHtml = computed(() => {
  if (!props.content) return '<p class="text-gray-500 dark:text-gray-400">내용이 없습니다.</p>'
  return renderMarkdown(props.content)
})
</script>

<style>
/* markdown.css에서 기본 스타일이 적용됩니다 */
</style>
