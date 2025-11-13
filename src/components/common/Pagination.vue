<template>
  <div class="flex items-center justify-center gap-2 py-4">
    <!-- 첫 페이지 버튼 -->
    <button
      @click="$emit('page-change', 1)"
      :disabled="isFirstPage"
      class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      title="첫 페이지"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- 이전 페이지 버튼 -->
    <button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="isFirstPage"
      class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      이전
    </button>

    <!-- 페이지 번호 -->
    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === -1" class="px-2 text-gray-500">...</span>
      <button
        v-else
        @click="$emit('page-change', page)"
        class="px-4 py-2 rounded-lg border transition-colors"
        :class="
          page === currentPage
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
        "
      >
        {{ page }}
      </button>
    </template>

    <!-- 다음 페이지 버튼 -->
    <button
      @click="$emit('page-change', currentPage + 1)"
      :disabled="isLastPage"
      class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      다음
    </button>

    <!-- 마지막 페이지 버튼 -->
    <button
      @click="$emit('page-change', totalPages)"
      :disabled="isLastPage"
      class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      title="마지막 페이지"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <!-- 페이지 정보 -->
  <div v-if="totalElements > 0" class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
    전체 {{ totalElements }}개 중 {{ startItem }}-{{ endItem }}개
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number      // 1부터 시작
  totalPages: number
  totalElements: number
  pageSize: number
  isFirstPage: boolean
  isLastPage: boolean
  visiblePages: number[]   // 표시할 페이지 번호 배열
}

const props = defineProps<Props>()

const startItem = computed(() => {
  if (props.totalElements === 0) return 0
  return ((props.currentPage - 1) * props.pageSize) + 1
})

const endItem = computed(() => {
  if (props.totalElements === 0) return 0
  return Math.min(props.currentPage * props.pageSize, props.totalElements)
})

defineEmits<{
  (e: 'page-change', page: number): void
}>()
</script>