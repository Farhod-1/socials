import { LocalMessageMapper } from '@/service/modules/chat/chat-helpers'
import type {
  LocalChatMessage,
  RemoteChatMessage,
  RemoteTicketChat
} from '@/service/modules/chat/types'
import { QueryClient, useQuery } from '@tanstack/vue-query'

export function useLastMessage(chatId: string) {
  return useQuery<LocalChatMessage>({
    staleTime: Infinity,
    queryKey: ['chat-last-message', chatId]
  })
}

export function saveLastMessageOfChat(queryClient: QueryClient, chat: RemoteTicketChat) {
  queryClient.setQueryData(
    ['chat-last-message', chat.chatId],
    chat.lastMessage ? LocalMessageMapper(chat.lastMessage) : ''
  )
}

export function saveLastMessageForChat(queryClient: QueryClient, message: RemoteChatMessage) {
  queryClient.setQueryData(
    ['chat-last-message', message.chat],
    message ? LocalMessageMapper(message) : ''
  )
}
