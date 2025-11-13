<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
    <div class="card max-w-md w-full">
      <!-- 로고 / 타이틀 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Polar Blog
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          관리자 로그인
        </p>
      </div>

      <!-- 에러 메시지 -->
      <ErrorMessage
        v-if="errorMessage"
        :message="errorMessage"
        type="error"
        :dismissible="true"
        @dismiss="errorMessage = ''"
      />

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            아이디
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            class="input-field dark:bg-gray-700 dark:text-white"
            placeholder="아이디를 입력하세요"
            :disabled="loading"
            required
            autocomplete="username"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            class="input-field dark:bg-gray-700 dark:text-white"
            placeholder="비밀번호를 입력하세요"
            :disabled="loading"
            required
            autocomplete="current-password"
          />
        </div>

        <button
          type="submit"
          class="w-full btn-primary flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="sm" />
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- 하단 링크 -->
      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          ← 홈으로 돌아가기
        </router-link>
      </div>

      <!-- 테스트 계정 안내 (개발 환경에서만) -->
      <div v-if="isDevelopment" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p class="text-xs text-blue-800 dark:text-blue-300 text-center">
          테스트 계정: admin / test123!@#
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const credentials = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const isDevelopment = import.meta.env.MODE === 'development'

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await login(credentials.value)

    // 리다이렉트 처리
    const redirect = route.query.redirect as string
    router.push(redirect || '/admin/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    loading.value = false
  }
}
</script>