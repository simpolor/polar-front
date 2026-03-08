<template>
  <div>
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <router-link
        to="/admin/bookmarks"
        class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        새 북마크 추가
      </h1>
    </div>

    <div class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.url"
            type="url"
            required
            placeholder="https://example.com"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <!-- 제목 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            제목 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="북마크 제목을 입력하세요"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <!-- 설명 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            설명
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="북마크에 대한 설명을 입력하세요 (선택)"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          />
        </div>

        <!-- 태그 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            태그
          </label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="태그를 쉼표로 구분하여 입력하세요 (예: Spring, Java, Backend)"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            쉼표(,)로 구분하여 여러 태그를 입력할 수 있습니다.
          </p>
          <!-- 태그 미리보기 -->
          <div v-if="parsedTags.length" class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="(tag, index) in parsedTags"
              :key="index"
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex justify-end gap-3 pt-2">
          <router-link
            to="/admin/bookmarks"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ submitting ? '추가 중...' : '북마크 추가' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmark.store'

const router = useRouter()
const bookmarkStore = useBookmarkStore()

// Form state
const form = ref({
  url: '',
  title: '',
  description: ''
})
const tagsInput = ref('')
const submitting = ref(false)

// Parsed tags from comma-separated input
const parsedTags = computed(() =>
  tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
)

// Submit
const handleSubmit = async () => {
  submitting.value = true

  try {
    await bookmarkStore.createNewBookmark({
      url: form.value.url,
      title: form.value.title,
      description: form.value.description || undefined,
      tags: parsedTags.value.length > 0 ? parsedTags.value : undefined
    })
    router.push('/admin/bookmarks')
  } catch (err) {
    console.error('Failed to create bookmark:', err)
  } finally {
    submitting.value = false
  }
}
</script>
