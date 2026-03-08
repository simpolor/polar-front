import apiClient from './axios'
import type {
  BookmarkItem,
  AdminBookmarkItem,
  AdminBookmarkDetail,
  BookmarkCreateRequest,
  BookmarkUpdateRequest,
  BookmarkCreatedResponse,
  BookmarkSearchFilter
} from '@/types/bookmark.types'
import type { PageResponse, ApiResponse } from '@/types/common.types'

// 공개 - 북마크 목록 조회 (페이징 + 태그 필터)
export const getBookmarkList = async (filter: BookmarkSearchFilter = {}): Promise<PageResponse<BookmarkItem>> => {
  const params: any = {
    page: filter.page ?? 1,
    size: filter.size ?? 20
  }
  if (filter.tagId) {
    params.tagId = filter.tagId
  }
  const response = await apiClient.get<PageResponse<BookmarkItem>>('/bookmarks', { params })
  return response.data
}

// 공개 - 북마크 상세 조회
export const getBookmarkDetail = async (bookmarkId: number): Promise<ApiResponse<BookmarkItem>> => {
  const response = await apiClient.get<ApiResponse<BookmarkItem>>(`/bookmarks/${bookmarkId}`)
  return response.data
}

// 공개 - 북마크 태그 목록 조회
export const getBookmarkTags = async (): Promise<ApiResponse<string[]>> => {
  const response = await apiClient.get<ApiResponse<string[]>>('/bookmarks/tags')
  return response.data
}

// 공개 - 북마크 조회수 증가
export const incrementBookmarkView = (bookmarkId: number): void => {
  apiClient.post(`/bookmarks/${bookmarkId}/views`).catch(() => {})
}

// 어드민 - 북마크 목록 조회 (페이징 + 태그 필터)
export const getAdminBookmarkList = async (filter: BookmarkSearchFilter = {}): Promise<PageResponse<AdminBookmarkItem>> => {
  const params: any = {
    page: filter.page ?? 1,
    size: filter.size ?? 20
  }
  if (filter.tagId) {
    params.tagId = filter.tagId
  }
  const response = await apiClient.get<PageResponse<AdminBookmarkItem>>('/admin/bookmarks', { params })
  return response.data
}

// 어드민 - 북마크 상세 조회
export const getAdminBookmarkDetail = async (bookmarkId: number): Promise<ApiResponse<AdminBookmarkDetail>> => {
  const response = await apiClient.get<ApiResponse<AdminBookmarkDetail>>(`/admin/bookmarks/${bookmarkId}`)
  return response.data
}

// 어드민 - 북마크 생성
export const createBookmark = async (data: BookmarkCreateRequest): Promise<ApiResponse<BookmarkCreatedResponse>> => {
  const response = await apiClient.post<ApiResponse<BookmarkCreatedResponse>>('/admin/bookmarks', data)
  return response.data
}

// 어드민 - 북마크 수정
export const updateBookmark = async (bookmarkId: number, data: BookmarkUpdateRequest): Promise<ApiResponse<AdminBookmarkDetail>> => {
  const response = await apiClient.put<ApiResponse<AdminBookmarkDetail>>(`/admin/bookmarks/${bookmarkId}`, data)
  return response.data
}

// 어드민 - 북마크 삭제
export const deleteBookmark = async (bookmarkId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/bookmarks/${bookmarkId}`)
  return response.data
}
