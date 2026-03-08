<template>
  <div class="max-w-4xl mx-auto">
    <!-- 헤더 -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        즐겨찾기
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ totalElements }}개의 북마크
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
    <LoadingSpinner v-if="publicLoading" message="북마크를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="publicError"
      :message="publicError"
      type="error"
      :retryable="true"
      @retry="loadBookmarks"
    />

    <!-- 북마크 목록 -->
    <div v-else-if="publicBookmarks.length" class="space-y-4">
      <div
        v-for="bookmark in publicBookmarks"
        :key="bookmark.bookmark_id"
        class="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {{ bookmark.title }}
          </h2>
          <button
            @click="openUrl(bookmark)"
            class="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline mb-3 max-w-full text-left"
          >
            <span class="truncate">{{ bookmark.url }}</span>
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>

          <!-- 설명 -->
          <p v-if="bookmark.description" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ bookmark.description }}
          </p>

          <!-- 하단: 태그 + 날짜 + 조회수 -->
          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(tag, index) in bookmark.tags"
                :key="index"
                @click="handleTagFilterByName(tag)"
                class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                #{{ tag }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ bookmark.views.toLocaleString() }}
              </span>
              <span>{{ formatDate(bookmark.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

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
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">
        {{ activeTagId ? `'${activeTagName}' 태그의 북마크가 없습니다.` : '등록된 북마크가 없습니다.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmark.store'
import { useTagStore } from '@/stores/tag.store'
import { incrementBookmarkView } from '@/api/bookmark.api'
import { formatDate } from '@/utils/date'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const router = useRouter()
const bookmarkStore = useBookmarkStore()
const tagStore = useTagStore()

// Computed
const publicBookmarks = computed(() => bookmarkStore.publicBookmarks)
const tags = computed(() => tagStore.bookmarkTags)
const publicLoading = computed(() => bookmarkStore.publicLoading)
const publicError = computed(() => bookmarkStore.publicError)
const pageInfo = computed(() => bookmarkStore.publicPageInfo)

const activeTagId = computed(() => {
  const id = Number(route.query.tagId)
  return id || null
})
const activeTagName = computed(() => {
  if (!activeTagId.value) return null
  return tagStore.getTagById(activeTagId.value)?.name ?? null
})
const totalElements = computed(() => pageInfo.value.total_elements)
const totalPages = computed(() => pageInfo.value.total_pages)
const currentPage = computed(() => pageInfo.value.page_number)
const pageSize = computed(() => pageInfo.value.page_size)
const isFirstPage = computed(() => pageInfo.value.first)
const isLastPage = computed(() => pageInfo.value.last)

const visiblePages = computed(() => {
  const pages: number[] = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
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
const loadBookmarks = async () => {
  const page = Number(route.query.page) || 1
  const tagId = Number(route.query.tagId) || undefined
  await bookmarkStore.fetchPublicBookmarks({ page, tagId })
}

const handleTagFilter = (tagId: number | null) => {
  const query: any = { page: '1' }
  if (tagId) query.tagId = tagId.toString()
  router.push({ query })
}

const handleTagFilterByName = (tagName: string) => {
  const tag = tagStore.bookmarkTags.find(t => t.name === tagName)
  if (tag) handleTagFilter(tag.id)
}

const handlePageChange = (page: number) => {
  const query: any = { page: page.toString() }
  if (activeTagId.value) query.tagId = activeTagId.value.toString()
  router.push({ query })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openUrl = (bookmark: { bookmark_id: number; url: string }) => {
  incrementBookmarkView(bookmark.bookmark_id)
  const normalized = /^https?:\/\//i.test(bookmark.url) ? bookmark.url : `https://${bookmark.url}`
  window.open(normalized, '_blank', 'noopener,noreferrer')
}

// Lifecycle
onMounted(() => {
  tagStore.fetchBookmarkTags()
  loadBookmarks()
})

watch(() => [route.query.page, route.query.tagId], () => {
  loadBookmarks()
})
</script>
