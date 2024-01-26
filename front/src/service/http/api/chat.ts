import http from '@/service/http'
import type { TicketsTablePaginationResponse } from '@/service/http/api/types'
import type {
  ITicketDetails,
  ITicketStatData,
  RemoteChatMessage
} from '@/service/modules/chat/types'
import type { IChatFilterForm } from '@/views/Chats/types'
import type { TicketStatsParams } from '@/views/OperatorStats/types'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import { computed, type ComputedRef, type MaybeRef, type Ref, toRaw, toValue } from 'vue'
import { saveChatItemDetails } from '@/service/modules/chat/chat-item-details'

export interface SendTextMessageData {
  ticketId: string
  replyTo?: string
  text: string
}

export interface SendTextMessageResponse {
  sent: boolean
  message: RemoteChatMessage
}

export function sendTextMessage() {
  return useMutation({
    mutationKey: ['chat-send-text-message'],
    mutationFn: async (data: SendTextMessageData) => {
      return http
        .post<SendTextMessageResponse>('operator-chat/message/text', data)
        .then((res) => res.data)
    }
  })
}

export interface EditTextMessageData {
  ticketId: string
  messageId: string
  text: string
}

export interface EditTextMessageResponse {
  edited: boolean
  message: RemoteChatMessage
}

export function editTextMessage() {
  return useMutation({
    mutationKey: ['chat-edit-text-message'],
    mutationFn: async (data: EditTextMessageData) => {
      return http
        .post<EditTextMessageResponse>('operator-chat/message/text/edit', data)
        .then((res) => res.data)
    }
  })
}

interface DeleteTextMessageData {
  ticketId: string
  messageId: string
}

interface DeleteTextMessageResponse {
  deleted: boolean
}

export function deleteMessage() {
  return useMutation({
    mutationKey: ['chat-delete-text-message'],
    mutationFn: async (data: DeleteTextMessageData) => {
      return http
        .delete<DeleteTextMessageResponse>('operator-chat/message', { data })
        .then((res) => res.data)
    }
  })
}

export interface TicketCountResponse {
  newTickets: number
}

export function ticketCount() {
  return useQuery({
    queryKey: ['ticket-count'],
    queryFn: async () => {
      return http.get<TicketCountResponse>('operator/tickets/count').then((res) => res.data)
    }
  })
}

export interface IOperatorTicketTableParams {
  operatorId?: string | undefined
  topicId?: string | undefined
  departmentId?: string | undefined
  projectId?: string
  status?: number | undefined
  dateFrom?: string
  dateTo?: string
  rating?: number | undefined
  page?: number
}

export function getTicketsList(data: ComputedRef<IChatFilterForm>) {
  return useQuery({
    queryKey: ['tickets', data],
    queryFn: () => {
      const filters: IOperatorTicketTableParams = {}

      const { date, ...rest } = toRaw(data.value) as IChatFilterForm

      Object.assign(filters, rest)

      if (Array.isArray(date) && date.length >= 2) {
        const [dateFrom, dateTo] = date

        filters.dateFrom = dateFrom.toISOString()
        filters.dateTo = dateTo.toISOString()
      }

      return http.get<
        TicketsTablePaginationResponse,
        AxiosResponse<TicketsTablePaginationResponse>,
        IOperatorTicketTableParams
      >('operator/tickets/table', {
        params: filters
      })
    },
    select: (response) => {
      return response.data
    }
  })
}

export function getTicketsStats(data: TicketStatsParams) {
  return useQuery({
    queryKey: ['ticket-stats', data],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return http.get<ITicketStatData[]>(`/tickets/stats`, { params: data })
    },
    select: (response) => response.data
  })
}

export interface TicketStatsMultiConditionalData {
  totalTicketsCount: number
  answeredTicketsCount: number
  finishedTicketsCount: number
  newTicketsCount: number
  totalBadRating: number
  totalExcellentRating: number
  totalGoodRating: number
  totalMessagesCount: number
}

