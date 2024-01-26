import { useOnEvent, ws } from '@/modules/socket'
import type { ChatMessageDeletedPayload, IOnlineOperatorData } from '@/modules/socket/types'
import { playNotification } from '@/modules/sound-controller'
import { saveLastMessageForChat } from '@/service/modules/chat/last-message'

import type {
  ITicketDetails,
  RemoteChatMessage,
  RemoteTicketChat,
  UpdateClientDetails,
  UpdateClientOnline,
  UpdateTicketDetails
} from '@/service/modules/chat/types'
import { useUser } from '@/service/modules/user/user'
import type { InfiniteData } from '@tanstack/vue-query'
import { useQueryClient } from '@tanstack/vue-query'
import { watchImmediate } from '@vueuse/core'

enum ChatEventType {
  NewMessage = 'chat.message.new',
  MessageDeleted = 'chat.message.deleted',
  MessageEdited = 'chat.message.edited',

  OperatorConnected = 'OPERATOR_CONNECTED_TO_TICKET',
  OperatorDisconnected = 'OPERATOR_DISCONNECTED_FROM_TICKET'
}

function mergeExtraPayload(message: RemoteChatMessage) {
  try {
    if (message.payload) Object.assign(message, message.payload)
  } catch (e) {
    console.error('Error while merging extra payload', e)
  }
}

function newMessageForChatHandler() {
  const queryClient = useQueryClient()

  function handleNewMessage(message: RemoteChatMessage) {
    queryClient.setQueryData<InfiniteData<RemoteChatMessage[]>>(
      ['chat-messages', message.chat],
      (data) => {
        const pages = (data?.pages || []).map((page) => [...page])

        if (pages && pages.length > 0) {
          pages[0].unshift(message)
        }

        if (pages.length > 0 && pages[0].length > 0)
          saveLastMessageForChat(queryClient, pages[0][0])

        return {
          pages: pages,
          pageParams: data?.pageParams
        } as InfiniteData<RemoteChatMessage[]>
      }
    )
  }

  useOnEvent(ChatEventType.NewMessage, function (message: RemoteChatMessage) {
    mergeExtraPayload(message)
    handleNewMessage(message)
    playNotification()
  })
}

function messageDeletedInChatHandler() {
  const queryClient = useQueryClient()

  useOnEvent(ChatEventType.MessageDeleted, function (payload: ChatMessageDeletedPayload) {
    queryClient.setQueryData<InfiniteData<RemoteChatMessage[]>>(
      ['chat-messages', payload.chat],
      (data) => {
        const pages = (data?.pages || []).map((page) => page.filter((m) => m._id !== payload._id))

        if (pages.length > 0 && pages[0].length > 0) {
          saveLastMessageForChat(queryClient, pages[0][0])
        }

        return {
          pages: pages,
          pageParams: data?.pageParams
        } as InfiniteData<RemoteChatMessage[]>
      }
    )
  })
}

function messageEditedInChatHandler() {
  const queryClient = useQueryClient()

  useOnEvent(ChatEventType.MessageEdited, function (payload: RemoteChatMessage) {
    mergeExtraPayload(payload)
    queryClient.setQueryData<InfiniteData<RemoteChatMessage[]>>(
      ['chat-messages', payload.chat],
      (data) => {
        const pages = (data?.pages || []).map((page) =>
          page.map((m) => (m._id === payload._id ? payload : m))
        )

        if (pages.length > 0 && pages[0].length > 0) {
          saveLastMessageForChat(queryClient, pages[0][0])
        }

        return {
          pages: pages,
          pageParams: data?.pageParams
        } as InfiniteData<RemoteChatMessage[]>
      }
    )
  })
}

export default function registerEvents() {
  const { token } = useUser()

  const queryClient = useQueryClient()

  function updateTicketDetails(
    ticketId: string,
    payload: UpdateClientDetails | UpdateTicketDetails
  ) {
    const savedData = queryClient.getQueryData<ITicketDetails>(['ticket-details', ticketId])

    if (savedData) {
      queryClient.setQueryData(['ticket-details', ticketId], {
        ...savedData,
        ...payload
      })
    }
  }

  watchImmediate(token, (token, oldValue) => {
    if (token && token !== oldValue) {
      ws.connect(token)
    }
  })

  newMessageForChatHandler()
  messageDeletedInChatHandler()
  messageEditedInChatHandler()

  ws.onEvent('ticket.created', (data: RemoteTicketChat) => {
    // Ticket handle adding new ticket to collections
    // chats.addChats(ChatTabType.New, data)
    // chats.addChats(ChatTabType.All, data)
  })

  ws.onEvent('ticket.details-updated', (data: UpdateTicketDetails) => {
    // TODO handle ticket details updated
    // chats.updateClientDetails(data)

    updateTicketDetails(data.ticketId, data)
    const savedData = queryClient.getQueryData<ITicketDetails>(['ticket-details', data.ticketId])

    if (savedData) {
      queryClient.setQueryData(['ticket-details', data.ticketId], {
        ...savedData,
        ...data
      })
    }
  })

  ws.onEvent('ticket.assigned-me', (data: RemoteTicketChat) => {
    // TODO handle ticket assign me
    // chats.addChats(ChatTabType.Mine, data)
  })

  ws.onEvent('ticket.operator-assigned', (data: UpdateClientDetails) => {
    // TODO handle operator assigned
    // chats.updateDetails(data._id, data)

    updateTicketDetails(data._id, data)
  })

  ws.onEvent('client.details-updated', (data: UpdateClientDetails) => {
    // TODO handle client details updated
    //chats.updateDetails(data.chatId, data)
  })

  ws.onEvent('client.online', (data: UpdateClientOnline) => {
    // TODO handle client online
    console.log('client.online', data)
    // chats.updateOnline(data)
  })

  useOnEvent(ChatEventType.OperatorConnected, (data: IOnlineOperatorData) => {
    const currentData =
      queryClient.getQueryData<IOnlineOperatorData[]>(['connectedOperators', data.ticketId]) ?? []

    const newData = currentData.filter((item) => item._id !== data._id)
    newData.push(data)

    queryClient.setQueryData(['connectedOperators', data.ticketId], newData)
  })

  useOnEvent(ChatEventType.OperatorDisconnected, (data: IOnlineOperatorData) => {
    const currentData =
      queryClient.getQueryData<IOnlineOperatorData[]>(['connectedOperators', data.ticketId]) ?? []

    queryClient.setQueryData(
      ['connectedOperators', data.ticketId],
      currentData.filter((item) => item._id !== data._id)
    )
  })
}
