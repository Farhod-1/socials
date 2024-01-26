import type { ITreeNode } from '@/components/TreeList/types'
import http from '@/service/http'
import type { ITranslatableField } from '@/types'
import type { IProjectDetail, IProjectForm } from '@/views/Projects/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'

export interface IProjectResponse {
  _id: string
  name: string
}

export function createProject() {
  return useMutation({
    mutationKey: ['create-project'],
    mutationFn: async (data: IProjectForm) => {
      return http.post<IProjectResponse>(`/projects`, data).then((res) => res.data)
    }
  })
}

export function updateProject(id: string) {
  return useMutation({
    mutationKey: ['update-project', id],
    mutationFn: async (data: IProjectForm) => {
      return http.put<IProjectResponse>(`/projects/${id}`, data).then((res) => res.data)
    }
  })
}

export function getProjectById(id: string, isEnabled?: MaybeRef<boolean>) {
  return useQuery({
    queryKey: ['project', id],
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: isEnabled,
    queryFn: async () => {
      return http.get<IProjectDetail>(`/projects/${id}`)
    },
    select: (response) => response.data
  })
}

export function getProjectsList() {
  return useQuery({
    queryKey: ['projects'],
    retry: 0,
    refetchOnWindowFocus: false,
    cacheTime: 10000, // Cache for 10 seconds (adjust as needed)
    keepPreviousData: true,
    queryFn: async () => {
      return (await http.get<IProjectResponse[]>(`/projects`)).data
    }
  })
}

export function deleteProject() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projects'],
    mutationFn: async (id: string) => {
      return http.delete(`/projects/${id}`)
    },

    onSuccess: () => {
      q.refetchQueries(['projects'])
    }
  })
}

export function getProjectTopics(projectId: MaybeRef<string>) {
  return useQuery({
    queryKey: ['projectTopics', projectId],
    initialData: () => [],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return await http
        .get<ITreeNode[]>(`/projects/${toValue(projectId)}/topic`)
        .then((res) => res.data)
    }
  })
}

export interface IProjectTopicCreateForm {
  projectId: string
  topics: { parent?: string; name: ITranslatableField; sortOrder?: number; faqIds?: string[] }[]
}

export function createProjectTopic() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectTopics'],
    mutationFn: async (payload: IProjectTopicCreateForm) => {
      return http.post(`/projects/${payload.projectId}/topic`, { topics: payload.topics })
    },

    onSuccess: () => {
      q.refetchQueries(['projectTopics'])
    }
  })
}

export interface IProjectTopicUpdateItem {
  id: string
  parent?: string
  sortOrder?: number
  name: ITranslatableField
  faqIds?: string[]
}

export interface IProjectTopicUpdateForm {
  projectId: string
  topics: IProjectTopicUpdateItem[]
}

export function editProjectTopic() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectTopics'],
    mutationFn: async (payload: IProjectTopicUpdateForm) => {
      return http.put(`/projects/${payload.projectId}/topic`, { topics: payload.topics })
    },

    onSuccess: () => {
      q.refetchQueries(['projectTopics'])
    }
  })
}

export function deleteProjectTopic() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['employees'],
    mutationFn: async (payload: { projectId: string; topicId: string }) => {
      return http.delete(`/projects/${payload.projectId}/topic/${payload.topicId}`)
    },

    onSuccess: () => {
      q.refetchQueries(['projectTopics'])
    }
  })
}

export function getLanguages() {
  return useQuery({
    queryKey: ['appLanguages'],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await http.get<string[]>(`localization/languages`)).data
    },
    initialData: () => []
  })
}

export function getProjectLanguages(projectId: string) {
  return useQuery({
    queryKey: ['projectLanguages', projectId],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await http.get<string[]>(`/projects/languages/${projectId}`)).data
    }
  })
}
