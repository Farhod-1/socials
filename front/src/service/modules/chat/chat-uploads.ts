import type { ComputedRef, Ref } from 'vue'
import { computed, reactive, ref } from 'vue'
import http from '@/service/http'
import type { ChatUploadFile, UploadFileResponse } from '@/service/modules/chat/types'

const uploads = reactive({} as Record<string, ChatUploadFile[]>)

export function useChatUploads() {
  const getUploadsOf = (chat: string): ComputedRef<ChatUploadFile[]> => {
    return computed(() => uploads[chat] ?? [])
  }

  async function uploadFile(ticketId: string, file: File, replyTo?: string) {
    uploads[ticketId] = uploads[ticketId] || []

    const cancelController = new AbortController()

    const id = Date.now() + '_' + Math.random()

    function removeFilePreview() {
      uploads[ticketId] = uploads[ticketId].filter((u) => u.id !== id)
    }

    const upload: Ref<ChatUploadFile> = ref({
      id: id,
      file,
      date: new Date(),
      progress: { total: 0, loaded: 0, percent: 0 },
      error: false,
      cancel: () => {
        removeFilePreview()

        cancelController.abort('Canceled by user')
      }
    })

    uploads[ticketId].push(upload.value)

    try {
      const formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('ticketId', ticketId)
      if (replyTo) formData.append('replyTo', replyTo)

      await http.request<UploadFileResponse>({
        method: 'post',
        data: formData,
        url: 'operator-chat/message/file',
        signal: cancelController.signal,
        onUploadProgress: (e: ProgressEvent) => {
          upload.value.progress = {
            total: e.total,
            loaded: e.loaded,
            percent: Math.round((e.loaded * 100) / e.total)
          }
        }
      })

      removeFilePreview()
    } catch (e) {
      upload.value.error = e
    }
  }

  return {
    getUploadsOf,
    uploadFile
  }
}
