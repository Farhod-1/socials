import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import http from '@/service/http'
import { type MaybeRef, toValue } from 'vue'

export enum CustomAttributeFormMode {
  CREATE = 'create',
  EDIT = 'edit'
}

export enum CustomAttributeType {
  Client = 'client',
  Ticket = 'ticket'
}

export const CustomAttributeTypes = [CustomAttributeType.Client, CustomAttributeType.Ticket]

export interface CustomAttribute {
  _id: string
  projectId: string
  name: string
  type: string
  key: string
}

export function getCustomAttribute(projectId: MaybeRef<string>, type: string) {
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['custom-attributes', projectId, type],
    queryFn: async (): Promise<CustomAttribute[]> => {
      return http
        .get<CustomAttribute[]>(`/custom-attribute`, {
          params: {
            projectId: toValue(projectId),
            type
          }
        })
        .then((res) => res.data)
    }
  })
}

export interface CreateCustomAttributeData {
  projectId: string
  name: string
  type: string
  key: string
}

export function createCustomAttribute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createCustomAttribute'],
    mutationFn: async (data: CreateCustomAttributeData) => {
      return (await http.post('/custom-attribute', data)).data
    },
    onSuccess: (response, options) => {
      queryClient.refetchQueries(['custom-attributes', options.projectId, options.type])
    }
  })
}

export interface UpdateCustomAttributeData {
  id: string
  projectId: string
  name: string
  type: string
  key: string
}

export function updateCustomAttribute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateCustomAttribute'],
    mutationFn: async (data: UpdateCustomAttributeData) => {
      return (await http.put('/custom-attribute', data)).data
    },
    onSuccess: (response, options) => {
      queryClient.refetchQueries(['custom-attributes', options.projectId, options.type])
    }
  })
}

export interface DeleteCustomAttributeData {
  id: string
  projectId: string
  type: string
}

export function deleteCustomAttribute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteCustomAttribute'],
    mutationFn: async (data: DeleteCustomAttributeData) => {
      return (await http.delete(`/custom-attribute`, { data })).data
    },
    onSuccess: (response, options) => {
      queryClient.refetchQueries(['custom-attributes', options.projectId, options.type])
    }
  })
}

export interface SetCustomAttributeData {
  id: string
  projectId: string
  customAttributeId: string
  customAttributeType: string
  value: string
}

export function setCustomAttribute() {
  return useMutation({
    mutationKey: ['setCustomAttribute'],
    mutationFn: async (data: SetCustomAttributeData) => {
      return (await http.patch('/operator/custom-attribute', data)).data
    }
  })
}
