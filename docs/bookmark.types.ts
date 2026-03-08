/**
 * 북마크 관련 타입 정의
 * Polar API 프론트엔드 - 즐겨찾기 (어드민 관리 / 유저 조회)
 *
 * [어드민 API]  /admin/bookmarks  → JWT 인증 필요
 * [유저 API]    /bookmarks        → 공개 (미구현, 추후 추가 예정)
 */

// ─────────────────────────────────────────────
// 공통 베이스 타입
// ─────────────────────────────────────────────

/**
 * 북마크 기본 아이템 (유저 공개 API 응답용)
 *
 * GET /bookmarks
 * GET /bookmarks/{bookmarkId}
 */
export interface BookmarkItem {
  bookmarkId: number
  url: string
  title: string
  description: string | null
  tags: string[]            // 태그 이름 목록 (Post와 동일한 Tag 엔티티 공유)
  createdAt: string         // "yyyy-MM-dd HH:mm:ss"
}

// ─────────────────────────────────────────────
// 어드민 API 타입
// ─────────────────────────────────────────────

/**
 * 어드민 - 북마크 목록 아이템
 *
 * GET /admin/bookmarks
 * GET /admin/bookmarks?tag=Spring&page=0&size=20
 */
export type AdminBookmarkItem = BookmarkItem

/**
 * 어드민 - 북마크 상세
 *
 * GET /admin/bookmarks/{bookmarkId}
 */
export interface AdminBookmarkDetail extends BookmarkItem {
  updatedAt: string         // "yyyy-MM-dd HH:mm:ss"
}

/**
 * 어드민 - 북마크 생성 요청
 *
 * POST /admin/bookmarks
 */
export interface BookmarkCreateRequest {
  url: string               // 필수
  title: string             // 필수
  description?: string
  tags?: string[]           // 태그 이름 목록 (없으면 자동 생성)
}

/**
 * 어드민 - 북마크 수정 요청 (생성과 동일 형식)
 *
 * PUT /admin/bookmarks/{bookmarkId}
 */
export interface BookmarkUpdateRequest extends BookmarkCreateRequest {
  // 생성과 동일
}

/**
 * 어드민 - 북마크 생성 응답 data 필드
 *
 * POST /admin/bookmarks → 201 Created
 * ApiResponse<BookmarkCreatedResponse>
 */
export interface BookmarkCreatedResponse {
  bookmarkId: number
}

// ─────────────────────────────────────────────
// 요청 파라미터
// ─────────────────────────────────────────────

/**
 * 북마크 목록 조회 쿼리 파라미터
 *
 * GET /admin/bookmarks?tag=Spring&page=0&size=20
 */
export interface BookmarkSearchFilter {
  tag?: string              // 태그 이름으로 필터링
  page?: number             // 페이지 번호 (기본값: 0)
  size?: number             // 페이지 크기 (기본값: 20)
}
