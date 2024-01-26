import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import http from '@/service/http'
import type {
  IChatBotDiagramResponse,
  IDiagramBot,
  NodeFormDataValues
} from '@/views/ChatBot/types'

export function getProjectChatBotDiagrams(projectId: string) {
  return useQuery({
    queryKey: ['projectChatBotDiagrams'],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return http.get<IChatBotDiagramResponse>(`/chatbot/diagrams/${projectId}`)
    },
    select: (response) => response.data
  })
}

export function createProjectChatBotDiagram() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (payload: IDiagramBot) => {
      return http.post(`/chatbot/diagrams`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}

export function publishProjectChatBotDiagram() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (diagramId: string) => {
      return http.put(`/chatbot/diagrams/publish/${diagramId}`)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}

export function editProjectChatBotDiagram(diagramId: string) {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (payload: any) => {
      return http.put(`/chatbot/diagrams/${diagramId}`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}

export function restoreProjectChatBotDiagram() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (diagramId: string) => {
      return http.put(`/chatbot/diagrams/restore/${diagramId}`)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}

export function createDiagramNode() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (payload: NodeFormDataValues) => {
      return http.post(`/chatbot/nodes`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}

export function editDiagramNode(nodeId: string) {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (payload: NodeFormDataValues) => {
      return http.put(`/chatbot/nodes/${nodeId}`, payload)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}

export function deleteDiagramNode() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['projectChatBotDiagrams'],
    mutationFn: async (id: string) => {
      return http.delete(`/chatbot/nodes/${id}`)
    },

    onSuccess: () => {
      q.refetchQueries(['projectChatBotDiagrams'])
    }
  })
}
