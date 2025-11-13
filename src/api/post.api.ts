import apiClient from './axios'
import type {
  PostListItem,
  PostDetail,
  PostRequest,
  Tag
} from '@/types/post.types'
import type {
  PageResponse,
  ApiResponse,
  ListResponse
} from '@/types/common.types'

// 포스트 목록 조회 (페이징)
export const getPostList = async (page: number = 1, size: number = 10): Promise<PageResponse<PostListItem>> => {
  const response = await apiClient.get<PageResponse<PostListItem>>('/posts', {
    params: { page, size }
  })
  return response.data
}

// 포스트 상세 조회
export const getPostDetail = async (postId: number): Promise<ApiResponse<PostDetail>> => {
  const response = await apiClient.get<ApiResponse<PostDetail>>(`/posts/${postId}`)
  return response.data
}

// 연관 포스트 조회
export const getRelatedPosts = async (postId: number): Promise<ListResponse<PostListItem>> => {
  const response = await apiClient.get<ListResponse<PostListItem>>(`/posts/${postId}/related-posts`)
  return response.data
}

// 태그별 포스트 조회
export const getPostsByTag = async (tagName: string, page: number = 1, size: number = 10): Promise<PageResponse<PostListItem>> => {
  const response = await apiClient.get<PageResponse<PostListItem>>(`/tags/${tagName}/posts`, {
    params: { page, size }
  })
  return response.data
}

// 관리자 API - 포스트 목록
export const getAdminPostList = async (page: number = 1, size: number = 10, title?: string): Promise<PageResponse<PostListItem>> => {
  const params: any = { page, size }
  if (title) {
    params.title = title
  }
  const response = await apiClient.get<PageResponse<PostListItem>>('/admin/posts', {
    params
  })
  return response.data
}

// 관리자 API - 포스트 상세
export const getAdminPostDetail = async (postId: number): Promise<ApiResponse<PostDetail>> => {
  const response = await apiClient.get<ApiResponse<PostDetail>>(`/admin/posts/${postId}`)
  return response.data
}

// 관리자 API - 포스트 생성
export const createPost = async (postData: PostRequest): Promise<ApiResponse<PostDetail>> => {
  const response = await apiClient.post<ApiResponse<PostDetail>>('/admin/posts', postData)
  return response.data
}

// 관리자 API - 포스트 수정
export const updatePost = async (postId: number, postData: PostRequest): Promise<ApiResponse<PostDetail>> => {
  const response = await apiClient.put<ApiResponse<PostDetail>>(`/admin/posts/${postId}`, postData)
  return response.data
}

// 관리자 API - 포스트 삭제
export const deletePost = async (postId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/posts/${postId}`)
  return response.data
}

// 태그 목록 조회
export const getTagList = async (): Promise<ListResponse<Tag>> => {
  const response = await apiClient.get<ListResponse<Tag>>('/admin/tags')
  return response.data
}

// 태그 생성
export const createTag = async (tagName: string): Promise<ApiResponse<Tag>> => {
  const response = await apiClient.post<ApiResponse<Tag>>('/admin/tags', { tag_name: tagName })
  return response.data
}

// 태그 수정
export const updateTag = async (tagId: number, tagName: string): Promise<ApiResponse<Tag>> => {
  const response = await apiClient.put<ApiResponse<Tag>>(`/admin/tags/${tagId}`, { tag_name: tagName })
  return response.data
}

// 태그 삭제
export const deleteTag = async (tagId: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/tags/${tagId}`)
  return response.data
}
