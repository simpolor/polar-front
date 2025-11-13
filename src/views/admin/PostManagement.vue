<template>
  <div>
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        포스트 관리
      </h1>
      <router-link
        to="/admin/posts/create"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        새 포스트 작성
      </router-link>
    </div>

    <!-- 검색 -->
    <div class="card mb-6">
      <div class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="제목으로 검색..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="handleSearch"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          @click="handleSearch"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 로딩 -->
    <LoadingSpinner v-if="loading" message="포스트를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      type="error"
      @dismiss="clearError"
      @retry="loadPosts"
    />

    <!-- 포스트 목록 -->
    <div v-else-if="posts.length" class="space-y-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="card rounded-none border-b-2 border-gray-200 dark:border-gray-700 hover:scale-[1.01] hover:border-b-blue-400 dark:hover:border-b-blue-500 transition-all duration-200"
        :class="{ 'opacity-60 bg-gray-50 dark:bg-gray-800/50': post.is_deleted }"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- 포스트 정보 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold truncate"
                  :class="post.is_deleted ? 'text-gray-500 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'">
                {{ post.title }}
              </h3>
              <!-- 삭제됨 배지 -->
              <span v-if="post.is_deleted" class="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                삭제됨
              </span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {{ post.description }}
            </p>

            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ formatDate(post.created_at) }}</span>
              <span>·</span>
              <span>{{ post.author }}</span>
              <span>·</span>
              <span>조회수 {{ post.views }}</span>
            </div>

            <!-- 태그 -->
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(tag, index) in post.tags.slice(0, 5)"
                :key="index"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                #{{ tag }}
              </span>
              <span
                v-if="post.tags.length > 5"
                class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400"
              >
                +{{ post.tags.length - 5 }}
              </span>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="flex items-center gap-2">
            <router-link
              v-if="!post.is_deleted"
              :to="`/admin/posts/${post.id}/edit`"
              class="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="수정"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </router-link>

            <button
              v-if="!post.is_deleted"
              @click="handleDelete(post)"
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="삭제"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <span v-if="post.is_deleted" class="p-2 text-gray-400 dark:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </span>
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
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
        포스트가 없습니다.
      </p>
      <router-link
        to="/admin/posts/create"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        첫 포스트 작성하기
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
          포스트 삭제
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          "{{ postToDelete?.title }}" 포스트를 삭제하시겠습니까?
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
import { useAdminStore } from '@/stores/admin.store'
import { formatDate } from '@/utils/date'
import type { PostListItem } from '@/types/post.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

// State
const searchQuery = ref('')
const showDeleteModal = ref(false)
const postToDelete = ref<PostListItem | null>(null)

// Computed
const loading = computed(() => adminStore.loading)
const error = computed(() => adminStore.error)
const posts = computed(() => adminStore.posts)
const pageInfo = computed(() => adminStore.pageInfo)

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
  const page = Number(route.query.page) || 1
  const title = route.query.title as string | undefined
  await adminStore.fetchAdminPosts(page, 10, title)
}

const handlePageChange = (page: number) => {
  const query: any = { page: page.toString() }
  if (searchQuery.value) {
    query.title = searchQuery.value
  }
  router.push({ query })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = () => {
  // 검색시 첫 페이지로 이동하고 title 쿼리 추가
  const query: any = { page: '1' }
  if (searchQuery.value) {
    query.title = searchQuery.value
  }
  router.push({ query })
}

const handleDelete = (post: PostListItem) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!postToDelete.value) return

  try {
    await adminStore.deleteExistingPost(postToDelete.value.id)
    showDeleteModal.value = false
    postToDelete.value = null
    // 삭제는 isDeleted 플래그만 변경하므로 페이지 이동 불필요
  } catch (err) {
    console.error('Failed to delete post:', err)
  }
}

const clearError = () => {
  adminStore.clearError()
}

// Lifecycle
onMounted(() => {
  // URL에서 검색어 초기화
  searchQuery.value = (route.query.title as string) || ''
  loadPosts()
})

// Watch route query changes
watch(() => [route.query.page, route.query.title], () => {
  // URL 검색어와 input 동기화
  searchQuery.value = (route.query.title as string) || ''
  loadPosts()
})
</script>
