<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white dark:bg-gray-800 shadow">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="text-2xl font-bold text-gray-800 dark:text-white">
            Polar Blog
          </router-link>

          <div class="flex items-center gap-6">
            <router-link
              to="/"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              홈
            </router-link>
            <router-link
              to="/posts"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              포스트
            </router-link>
            <router-link
              v-if="isAdmin"
              to="/admin"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              관리자
            </router-link>
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {{ darkMode ? '🌞' : '🌙' }}
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
        <p>&copy; 2024 Polar Blog. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUIStore } from '@/stores/ui.store'

const { isAdmin } = useAuth()
const uiStore = useUIStore()

const darkMode = computed(() => uiStore.darkMode)

const toggleDarkMode = () => {
  uiStore.toggleDarkMode()
}
</script>