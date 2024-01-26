import type {
  LocalChatMessage,
  LocalTicketChat,
  RemoteChatMessage,
  RemoteTicketChat
} from '@/service/modules/chat/types'
import linkifyStr from 'linkify-string/dist/linkify-string.es'

function linkify(inputText?: string) {
  return inputText
    ? linkifyStr(inputText, { defaultProtocol: 'https', target: '_blank' })
    : inputText
}

export function LocalMessageMapper(m: RemoteChatMessage): LocalChatMessage {
  return {
    ...m,
    formattedText: linkify(m.text),
    replyTo: m.replyTo ? LocalMessageMapper(m.replyTo) : undefined,
    createdAt: new Date(m.createdAt),
    updatedAt: new Date(m.updatedAt),
    editedAt: m.editedAt ? new Date(m.editedAt) : undefined
  }
}

export function LocalChatMapper(c: RemoteTicketChat): LocalTicketChat {
  return {
    ...c,
    lastMessage: c.lastMessage ? LocalMessageMapper(c.lastMessage) : undefined,
    createdAt: new Date(c.createdAt),
    respondDate: c.respondDate ? new Date(c.respondDate) : undefined,
    deadline: c.deadline ? new Date(c.deadline) : undefined,
    lastActivityAt: c.lastActivityAt ? new Date(c.lastActivityAt) : undefined
  }
}