export interface TicketMultiConditionalStatsQueryParams {
  operators: string[]
  projects: string[]
  timeFrom: Date
  timeTo: Date
}

// TODO move to separate file
export function getTicketStatsMultiConditional(
  data: MaybeRef<TicketMultiConditionalStatsQueryParams>
) {
  return useQuery({
    queryKey: ['ticket-stats-multi-conditional', data] as [
      string,
      TicketMultiConditionalStatsQueryParams
    ],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async ({ queryKey }) => {
      return (
        await http.get<
          TicketStatsMultiConditionalData,
          AxiosResponse<TicketStatsMultiConditionalData>,
          TicketMultiConditionalStatsQueryParams
        >(`/tickets/stats/multi-conditional`, {
          params: {
            operators: queryKey[1].operators,
            projects: queryKey[1].projects,
            timeFrom: queryKey[1].timeFrom.toISOString(),
            timeTo: queryKey[1].timeTo.toISOString()
          }
        })
      ).data
    }
  })
}

export function getTicketDetails(chatting: Ref<{ ticketId: string } | undefined>) {
  return useQuery({
    queryKey: ['ticket-details', chatting.value?.ticketId],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await http.get<ITicketDetails>(`operator/ticket/${chatting.value?.ticketId}`)).data
    }
  })
}

export interface IUpdateTicketTopicsPayload {
  topicIds?: string[]
  topicComment?: string
  description?: string
}

export function updateTicketTopics(ticketId: string) {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['ticket-details', ticketId],
    mutationFn: async (payload: IUpdateTicketTopicsPayload) => {
      return http.put(`operator/tickets/${ticketId}`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['ticket-details', ticketId])
    }
  })
}

export function updateTicketDescription(ticketId: string) {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['ticket-details'],
    mutationFn: async (payload: { description?: string }) => {
      return http.put(`operator/tickets/${ticketId}`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['chat-list'])
      q.refetchQueries(['client-chats-pagination'])
    }
  })
}

interface IClientChatsParams {
  projectId: string
  clientId: string
  page?: MaybeRef<number>
}

export function getClientChatsTable(params: IClientChatsParams) {
  return useQuery({
    queryKey: ['client-chats-pagination', params],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      return (
        await http.get<
          TicketsTablePaginationResponse,
          AxiosResponse<TicketsTablePaginationResponse>
        >('operator/tickets/table', {
          params: {
            page: toValue(params.page),
            clientId: params.clientId,
            projectId: params.projectId
          }
        })
      ).data
    }
  })
}

export interface IClientChatsCountParams {
  projectId: string
  clientId: string
}

export function getClientChatsCount(params: IClientChatsCountParams) {
  const { data: clientChatsData } = getClientChatsTable({
    clientId: params.clientId,
    projectId: params.projectId,
    page: 1
  })

  return computed(() => clientChatsData.value?.meta?.totalCount ?? 0)
}

export function getClientChats(params: IClientChatsParams, enabled: Ref<boolean>) {
  const queryClient = useQueryClient()

  return useInfiniteQuery<TicketsTablePaginationResponse>({
    queryKey: ['client-chats', params],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.length === 0) {
        return undefined
      }

      return pages.length + 1
    },
    queryFn: async (context) => {
      const chats = await http
        .get<
          TicketsTablePaginationResponse,
          AxiosResponse<TicketsTablePaginationResponse>,
          IOperatorTicketTableParams
        >('operator/tickets/table', {
          params: { ...params, page: context.pageParam }
        })
        .then((res) => res.data)

      chats.tickets.forEach((chat) => {
        saveChatItemDetails(queryClient, chat)
      })

      return chats
    },
    enabled
  })
}

interface ITicketArchiveDatePayload {
  ticketId: string
  timeToSchedule: Date | null
}

export function updateTicketArchiveDate(ticketId: string) {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['ticket-archive-date'],
    mutationFn: async (payload: ITicketArchiveDatePayload) => {
      return http.put('operator/ticket/auto-archive', payload)
    },

    onSuccess: () => {
      q.refetchQueries(['ticket-details', ticketId])
    }
  })
}
