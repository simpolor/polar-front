import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPostList, getPostDetail, getRelatedPosts } from '@/api/post.api'
import type { PostListItem, PostDetail } from '@/types/post.types'
import type { PageInfo } from '@/types/common.types'

export const usePostStore = defineStore('post', () => {
  // State
  const posts = ref<PostListItem[]>([])
  const currentPost = ref<PostDetail | null>(null)
  const relatedPosts = ref<PostListItem[]>([])
  const pageInfo = ref<PageInfo>({
    page_number: 1,
    page_size: 10,
    total_elements: 0,
    total_pages: 0,
    first: true,
    last: false,
    empty: true
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchPosts = async (page: number = 1, size: number = 10) => {
    loading.value = true
    error.value = null

    try {
      const response = await getPostList(page, size)
      posts.value = response.content
      pageInfo.value = response.page
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트 목록을 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPostDetail = async (postId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await getPostDetail(postId)
      currentPost.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트를 불러오는데 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRelatedPosts = async (postId: number) => {
    try {
      const response = await getRelatedPosts(postId)
      relatedPosts.value = response.data
    } catch (err) {
      console.error('연관 포스트 로드 실패:', err)
      relatedPosts.value = []
    }
  }

  const clearCurrentPost = () => {
    currentPost.value = null
    relatedPosts.value = []
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    posts,
    currentPost,
    relatedPosts,
    pageInfo,
    loading,
    error,
    // Actions
    fetchPosts,
    fetchPostDetail,
    fetchRelatedPosts,
    clearCurrentPost,
    clearError
  }
})
