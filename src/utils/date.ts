import { format, parseISO } from 'date-fns'

// 날짜 포맷팅 함수
export const formatDate = (dateString: string | undefined, formatStr: string = 'yyyy-MM-dd'): string => {
  if (!dateString) {
    return '-'
  }

  try {
    const date = parseISO(dateString)
    return format(date, formatStr)
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

// 날짜 + 시간 포맷팅
export const formatDateTime = (dateString: string | undefined): string => {
  return formatDate(dateString, 'yyyy-MM-dd HH:mm:ss')
}

// 상대 시간 표시 (예: "2시간 전")
export const formatRelativeTime = (dateString: string | undefined): string => {
  if (!dateString) {
    return '-'
  }

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return '방금 전'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}분 전`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}시간 전`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}일 전`
    } else {
      return formatDate(dateString)
    }
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return dateString
  }
}