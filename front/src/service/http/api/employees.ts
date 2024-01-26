import http from '@/service/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'

export interface IGetEmployeesResponse {
  _id: string
  name: string
  position: string
  photoPath?: string
  status?: EmployeeStatus
}

export interface ICreateEmployee {
  name: string
  username: string
  password: string
  position: string
  phone: string
  email: string
  role: string | undefined
  projects: string[]
}

export interface IEditEmployee {
  id: string
  name: string
  username: string
  password: string
  position: string
  phone: string
  email: string
  role: string | undefined
  projects: string[]
  organization: string
}

export interface ICreateEmployeeResponse {
  id: string
  username: string
}

export interface IEmployee {
  _id: string
  name: string
  email: string
  phone: string
  username: string
  position: string
  photoPath?: string
  roles: string[]
  projects: IProjects[]
  organization: IOrganization
}

interface IProjects {
  _id: string
  name: string
  employees: IEmployee[]
}

interface IOrganization {
  _id: string
  name: string
  owner: IOwner
}

interface IOwner {
  _id: string
  username: string
}

export enum EmployeeStatus {
  OnSite = 0,
  SickLeave = 1,
  Vacation = 2,
  LunchBreak = 3
}

export function getEmployees() {
  return useQuery({
    initialData: () => [],
    queryKey: ['employees'],
    cacheTime: 10000, // Cache for 10 seconds (adjust as needed)
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return (await http.get<IGetEmployeesResponse[]>(`/employees`)).data
    }
  })
}

export function getEmployeeById(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      return http.get<IEmployee>(`/employees/${id}`)
    },
    select: (response) => response.data
  })
}

export function createEmployee() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['employee-create'],
    mutationFn: async (payload: ICreateEmployee) => {
      return (await http.post<ICreateEmployeeResponse>(`/employees/register`, payload)).data
    },

    onSuccess: () => {
      q.refetchQueries(['employees'])
    }
  })
}

export function editEmployee() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['employee-edit'],
    mutationFn: async (payload: IEditEmployee) => {
      return http.put(`/employees`, payload)
    },

    onSuccess: (context, options) => {
      q.refetchQueries(['employees'])
      q.refetchQueries(['employee', options?.id])
    }
  })
}

export function deleteEmployee() {
  const q = useQueryClient()

  return useMutation({
    mutationKey: ['employee-delete'],
    mutationFn: async (id: string) => {
      return http.delete(`/employees/${id}`)
    },

    onSuccess: () => {
      q.refetchQueries(['employees'])
    }
  })
}

export function uploadPhoto(id: MaybeRef<string>) {
  const q = useQueryClient()
  return useMutation({
    mutationKey: ['employee-update-photo'],
    mutationFn: async (data: FormData) => {
      return http.post(`/employees/photo/${toValue(id)}`, data).then((res) => res.data)
    },
    onSuccess: () => {
      q.refetchQueries(['employees'])
    }
  })
}

export function deletePhoto(id: MaybeRef<string>) {
  const q = useQueryClient()
  return useMutation({
    mutationKey: ['employee-delete-photo'],
    mutationFn: async () => {
      return http.delete(`/employees/photo/${toValue(id)}`)
    },

    onSuccess: () => {
      q.refetchQueries(['employees'])
    }
  })
}
