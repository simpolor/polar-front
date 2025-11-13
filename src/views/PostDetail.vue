<template>
  <div>
    <!-- 로딩 -->
    <LoadingSpinner v-if="loading" message="포스트를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      type="error"
      :retryable="true"
      @retry="loadPost"
      @dismiss="clearError"
    />

    <!-- 삭제된 포스트 -->
    <ErrorMessage
      v-else-if="post && post.is_deleted"
      message="삭제된 포스트입니다."
      type="error"
    />

    <!-- 포스트 내용 -->
    <article v-else-if="post && !post.is_deleted" class="max-w-4xl mx-auto">
      <!-- 커버 이미지 -->
      <div v-if="post.cover_file" class="mb-8 -mx-4 md:mx-0">
        <img
          :src="post.cover_file.file_url"
          :alt="post.title"
          class="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      <!-- 제목 -->
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {{ post.title }}
      </h1>

      <!-- 메타 정보 -->
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <span class="flex items-center gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ post.author }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formatDate(post.created_at, 'yyyy-MM-dd HH:mm') }}
        </span>
      </div>

      <!-- 태그 -->
      <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mb-8">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 본문 -->
      <MarkdownViewer :content="post.content" class="mb-12" />

      <!-- 연관 포스트 -->
      <div v-if="relatedPosts.length" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          연관 포스트
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PostCard v-for="relatedPost in relatedPosts" :key="relatedPost.id" :post="relatedPost" />
        </div>
      </div>

      <!-- 목록으로 돌아가기 -->
      <div class="mt-12 text-center">
        <router-link
          to="/posts"
          class="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          목록으로 돌아가기
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { usePostStore } from '@/stores/post.store'
import { formatDate } from '@/utils/date'
import MarkdownViewer from '@/components/post/MarkdownViewer.vue'
import PostCard from '@/components/post/PostCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const postStore = usePostStore()

// Computed
const post = computed(() => postStore.currentPost)
const relatedPosts = computed(() => (postStore.relatedPosts || []).filter(p => !p.is_deleted))
const loading = computed(() => postStore.loading)
const error = computed(() => postStore.error)

// SEO - 포스트 데이터를 기반으로 동적 메타 태그 생성
const seoTitle = computed(() => post.value ? `${post.value.title} - Polar Blog` : 'Polar Blog')
const seoDescription = computed(() => post.value?.description || '개발 관련 지식과 경험을 공유하는 기술 블로그입니다.')
const seoKeywords = computed(() => {
  if (!post.value) return '개발, 프로그래밍, 블로그'
  const tags = post.value.tags.join(', ')
  return `${post.value.keywords}, ${tags}`
})
const seoImage = computed(() => post.value?.cover_file?.file_url || '')
const seoAuthor = computed(() => post.value?.author || 'Polar Blog')

useHead({
  title: seoTitle,
  meta: [
    {
      name: 'description',
      content: seoDescription
    },
    {
      name: 'keywords',
      content: seoKeywords
    },
    {
      name: 'author',
      content: seoAuthor
    },
    {
      property: 'og:title',
      content: seoTitle
    },
    {
      property: 'og:description',
      content: seoDescription
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:image',
      content: seoImage
    },
    {
      property: 'article:author',
      content: seoAuthor
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: seoTitle
    },
    {
      name: 'twitter:description',
      content: seoDescription
    },
    {
      name: 'twitter:image',
      content: seoImage
    }
  ]
})

// Methods
const loadPost = async () => {
  try {
    const postId = Number(props.id)
    await postStore.fetchPostDetail(postId)
    // 연관 포스트 로드
    await postStore.fetchRelatedPosts(postId)
  } catch (err) {
    console.error('Failed to load post:', err)
  }
}

const clearError = () => {
  postStore.clearError()
}

// Lifecycle
onMounted(() => {
  loadPost()
})

onUnmounted(() => {
  postStore.clearCurrentPost()
})
</script>