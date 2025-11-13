import { ref, computed } from 'vue'
import type { PageInfo } from '@/types/common.types'

export function usePagination(initialPageSize: number = 10) {
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const pageInfo = ref<PageInfo | null>(null)

  const totalPages = computed(() => pageInfo.value?.total_pages ?? 0)
  const totalElements = computed(() => pageInfo.value?.total_elements ?? 0)
  const isFirstPage = computed(() => pageInfo.value?.first ?? true)
  const isLastPage = computed(() => pageInfo.value?.last ?? true)
  const isEmpty = computed(() => pageInfo.value?.empty ?? true)

  // 표시할 페이지 번호 계산
  const visiblePages = computed(() => {
    const pages: number[] = []
    const total = totalPages.value
    const current = currentPage.value // 1부터 시작하는 페이지 번호

    if (total <= 7) {
      // 총 페이지가 7개 이하면 모두 표시
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 현재 페이지 주변 페이지만 표시
      if (current <= 4) {
        // 앞쪽 페이지
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push(-1) // 구분자
        pages.push(total)
      } else if (current >= total - 3) {
        // 뒤쪽 페이지
        pages.push(1)
        pages.push(-1) // 구분자
        for (let i = total - 4; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // 중간 페이지
        pages.push(1)
        pages.push(-1) // 구분자
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i)
        }
        pages.push(-1) // 구분자
        pages.push(total)
      }
    }

    return pages
  })

  const setPageInfo = (info: PageInfo) => {
    pageInfo.value = info
    currentPage.value = info.page_number
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (!isLastPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (!isFirstPage.value) {
      currentPage.value--
    }
  }

  const firstPage = () => {
    currentPage.value = 1
  }

  const lastPage = () => {
    currentPage.value = totalPages.value
  }

  return {
    // State
    currentPage,
    pageSize,
    pageInfo,
    // Computed
    totalPages,
    totalElements,
    isFirstPage,
    isLastPage,
    isEmpty,
    visiblePages,
    // Actions
    setPageInfo,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage
  }
}