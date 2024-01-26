import { computed } from 'vue'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useAxiosErrorMessage(error: Ref<unknown>) {
  const { t } = useI18n()

  return computed<string>(() => {
    if (!error.value) {
      return undefined
    }

    if (axios.isAxiosError(error) && error.response) {
      const response = error.response as AxiosResponse

      return response.data?.message?.toString()
    }

    return t('validation.field_invalid')
  })
}
