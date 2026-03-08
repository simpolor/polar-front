// 북마크 기본 아이템
export interface BookmarkItem {
  bookmark_id: number
  url: string
  title: string
  description: string | null
  tags: string[]
  views: number
  created_at: string  // "yyyy-MM-dd HH:mm:ss"
}

// 어드민 - 북마크 목록 아이템 (GET /admin/bookmarks)
export type AdminBookmarkItem = BookmarkItem

// 어드민 - 북마크 상세 (GET /admin/bookmarks/{bookmarkId})
export interface AdminBookmarkDetail extends BookmarkItem {
  updated_at: string  // "yyyy-MM-dd HH:mm:ss"
}

// 어드민 - 북마크 생성 요청 (POST /admin/bookmarks)
export interface BookmarkCreateRequest {
  url: string
  title: string
  description?: string
  tags?: string[]
}

// 어드민 - 북마크 수정 요청 (PUT /admin/bookmarks/{bookmarkId})
export interface BookmarkUpdateRequest extends BookmarkCreateRequest {}

// 어드민 - 북마크 생성 응답 (201 Created)
export interface BookmarkCreatedResponse {
  bookmark_id: number
}

// 북마크 목록 조회 쿼리 파라미터
export interface BookmarkSearchFilter {
  tagId?: number
  page?: number
  size?: number
}
