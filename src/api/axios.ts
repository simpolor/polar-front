import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import { getToken, removeToken } from '@/utils/storage'
import { toast } from 'vue3-toastify'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      removeToken()
      // router.push를 여기서 직접 호출하지 않고, error를 reject하여 호출한 곳에서 처리하도록 함
      toast.error('로그인이 필요합니다.')
    } else if (error.response?.status === 403) {
      // 권한 없음
      toast.error('접근 권한이 없습니다.')
    } else if (error.response?.status === 404) {
      // 리소스 없음
      toast.error('요청한 리소스를 찾을 수 없습니다.')
    } else if (error.response?.status === 500) {
      // 서버 오류
      toast.error('서버 오류가 발생했습니다.')
    } else {
      // 기타 오류
      toast.error('오류가 발생했습니다.')
    }

    return Promise.reject(error)
  }
)

export default apiClient