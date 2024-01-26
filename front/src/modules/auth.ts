import type { User } from '@/types'

const AuthToken = 'call24_auth_token'
const AuthUser = 'call24_auth_user'

class Auth {
  saveLogin(token: string) {
    localStorage.setItem(AuthToken, token)
  }

  isLoggedIn() {
    const token = localStorage.getItem(AuthToken) || ''

    return token.length > 0
  }

  saveUser(user: User) {
    localStorage.setItem(AuthUser, JSON.stringify(user))
  }

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(AuthUser) || 'null')
    } catch {
      return null
    }
  }

  getToken() {
    return localStorage.getItem(AuthToken)
  }
}

export default new Auth()
