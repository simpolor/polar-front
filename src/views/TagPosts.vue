<template>
  <div class="max-w-4xl mx-auto">
    <!-- 헤더 -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        #{{ currentTag?.name ?? tagId }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        이 태그가 포함된 포스트
      </p>
    </div>

    <!-- 로딩 -->
    <LoadingSpinner v-if="loading" message="포스트를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      type="error"
      :retryable="true"
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        이 태그의 포스트가 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { getPostsByTagId } from '@/api/post.api'
import { usePagination } from '@/composables/usePagination'
import { useTagStore } from '@/stores/tag.store'
import type { PostListItem } from '@/types/post.types'
import PostCard from '@/components/post/PostCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  tagId: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const pagination = usePagination(10)
const tagStore = useTagStore()

const currentTag = computed(() => tagStore.getTagById(Number(props.tagId)))

// SEO
const seoTitle = computed(() => currentTag.value ? `#${currentTag.value.name} - 단순하게 색있게` : '단순하게 색있게')
const seoDescription = computed(() => currentTag.value ? `${currentTag.value.name} 태그가 포함된 포스트 목록입니다.` : '')
const seoKeywords = computed(() => currentTag.value ? `${currentTag.value.name}, 개발, 프로그래밍, 블로그` : '개발, 프로그래밍, 블로그')

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { name: 'keywords', content: seoKeywords },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription }
  ]
})

const posts = ref<PostListItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Computed
const totalElements = computed(() => pagination.totalElements.value)
const totalPages = computed(() => pagination.totalPages.value)
const currentPage = computed(() => pagination.currentPage.value)
const pageSize = computed(() => pagination.pageSize.value)
const isFirstPage = computed(() => pagination.isFirstPage.value)
const isLastPage = computed(() => pagination.isLastPage.value)
const visiblePages = computed(() => pagination.visiblePages.value)

// Methods
const clearError = () => { error.value = null }

const loadPosts = async () => {
  loading.value = true
  error.value = null
  posts.value = []

  try {
    await tagStore.fetchTags()
    const tagId = Number(props.tagId)
    const page = Number(route.query.page) || 1
    const response = await getPostsByTagId(tagId, page, pagination.pageSize.value)
    posts.value = response.content
    pagination.setPageInfo(response.page)
  } catch (err: any) {
    console.error('Failed to load posts:', err)
    error.value = err.response?.data?.message || '포스트를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  router.push({ query: { page: page.toString() } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Lifecycle
onMounted(() => {
  loadPosts()
})

// tagId 또는 페이지 변경 시 재조회
watch(() => props.tagId, () => {
  loadPosts()
})

watch(() => route.query.page, () => {
  loadPosts()
})
</script>