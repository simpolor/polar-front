<template>
  <router-link
    :to="`/posts/${post.id}`"
    class="card rounded-none border-b-2 border-gray-200 dark:border-gray-700 hover:border-b-gray-500 transition-all duration-200 flex gap-6 items-start"
  >
    <!-- 텍스트 영역 -->
    <div class="flex-1 min-w-0">
      <!-- 제목 -->
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
        {{ post.title }}
      </h3>

      <!-- 설명 -->
      <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
        {{ post.description }}
      </p>

      <!-- 태그 -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400 rounded-full"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 메타 정보 -->
      <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ post.author }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formatDate(post.created_at) }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ post.views?.toLocaleString() ?? '0' }}
        </span>
      </div>
    </div>

    <!-- 커버 이미지 (우측) -->
    <div v-if="post.cover_file" class="flex-shrink-0">
      <img
        :src="post.cover_file.image_url"
        :alt="post.title"
        class="w-36 h-24 object-cover object-left-top rounded-lg"
      />
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { PostListItem } from '@/types/post.types'
import { formatDate } from '@/utils/date'

interface Props {
  post: PostListItem
}

defineProps<Props>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
