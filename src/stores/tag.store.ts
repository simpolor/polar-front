import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPublicTagList } from '@/api/post.api'
import type { TagPublic } from '@/types/post.types'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<TagPublic[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  const fetchTags = async () => {
    if (loaded.value) return
    loading.value = true
    try {
      const res = await getPublicTagList()
      tags.value = res.content
      loaded.value = true
    } catch (e) {
      console.error('태그 목록 로드 실패:', e)
    } finally {
      loading.value = false
    }
  }

  const getTagById = (id: number): TagPublic | undefined => {
    return tags.value.find(t => t.id === id)
  }

  return { tags, loading, fetchTags, getTagById }
})
