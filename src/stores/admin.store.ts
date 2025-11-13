import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getAdminPostList,
  getAdminPostDetail,
  createPost,
  updatePost,
  deletePost,
  getTagList,
  createTag,
  updateTag,
  deleteTag
} from '@/api/post.api'
import type { PostListItem, PostDetail, PostRequest, Tag } from '@/types/post.types'
import type { PageInfo } from '@/types/common.types'
import { toast } from 'vue3-toastify'

export const useAdminStore = defineStore('admin', () => {
  // State
  const posts = ref<PostListItem[]>([])
  const currentPost = ref<PostDetail | null>(null)
  const tags = ref<Tag[]>([])
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

  // Actions - Posts
  const fetchAdminPosts = async (page: number = 1, size: number = 10, title?: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await getAdminPostList(page, size, title)
      posts.value = response.content
      pageInfo.value = response.page
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트 목록을 불러오는데 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAdminPostDetail = async (postId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await getAdminPostDetail(postId)
      currentPost.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트를 불러오는데 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNewPost = async (postData: PostRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await createPost(postData)
      toast.success('포스트가 생성되었습니다.')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트 생성에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateExistingPost = async (postId: number, postData: PostRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await updatePost(postId, postData)
      toast.success('포스트가 수정되었습니다.')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트 수정에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteExistingPost = async (postId: number) => {
    loading.value = true
    error.value = null

    try {
      await deletePost(postId)
      toast.success('포스트가 삭제되었습니다.')
      // 목록에서 제거하지 않고 isDeleted를 true로 변경
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.is_deleted = true
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '포스트 삭제에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Tags
  const fetchTags = async () => {
    try {
      const response = await getTagList()
      tags.value = response.data;
      console.log('tags.value:', tags.value);

    } catch (err: any) {
      console.error('Failed to load tags:', err)
      toast.error('태그 목록을 불러오는데 실패했습니다.')
    }
  }

  const createNewTag = async (name: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await createTag(name)
      tags.value.push(response.data)
      toast.success('태그가 생성되었습니다.')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '태그 생성에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateExistingTag = async (tagId: number, tagName: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await updateTag(tagId, tagName)
      const index = tags.value.findIndex(t => t.id === tagId)
      if (index !== -1) {
        tags.value[index] = response.data
      }
      toast.success('태그가 수정되었습니다.')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '태그 수정에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteExistingTag = async (tagId: number) => {
    loading.value = true
    error.value = null

    try {
      await deleteTag(tagId)
      tags.value = tags.value.filter(t => t.id !== tagId)
      toast.success('태그가 삭제되었습니다.')
    } catch (err: any) {
      error.value = err.response?.data?.message || '태그 삭제에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentPost = () => {
    currentPost.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    posts,
    currentPost,
    tags,
    pageInfo,
    loading,
    error,
    // Actions - Posts
    fetchAdminPosts,
    fetchAdminPostDetail,
    createNewPost,
    updateExistingPost,
    deleteExistingPost,
    // Actions - Tags
    fetchTags,
    createNewTag,
    updateExistingTag,
    deleteExistingTag,
    // Utilities
    clearCurrentPost,
    clearError
  }
})
