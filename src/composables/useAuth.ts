import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginRequest } from '@/types/auth.types'
import { toast } from 'vue3-toastify'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Computed
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const username = computed(() => authStore.username)

  // Login
  const login = async (credentials: LoginRequest) => {
    try {
      await authStore.loginAction(credentials)
      toast.success(`환영합니다, ${authStore.username}님!`)
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.'
      toast.error(errorMessage)
      throw error
    }
  }

  // Logout
  const logout = () => {
    authStore.logout()
    toast.info('로그아웃되었습니다.')
    router.push('/login')
  }

  // Check authentication
  const checkAuth = async () => {
    try {
      const isValid = await authStore.checkAuth()
      if (!isValid) {
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
        router.push('/login')
      }
      return isValid
    } catch (error) {
      console.error('Auth check error:', error)
      return false
    }
  }

  return {
    // State
    isAuthenticated,
    isAdmin,
    username,
    // Actions
    login,
    logout,
    checkAuth
  }
}
