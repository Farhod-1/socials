import { LocalChatMapper } from '@/service/modules/chat/chat-helpers'
import type { LocalTicketChat, RemoteTicketChat } from '@/service/modules/chat/types'
import { QueryClient, useQuery } from '@tanstack/vue-query'

export function useChatItemDetails(ticketId: string) {
  return useQuery<LocalTicketChat>({
    staleTime: Infinity,
    queryKey: ['chat-item-details', ticketId]
  })
}

export function saveChatItemDetails(queryClient: QueryClient, chat: RemoteTicketChat) {
  queryClient.setQueryData<LocalTicketChat>(['chat-item-details', chat._id], LocalChatMapper(chat))
}

export function updateProjectOfChatItem(
  queryClient: QueryClient,
  ticketId: string,
  project: { id: string; name: string }
) {
  const chat = queryClient.getQueryData<LocalTicketChat>(['chat-item-details', ticketId])

  if (chat) {
    queryClient.setQueryData<LocalTicketChat>(['chat-item-details', ticketId], {
      ...chat,
      projectId: project.id,
      project: {
        _id: project.id,
        name: project.name
      }
    })
  }
}
