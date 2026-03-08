<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div class="p-6">
        <router-link to="/admin" class="text-2xl font-bold text-gray-800 dark:text-white">
          Admin
        </router-link>
      </div>

      <nav class="px-4 pb-4">
        <router-link
          to="/admin/dashboard"
          class="block px-4 py-2 mb-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-gray-800 text-white hover:bg-gray-900"
        >
          대시보드
        </router-link>

        <div class="mt-4">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            콘텐츠 관리
          </p>
          <router-link
            to="/admin/posts"
            class="block px-4 py-2 mb-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            active-class="bg-gray-800 text-white hover:bg-gray-900"
          >
            포스트
          </router-link>
          <router-link
            to="/admin/tags"
            class="block px-4 py-2 mb-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            active-class="bg-gray-800 text-white hover:bg-gray-900"
          >
            태그
          </router-link>
          <router-link
            to="/admin/bookmarks"
            class="block px-4 py-2 mb-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            active-class="bg-gray-800 text-white hover:bg-gray-900"
          >
            북마크
          </router-link>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            로그아웃
          </button>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="px-8 py-4 flex items-center justify-between">
          <router-link to="/admin/dashboard" class="text-2xl font-semibold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            관리자 페이지
          </router-link>

          <div class="flex items-center gap-4">
            <span class="text-gray-600 dark:text-gray-400">
              {{ username }}
            </span>
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {{ darkMode ? '🌞' : '🌙' }}
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 p-8">
        <router-view :key="$route.fullPath" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUIStore } from '@/stores/ui.store'

const { username, logout } = useAuth()
const uiStore = useUIStore()

const darkMode = computed(() => uiStore.darkMode)

const toggleDarkMode = () => {
  uiStore.toggleDarkMode()
}

const handleLogout = () => {
  logout()
}

// 어드민 페이지는 기본적으로 화이트 테마 사용
onMounted(() => {
  if (uiStore.darkMode) {
    uiStore.toggleDarkMode()
  }
})
</script>