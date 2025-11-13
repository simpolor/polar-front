# Vue3 프론트엔드 개발 가이드

> Polar API를 위한 Vue3 기반 프론트엔드 개발 명세서
> 이 문서는 Claude Code가 프론트엔드를 개발할 때 참고하는 가이드입니다.

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [API 명세](#api-명세)
5. [페이지 구성](#페이지-구성)
6. [컴포넌트 설계](#컴포넌트-설계)
7. [상태 관리](#상태-관리)
8. [라우팅](#라우팅)
9. [인증 플로우](#인증-플로우)
10. [개발 우선순위](#개발-우선순위)

---

## 프로젝트 개요

### 목적
Polar API 백엔드를 위한 블로그 플랫폼 프론트엔드 개발

### 주요 기능
- 블로그 포스트 목록 조회 및 상세 보기
- 마크다운 렌더링
- 태그 기반 포스트 필터링
- 시리즈별 포스트 그룹화
- 관리자 대시보드 (포스트/태그/시리즈 관리)
- JWT 기반 인증

### 요구사항
- 반응형 디자인 (모바일/태블릿/데스크톱)
- SEO 최적화 (메타 태그, SSR 고려)
- 마크다운 문법 지원
- 다크모드 지원
- 빠른 페이지 로딩 (코드 스플리팅)

---

## 기술 스택

### Core
- **Vue 3.4+** (Composition API)
- **TypeScript 5.0+**
- **Vite 5.0+** (빌드 도구)

### 상태 관리
- **Pinia** (Vue 3 공식 상태 관리)

### 라우팅
- **Vue Router 4**

### UI/스타일링
선택 가능한 옵션:
- **Option 1**: Tailwind CSS + HeadlessUI
- **Option 2**: Vuetify 3
- **Option 3**: Element Plus
- **추천**: Tailwind CSS (커스터마이징 자유도가 높음)

### HTTP 클라이언트
- **Axios** (인터셉터로 JWT 토큰 자동 첨부)

### 마크다운
- **markdown-it** 또는 **marked**
- **highlight.js** (코드 하이라이팅)

### 유틸리티
- **date-fns** (날짜 포맷팅)
- **vue-toastification** (알림 메시지)

---

## 프로젝트 구조

```
polar-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                    # API 통신 모듈
│   │   ├── axios.ts           # Axios 인스턴스 설정
│   │   ├── auth.api.ts        # 인증 API
│   │   ├── post.api.ts        # 포스트 API
│   │   ├── tag.api.ts         # 태그 API
│   │   ├── series.api.ts      # 시리즈 API
│   │   └── admin.api.ts       # 관리자 API
│   ├── assets/                 # 정적 파일
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── markdown.css   # 마크다운 스타일
│   │   └── images/
│   ├── components/             # 재사용 컴포넌트
│   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── Pagination.vue
│   │   │   └── ErrorMessage.vue
│   │   ├── post/              # 포스트 관련
│   │   │   ├── PostCard.vue
│   │   │   ├── PostList.vue
│   │   │   ├── PostDetail.vue
│   │   │   ├── MarkdownViewer.vue
│   │   │   └── RelatedPosts.vue
│   │   ├── tag/               # 태그 관련
│   │   │   ├── TagList.vue
│   │   │   └── TagBadge.vue
│   │   └── admin/             # 관리자 컴포넌트
│   │       ├── PostEditor.vue
│   │       ├── MarkdownEditor.vue
│   │       ├── TagManager.vue
│   │       └── SeriesManager.vue
│   ├── composables/           # Composition 함수
│   │   ├── useAuth.ts
│   │   ├── usePagination.ts
│   │   ├── useMarkdown.ts
│   │   └── useToast.ts
│   ├── layouts/               # 레이아웃 컴포넌트
│   │   ├── DefaultLayout.vue
│   │   ├── AdminLayout.vue
│   │   └── EmptyLayout.vue
│   ├── router/                # 라우팅
│   │   ├── index.ts
│   │   └── guards.ts          # 라우트 가드
│   ├── stores/                # Pinia 스토어
│   │   ├── auth.store.ts
│   │   ├── post.store.ts
│   │   ├── tag.store.ts
│   │   └── ui.store.ts        # 다크모드, 로딩 상태 등
│   ├── types/                 # TypeScript 타입 정의
│   │   ├── api.types.ts
│   │   ├── post.types.ts
│   │   ├── auth.types.ts
│   │   └── common.types.ts
│   ├── utils/                 # 유틸리티 함수
│   │   ├── date.ts
│   │   ├── storage.ts         # localStorage 관리
│   │   └── validators.ts
│   ├── views/                 # 페이지 컴포넌트
│   │   ├── Home.vue
│   │   ├── PostList.vue
│   │   ├── PostDetail.vue
│   │   ├── TagPosts.vue
│   │   ├── SeriesPosts.vue
│   │   ├── Login.vue
│   │   └── admin/
│   │       ├── Dashboard.vue
│   │       ├── PostManagement.vue
│   │       ├── PostCreate.vue
│   │       ├── PostEdit.vue
│   │       ├── TagManagement.vue
│   │       └── SeriesManagement.vue
│   ├── App.vue
│   └── main.ts
├── .env.development           # 개발 환경 변수
├── .env.production            # 운영 환경 변수
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## API 명세

### Base URL
```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:8080

// .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 공통 응답 형식

#### 단일 데이터 응답 (ApiResponse)
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error_code?: string;
  timestamp: string;
}
```

#### 페이징 응답 (PageResponse)
```typescript
interface PageResponse<T> {
  success: boolean;
  content: T[];
  page: {
    page_number: number;      // 현재 페이지 (0부터 시작)
    page_size: number;         // 페이지 크기
    total_elements: number;    // 전체 요소 개수
    total_pages: number;       // 전체 페이지 개수
    first: boolean;            // 첫 페이지 여부
    last: boolean;             // 마지막 페이지 여부
    empty: boolean;            // 비어있는 페이지 여부
  };
  message?: string;
  timestamp: string;
}
```

#### 리스트 응답 (ListResponse)
```typescript
interface ListResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
  timestamp: string;
}
```

### 1. 인증 API

#### 로그인
```
POST /auth/login
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "test123!@#"
}

Response (성공):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "username": "admin",
  "role": "ROLE_ADMIN",
  "expires_in": 86400000
}

Response (실패):
{
  "error": "INVALID_CREDENTIALS",
  "message": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

#### 토큰 검증
```
GET /auth/validate
Authorization: Bearer {token}

Response:
{
  "valid": true,
  "username": "admin",
  "role": "ROLE_ADMIN",
  "expires_in": 82800000,
  "expires_at": 1699999999999
}
```

### 2. 포스트 API (공개)

#### 포스트 목록 (페이징)
```
GET /posts?page=1&size=10

Response:
{
  "success": true,
  "content": [
    {
      "id": 1,
      "title": "Spring Boot 시작하기",
      "author": "박석영",
      "description": "Spring Boot 기초 가이드",
      "views": 1234,
      "tags": ["Java", "Spring Boot"],
      "created_at": "2024-01-15 10:30:00"
    }
  ],
  "page": {
    "page_number": 0,
    "page_size": 10,
    "total_elements": 50,
    "total_pages": 5,
    "first": true,
    "last": false,
    "empty": false
  },
  "timestamp": "2024-01-20T10:00:00"
}
```

#### 포스트 상세
```
GET /posts/{postId}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Spring Boot 시작하기",
    "content": "# Spring Boot\n\n마크다운 내용...",
    "description": "Spring Boot 기초 가이드",
    "keywords": "Spring Boot, Java, Tutorial",
    "author": "박석영",
    "views": 1234,
    "tags": ["Java", "Spring Boot"],
    "cover_file": {
      "id": 1,
      "file_name": "cover.jpg",
      "file_url": "https://s3.amazonaws.com/bucket/cover.jpg",
      "file_size": 102400,
      "file_type": "image/jpeg"
    },
    "created_at": "2024-01-15 10:30:00"
  },
  "timestamp": "2024-01-20T10:00:00"
}
```

#### 연관 포스트
```
GET /posts/{postId}/related-posts

Response:
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Spring Boot JPA",
      "author": "박석영",
      "description": "JPA 활용법",
      "views": 890,
      "tags": ["Java", "Spring Boot", "JPA"],
      "created_at": "2024-01-16 14:20:00"
    }
  ],
  "timestamp": "2024-01-20T10:00:00"
}
```

### 3. 관리자 API

**모든 관리자 API는 JWT 토큰 필요**
```
Authorization: Bearer {token}
```

#### 포스트 관리

##### 목록 조회
```
GET /admin/posts?page=1&size=10

Response: (PageResponse 형식)
```

##### 상세 조회
```
GET /admin/posts/{id}

Response: (ApiResponse 형식, PostDetail 포함)
```

##### 생성
```
POST /admin/posts
Content-Type: application/json

Request:
{
  "title": "새 포스트",
  "content": "# 제목\n\n내용...",
  "description": "설명",
  "keywords": "키워드1, 키워드2",
  "author": "박석영",
  "publish_status": "PUBLISHED",
  "tag_ids": [1, 2, 3],
  "series_id": 1,
  "cover_file_id": 5
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "포스트가 생성되었습니다.",
  "timestamp": "2024-01-20T10:00:00"
}
```

##### 수정
```
PUT /admin/posts/{id}
Content-Type: application/json

Request: (생성과 동일)

Response:
{
  "success": true,
  "data": { ... },
  "message": "포스트가 수정되었습니다.",
  "timestamp": "2024-01-20T10:00:00"
}
```

##### 삭제
```
DELETE /admin/posts/{id}

Response:
{
  "success": true,
  "message": "포스트가 삭제되었습니다.",
  "timestamp": "2024-01-20T10:00:00"
}
```

#### 태그 관리

```
GET    /admin/tags              # 목록
GET    /admin/tags/{id}         # 상세
POST   /admin/tags              # 생성
PUT    /admin/tags/{id}         # 수정
DELETE /admin/tags/{id}         # 삭제
```

#### 시리즈 관리

```
GET    /admin/series            # 목록
GET    /admin/series/{id}       # 상세
POST   /admin/series            # 생성
PUT    /admin/series/{id}       # 수정
DELETE /admin/series/{id}       # 삭제
```

#### 캐시 관리

```
GET    /admin/cache/status      # 캐시 상태 조회
DELETE /admin/cache/clear       # 캐시 전체 삭제
```

### 4. 파일 API

#### 파일 업로드
```
POST /files/upload
Content-Type: multipart/form-data

Request:
- file: (파일)

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "file_name": "image.jpg",
    "file_url": "https://s3.amazonaws.com/bucket/image.jpg",
    "file_size": 102400,
    "file_type": "image/jpeg"
  },
  "timestamp": "2024-01-20T10:00:00"
}
```

---

## 페이지 구성

### 공개 페이지

#### 1. 홈 (/)
- 최신 포스트 목록 (페이징)
- 인기 태그
- 최근 시리즈
- 검색 기능

#### 2. 포스트 목록 (/posts)
- 전체 포스트 목록
- 페이징 (10개씩)
- 태그 필터
- 검색 기능

#### 3. 포스트 상세 (/posts/:id)
- 마크다운 렌더링
- 작성자, 작성일, 조회수
- 태그 표시
- 연관 포스트 (같은 시리즈 또는 같은 태그)
- 이전/다음 포스트 네비게이션

#### 4. 태그별 포스트 (/tags/:tagName)
- 특정 태그의 포스트 목록
- 페이징

#### 5. 시리즈별 포스트 (/series/:seriesId)
- 특정 시리즈의 포스트 목록
- 순서대로 정렬

### 관리자 페이지 (/admin)

**JWT 인증 필요**

#### 1. 대시보드 (/admin/dashboard)
- 통계 요약 (전체 포스트, 태그, 조회수)
- 최근 포스트
- 빠른 작업 링크

#### 2. 포스트 관리 (/admin/posts)
- 전체 포스트 목록 (DRAFT 포함)
- 검색, 필터 (발행 상태별)
- 생성/수정/삭제 버튼

#### 3. 포스트 생성 (/admin/posts/create)
- 제목, 설명, 키워드 입력
- 마크다운 에디터 (실시간 프리뷰)
- 태그 선택
- 시리즈 선택
- 커버 이미지 업로드
- 발행 상태 선택 (DRAFT/PUBLISHED)

#### 4. 포스트 수정 (/admin/posts/:id/edit)
- 생성과 동일한 폼
- 기존 데이터 불러오기

#### 5. 태그 관리 (/admin/tags)
- 태그 목록
- 생성/수정/삭제

#### 6. 시리즈 관리 (/admin/series)
- 시리즈 목록
- 생성/수정/삭제
- 포스트 순서 변경

#### 7. 캐시 관리 (/admin/cache)
- 캐시 상태 확인
- 캐시 삭제

---

## 컴포넌트 설계

### 공통 컴포넌트

#### AppHeader.vue
```vue
<template>
  <header>
    <nav>
      <router-link to="/">홈</router-link>
      <router-link to="/posts">포스트</router-link>
      <router-link to="/admin" v-if="isAdmin">관리자</router-link>
      <button @click="toggleDarkMode">다크모드</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'

const authStore = useAuthStore()
const uiStore = useUIStore()

const isAdmin = computed(() => authStore.isAdmin)
const toggleDarkMode = () => uiStore.toggleDarkMode()
</script>
```

#### Pagination.vue
```vue
<template>
  <div class="pagination">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="isFirstPage"
    >
      이전
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page - 1)"
      :class="{ active: page === currentPage + 1 }"
    >
      {{ page }}
    </button>

    <button
      @click="goToPage(currentPage + 1)"
      :disabled="isLastPage"
    >
      다음
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number      // 0부터 시작
  totalPages: number
  isFirstPage: boolean
  isLastPage: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const visiblePages = computed(() => {
  // 페이지 번호 계산 로직
  const pages: number[] = []
  // ... 구현
  return pages
})

const goToPage = (page: number) => {
  emit('page-change', page)
}
</script>
```

#### PostCard.vue
```vue
<template>
  <article class="post-card">
    <img v-if="post.coverFile" :src="post.coverFile.fileUrl" :alt="post.title" />
    <h3>{{ post.title }}</h3>
    <p>{{ post.description }}</p>
    <div class="meta">
      <span>{{ post.author }}</span>
      <span>{{ formatDate(post.createdAt) }}</span>
      <span>조회 {{ post.views }}</span>
    </div>
    <div class="tags">
      <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PostListItem } from '@/types/post.types'
import TagBadge from '@/components/tag/TagBadge.vue'
import { formatDate } from '@/utils/date'

interface Props {
  post: PostListItem
}

defineProps<Props>()
</script>
```

#### MarkdownViewer.vue
```vue
<template>
  <div class="markdown-viewer" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'

interface Props {
  content: string
}

const props = defineProps<Props>()
const { renderMarkdown } = useMarkdown()

const renderedHtml = computed(() => renderMarkdown(props.content))
</script>

<style>
/* markdown.css에서 스타일링 */
</style>
```

### 관리자 컴포넌트

#### MarkdownEditor.vue
```vue
<template>
  <div class="markdown-editor">
    <div class="editor-toolbar">
      <button @click="insertBold">Bold</button>
      <button @click="insertItalic">Italic</button>
      <button @click="insertLink">Link</button>
      <button @click="insertImage">Image</button>
      <button @click="insertCode">Code</button>
    </div>

    <div class="editor-content">
      <textarea
        v-model="content"
        @input="handleInput"
        placeholder="마크다운으로 작성하세요..."
      ></textarea>

      <div class="preview">
        <MarkdownViewer :content="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MarkdownViewer from './MarkdownViewer.vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const content = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  content.value = newVal
})

const handleInput = () => {
  emit('update:modelValue', content.value)
}

// 마크다운 헬퍼 함수들
const insertBold = () => { /* ... */ }
const insertItalic = () => { /* ... */ }
const insertLink = () => { /* ... */ }
const insertImage = () => { /* ... */ }
const insertCode = () => { /* ... */ }
</script>
```

---

## 상태 관리

### Auth Store (auth.store.ts)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, validateToken } from '@/api/auth.api'
import type { LoginRequest, LoginResponse } from '@/types/auth.types'
import { setToken, getToken, removeToken } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(getToken())
  const username = ref<string | null>(null)
  const role = ref<string | null>(null)
  const expiresAt = ref<number | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => role.value === 'ROLE_ADMIN')

  // Actions
  const loginAction = async (credentials: LoginRequest) => {
    try {
      const response = await login(credentials)

      token.value = response.token
      username.value = response.username
      role.value = response.role
      expiresAt.value = Date.now() + response.expiresIn

      setToken(response.token)

      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    token.value = null
    username.value = null
    role.value = null
    expiresAt.value = null
    removeToken()
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const response = await validateToken()

      if (response.valid) {
        username.value = response.username
        role.value = response.role
        expiresAt.value = response.expiresAt
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    // State
    token,
    username,
    role,
    expiresAt,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    loginAction,
    logout,
    checkAuth
  }
})
```

### Post Store (post.store.ts)

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPostList, getPostDetail, getRelatedPosts } from '@/api/post.api'
import type { PostListItem, PostDetail, PageResponse } from '@/types/post.types'

export const usePostStore = defineStore('post', () => {
  // State
  const posts = ref<PostListItem[]>([])
  const currentPost = ref<PostDetail | null>(null)
  const relatedPosts = ref<PostListItem[]>([])
  const pagination = ref({
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchPosts = async (page: number = 0, size: number = 10) => {
    loading.value = true
    error.value = null

    try {
      const response = await getPostList(page, size)
      posts.value = response.content
      pagination.value = response.page
    } catch (err) {
      error.value = '포스트 목록을 불러오는데 실패했습니다.'
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
    } catch (err) {
      error.value = '포스트를 불러오는데 실패했습니다.'
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
    }
  }

  return {
    // State
    posts,
    currentPost,
    relatedPosts,
    pagination,
    loading,
    error,
    // Actions
    fetchPosts,
    fetchPostDetail,
    fetchRelatedPosts
  }
})
```

### UI Store (ui.store.ts)

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const darkMode = ref(false)
  const sidebarOpen = ref(false)

  // Actions
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value.toString())
    updateDarkModeClass()
  }

  const updateDarkModeClass = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      darkMode.value = saved === 'true'
    } else {
      // 시스템 설정 따르기
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDarkModeClass()
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    darkMode,
    sidebarOpen,
    toggleDarkMode,
    toggleSidebar,
    initDarkMode
  }
})
```

---

## 라우팅

### router/index.ts

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard, adminGuard } from './guards'

const routes: RouteRecordRaw[] = [
  // 공개 페이지
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: '/posts',
        name: 'PostList',
        component: () => import('@/views/PostList.vue')
      },
      {
        path: '/posts/:id',
        name: 'PostDetail',
        component: () => import('@/views/PostDetail.vue'),
        props: true
      },
      {
        path: '/tags/:tagName',
        name: 'TagPosts',
        component: () => import('@/views/TagPosts.vue'),
        props: true
      },
      {
        path: '/series/:seriesId',
        name: 'SeriesPosts',
        component: () => import('@/views/SeriesPosts.vue'),
        props: true
      }
    ]
  },

  // 로그인 (레이아웃 없음)
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { layout: 'empty' }
  },

  // 관리자 페이지
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    beforeEnter: adminGuard,
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'posts',
        name: 'AdminPostList',
        component: () => import('@/views/admin/PostManagement.vue')
      },
      {
        path: 'posts/create',
        name: 'AdminPostCreate',
        component: () => import('@/views/admin/PostCreate.vue')
      },
      {
        path: 'posts/:id/edit',
        name: 'AdminPostEdit',
        component: () => import('@/views/admin/PostEdit.vue'),
        props: true
      },
      {
        path: 'tags',
        name: 'AdminTags',
        component: () => import('@/views/admin/TagManagement.vue')
      },
      {
        path: 'series',
        name: 'AdminSeries',
        component: () => import('@/views/admin/SeriesManagement.vue')
      },
      {
        path: 'cache',
        name: 'AdminCache',
        component: () => import('@/views/admin/CacheManagement.vue')
      }
    ]
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

### router/guards.ts

```typescript
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    const isValid = await authStore.checkAuth()
    if (isValid) {
      next()
    } else {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  }
}

