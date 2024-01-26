import type { ToastType } from '@/components/Toast/ToastPlugin'

export interface IToastOptions {
  _id?: number
  _hiding?: boolean
  timer?: number
  message: string
  type: ToastType
  closeable?: boolean
  close?: () => void
}

export interface IToast {
  open: (option: IToastOptions) => void
}
