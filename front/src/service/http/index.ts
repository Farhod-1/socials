import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import auth from '@/modules/auth'

class httpService {
  service: AxiosInstance

  constructor() {
    const service = axios.create({
      baseURL: window.CALL24_CONFIG.API_URL
    })

    service.interceptors.request.use((config) => {
      const token = auth.getToken()

      if (token && config && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
      }

      return config
    })

    service.interceptors.response.use(this.handleSuccess, this.handleError)
    this.service = service
  }

  redirectTo = (document: Document, path: string) => {
    document.location = path
  }

  handleSuccess(response: AxiosResponse): AxiosResponse {
    return response
  }

  handleError = (error: AxiosError) => {
    // switch (error?.response?.status) {
    //   case 401:
    //     this.redirectTo(document, "/login");
    //     break;
    // }
    return Promise.reject(error)
  }
}

const http = new httpService().service

export default http
