import Auth from '@/modules/auth'
import { getMe, type IGetMeResponse } from '@/service/http/api/user'
import { watchImmediate } from '@vueuse/core'
import { computed, type ComputedRef, inject, provide, ref, type Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const UserModuleSymbol = Symbol('userModule')

export enum UserRoles {
  ADMIN = 'admin',
  OPERATOR = 'operator'
}

export interface IUserModule {
  token: Ref<string | null>
  setToken: (token: string) => void
  isLoaded: Ref<boolean>
  user: Ref<IGetMeResponse>
  hasRole: (role: UserRoles) => ComputedRef<boolean>
  isLoggedUser: (id: string) => boolean
  isAdmin: ComputedRef<boolean>
  isOperator: ComputedRef<boolean>
  id: ComputedRef<string>
}

export function createUserModule() {
  const token = ref<string | null>(Auth.getToken())
  const isLoaded = ref(false)
  const user = ref<IGetMeResponse>({
    _id: '',
    photoPath: '',
    roles: [],
    projects: [],
    employees: [],
    organization: [],
    username: undefined,
    locale: 'uz'
  })

  function hasRole(role: UserRoles): ComputedRef<boolean> {
    return computed(() => {
      return user.value.roles.includes(role)
    })
  }

  function isLoggedUser(id: string): boolean {
    return user.value._id === id
  }

  function setToken(newToken: string) {
    token.value = newToken
    Auth.saveLogin(newToken)
  }

  const isAdmin = hasRole(UserRoles.ADMIN)
  const isOperator = hasRole(UserRoles.OPERATOR)
  const id = computed(() => user.value._id)

  const userModule: IUserModule = {
    token,
    setToken,
    isLoaded,
    user,
    hasRole,
    isLoggedUser,
    isAdmin,
    isOperator,
    id
  }

  const { data: userDetails, refetch: refetchUser } = getMe()

  watch(userDetails, (newUser) => {
    if (newUser) {
      user.value = newUser
      isLoaded.value = true
    }
  })

  watchImmediate(token, (token) => {
    if (token) refetchUser()
  })

  const i18n = useI18n()

  watchImmediate(
    () => user.value.locale,
    (locale) => {
      if (locale) i18n.locale.value = locale
    }
  )

  return userModule
}

export function provideUserModule() {
  const module = createUserModule()

  provide<IUserModule>(UserModuleSymbol, module)

  return module
}

export function useUser() {
  return inject(UserModuleSymbol) as IUserModule
}
