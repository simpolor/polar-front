import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const darkMode = ref(false)
  const sidebarOpen = ref(false)

  // Actions
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value.toString())
    updateDarkModeClass()
  }

  const updateDarkModeClass = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      darkMode.value = saved === 'true'
    } else {
      // 기본값: 화이트 테마
      darkMode.value = false
    }
    updateDarkModeClass()
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    darkMode,
    sidebarOpen,
    toggleDarkMode,
    toggleSidebar,
    initDarkMode
  }
})
