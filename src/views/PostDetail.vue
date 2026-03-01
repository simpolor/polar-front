<template>
  <div class="max-w-6xl mx-auto flex gap-8">
    <!-- 메인 콘텐츠 -->
    <div class="flex-1 min-w-0">
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
      <article v-else-if="post && !post.is_deleted">
        <!-- 커버 이미지 -->
        <div v-if="post.cover_file" class="mb-8">
          <img
            :src="post.cover_file.image_url"
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
            class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-400"
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
          <button
            @click="router.back()"
            class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            목록으로 돌아가기
          </button>
        </div>
      </article>
    </div>

    <!-- 태그 사이드바 -->
    <CategorySidebar />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { usePostStore } from '@/stores/post.store'
import { formatDate } from '@/utils/date'
import MarkdownViewer from '@/components/post/MarkdownViewer.vue'
import PostCard from '@/components/post/PostCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import CategorySidebar from '@/components/common/CategorySidebar.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const postStore = usePostStore()
const route = useRoute()
const router = useRouter()

// Computed
const post = computed(() => postStore.currentPost)
const relatedPosts = computed(() => (postStore.relatedPosts || []).filter(p => !p.is_deleted))
const loading = computed(() => postStore.loading)
const error = computed(() => postStore.error)

// SEO
const seoTitle = computed(() => post.value ? `${post.value.title} - 단순하고 색있게` : '단순하고 색있게')
const seoDescription = computed(() => post.value?.description || '복잡한 개발 지식을 단순하게. 코드와 경험을 색있게 기록합니다.')
const seoKeywords = computed(() => {
  if (!post.value) return '개발, 프로그래밍, 블로그'
  return post.value.tags.join(', ')
})
const seoImage = computed(() => post.value?.cover_file?.image_url)
const seoAuthor = computed(() => post.value?.author || '단순하고 색있게')
const seoUrl = computed(() => typeof window !== 'undefined' ? `${window.location.origin}${route.fullPath}` : '')
const seoPublishedTime = computed(() => post.value?.created_at || '')
const seoModifiedTime = computed(() => post.value?.updated_at || post.value?.created_at || '')

const jsonLd = computed(() => {
  if (!post.value) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.value.title,
    description: post.value.description,
    ...(post.value.cover_file?.image_url && { image: post.value.cover_file.image_url }),
    author: { '@type': 'Person', name: post.value.author },
    publisher: { '@type': 'Organization', name: '단순하고 색있게' },
    datePublished: post.value.created_at,
    dateModified: post.value.updated_at || post.value.created_at,
    keywords: post.value.tags.join(', '),
    url: seoUrl.value
  })
})

useHead({
  title: seoTitle,
  link: [
    { rel: 'canonical', href: seoUrl }
  ],
  meta: [
    { name: 'description', content: seoDescription },
    { name: 'keywords', content: seoKeywords },
    { name: 'author', content: seoAuthor },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: seoUrl },
    { property: 'og:image', content: seoImage },
    { property: 'og:site_name', content: '단순하고 색있게' },
    { property: 'og:locale', content: 'ko_KR' },
    { property: 'article:author', content: seoAuthor },
    { property: 'article:published_time', content: seoPublishedTime },
    { property: 'article:modified_time', content: seoModifiedTime },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: seoImage }
  ],
  script: [
    { type: 'application/ld+json', innerHTML: jsonLd }
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