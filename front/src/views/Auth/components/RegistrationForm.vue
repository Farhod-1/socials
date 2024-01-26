<script lang="ts" setup>
import IconLogo from '@/assets/icon/IconLogo.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { register } from '@/service/http/api/auth'
import type { RegisterForm } from '@/types/register-form'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import * as Yup from 'yup'

const toast = useToast()
const router = useRouter()

interface IModalProps {
  type: string
  email: string
}

const props = defineProps<IModalProps>()
const { t } = useI18n()

const schema = Yup.object().shape({
  name: Yup.string().required(t('required_field')),
  password: Yup.string().when([], {
    is: () => props.type === 'create',
    then: Yup.string()
      .min(4, t('validation.string_field_too_short', { min: 4 }))
      .required(t('required_field'))
  }),
  confirm_password: Yup.string().when([], {
    is: () => props.type === 'create',
    then: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.password_must_match'))
      .required(t('required_field'))
  }),
  organizationName: Yup.string().required(t('required_field')),
  username: Yup.string().required(t('required_field')),
  phone: Yup.string()
    .matches(/^\+?\d{12}$/, t('validation.phone_invalid'))
    .required(t('required_field'))
})

const { handleSubmit } = useForm<RegisterForm>({
  validationSchema: schema
})

const { isLoading, mutate: doRegister } = register()

const onSubmit = handleSubmit(async (values: RegisterForm) => {
  doRegister(
    {
      email: props.email,
      name: values.name,
      organizationName: values.organizationName,
      password: values.password,
      phone: values.phone,
      username: values.username
    },
    {
      onSuccess: () => {
        return router.push('/login')
      },
      onError: (err: any) => {
        if (typeof err.response.data.message === 'string') {
          toast?.open({
            type: ToastType.ERROR,
            timer: 3000,
            message: err.response.data.message
          })
        } else if (Array.isArray(err.response.data.message)) {
          const message = err.response.data.message.join(', ')

          toast?.open({
            type: ToastType.ERROR,
            timer: 3000,
            message: message
          })
        }
      }
    }
  )
})
</script>

<template>
  <div class="modal__body flex items-center justify-center dark:bg-dark-700">
    <form :validation-schema="schema" class="w-[500px] form_input" @submit="onSubmit">
      <div class="flex w-full items-center justify-center my-4">
        <IconLogo class="w-[198px] text-center text-black dark:text-dark-200" />
      </div>
      <div class="font-bold text-2xl pt-6 pb-2 px-6">
        {{ t('register') }}
      </div>

      <div class="px-6 py-3">
        <div class="grid grid-cols-2 gap-4">
          <VInput
            :placeholder="t('username')"
            class="register_input"
            label="Username"
            name="username"
            type="text"
          />
          <VInput
            :label="t('fio')"
            :placeholder="t('fio')"
            class="register_input"
            name="name"
            type="text"
          />
          <VInput
            :placeholder="t('password')"
            class="register_input"
            label="Password"
            name="password"
            type="password"
          />
          <VInput
            :label="t('confirm_password')"
            :placeholder="t('confirm_password')"
            class="register_input"
            name="confirm_password"
            type="password"
          />
          <VInput
            :placeholder="t('organization')"
            class="register_input"
            label="OrganizationName"
            name="organizationName"
            type="text"
          />
          <VInput
            :placeholder="t('phone_number')"
            class="register_input"
            label="Phone"
            name="phone"
            type="text"
          />
        </div>
      </div>

      <div class="border-t border-t-gray-200 flex justify-end p-3">
        <BaseButton :loading="isLoading" type="submit" variant="primary">
          {{ t('register') }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
<style scoped>
.register_input {
  margin-bottom: 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .register_input {
    width: 100%;
  }

  .form_input {
    width: 100%;
  }
}
</style>
