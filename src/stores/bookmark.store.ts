import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getBookmarkList,
  getBookmarkTags,
  getAdminBookmarkList,
  getAdminBookmarkDetail,
  createBookmark,
  updateBookmark,
  deleteBookmark
} from '@/api/bookmark.api'
import type {
  BookmarkItem,
  AdminBookmarkItem,
  AdminBookmarkDetail,
  BookmarkCreateRequest,
  BookmarkUpdateRequest,
  BookmarkSearchFilter
} from '@/types/bookmark.types'
import type { PageInfo } from '@/types/common.types'
import { toast } from 'vue3-toastify'

export const useBookmarkStore = defineStore('bookmark', () => {
  // State
  const bookmarks = ref<AdminBookmarkItem[]>([])
  const currentBookmark = ref<AdminBookmarkDetail | null>(null)
  const pageInfo = ref<PageInfo>({
    page_number: 1,
    page_size: 20,
    total_elements: 0,
    total_pages: 0,
    first: true,
    last: false,
    empty: true
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 공개 State
  const publicBookmarks = ref<BookmarkItem[]>([])
  const publicPageInfo = ref<PageInfo>({
    page_number: 1,
    page_size: 20,
    total_elements: 0,
    total_pages: 0,
    first: true,
    last: false,
    empty: true
  })
  const publicTags = ref<string[]>([])
  const publicLoading = ref(false)
  const publicError = ref<string | null>(null)

  // Actions
  const fetchBookmarks = async (filter: BookmarkSearchFilter = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await getAdminBookmarkList(filter)
      bookmarks.value = response.content
      pageInfo.value = response.page
    } catch (err: any) {
      error.value = err.response?.data?.message || '북마크 목록을 불러오는데 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBookmarkDetail = async (bookmarkId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await getAdminBookmarkDetail(bookmarkId)
      currentBookmark.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '북마크를 불러오는데 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNewBookmark = async (data: BookmarkCreateRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await createBookmark(data)
      toast.success('북마크가 생성되었습니다.')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '북마크 생성에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateExistingBookmark = async (bookmarkId: number, data: BookmarkUpdateRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await updateBookmark(bookmarkId, data)
      toast.success('북마크가 수정되었습니다.')
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '북마크 수정에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteExistingBookmark = async (bookmarkId: number) => {
    loading.value = true
    error.value = null

    try {
      await deleteBookmark(bookmarkId)
      bookmarks.value = bookmarks.value.filter(b => b.bookmark_id !== bookmarkId)
      toast.success('북마크가 삭제되었습니다.')
    } catch (err: any) {
      error.value = err.response?.data?.message || '북마크 삭제에 실패했습니다.'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentBookmark = () => {
    currentBookmark.value = null
  }

  const clearError = () => {
    error.value = null
  }

  // 공개 Actions
  const fetchPublicBookmarks = async (filter: BookmarkSearchFilter = {}) => {
    publicLoading.value = true
    publicError.value = null

    try {
      const response = await getBookmarkList(filter)
      publicBookmarks.value = response.content
      publicPageInfo.value = response.page
    } catch (err: any) {
      publicError.value = err.response?.data?.message || '북마크 목록을 불러오는데 실패했습니다.'
      throw err
    } finally {
      publicLoading.value = false
    }
  }

  const fetchPublicTags = async () => {
    try {
      const response = await getBookmarkTags()
      publicTags.value = response.data
    } catch (err) {
      console.error('Failed to load bookmark tags:', err)
    }
  }

  return {
    // 어드민 State
    bookmarks,
    currentBookmark,
    pageInfo,
    loading,
    error,
    // 어드민 Actions
    fetchBookmarks,
    fetchBookmarkDetail,
    createNewBookmark,
    updateExistingBookmark,
    deleteExistingBookmark,
    clearCurrentBookmark,
    clearError,
    // 공개 State
    publicBookmarks,
    publicPageInfo,
    publicTags,
    publicLoading,
    publicError,
    // 공개 Actions
    fetchPublicBookmarks,
    fetchPublicTags
  }
})
