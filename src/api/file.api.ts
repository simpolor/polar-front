import apiClient from './axios'
import type { ApiResponse } from '@/types/common.types'

// 파일 업로드 응답
export interface UploadedFile {
  file_id: number
  image_url: string
  original_file_name: string
}

// 이미지 파일 업로드
export const uploadImage = async (file: File): Promise<ApiResponse<UploadedFile>> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await apiClient.post<ApiResponse<UploadedFile>>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}
