<template>
  <div class="max-w-4xl mx-auto">
    <!-- 헤더 -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        전체 포스트
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ totalElements }}개의 포스트
      </p>
    </div>

    <!-- 태그 필터 -->
    <div v-if="tags.length" class="flex flex-wrap gap-2 mb-8">
      <button
        @click="handleTagFilter(null)"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          !activeTagId
            ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        전체
      </button>
      <button
        v-for="tag in tags"
        :key="tag.id"
        @click="handleTagFilter(tag.id)"
        :class="[
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeTagId === tag.id
            ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        #{{ tag.name }}
      </button>
    </div>

    <!-- 로딩 -->
    <LoadingSpinner v-if="loading" message="포스트를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      type="error"
      :retryable="true"
      @retry="loadPosts"
      @dismiss="clearError"
    />

    <!-- 포스트 목록 -->
    <div v-else-if="posts.length" class="space-y-6">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />

      <!-- 페이지네이션 -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-elements="totalElements"
        :page-size="pageSize"
        :is-first-page="isFirstPage"
        :is-last-page="isLastPage"
        :visible-pages="visiblePages"
        @page-change="handlePageChange"
      />
    </div>

    <!-- 빈 상태 -->
    <div v-else class="text-center py-16">
      <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        아직 포스트가 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useTagStore } from '@/stores/tag.store'
import { usePostStore } from '@/stores/post.store'
import PostCard from '@/components/post/PostCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const tagStore = useTagStore()

const seoUrl = computed(() => typeof window !== 'undefined' ? `${window.location.origin}${route.fullPath}` : '')

// SEO
useHead({
  title: '전체 포스트 - 단순하게 색있게',
  link: [{ rel: 'canonical', href: seoUrl }],
  meta: [
    {
      name: 'description',
      content: '단순하게 색있게의 모든 포스트를 확인하세요. 개발 관련 다양한 주제의 글들을 찾아볼 수 있습니다.'
    },
    {
      name: 'keywords',
      content: '개발 블로그, 프로그래밍, 기술 블로그, 포스트 목록'
    },
    {
      property: 'og:title',
      content: '전체 포스트 - 단순하게 색있게'
    },
    {
      property: 'og:description',
      content: '단순하게 색있게의 모든 포스트를 확인하세요.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:title',
      content: '전체 포스트 - 단순하게 색있게'
    },
    {
      name: 'twitter:description',
      content: '단순하게 색있게의 모든 포스트를 확인하세요.'
    }
  ]
})

// Computed - postStore에서 직접 가져오기
const posts = computed(() => postStore.posts.filter(post => !post.is_deleted))
const loading = computed(() => postStore.loading)
const error = computed(() => postStore.error)
const pageInfo = computed(() => postStore.pageInfo)
const tags = computed(() => tagStore.tags)
const activeTagId = computed(() => {
  const id = Number(route.query.tagId)
  return id || null
})

const totalElements = computed(() => pageInfo.value?.total_elements ?? 0)
const totalPages = computed(() => pageInfo.value?.total_pages ?? 0)
const currentPage = computed(() => pageInfo.value?.page_number ?? 1)
const pageSize = computed(() => pageInfo.value?.page_size ?? 10)
const isFirstPage = computed(() => pageInfo.value?.first ?? true)
const isLastPage = computed(() => pageInfo.value?.last ?? true)

// 표시할 페이지 번호 계산
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(-1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    }
  }

  return pages
})

// Methods
const loadPosts = async () => {
  try {
    const page = Number(route.query.page) || 1
    const tagId = Number(route.query.tagId) || undefined
    await postStore.fetchPosts(page, 10, tagId)
  } catch (err) {
    console.error('Failed to load posts:', err)
  }
}

const handleTagFilter = (tagId: number | null) => {
  const query: any = { page: '1' }
  if (tagId) query.tagId = tagId.toString()
  router.push({ query })
}

const handlePageChange = (page: number) => {
  const query: any = { page: page.toString() }
  if (activeTagId.value) query.tagId = activeTagId.value.toString()
  router.push({ query })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearError = () => {
  postStore.clearError()
}

// Lifecycle
onMounted(() => {
  tagStore.fetchTags()
  loadPosts()
})

// Watch route changes
watch(() => [route.query.page, route.query.tagId], () => {
  loadPosts()
})
</script>