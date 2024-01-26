import http from '@/service/http'
import type { PaginationResponse } from '@/service/http/api/types'
import { updateProjectOfChatItem } from '@/service/modules/chat/chat-item-details'
import type { IClient } from '@/views/Clients/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'

export interface UpdateTicketDetailsResponse {
  success: boolean
  data: UpdateTicketDetailsData
}

export interface UpdateTicketDetailsData {
  topicId?: string
  status?: number
  deadline?: string
}

export interface UpdateTicketDetailsDataExtended {
  topicIds?: string[]
  status?: number
  deadline?: string
}

export function updateTicketDetailsRequest(ticketId: string) {
  return useMutation({
    mutationKey: ['ticket-update-details', ticketId],
    mutationFn: async (data: UpdateTicketDetailsData) => {
      return http
        .put<UpdateTicketDetailsResponse>(`operator/tickets/${ticketId}`, data)
        .then((res) => res.data)
    }
  })
}

export interface UpdateDetailsResponse {
  updated: boolean
  data: {
    clientId: string
    name?: string
    email?: string
    phone?: string
    comment?: string
  }
}

export interface UpdateDetailsData {
  clientId: string
  name?: string
  email?: string
  phone?: string
  comment?: string
}

interface UpdateClientDetailsResponse {
  updated: boolean
  details: UpdateDetailsData
}

export function updateDetailsRequest() {
  return useMutation({
    mutationKey: ['updateDetails'],
    mutationFn: async (data: UpdateDetailsData) => {
      return (await http.put<UpdateClientDetailsResponse>('operator/clients/details', data)).data
    }
  })
}

interface ChangeProjectData {
  ticketId: string
  newProject: {
    id: string
    name: string
  }
}

export function changeProjectRequest() {
  const q = useQueryClient()
  return useMutation({
    mutationKey: ['changeProject'],
    mutationFn: async (data: ChangeProjectData) => {
      return (
        await http.put<UpdateClientDetailsResponse>(
          `operator/ticket/${data.ticketId}/switch-project`,
          {
            projectId: data.newProject.id
          }
        )
      ).data
    },
    onSuccess: (context, options) => {
      q.refetchQueries(['ticket-details', options.ticketId])

      updateProjectOfChatItem(q, options.ticketId, options.newProject)
    }
  })
}

export interface FinishTicketData {
  ticketId: string
}

export interface FinishTicketResponse {
  finished: boolean
}

export function finishTicket() {
  return useMutation({
    mutationFn: async (data: FinishTicketData) => {
      return http.put<FinishTicketResponse>(`operator/ticket/finish`, data).then((res) => res.data)
    },
    mutationKey: ['ticket-finish']
  })
}

export function getProjectClients(projectId: string, page: Ref<number>) {
  return useQuery({
    queryKey: ['project-clients', projectId, page],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return http
        .get<PaginationResponse<IClient>>(`clients/${projectId}`, {
          params: { page: page.value, limit: 20 }
        })
        .then((res) => res.data)
    }
  })
}

export interface ArchiveTicketData {
  ticketId: string
}

export interface ArchiveTicketResponse {
  archived: boolean
}

export function archiveTicket() {
  return useMutation({
    mutationFn: async (data: ArchiveTicketData) => {
      return http
        .put<ArchiveTicketResponse>(`operator/ticket/archive`, data)
        .then((res) => res.data)
    },
    mutationKey: ['ticket-archive']
  })
}

export interface IOnlineOperatorResponse {
  _id: string
  name: string
  phone: string
  position: string
  connectedAt: string
  email: string
  isOnline: boolean
  lastOnline: number
  projects: string[]
  ticketId: string
}

export function getConnectedOperators(ticketId: string) {
  return useQuery({
    queryKey: ['connectedOperators', ticketId],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (
        await http.get<IOnlineOperatorResponse[]>(
          `/operator/ticket/${ticketId}/connected-operators`
        )
      ).data
    }
  })
}

export function connectOperator() {
  return useMutation({
    mutationFn: async (ticketId: string) => {
      return http.post(`/operator/ticket/${ticketId}/connect`)
    }
  })
}

export function disconnectOperator() {
  return useMutation({
    mutationFn: async (ticketId: string) => {
      return http.delete(`/operator/ticket/${ticketId}/disconnect`)
    }
  })
}
