import { createApp, ref } from 'vue'
import ToastContainer from './ToastContainer.vue'
import type { IToast, IToastOptions } from '@/components/Toast/IToastOptions'

export const provideToast = () => {
  const container = ref(document.createElement('div'))
  document.body.appendChild(container.value)
  let count = 0

  const toasts = ref<IToastOptions[]>([])

  createApp(ToastContainer, { toasts: toasts.value }).mount(container.value)

  return {
    open(options: IToastOptions) {
      let timeout: number
      count++
      options._id = count
      options._hiding = false

      const dismiss = () => {
        if (timeout) {
          clearTimeout(timeout)
        }

        const pos = toasts.value.findIndex((t: IToastOptions) => t._id === options._id)

        if (pos >= 0) toasts.value.splice(pos, 1)
      }

      function startHiding() {
        options._hiding = true

        setTimeout(dismiss, 200)
      }

      if ('timer' in options && typeof options.timer === 'number' && options.timer > 0) {
        timeout = setTimeout(startHiding, options.timer)
      }

      toasts.value.push({ ...options, close: startHiding })
    }
  } as IToast
}
