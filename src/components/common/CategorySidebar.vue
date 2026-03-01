<template>
  <!-- 모바일 오버레이 배경 -->
  <Teleport to="body">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="uiStore.sidebarOpen = false"
    />
  </Teleport>

  <aside
    class="
      fixed top-0 right-0 h-full w-64 z-50
      bg-white dark:bg-gray-900 shadow-xl
      transition-transform duration-300
      md:relative md:top-auto md:right-auto md:h-auto
      md:w-56 md:flex-shrink-0
      md:bg-transparent md:dark:bg-transparent
      md:shadow-none md:z-auto
      md:translate-x-0
    "
    :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="sticky top-8 p-6 pt-20 md:p-0 md:pt-0">
      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        태그
      </h3>

      <!-- 로딩 -->
      <div v-if="loading" class="space-y-2">
        <div v-for="i in 5" :key="i" class="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <!-- 태그 목록 -->
      <ul v-else class="space-y-1">
        <li>
          <router-link
            to="/posts"
            class="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
            :class="isAllActive
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <span>전체</span>
          </router-link>
        </li>
        <li v-for="tag in tags" :key="tag.id">
          <router-link
            :to="`/tags/${tag.id}`"
            class="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
            :class="activeTagId === tag.id
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <span>{{ tag.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTagStore } from '@/stores/tag.store'
import { useUIStore } from '@/stores/ui.store'

const route = useRoute()
const tagStore = useTagStore()
const uiStore = useUIStore()

const tags = computed(() => tagStore.tags)
const loading = computed(() => tagStore.loading)
const sidebarOpen = computed(() => uiStore.sidebarOpen)

const activeTagId = computed(() => {
  if (route.name === 'TagPosts') return Number(route.params.tagId)
  return null
})

const isAllActive = computed(() => route.name === 'PostList' || route.path === '/posts')

onMounted(() => {
  tagStore.fetchTags()
})
</script>
