import type { IToast } from '@/components/Toast/IToastOptions'
import type { App } from 'vue'
import { inject } from 'vue'
import { provideToast } from './provideToast'

export function useToast(): IToast {
  return inject('$toast') as IToast
}

const ToastPlugin = {
  install: (app: App) => {
    const instance = provideToast()
    app.config.globalProperties.$toast = instance
    app.provide('$toast', instance)
  }
}
export default ToastPlugin

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}
