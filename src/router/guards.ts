import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const authGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    const isValid = await authStore.checkAuth()
    if (isValid) {
      next()
    } else {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  }
}

export const adminGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    const isValid = await authStore.checkAuth()

    if (!isValid) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (!authStore.isAdmin) {
      next({ name: 'Home' })
    } else {
      next()
    }
  }
}