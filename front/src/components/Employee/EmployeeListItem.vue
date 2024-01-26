<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import EmployeeStatusText from '@/components/Employee/EmployeeStatusText.vue'

const { t } = useI18n()

defineProps<{
  name?: string
  position?: string
  img?: string
  status?: number
  isOnline: boolean
}>()
</script>

<template>
  <div class="flex py-2 px-3 gap-3 items-center">
    <div
      class="relative border-2 rounded-full dark:border-dark-500"
      :class="{ 'border-green-600': isOnline }"
    >
      <div
        class="w-10 h-10 rounded-full shrink-0 bg-contain"
        :style="{ backgroundImage: `url(${img})` }"
      />

      <div
        v-if="isOnline"
        class="absolute w-2.5 h-2.5 bg-green-600 border border-green-700 rounded-full right-1 bottom-0"
      ></div>
    </div>

    <div>
      <div class="line-clamp-1 break-all">
        {{ name }}
      </div>
      <div class="text-xs line-clamp-1 break-all">{{ position }}</div>

      <EmployeeStatusText :status="status" />
    </div>
  </div>
</template>
