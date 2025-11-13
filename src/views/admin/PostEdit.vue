<template>
  <div>
    <!-- 로딩 -->
    <LoadingSpinner v-if="initialLoading" message="포스트를 불러오는 중..." />

    <!-- 에러 (로딩 중 에러) -->
    <ErrorMessage
      v-else-if="loadError"
      :message="loadError"
      type="error"
      @dismiss="loadError = null"
      @retry="loadPost"
    />

    <!-- 폼 -->
    <div v-else>
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          포스트 수정
        </h1>
        <router-link
          to="/admin/posts"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          목록으로
        </router-link>
      </div>

      <!-- 에러 메시지 (제출 중 에러) -->
      <ErrorMessage
        v-if="submitError"
        :message="submitError"
        type="error"
        @dismiss="submitError = null"
      />

      <!-- 폼 -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 제목 -->
        <div class="card">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            제목 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            placeholder="포스트 제목을 입력하세요"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 설명 -->
        <div class="card">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            설명 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.description"
            required
            rows="3"
            placeholder="포스트에 대한 간단한 설명을 입력하세요"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <!-- 키워드 -->
        <div class="card">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            키워드 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.keywords"
            type="text"
            required
            placeholder="SEO 키워드를 입력하세요"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 작성자 -->
        <div class="card">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            작성자 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.author"
            type="text"
            required
            placeholder="작성자 이름을 입력하세요"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- 본문 -->
        <div class="card">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            본문 <span class="text-red-500">*</span>
          </label>
          <MarkdownEditor v-model="formData.content" />
        </div>

        <!-- 태그 -->
        <div class="card">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            태그
          </label>
          <input
            v-model="formData.tags"
            type="text"
            placeholder="태그를 쉼표 또는 스페이스로 구분하여 입력하세요 (예: JavaScript, Vue, TypeScript)"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            쉼표(,) 또는 스페이스로 구분하여 여러 태그를 입력할 수 있습니다.
          </p>
        </div>

        <!-- 발행 설정 -->
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                발행 상태
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                발행하면 포스트가 공개됩니다.
              </p>
            </div>
            <button
              type="button"
              @click="formData.publish_status = formData.publish_status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                formData.publish_status === 'PUBLISHED' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  formData.publish_status === 'PUBLISHED' ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex justify-end gap-3">
          <router-link
            to="/admin/posts"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <LoadingSpinner v-if="submitting" size="sm" />
            <span>{{ formData.publish_status === 'PUBLISHED' ? '발행하기' : '임시저장' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import type { PostRequest } from '@/types/post.types'
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()
const adminStore = useAdminStore()

// State
const initialLoading = ref(true)
const submitting = ref(false)
const loadError = ref<string | null>(null)
const submitError = ref<string | null>(null)

const formData = ref<PostRequest>({
  title: '',
  description: '',
  content: '',
  keywords: '',
  author: '',
  publish_status: 'DRAFT',
  tags: '',
  cover_file_id: undefined
})

// Methods

const loadPost = async () => {
  initialLoading.value = true
  loadError.value = null

  try {
    const postId = Number(props.id)

    // 포스트 로드
    await adminStore.fetchAdminPostDetail(postId)

    // 포스트 데이터 설정
    const post = adminStore.currentPost
    if (post) {
      // 태그 배열을 쉼표로 구분된 문자열로 변환
      const tagString = post.tags.join(', ')

      formData.value = {
        title: post.title,
        description: post.description,
        content: post.content,
        keywords: post.keywords,
        author: post.author,
        publish_status: post.publish_status || 'PUBLISHED',
        tags: tagString,
        cover_file_id: post.cover_file?.id
      }
    } else {
      loadError.value = '포스트를 찾을 수 없습니다.'
    }
  } catch (err: any) {
    loadError.value = err.response?.data?.message || '포스트를 불러오는데 실패했습니다.'
  } finally {
    initialLoading.value = false
  }
}

const handleSubmit = async () => {
  if (submitting.value) return

  // 유효성 검사
  if (!formData.value.title.trim()) {
    submitError.value = '제목을 입력해주세요.'
    return
  }

  if (!formData.value.description.trim()) {
    submitError.value = '설명을 입력해주세요.'
    return
  }

  if (!formData.value.keywords.trim()) {
    submitError.value = '키워드를 입력해주세요.'
    return
  }

  if (!formData.value.author.trim()) {
    submitError.value = '작성자를 입력해주세요.'
    return
  }

  if (!formData.value.content.trim()) {
    submitError.value = '본문을 입력해주세요.'
    return
  }

  submitting.value = true
  submitError.value = null

  try {
    // 포스트 수정
    const postId = Number(props.id)
    await adminStore.updateExistingPost(postId, formData.value)

    // 성공시 목록으로 이동
    router.push('/admin/posts')
  } catch (err: any) {
    submitError.value = err.response?.data?.message || '포스트 수정에 실패했습니다.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPost()
})
</script>
