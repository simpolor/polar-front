<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white dark:bg-gray-800 shadow">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/posts" class="flex items-center gap-2">
            <img src="@/assets/logo.png" alt="단순하게 색있게" class="h-8" />
            <span class="text-xl font-bold text-gray-900 dark:text-white leading-none" style="line-height: 2rem;">단순하게 색있게</span>
          </router-link>

          <div class="flex items-center gap-2">
            <router-link
              v-if="isAdmin"
              to="/admin"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
            >
              관리자
            </router-link>
            <router-link
              to="/bookmarks"
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              즐겨찾기
            </router-link>
            <button
              @click="toggleDarkMode"
              :aria-label="darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {{ darkMode ? '🌞' : '🌙' }}
            </button>
            <button
              @click="uiStore.toggleSidebar()"
              aria-label="태그 메뉴 열기"
              class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-1 container mx-auto px-4 py-8">
      <router-view :key="$route.fullPath" />
    </main>

    <footer class="bg-gray-100 dark:bg-gray-800 py-8">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Simpolor</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUIStore } from '@/stores/ui.store'

const { isAdmin } = useAuth()
const uiStore = useUIStore()
const route = useRoute()

// 라우트 변경 시 사이드바 닫기
watch(() => route.fullPath, () => {
  uiStore.sidebarOpen = false
})

const darkMode = computed(() => uiStore.darkMode)

const toggleDarkMode = () => {
  uiStore.toggleDarkMode()
}
</script>