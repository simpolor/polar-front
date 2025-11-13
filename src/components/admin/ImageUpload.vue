<template>
  <div class="space-y-4">
    <!-- 현재 이미지 미리보기 -->
    <div v-if="previewUrl" class="relative inline-block">
      <img
        :src="previewUrl"
        :alt="imageAlt"
        class="max-w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
      />
      <button
        type="button"
        @click="handleRemove"
        class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
        title="이미지 제거"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 업로드 버튼 -->
    <div v-if="!previewUrl">
      <label
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @dragenter.prevent
        :class="[
          'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-gray-50 dark:bg-gray-800/50',
          isDragging
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
        ]"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            class="w-12 h-12 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF (MAX. 10MB)
          </p>
        </div>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*"
          @change="handleFileChange"
        />
      </label>
    </div>

    <!-- 업로드 중 -->
    <div v-if="uploading" class="flex items-center justify-center gap-2 text-blue-500">
      <LoadingSpinner size="sm" />
      <span class="text-sm">업로드 중...</span>
    </div>

    <!-- 에러 메시지 -->
    <ErrorMessage
      v-if="error"
      :message="error"
      type="error"
      @dismiss="error = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { uploadImage } from '@/api/file.api'
import type { FileInfo } from '@/types/common.types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  modelValue?: FileInfo | null
  imageAlt?: string
}

interface Emits {
  (e: 'update:modelValue', value: FileInfo | null): void
  (e: 'update:fileId', value: number | undefined): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  imageAlt: '커버 이미지'
})

const emit = defineEmits<Emits>()

// State
const fileInput = ref<HTMLInputElement>()
const previewUrl = ref<string>('')
const uploading = ref(false)
const error = ref<string | null>(null)
const isDragging = ref(false)

// Watch modelValue 변화
watch(() => props.modelValue, (newValue) => {
  if (newValue?.image_url) {
    previewUrl.value = newValue.image_url
  } else {
    previewUrl.value = ''
  }
}, { immediate: true })

// Methods
const uploadFile = async (file: File) => {
  // 파일 크기 검증 (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    error.value = '파일 크기는 10MB를 초과할 수 없습니다.'
    return
  }

  // 이미지 타입 검증
  if (!file.type.startsWith('image/')) {
    error.value = '이미지 파일만 업로드 가능합니다.'
    return
  }

  error.value = null
  uploading.value = true

  try {
    // 파일 업로드
    const response = await uploadImage(file)

    if (response.success && response.data) {
      // 미리보기 설정
      previewUrl.value = response.data.image_url

      // 부모 컴포넌트에 전달
      emit('update:modelValue', response.data)
      emit('update:fileId', response.data.file_id)
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || '이미지 업로드에 실패했습니다.'
    console.error('Upload error:', err)
  } finally {
    uploading.value = false
    // input 초기화
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return
  await uploadFile(file)
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false

  const file = event.dataTransfer?.files[0]
  if (!file) return

  await uploadFile(file)
}

const handleRemove = () => {
  previewUrl.value = ''
  emit('update:modelValue', null)
  emit('update:fileId', undefined)

  // input 초기화
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
