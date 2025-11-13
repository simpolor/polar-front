import apiClient from './axios'
import type { LoginRequest, LoginResponse, ValidateTokenResponse } from '@/types/auth.types'

// 로그인
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
  return response.data
}

// 토큰 검증
export const validateToken = async (): Promise<ValidateTokenResponse> => {
  const response = await apiClient.get<ValidateTokenResponse>('/auth/validate')
  return response.data
}
