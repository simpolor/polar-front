<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300 dark:text-gray-700">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        페이지를 찾을 수 없습니다
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <router-link to="/" class="btn-primary inline-block">
        홈으로 돌아가기
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found page
</script>