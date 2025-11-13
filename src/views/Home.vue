<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- 히어로 섹션 -->
    <section class="text-center py-12 md:py-20">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
        Polar Blog
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
        개발 지식과 경험을 공유하는 공간
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/posts"
          class="btn-primary inline-flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          포스트 둘러보기
        </router-link>
      </div>
    </section>

    <!-- 최신 포스트 -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          최신 포스트
        </h2>
        <router-link
          to="/posts"
          class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          전체보기 →
        </router-link>
      </div>

      <!-- 로딩 -->
      <LoadingSpinner v-if="loading" message="포스트를 불러오는 중..." />

      <!-- 에러 -->
      <ErrorMessage
        v-else-if="error"
        :message="error"
        type="error"
        @dismiss="clearError"
      />

      <!-- 포스트 목록 -->
      <div v-else-if="visiblePosts.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PostCard v-for="post in visiblePosts" :key="post.id" :post="post" />
      </div>

      <!-- 빈 상태 -->
      <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          아직 포스트가 없습니다.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { usePostStore } from '@/stores/post.store'
import PostCard from '@/components/post/PostCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const postStore = usePostStore()

// SEO
useHead({
  title: 'Polar Blog - 개발 지식과 경험을 공유하는 공간',
  meta: [
    {
      name: 'description',
      content: '개발 관련 지식과 경험을 공유하는 기술 블로그입니다. 다양한 프로그래밍 주제와 실무 경험을 다룹니다.'
    },
    {
      name: 'keywords',
      content: '개발, 프로그래밍, 블로그, 기술, 소프트웨어, Vue, TypeScript, JavaScript'
    },
    {
      property: 'og:title',
      content: 'Polar Blog - 개발 지식과 경험을 공유하는 공간'
    },
    {
      property: 'og:description',
      content: '개발 관련 지식과 경험을 공유하는 기술 블로그입니다.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:title',
      content: 'Polar Blog - 개발 지식과 경험을 공유하는 공간'
    },
    {
      name: 'twitter:description',
      content: '개발 관련 지식과 경험을 공유하는 기술 블로그입니다.'
    }
  ]
})

// Computed
const posts = computed(() => postStore.posts)
const visiblePosts = computed(() => posts.value.filter(post => !post.is_deleted).slice(0, 6))
const loading = computed(() => postStore.loading)
const error = computed(() => postStore.error)

// Methods
const loadPosts = async () => {
  try {
    await postStore.fetchPosts(1, 6) // 최신 6개만
  } catch (err) {
    console.error('Failed to load posts:', err)
  }
}

const clearError = () => {
  postStore.clearError()
}

// Lifecycle
onMounted(() => {
  loadPosts()
})
</script>
