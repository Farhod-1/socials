import type { ISmartOfficeDepartment, ITicketTask } from '@/views/Tickets/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import http from '@/service/http'
import type { MaybeRef } from 'vue'

export interface GetTicketTasksParams {
  projectId?: string
  ticketId?: string
  page: MaybeRef<number>
}

export interface GetTicketTasksResponse {
  meta: {
    currentPage: number
    pageLimit: number
    totalCount: number
  }
  ticketTasks: ITicketTask[]
}

export function getTicketTasks(data: GetTicketTasksParams) {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60,
    queryKey: [
      'ticketTasks',
      data.page,
      {
        ticketId: data.ticketId,
        projectId: data.projectId
      }
    ] as [string, number, { ticketId?: string; projectId?: string }],
    queryFn: async ({ queryKey }) => {
      const page = queryKey[1]
      const filters = data

      return http
        .get<GetTicketTasksResponse>(`/ticket-tasks`, {
          params: {
            page: page,
            projectId: filters.projectId,
            ticketId: filters.ticketId
          }
        })
        .then((res) => res.data)
    }
  })
}

export function createTicketTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createTicketTask'],
    mutationFn: async <T>(data: T) => {
      return http.post<ITicketTask>('/ticket-tasks', data)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['ticketTasks'])
    }
  })
}

export function updateTicketTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['updateTicketTask'],
    mutationFn: async <T>(data: T) => {
      return http.put<ITicketTask>('/ticket-tasks', data)
    },
    onSuccess: () => {
      queryClient.refetchQueries(['ticketTasks'])
      queryClient.refetchQueries(['projectTicketTasks'])
    }
  })
}

export function getSmartOfficeProjectDepartments(projectId: string) {
  return useQuery({
    queryKey: ['smartOfficeProjectDepartments', projectId],
    initialData: () => [],
    queryFn: async () => {
      return (
        await http.get<ISmartOfficeDepartment[]>(
          `smart-office-integration/departments/${projectId}`
        )
      ).data
    }
  })
}
