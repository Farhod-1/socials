import { ChatMessageType, type LocalChatMessage } from '@/service/modules/chat/types'
import { autoResetRef } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, provide, ref, watch } from 'vue'

interface ChatDetails {
  ticketId: string
}

interface Chatting {
  chatting: Ref<ChatDetails | undefined>
  open: (ticketId: string) => void
  isOpen: (ticketId?: string) => boolean
  close: () => void
  message: ComputedRef<string>
  setMessage: (value: string) => void
  addMessage: (value: string) => void
  replyMessage: ComputedRef<LocalChatMessage | undefined>
  setReplyMessage: (message?: LocalChatMessage) => void
  editMessage: ComputedRef<LocalChatMessage | undefined>
  setEditMessage: (message?: LocalChatMessage) => void
  focusedMessageId: ComputedRef<string | undefined>
  focusMessage: (messageId?: string) => void
}

export function provideChatModule() {
  const messageRef = ref('')
  const message = computed(() => messageRef.value)

  // just add new value instead of replacing
  function addMessage(value: string) {
    messageRef.value += value
  }

  function setMessage(value: string) {
    messageRef.value = value
  }

  const replyMessageRef = ref<LocalChatMessage | undefined>()
  const replyMessage = computed(() => replyMessageRef.value)

  function setReplyMessage(message?: LocalChatMessage) {
    message !== undefined && setEditMessage(undefined)

    replyMessageRef.value = message
  }

  const editMessageRef = ref<LocalChatMessage | undefined>()
  const editMessage = computed(() => editMessageRef.value)

  function setEditMessage(editMessage?: LocalChatMessage) {
    editMessage !== undefined && setReplyMessage(undefined)

    editMessageRef.value = editMessage

    if (editMessage?.text) {
      messageRef.value = editMessage.text
    }
  }

  watch(editMessageRef, (message) => {
    if (message?.type === ChatMessageType.Text && message.text != null && message.text.trim()) {
      message.value = message.text.trim()
    }
  })

  const focusedMessageIdRef = autoResetRef<string | undefined>('', 100)
  const focusedMessageId = computed(() => focusedMessageIdRef.value)
  const focusMessage = (messageId?: string) => {
    focusedMessageIdRef.value = messageId
  }

  const chatDetails = ref<ChatDetails | undefined>()

  watch(chatDetails, () => {
    setReplyMessage(undefined)
    setEditMessage(undefined)
  })

  function isOpen(ticketId?: string) {
    return chatDetails.value?.ticketId === ticketId && typeof ticketId === 'string'
  }

  function open(ticketId: string) {
    chatDetails.value = { ticketId }
  }

  function close() {
    chatDetails.value = undefined
  }

  const chatting: Chatting = {
    chatting: chatDetails,
    open,
    isOpen,
    close,
    message,
    setMessage,
    addMessage,
    editMessage,
    setReplyMessage,
    replyMessage,
    setEditMessage,
    focusedMessageId,
    focusMessage
  }

  provide<Chatting>('chatting', chatting)

  return chatting
}

export function useChatting() {
  return inject<Chatting>('chatting') as Chatting
}
