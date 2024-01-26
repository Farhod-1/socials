import http from '@/service/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export interface CreateSipSettingsData {
  enabled: boolean
  host: string
  server: string
  defaultProjectId: string
}

export interface CreateSipSettingsResponse {
  enabled: boolean
  host: string
  server: string
  defaultProjectId: string
}

export function createSipSettings() {
  return useMutation({
    mutationKey: ['sipSettings'],
    mutationFn: async (data: CreateSipSettingsData) => {
      return http.post<CreateSipSettingsResponse>('sip-settings', data).then((res) => res.data)
    }
  })
}

export interface OrganizationSipSettingsResponse {
  enabled: boolean
  host: string
  agentHost: string
  server: string
  defaultProjectId: string
}

export function getOrganizationSipSettings() {
  return useQuery({
    queryKey: ['sipSettings'],
    queryFn: async () => {
      return http.get<OrganizationSipSettingsResponse>('sip-settings').then((res) => res.data)
    }
  })
}

export interface SipUserDetails {
  username: string
  password: string
  enabled: boolean
  employee: string
}

export function getSipUsers() {
  return useQuery({
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    queryKey: ['sipUserList'],
    initialData: () => [],
    queryFn: async () => {
      return http.get<SipUserDetails[]>('/sip-users').then((res) => res.data)
    }
  })
}

export interface CreateSipUserResponse {
  username: string
  password: string
  enabled: boolean
  employee: string
}

export function createSipUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createSipUser'],
    mutationFn: async (payload: SipUserDetails) => {
      return http.post<CreateSipUserResponse>('/sip-users', payload).then((res) => res.data)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['sipUserList'])
    }
  })
}

export interface UpdateSipUserResponse {
  username: string
  password: string
  enabled: boolean
  employee: string
}

export function editSipUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateSipUser'],
    mutationFn: async (payload: SipUserDetails) => {
      return http.put<UpdateSipUserResponse>('/sip-users', payload).then((res) => res.data)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['sipUserList'])
    }
  })
}

export function deleteSipUser() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['deleteSipUser'],
    mutationFn: async (id: string) => {
      return http.delete<void>(`/sip-users/${id}`).then((res) => res.data)
    },

    onSuccess: () => {
      q.refetchQueries(['sipUserList'])
    }
  })
}
