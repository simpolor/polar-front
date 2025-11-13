<template>
  <article class="card rounded-none border-b-2 border-gray-200 dark:border-gray-700 hover:scale-[1.02] hover:border-b-blue-400 dark:hover:border-b-blue-500 transition-all duration-200 cursor-pointer" @click="goToPost">
    <!-- 커버 이미지 -->
    <div v-if="post.cover_file" class="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-lg">
      <img
        :src="post.cover_file.image_url"
        :alt="post.title"
        class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>

    <!-- 제목 -->
    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
      {{ post.title }}
    </h3>

    <!-- 설명 -->
    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
      {{ post.description }}
    </p>

    <!-- 메타 정보 -->
    <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ post.author }}
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(post.created_at) }}
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {{ post.views.toLocaleString() }}
      </span>
    </div>

    <!-- 태그 -->
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        @click.stop="goToTag(tag)"
      >
        #{{ tag }}
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PostListItem } from '@/types/post.types'
import { formatDate } from '@/utils/date'

interface Props {
  post: PostListItem
}

const props = defineProps<Props>()
const router = useRouter()

const goToPost = () => {
  router.push(`/posts/${props.post.id}`)
}

const goToTag = (tag: string) => {
  router.push(`/tags/${encodeURIComponent(tag)}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
