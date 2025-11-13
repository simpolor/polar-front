<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      대시보드
    </h1>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              전체 포스트
            </h3>
            <p class="text-3xl font-bold text-blue-500">
              {{ totalPosts }}
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              태그 수
            </h3>
            <p class="text-3xl font-bold text-green-500">
              {{ totalTags }}
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>

    </div>

    <!-- 빠른 작업 -->
    <div class="card mb-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
        빠른 작업
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          to="/admin/posts/create"
          class="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
        >
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="font-medium text-gray-900 dark:text-white">새 포스트 작성</span>
        </router-link>

        <router-link
          to="/admin/tags"
          class="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
        >
          <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="font-medium text-gray-900 dark:text-white">태그 관리</span>
        </router-link>
      </div>
    </div>

    <!-- 최근 포스트 -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          최근 포스트
        </h2>
        <router-link
          to="/admin/posts"
          class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          전체보기 →
        </router-link>
      </div>

      <LoadingSpinner v-if="loading" size="sm" />

      <div v-else-if="recentPosts.length" class="space-y-3">
        <router-link
          v-for="post in recentPosts"
          :key="post.id"
          :to="`/admin/posts/${post.id}/edit`"
          class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <h3 class="font-medium text-gray-900 dark:text-white mb-1">
            {{ post.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(post.created_at) }} · {{ post.author }}
          </p>
        </router-link>
      </div>

      <p v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
        포스트가 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import { formatDate } from '@/utils/date'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const adminStore = useAdminStore()

const loading = computed(() => adminStore.loading)
const recentPosts = computed(() => (adminStore.posts || []).slice(0, 5))
const totalPosts = computed(() => adminStore.pageInfo?.total_elements || 0)
const totalTags = computed(() => (adminStore.tags || []).length)

onMounted(async () => {
  try {
    // API가 구현되지 않았을 수 있으므로 각각 try-catch
    try {
      await adminStore.fetchAdminPosts(1, 5)
    } catch (err) {
      console.warn('포스트 목록 로드 실패:', err)
    }

    try {
      await adminStore.fetchTags()
    } catch (err) {
      console.warn('태그 목록 로드 실패:', err)
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  }
})
</script>