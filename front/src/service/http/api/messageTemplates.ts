import type { MessageTemplate, MessageTemplateForm } from '@/types/message-templates'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import http from '@/service/http'

export function getMessageTemplates() {
  return useQuery({
    queryKey: ['messageTemplates'],
    retry: 0,
    refetchOnWindowFocus: false,
    placeholderData: () => [],
    initialData: () => [],
    queryFn: async (): Promise<MessageTemplate[]> => {
      return (await http.get<MessageTemplate[]>(`/message-template`)).data
    }
  })
}

export function createMessageTemplate() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['messageTemplates'],
    mutationFn: async (payload: MessageTemplateForm) => {
      return http.post(`message-template`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['messageTemplates'])
    }
  })
}

export function editMessageTemplate() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['messageTemplates'],
    mutationFn: async (payload: MessageTemplateForm) => {
      return http.patch(`/message-template/${payload._id}`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['messageTemplates'])
    }
  })
}

export function deleteMessageTemplate() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['messageTemplates'],
    mutationFn: async (id: string) => {
      return http.delete(`/message-template/${id}`)
    },

    onSuccess: () => {
      q.refetchQueries(['messageTemplates'])
    }
  })
}
