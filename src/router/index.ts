import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { adminGuard } from './guards'

const routes: RouteRecordRaw[] = [
  // 공개 페이지
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/posts'
      },
      {
        path: 'posts',
        name: 'PostList',
        component: () => import('@/views/PostList.vue')
      },
      {
        path: 'posts/:id',
        name: 'PostDetail',
        component: () => import('@/views/PostDetail.vue'),
        props: true
      },
      {
        path: 'tags/:tagId',
        name: 'TagPosts',
        component: () => import('@/views/TagPosts.vue'),
        props: true
      },
      {
        path: 'bookmarks',
        name: 'BookmarkList',
        component: () => import('@/views/BookmarkList.vue')
      }
    ]
  },

  // 로그인 (레이아웃 없음)
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
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
        path: 'bookmarks',
        name: 'AdminBookmarks',
        component: () => import('@/views/admin/BookmarkManagement.vue')
      },
      {
        path: 'bookmarks/create',
        name: 'AdminBookmarkCreate',
        component: () => import('@/views/admin/BookmarkCreate.vue')
      },
      {
        path: 'bookmarks/:id/edit',
        name: 'AdminBookmarkEdit',
        component: () => import('@/views/admin/BookmarkEdit.vue'),
        props: true
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
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router