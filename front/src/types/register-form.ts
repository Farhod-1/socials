export interface RegisterForm {
  name: string
  phone: string
  username: string
  organizationName: string
  password: string
  email: string
}

export interface EmailForm {
  email: string
}

export interface ResetPasswordForm {
  login: string
}

export interface SetNewPasswordForm extends Record<string, unknown> {
  password: string
  email: string
  confirmationCode: number
}
