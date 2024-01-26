<template>
  <div class="absolute top-4 right-4">
    <button @click="toggleDark()">
      <IconDark v-if="isDark" class="w-8 h-8" />
      <IconLight v-else class="w-8 h-8" />
    </button>
  </div>
  <IconBack
    v-if="!emailNotSent"
    class="w-8 m-4 absolute hover:bg-gray-100 rounded-full hover:cursor-pointer dark:hover:bg-dark-700"
    @click.prevent="backToEmail"
  />
  <div class="register flex flex-col justify-center items-center h-screen">
    <RegistrationForm v-if="emailConfirmed && !emailNotSent" :email="form.email" type="create" />
    <div v-if="emailNotSent" class="w-[300px]">
      <div class="flex w-full items-center justify-center">
        <IconLogo class="w-[198px] text-center text-black my-3 dark:text-dark-200" />
      </div>
      <div>
        <div class="mb-3 text-lg">
          {{ t('register') }}
        </div>
        <form :validation-schema="schema" class="p-0" @submit="submit">
          <VInput
            v-model="form.email"
            :placeholder="t('enter_email_to_confirm')"
            class="mb-6 mt-2"
            label="Email"
            name="email"
            type="text"
          />
          <BaseButton :loading="isLoading" class="w-full" type="submit" variant="primary">
            {{ t('send_code') }}
          </BaseButton>
        </form>
        <h2 class="text-center mt-3">
          {{ t('have_account') }}
          <router-link class="text-blue-600" to="/login">
            {{ t('login') }}
          </router-link>
        </h2>
      </div>
    </div>

    <div v-if="!emailConfirmed" class="w-[300px]">
      <div class="flex w-full items-center justify-center">
        <IconLogo class="w-[198px] text-center text-black dark:text-dark-200" />
      </div>
      <div class="text-[11px] mt-8 mb-4">⚠️{{ t('confirmation_code_may_be_in_spam') }}</div>
      <form :validation-schema="codeSchema" class="form flex flex-col" @submit.prevent="checkOTP">
        <OTPInput v-model="password.code" :length="6" class="mb-6 w-[300px]" />
        <div v-if="error" class="text-red-600 mb-4">
          {{ error }}
        </div>
        <BaseButton type="submit" variant="primary">
          {{ t('submit') }}
        </BaseButton>
      </form>
      <div class="mt-4 text-center">
        <div class="text-center my-2 mr-2 inline">
          {{ t('did_not_get_code') }}
        </div>

        <BaseButton
          :disabled="state.expiringTime !== 0"
          size="sm"
          variant="success"
          @click="resend"
        >
          {{ t('resend') }}
        </BaseButton>
        <br />
        <span v-show="state.expiringTime !== 0" class="my-2"
          >{{ t('time_of_sending_new_code') }} : {{ state.expiringTime }}{{ t('seconds') }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconBack from '@/assets/icon/IconBack.vue'
import IconDark from '@/assets/icon/IconDark.vue'
import IconLight from '@/assets/icon/IconLight.vue'
import IconLogo from '@/assets/icon/IconLogo.vue'
import BaseButton from '@/components/Button/Button.vue'
import VInput from '@/components/Input/VInput.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { sendEmailOtp, verifyEmailOtp } from '@/service/http/api/auth'
import type { EmailForm } from '@/types/register-form'
import OTPInput from '@/views/Auth/components/OTPInput.vue'
import RegistrationForm from '@/views/Auth/components/RegistrationForm.vue'
import { useDark, useToggle } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Yup from 'yup'

const toast = useToast()
const { t } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const emailConfirmed = ref(true)
const emailNotSent = ref(true)

const state = reactive({
  expiringTime: 0
})

const form = reactive({
  email: ''
})

const password = reactive({
  code: ''
})

const error = ref('')

const backToEmail = () => {
  emailConfirmed.value = true
  emailNotSent.value = true
}
const codeSchema = Yup.object({
  code: Yup.number().max(999999).min(100000).required('Code is required')
})
const schema = Yup.object({
  email: Yup.string().email().required('Email is required')
})

const { handleSubmit } = useForm<EmailForm>({
  validationSchema: schema
})

const { isLoading, mutate: doSendEmail } = sendEmailOtp()

const submit = handleSubmit(async (values: EmailForm) => {
  doSendEmail(values, {
    onSuccess: ({ expiresIn }) => {
      emailConfirmed.value = false
      emailNotSent.value = false
      state.expiringTime = expiresIn
    },
    onError: (error: any) => {
      toast?.open({
        type: ToastType.ERROR,
        timer: 3000,
        message: error.response.data.message
      })
    }
  })
})

const resend = () => {
  doSendEmail(form, {
    onSuccess: ({ expiresIn }) => {
      state.expiringTime = expiresIn
    },
    onError: (error: any) => {
      toast?.open({
        type: ToastType.ERROR,
        timer: 3000,
        message: error.response.data.message
      })
    }
  })
}

const { mutate: doCheckOTP } = verifyEmailOtp()

const checkOTP = () => {
  const OTP = {
    email: form.email,
    verificationCode: Number(password.code)
  }
  doCheckOTP(OTP, {
    onSuccess: (response) => {
      if (response) {
        emailConfirmed.value = true
        emailNotSent.value = false
      }
    },
    onError: (error: any) => {
      toast?.open({
        type: ToastType.ERROR,
        timer: 3000,
        message: error.response.data.message
      })
    }
  })
}

setInterval(() => {
  if (state.expiringTime > 0) {
    state.expiringTime = state.expiringTime - 1
  }
}, 1000)
</script>
