<script lang="ts" setup>
import { EmployeeStatus } from '@/service/http/api/employees'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  status?: number
}>()

const statusName = (status: number) => {
  switch (status) {
    case EmployeeStatus.OnSite:
      return t('employee-status.on_site')
    case EmployeeStatus.Vacation:
      return t('employee-status.on_vacation')
    case EmployeeStatus.SickLeave:
      return t('employee-status.on_sick_leave')
    case EmployeeStatus.LunchBreak:
      return t('employee-status.lunch_break')
    default:
      return t('employee-status.on_site')
  }
}

const statusColor = (status: number) => {
  switch (status) {
    case EmployeeStatus.OnSite:
      return 'text-emerald-500'
    case EmployeeStatus.Vacation:
      return 'text-yellow-500'
    case EmployeeStatus.SickLeave:
      return 'text-red-500'
    case EmployeeStatus.LunchBreak:
      return 'text-blue-500'
    default:
      return 'text-emerald-500'
  }
}
</script>

<template>
  <div v-if="status && status >= 0" :class="statusColor(status)" class="text-xs">
    {{ statusName(status) }}
  </div>
</template>
