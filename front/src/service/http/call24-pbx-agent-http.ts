import { useLocalStorage, watchImmediate } from '@vueuse/core'
import axios, { type AxiosInstance } from 'axios'

import { inject, provide } from 'vue'

const Call24HttpAgentSymbol = Symbol('Call24HttpAgent')

export function useCall24PBXAgentHttpHost() {
  return useLocalStorage<string>('call24-pbx-agent-url', '')
}

export function provideCall24PBXAgentHttp() {
  const http = axios.create({})

  const url = useCall24PBXAgentHttpHost()

  watchImmediate(url, (value) => {
    http.defaults.baseURL = value
  })

  return provide(Call24HttpAgentSymbol, http)
}

export function useCall24PBXAgentHttp() {
  return inject<AxiosInstance>(Call24HttpAgentSymbol) as AxiosInstance
}
