import http from '@/service/http'
import { useMutation } from '@tanstack/vue-query'

export interface IIntegratePlaton {
  projectId: string
  enabled: boolean
}

export interface IIntegratePlatonResponse {
  success: boolean
}

export function integratePlaton() {
  return useMutation({
    mutationKey: ['integrate-platon'],
    mutationFn: async (data: IIntegratePlaton) => {
      return http
        .put<IIntegratePlatonResponse>(`/projects/integration/platon`, data)
        .then((res) => res.data)
    }
  })
}

export interface IIntegrateTelegram {
  projectId: string
  enabled: boolean
  botToken: string
  botUsername: string
}

export interface IIntegrateTelegramResponse {
  success: boolean
}

export function integrateTelegram() {
  return useMutation({
    mutationKey: ['integrate-telegram'],
    mutationFn: async (data: IIntegrateTelegram) => {
      return http
        .put<IIntegrateTelegramResponse>(`/projects/integration/telegram`, data)
        .then((res) => res.data)
    }
  })
}

export interface IIntegrateSmartOffice {
  enabled: boolean
  username: string
  password: string
  baseUrl: string
  orgId: number
  fileFormElementId: number
  photoFormElementId: number
}

export interface IIntegrateSmartOfficeResponse {
  success: boolean
}

export function integrateSmartOffice() {
  return useMutation({
    mutationKey: ['integrate-smart-office'],
    mutationFn: async (data: IIntegrateSmartOffice) => {
      return http
        .put<IIntegrateSmartOfficeResponse>(`/projects/integration/smart-office`, data)
        .then((res) => res.data)
    }
  })
}
