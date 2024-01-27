import http from '@/service/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export interface IGetMeResponse {
  _id: string
  photoPath: string
  roles: TRoles
  username?: string
  name?: string
  position?: string
  status?: number
  email?: string
  phone?: string
  projects: IProjects[]
  employees: IEmployees[]
  organization: IOrganization[]
  locale: string
}

export interface IOrganization {
  _id: string
  name: string
}

export interface IProjects {
  _id: string
  name: string
  topics: ITopic[]
}

export interface ITopic {
  _id: string
  name: {
    uz: string
    default: string
  }
}

export interface IEmployees {
  _id: string
  name: string
}

export type TRoles = string[]

export function getMe() {
  return useQuery({
    queryKey: ['me'],
    retry: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return http.get<IGetMeResponse>('employees/me').then((res) => res.data)
    }
  })
}

export interface IUpdatePersonalSettings {
  name?: string
  username?: string
  position?: string
  email?: string
  phone?: string
  locale?: string
  newPassword?: string
  oldPassword?: string
}

export interface IUpdatePersonalSettingsResponse {
  updated: boolean
}

export function updatePersonalSettingsRequest() {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ['update-personal-settings'],
    mutationFn: async (payload: IUpdatePersonalSettings) => {
      return http
        .put<IUpdatePersonalSettingsResponse>('employees/me', payload)
        .then((res) => res.data)
    },

    onSuccess: () => {
      qc.refetchQueries(['me'])
    }
  })
}

interface IUserStatusUpdateParams {
  userId: string
  status: number
}

export function updateUserStatusQuery() {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ['userStatus'],
    mutationFn: async (payload: IUserStatusUpdateParams) => {
      return http.put(`/operator/status/${payload.userId}`, { status: payload.status })
    },

    onSuccess() {
      qc.refetchQueries(['me'])
    }
  })
}



export function createCallTicketQuery() {
  const q = useQueryClient()
  return useMutation({
    mutationKey: ['createCallTicket'],
    mutationFn: async (phone: string) => {
      return (await http.post(`operator/call/ticket`, { phone: phone })).data
    },
    onSuccess: () => {
      q.refetchQueries(['client-chats-pagination'])
    }
  })
}
