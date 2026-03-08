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
        북마크 수정
      </h1>
    </div>

    <!-- 초기 로딩 -->
    <LoadingSpinner v-if="initialLoading" message="북마크를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="loadError"
      :message="loadError"
      type="error"
    />

    <!-- 수정 폼 -->
    <div v-else class="card max-w-2xl">
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
            {{ submitting ? '저장 중...' : '저장' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmark.store'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const props = defineProps<{ id: string }>()

const router = useRouter()
const bookmarkStore = useBookmarkStore()

// State
const initialLoading = ref(true)
const loadError = ref<string | null>(null)
const submitting = ref(false)

const form = ref({
  url: '',
  title: '',
  description: ''
})
const tagsInput = ref('')

// Parsed tags
const parsedTags = computed(() =>
  tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
)

// Load existing bookmark data
onMounted(async () => {
  try {
    await bookmarkStore.fetchBookmarkDetail(Number(props.id))
    const bookmark = bookmarkStore.currentBookmark
    if (bookmark) {
      form.value.url = bookmark.url
      form.value.title = bookmark.title
      form.value.description = bookmark.description || ''
      tagsInput.value = bookmark.tags.join(', ')
    }
  } catch (err: any) {
    loadError.value = err.response?.data?.message || '북마크를 불러오는데 실패했습니다.'
  } finally {
    initialLoading.value = false
  }
})

onUnmounted(() => {
  bookmarkStore.clearCurrentBookmark()
})

// Submit
const handleSubmit = async () => {
  submitting.value = true

  try {
    await bookmarkStore.updateExistingBookmark(Number(props.id), {
      url: form.value.url,
      title: form.value.title,
      description: form.value.description || undefined,
      tags: parsedTags.value.length > 0 ? parsedTags.value : undefined
    })
    router.push('/admin/bookmarks')
  } catch (err) {
    console.error('Failed to update bookmark:', err)
  } finally {
    submitting.value = false
  }
}
</script>
