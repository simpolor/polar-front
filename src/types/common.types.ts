// 공통 API 응답 타입

// 단일 데이터 응답
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error_code?: string
  timestamp: string
}

// 페이징 응답
export interface PageInfo {
  page_number: number      // 현재 페이지 (1부터 시작)
  page_size: number        // 페이지 크기
  total_elements: number   // 전체 요소 개수
  total_pages: number      // 전체 페이지 개수
  first: boolean           // 첫 페이지 여부
  last: boolean            // 마지막 페이지 여부
  empty: boolean           // 비어있는 페이지 여부
}

export interface PageResponse<T> {
  success: boolean
  content: T[]
  page: PageInfo
  message?: string
  timestamp: string
}

// 리스트 응답
export interface ListResponse<T> {
  success: boolean
  data: T[]
  message?: string
  timestamp: string
}

// 파일 정보
export interface FileInfo {
  file_id: number
  image_url: string
  original_file_name: string
}