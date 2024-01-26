<template>
  <ChatDetailField
    v-if="ticketDetails.scheduledTimeToBeArchived"
    :label="t('chat_details.auto_close_at')"
    class="mb-2"
  >
    <DateRange :model-value="autoCloseAtDate" @update:model-value="updateAutoCloseDate">
      <template #trigger>
        <span>{{ autoCloseAtDateFormat }}</span>
      </template>
    </DateRange>
  </ChatDetailField>
</template>

<script lang="ts" setup>
import ChatDetailField from '@/components/ChatSettings/ChatUpdatableField/ChatDetailField.vue'
import DateRange from '@/components/Date/DateRange.vue'
import type { ITicketDetails } from '@/service/modules/chat/types'
import { computed } from 'vue'
import { ToLongMonthNameDateTime } from '@/modules/helpers/date'
import { updateTicketArchiveDate } from '@/service/http/api/chat'
import type { AxiosError } from 'axios'
import { useChatDetails } from '@/components/Chatting/helpers'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import { useI18n } from 'vue-i18n'
import { useOnEvent } from '@/modules/socket'
import { useQueryClient } from '@tanstack/vue-query'

const toast = useToast()
const { t } = useI18n()
const ticketDetails = useChatDetails()

const autoCloseAtDateFormat = computed(() => {
  return ticketDetails.value?.scheduledTimeToBeArchived
    ? ToLongMonthNameDateTime(ticketDetails.value?.scheduledTimeToBeArchived)
    : '-'
})

const autoCloseAtDate = computed(() => {
  return ticketDetails.value?.scheduledTimeToBeArchived
    ? new Date(ticketDetails.value?.scheduledTimeToBeArchived)
    : undefined
})

const { mutate: updateTicketArchiveMutation } = updateTicketArchiveDate(ticketDetails.value._id)

function updateAutoCloseDate(value: Date) {
  updateTicketArchiveMutation(
    {
      ticketId: ticketDetails.value._id,
      timeToSchedule: value
    },
    {
      onSuccess: () => {
        toast.open({
          type: ToastType.SUCCESS,
          message: t('toast.created.success'),
          timer: 1000
        })
      },
      onError: (error) => {
        const message =
          (
            error as AxiosError<{
              message: string
            }>
          )?.response?.data?.message || error

        toast.open({
          type: ToastType.ERROR,
          message: `${t('error')}: ${message}`,
          timer: 1000
        })
      }
    }
  )
}

const queryClient = useQueryClient()

interface ITicketArchiveScheduledEventData {
  scheduledTime: string
  ticketId: string
}

useOnEvent('ticket.auto-archive.rescheduled', (data: ITicketArchiveScheduledEventData) => {
  queryClient.setQueryData<ITicketDetails>(['ticket-details', data.ticketId], (oldData) => {
    if (!oldData) return oldData

    return {
      ...oldData,
      scheduledTimeToBeArchived: data.scheduledTime
    }
  })
})

useOnEvent('ticket.auto-archive.scheduled', (data: ITicketArchiveScheduledEventData) => {
  queryClient.setQueryData<ITicketDetails>(['ticket-details', data.ticketId], (oldData) => {
    if (!oldData) return oldData

    return {
      ...oldData,
      scheduledTimeToBeArchived: data.scheduledTime
    }
  })
})
</script>