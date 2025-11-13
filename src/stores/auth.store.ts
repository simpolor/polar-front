import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, validateToken } from '@/api/auth.api'
import type { LoginRequest } from '@/types/auth.types'
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