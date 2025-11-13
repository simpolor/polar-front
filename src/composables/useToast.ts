import { toast } from 'vue3-toastify'
import type { ToastOptions } from 'vue3-toastify'

const defaultOptions: ToastOptions = {
  autoClose: 3000,
  position: 'top-right',
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  theme: 'auto'
}

export function useToast() {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options })
  }

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options })
  }

  const info = (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options })
  }

  const warning = (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options })
  }

  return {
    success,
    error,
    info,
    warning
  }
}