import type { Ref } from 'vue'
import { inject, provide } from 'vue'
import previewImage from '@/helpers/preview-image'

const ChatLayoutSymbol = Symbol('ChatLayout')

interface ChatLayout {
  previewImages: () => void
}

export function provideChatLayout(chatContainer: Ref<HTMLElement | undefined>) {
  function previewImages() {
    const el = chatContainer.value?.querySelector<HTMLDivElement>('div.messages')

    if (el) previewImage(el)
  }

  provide<ChatLayout>(ChatLayoutSymbol, {
    previewImages
  })
}

export function useChatLayout() {
  const chatLayout = inject<ChatLayout>(ChatLayoutSymbol)

  if (chatLayout == null) {
    throw new Error('useChatLayout() is called without provider.')
  }

  return chatLayout
}
