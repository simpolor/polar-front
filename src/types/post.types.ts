import type { FileInfo } from './common.types'

// 포스트 목록 아이템
export interface PostListItem {
  id: number
  title: string
  author: string
  description: string
  views: number
  tags: string[]
  created_at: string
  cover_file?: FileInfo
  is_deleted: boolean
}

// 포스트 상세
export interface PostDetail {
  id: number
  title: string
  content: string
  description: string
  keywords: string
  author: string
  views: number
  tags: string[]
  cover_file?: FileInfo
  created_at: string
  updated_at?: string
  is_deleted: boolean
  publish_status?: 'DRAFT' | 'PUBLISHED'
}

// 포스트 생성/수정 요청
export interface PostRequest {
  title: string
  content: string
  description: string
  keywords: string
  author: string
  publish_status: 'DRAFT' | 'PUBLISHED'
  tags: string  // 쉼표로 구분된 태그 이름 문자열
  cover_file_id?: number
  add_file_ids?: number[]
  del_file_ids?: number[]
}

// 태그
export interface Tag {
  id: number
  tag_name: string
  post_count?: number
}