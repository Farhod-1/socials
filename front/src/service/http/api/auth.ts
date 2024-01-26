import { useMutation } from '@tanstack/vue-query'
import http from '@/service/http'

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export function login() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginData) => {
      return http.post<LoginResponse>('/employees/login', data)
    }
  })
}

export interface RegisterData {
  name: string
  phone: string
  username: string
  organizationName: string
  password: string
  email: string
}

export function register() {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: (data: RegisterData) => {
      return http.post('/organization/register', data)
    }
  })
}

export interface EmailData {
  email: string
}

export function sendEmailOtp() {
  return useMutation({
    mutationKey: ['email'],
    mutationFn: async (data: EmailData) => {
      return (await http.post<{ expiresIn: number }>('/organization/register/otp', data)).data
    }
  })
}

export interface ResetPasswordData {
  login: string
}

export function sendEmailOtpForgotPassword() {
  return useMutation({
    mutationKey: ['email'],
    mutationFn: async (data: ResetPasswordData) => {
      return (await http.post<{ expiresIn: number }>('/employees/reset-password/otp', data)).data
    }
  })
}

export interface VerifyEmailData {
  verificationCode: number
  email: string
}

export function verifyEmailOtp() {
  return useMutation({
    mutationKey: ['verifyEmail'],
    mutationFn: (data: VerifyEmailData) => {
      return http.post('organization/register/confirm-otp', data)
    }
  })
}

export interface SetNewPasswordData {
  password: string
  email: string
  confirmationCode: number
}

export function setNewPassword() {
  return useMutation({
    mutationKey: ['setNewPassword'],
    mutationFn: (data: SetNewPasswordData) => {
      return http.post('employees/reset-password', data)
    }
  })
}

export function refreshToken() {
  return useMutation({
    mutationKey: ['refreshToken'],
    mutationFn: (token: string) => {
      return http.put('auth/refresh-token', { token: token })
    }
  })
}
