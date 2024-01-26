import http from '@/service/http'
import type { CreateOperatorFAQData, OperatorFaq, OperatorFaqList } from '@/types/operator-faq'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { computed } from 'vue'

export interface PaginationParams {
  page: number
  limit: number
}

export enum OperatorFAQFormMode {
  CREATE = 'create',
  EDIT = 'edit'
}

export function getProjectOperatorFaqList(page: Ref<number>, limit: Ref<number>) {
  return useQuery({
    queryKey: ['projectOperatorFaqList', page, limit],
    queryFn: async () => {
      return (
        await http.get<OperatorFaqList>(`/faq`, {
          params: {
            page: page.value,
            limit: limit.value
          }
        })
      ).data
    }
  })
}

export interface SearchQueryParam {
  searchKeyword: Ref<string>
}

export function searchProjectOperatorFaqItems(searchKeyword: Ref<string>) {
  const isQueryEnabled = computed(() => {
    return searchKeyword.value.length >= 5
  })

  return useQuery({
    enabled: isQueryEnabled,
    queryKey: ['searchProjectOperatorFaqItems', searchKeyword],
    queryFn: async () => {
      return (
        await http.get<OperatorFaq[]>(`/operator-faq`, {
          params: {
            text: searchKeyword.value
          }
        })
      ).data
    }
  })
}

export function searchProjectOperatorFaqItemsByTopic(
  searchKeyword: Ref<string>,
  projectId: string
) {
  const isQueryEnabled = computed(() => {
    return searchKeyword.value.length >= 2
  })

  return useQuery({
    enabled: isQueryEnabled,
    queryKey: ['searchProjectOperatorFaqItemsByTopic', searchKeyword],
    queryFn: async () => {
      return (
        await http.get<OperatorFaq[]>(`/projects/topics/faqs/${projectId}`, {
          params: {
            text: searchKeyword.value
          }
        })
      ).data
    }
  })
}

export function createOperatorFaq(projectId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createOperatorFaq'],
    mutationFn: async (data: CreateOperatorFAQData) => {
      return http.post('/faq', data)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['projectOperatorFaqList'])

      if (projectId) {
        queryClient.refetchQueries(['projectTopics', projectId])
      }
    }
  })
}

export function updateOperatorFaq(projectId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateOperatorFaq'],
    mutationFn: async (data: CreateOperatorFAQData) => {
      return http.put(`/faq/${data._id}`, data)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['projectOperatorFaqList'])

      if (projectId) {
        queryClient.refetchQueries(['projectTopics', projectId])
      }
    }
  })
}

export interface DeleteOperatorFaqData {
  _id: string
}

export function deleteOperatorFaq(projectId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteOperatorFaq'],
    mutationFn: async (data: DeleteOperatorFaqData) => {
      return http.delete(`faq/${data._id}`)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['projectOperatorFaqList'])

      if (projectId) queryClient.refetchQueries(['projectTopics', projectId])
    }
  })
}
