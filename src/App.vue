<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUIStore } from '@/stores/ui.store'

const uiStore = useUIStore()

// 앱 초기화
onMounted(() => {
  // 다크모드 초기화
  uiStore.initDarkMode()
})
</script>

<style>
/* Global styles are imported in main.ts */
</style>
