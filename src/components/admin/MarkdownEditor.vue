<template>
  <div>
    <div ref="editorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { uploadImage } from '@/api/file.api'
import { toast } from 'vue3-toastify'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editorRef = ref<HTMLElement | null>(null)
let editor: Editor | null = null

// 이미지 업로드 핸들러
const handleImageUpload = async (blob: Blob | File, callback: (url: string, altText: string) => void) => {
  try {
    toast.info('이미지를 업로드하는 중...')

    const file = blob as File
    const response = await uploadImage(file)
    let imageUrl = response.data.image_url
    const fileName = response.data.original_file_name

    // 상대 경로를 절대 경로로 변환
    if (!imageUrl.startsWith('http')) {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
      imageUrl = `${baseURL}/${imageUrl}`
    }

    callback(imageUrl, fileName)
    toast.success('이미지가 업로드되었습니다.')
  } catch (err: any) {
    console.error('Image upload failed:', err)
    toast.error(err.response?.data?.message || '이미지 업로드에 실패했습니다.')
    callback('', '')
  }
}

onMounted(() => {
  if (!editorRef.value) return

  editor = new Editor({
    el: editorRef.value,
    height: '600px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    initialValue: props.modelValue || '',
    placeholder: '마크다운으로 작성하세요...',
    hooks: {
      addImageBlobHook: handleImageUpload
    },
    events: {
      change: () => {
        if (editor) {
          const markdown = editor.getMarkdown()
          emit('update:modelValue', markdown)
        }
      }
    }
  })
})

// props 변경 감지
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getMarkdown()) {
    editor.setMarkdown(newValue)
  }
})

onUnmounted(() => {
  if (editor) {
    editor.destroy()
  }
})
</script>

<style>
/* Toast UI Editor 다크모드 지원 */
.dark .toastui-editor-defaultUI {
  background-color: #1f2937;
  border-color: #374151;
}

.dark .toastui-editor-md-container,
.dark .toastui-editor-md-preview {
  background-color: #111827;
  color: #f3f4f6;
}

.dark .toastui-editor-toolbar {
  background-color: #1f2937;
  border-color: #374151;
}

.dark .toastui-editor-toolbar button {
  color: #d1d5db;
}

.dark .toastui-editor-toolbar button:hover {
  background-color: #374151;
}

.dark .toastui-editor-md-splitter {
  background-color: #374151;
}

.dark .ProseMirror {
  color: #f3f4f6;
}
</style>
