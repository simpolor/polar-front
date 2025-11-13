<template>
  <div>
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        태그 관리
      </h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        새 태그 추가
      </button>
    </div>

    <!-- 로딩 -->
    <LoadingSpinner v-if="loading && !tags.length" message="태그를 불러오는 중..." />

    <!-- 에러 -->
    <ErrorMessage
      v-else-if="error"
      :message="error"
      type="error"
      @dismiss="clearError"
      @retry="loadTags"
    />

    <!-- 태그 목록 -->
    <div v-else-if="tags.length" class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                태그명
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                포스트 수
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ tag.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  #{{ tag.tag_name }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {{ tag.post_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="handleEdit(tag)"
                  class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                >
                  수정
                </button>
                <button
                  @click="handleDelete(tag)"
                  class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
        태그가 없습니다.
      </p>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        첫 태그 추가하기
      </button>
    </div>

    <!-- 생성/수정 모달 -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModals"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {{ showCreateModal ? '새 태그 추가' : '태그 수정' }}
        </h3>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              태그명
            </label>
            <input
              v-model="tagName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="태그명을 입력하세요"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModals"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {{ showCreateModal ? '추가' : '수정' }}
            </button>
          </div>
        </form>
      </div>
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
          태그 삭제
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          "{{ tagToDelete?.tag_name }}" 태그를 삭제하시겠습니까?
          <br />
          <span class="text-sm text-red-500">
            이 태그를 사용하는 포스트가 {{ tagToDelete?.post_count || 0 }}개 있습니다.
          </span>
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
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import type { Tag } from '@/types/post.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const adminStore = useAdminStore()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const tagName = ref('')
const tagToEdit = ref<Tag | null>(null)
const tagToDelete = ref<Tag | null>(null)

// Computed
const loading = computed(() => adminStore.loading)
const error = computed(() => adminStore.error)
const tags = computed(() => adminStore.tags || [])

// Methods
const loadTags = async () => {
  try {
    await adminStore.fetchTags()
  } catch (err) {
    console.error('Failed to load tags:', err)
  }
}

const handleEdit = (tag: Tag) => {
  tagToEdit.value = tag
  tagName.value = tag.tag_name
  showEditModal.value = true
}

const handleDelete = (tag: Tag) => {
  tagToDelete.value = tag
  showDeleteModal.value = true
}

const handleSubmit = async () => {
  try {
    if (showCreateModal.value) {
      await adminStore.createNewTag(tagName.value)
    } else if (showEditModal.value && tagToEdit.value) {
      await adminStore.updateExistingTag(tagToEdit.value.id, tagName.value)
    }
    closeModals()
  } catch (err) {
    console.error('Failed to save tag:', err)
  }
}

const confirmDelete = async () => {
  if (!tagToDelete.value) return

  try {
    await adminStore.deleteExistingTag(tagToDelete.value.id)
    showDeleteModal.value = false
    tagToDelete.value = null
  } catch (err) {
    console.error('Failed to delete tag:', err)
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  tagName.value = ''
  tagToEdit.value = null
}

const clearError = () => {
  adminStore.clearError()
}

// Lifecycle
onMounted(() => {
  loadTags()
})
</script>
