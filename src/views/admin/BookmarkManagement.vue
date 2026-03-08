<template>
  <div>
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        북마크 관리
      </h1>
      <router-link
        to="/admin/bookmarks/create"
        class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        새 북마크 추가
      </router-link>
    </div>

    <!-- 태그 필터 -->
    <div class="card mb-6">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <select
            v-model="tagFilter"
            class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none"
            @change="handleSearch"
          >
            <option :value="0">태그로 필터링...</option>
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
          </select>
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <button
          v-if="tagFilter"
          @click="handleClearFilter"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>

    <!-- 로딩 -->
    <LoadingSpinner v-if="loading" message="북마크를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      type="error"
      @dismiss="clearError"
      @retry="loadBookmarks"
    />

    <!-- 북마크 목록 -->
    <div v-else-if="bookmarks.length" class="space-y-4">
      <div
        v-for="bookmark in bookmarks"
        :key="bookmark.bookmark_id"
        class="card rounded-none border-b-2 border-gray-200 dark:border-gray-700 hover:scale-[1.01] hover:border-b-blue-400 dark:hover:border-b-blue-500 transition-all duration-200"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- 북마크 정보 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {{ bookmark.title }}
              </h3>
            </div>

            <a
              :href="bookmark.url"
              @click.prevent="openUrl(bookmark.url)"
              class="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline mb-2 max-w-full cursor-pointer"
            >
              <span class="truncate">{{ bookmark.url }}</span>
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <p v-if="bookmark.description" class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {{ bookmark.description }}
            </p>

            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ formatDate(bookmark.created_at) }}</span>
              <span>·</span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ bookmark.views.toLocaleString() }}
              </span>
            </div>

            <!-- 태그 -->
            <div v-if="bookmark.tags && bookmark.tags.length" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(tag, index) in bookmark.tags.slice(0, 5)"
                :key="index"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                #{{ tag }}
              </span>
              <span
                v-if="bookmark.tags.length > 5"
                class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400"
              >
                +{{ bookmark.tags.length - 5 }}
              </span>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="flex items-center gap-2">
            <router-link
              :to="`/admin/bookmarks/${bookmark.bookmark_id}/edit`"
              class="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded transition-colors"
              title="수정"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </router-link>

            <button
              @click="handleDelete(bookmark)"
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="삭제"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
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
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
        북마크가 없습니다.
      </p>
      <router-link
        to="/admin/bookmarks/create"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        첫 북마크 추가하기
      </router-link>
    </div>

    <!-- 삭제 확인 모달 -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          북마크 삭제
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          "{{ bookmarkToDelete?.title }}" 북마크를 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmark.store'
import { useTagStore } from '@/stores/tag.store'
import { formatDate } from '@/utils/date'
import type { AdminBookmarkItem } from '@/types/bookmark.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const router = useRouter()
const bookmarkStore = useBookmarkStore()
const tagStore = useTagStore()

// State
const tagFilter = ref(0)
const showDeleteModal = ref(false)
const bookmarkToDelete = ref<AdminBookmarkItem | null>(null)

// Computed
const loading = computed(() => bookmarkStore.loading)
const error = computed(() => bookmarkStore.error)
const bookmarks = computed(() => bookmarkStore.bookmarks)
const pageInfo = computed(() => bookmarkStore.pageInfo)
const tags = computed(() => tagStore.tags)

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
const openUrl = (url: string) => {
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`
  window.open(normalized, '_blank', 'noopener,noreferrer')
}

const loadBookmarks = async () => {
  const page = Number(route.query.page) || 1
  const tagId = Number(route.query.tagId) || undefined
  await bookmarkStore.fetchBookmarks({ page, tagId })
}

const handlePageChange = (page: number) => {
  const query: any = { page: page.toString() }
  if (tagFilter.value) query.tagId = tagFilter.value.toString()
  router.push({ query })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = () => {
  const query: any = { page: '1' }
  if (tagFilter.value) query.tagId = tagFilter.value.toString()
  router.push({ query })
}

const handleClearFilter = () => {
  tagFilter.value = 0
  router.push({ query: { page: '1' } })
}

const handleDelete = (bookmark: AdminBookmarkItem) => {
  bookmarkToDelete.value = bookmark
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!bookmarkToDelete.value) return

  try {
    await bookmarkStore.deleteExistingBookmark(bookmarkToDelete.value.bookmark_id)
    showDeleteModal.value = false
    bookmarkToDelete.value = null
  } catch (err) {
    console.error('Failed to delete bookmark:', err)
  }
}

const clearError = () => {
  bookmarkStore.clearError()
}

// Lifecycle
onMounted(() => {
  tagStore.fetchTags()
  tagFilter.value = Number(route.query.tagId) || 0
  loadBookmarks()
})

watch(() => [route.query.page, route.query.tagId], () => {
  tagFilter.value = Number(route.query.tagId) || 0
  loadBookmarks()
})
</script>