export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    const isValid = await authStore.checkAuth()

    if (!isValid) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (!authStore.isAdmin) {
      next({ name: 'Home' })
    } else {
      next()
    }
  }
}
```

---

## 인증 플로우

### 1. Axios 인터셉터 설정 (api/axios.ts)

```typescript
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import { getToken, removeToken } from '@/utils/storage'
import router from '@/router'
import { useToast } from '@/composables/useToast'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    const toast = useToast()

    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      removeToken()
      router.push({ name: 'Login' })
      toast.error('로그인이 필요합니다.')
    } else if (error.response?.status === 403) {
      // 권한 없음
      toast.error('접근 권한이 없습니다.')
    } else if (error.response?.status === 404) {
      // 리소스 없음
      toast.error('요청한 리소스를 찾을 수 없습니다.')
    } else if (error.response?.status === 500) {
      // 서버 오류
      toast.error('서버 오류가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)

export default apiClient
```

### 2. LocalStorage 유틸리티 (utils/storage.ts)

```typescript
const TOKEN_KEY = 'polar_auth_token'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
```

### 3. 로그인 플로우

```
1. 사용자가 /login 페이지에서 아이디/비밀번호 입력
2. authStore.loginAction() 호출
3. POST /auth/login → JWT 토큰 받음
4. 토큰을 localStorage에 저장
5. authStore에 사용자 정보 저장
6. 관리자 대시보드로 리다이렉트
```

### 4. 인증 확인 플로우

```
1. 앱 시작 시 (main.ts)
2. localStorage에서 토큰 확인
3. 토큰이 있으면 authStore.checkAuth() 호출
4. GET /auth/validate → 토큰 유효성 검증
5. 유효하면 사용자 정보 복원
6. 무효하면 토큰 삭제 및 로그아웃 상태
```

### 5. 자동 로그아웃

```
1. API 요청 시 401 Unauthorized 응답
2. Axios 인터셉터에서 감지
3. 토큰 삭제
4. 로그인 페이지로 리다이렉트
```

---

## 개발 우선순위

### Phase 1: 기본 구조 (1주)

1. **프로젝트 초기 설정**
   - Vite + Vue3 + TypeScript 프로젝트 생성
   - 의존성 설치 (Pinia, Vue Router, Axios, Tailwind CSS 등)
   - 환경 변수 설정
   - 디렉토리 구조 생성

2. **API 통신 모듈**
   - Axios 인스턴스 설정
   - 인터셉터 구현
   - API 함수 작성 (auth, post)

3. **타입 정의**
   - TypeScript 인터페이스/타입 정의
   - API 응답 타입
   - 도메인 모델 타입

4. **라우팅 설정**
   - Vue Router 설정
   - 기본 라우트 정의
   - 레이아웃 컴포넌트

### Phase 2: 인증 시스템 (3일)

1. **인증 Store**
   - Pinia auth store 구현
   - 로그인/로그아웃 액션
   - 토큰 관리

2. **로그인 페이지**
   - 로그인 폼
   - 에러 처리
   - 리다이렉트 로직

3. **라우트 가드**
   - authGuard 구현
   - adminGuard 구현
   - 자동 리다이렉트

### Phase 3: 공개 페이지 (1주)

1. **공통 컴포넌트**
   - AppHeader
   - AppFooter
   - Pagination
   - LoadingSpinner
   - ErrorMessage

2. **포스트 목록 페이지**
   - PostList 뷰
   - PostCard 컴포넌트
   - 페이징 구현

3. **포스트 상세 페이지**
   - PostDetail 뷰
   - MarkdownViewer 컴포넌트
   - 연관 포스트 표시

4. **마크다운 렌더링**
   - markdown-it 설정
   - 코드 하이라이팅
   - 마크다운 스타일링

### Phase 4: 관리자 페이지 (2주)

1. **관리자 레이아웃**
   - AdminLayout 컴포넌트
   - 사이드바 네비게이션
   - 헤더

2. **포스트 관리**
   - 목록 페이지
   - 생성 페이지 (MarkdownEditor)
   - 수정 페이지
   - 삭제 기능

3. **태그 관리**
   - 목록/생성/수정/삭제

4. **시리즈 관리**
   - 목록/생성/수정/삭제

5. **파일 업로드**
   - 이미지 업로드 컴포넌트
   - 드래그 앤 드롭
   - 미리보기

### Phase 5: UI/UX 개선 (1주)

1. **반응형 디자인**
   - 모바일 최적화
   - 태블릿 최적화

2. **다크모드**
   - 테마 전환
   - 색상 스킴

3. **로딩/에러 상태**
   - 스켈레톤 UI
   - 에러 메시지 표시
   - 토스트 알림

4. **SEO 최적화**
   - 메타 태그 설정
   - vue-meta 또는 useHead

### Phase 6: 테스트 및 배포 (3일)

1. **테스트**
   - 단위 테스트 (Vitest)
   - E2E 테스트 (Playwright 선택사항)

2. **빌드 최적화**
   - 코드 스플리팅
   - 번들 사이즈 최적화
   - 이미지 최적화

3. **배포 준비**
   - 환경 변수 설정
   - 빌드 스크립트
   - Nginx 설정 (선택사항)

---

## 추가 권장사항

### 1. 코드 스타일
- ESLint + Prettier 설정
- Vue3 Composition API 사용
- TypeScript strict 모드
- 컴포넌트는 단일 책임 원칙

### 2. 성능 최적화
- 이미지 lazy loading
- 컴포넌트 lazy loading (defineAsyncComponent)
- 가상 스크롤 (긴 목록의 경우)
- 디바운싱/쓰로틀링 (검색)

### 3. 접근성
- 시맨틱 HTML
- ARIA 속성
- 키보드 네비게이션
- 색상 대비

### 4. 보안
- XSS 방지 (마크다운 렌더링 시 sanitization)
- CSRF 토큰 (필요 시)
- Content Security Policy

---

## 예상 개발 기간

- **최소 기능 (MVP)**: 2-3주
- **완전한 기능**: 4-6주
- **추가 개선 및 테스트**: 1-2주

**총 예상 기간**: 5-9주

---

## 참고 자료

### 공식 문서
- [Vue 3 공식 문서](https://vuejs.org/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)
- [Vue Router 공식 문서](https://router.vuejs.org/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)

### 마크다운 라이브러리
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [highlight.js](https://highlightjs.org/)

### 기타
- [Vite 공식 문서](https://vitejs.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

---

## Claude Code 사용 가이드

### 이 가이드를 활용하는 방법

1. **초기 설정 시**
   ```
   "이 프로젝트의 Vue3 프론트엔드를 Phase 1부터 시작해줘.
   VUE3-FRONTEND-GUIDE.md를 참고해서 프로젝트를 초기화하고
   기본 구조를 만들어줘."
   ```

2. **특정 기능 개발 시**
   ```
   "VUE3-FRONTEND-GUIDE.md의 Phase 3를 참고해서
   포스트 목록 페이지를 만들어줘. API 응답 형식도
   가이드에 있으니 그대로 사용해줘."
   ```

3. **컴포넌트 생성 시**
   ```
   "가이드에 있는 MarkdownEditor 컴포넌트를 구현해줘.
   실시간 프리뷰 기능도 포함해서."
   ```

4. **API 연동 시**
   ```
   "가이드의 API 명세를 참고해서 포스트 API 함수들을
   api/post.api.ts에 작성해줘."
   ```

### 주의사항
- 이 가이드는 백엔드 API 응답 형식에 맞춰 작성되었습니다.
- snake_case로 오는 API 응답을 camelCase로 변환해야 합니다.
- JWT 토큰은 반드시 localStorage에 안전하게 보관하세요.
- 환경 변수는 `.env` 파일에 저장하고 Git에 커밋하지 마세요.

---

**작성일**: 2024-01-20
**작성자**: Claude Code
**버전**: 1.0
