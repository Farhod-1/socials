<template>
  <div v-if="chat.finished && chat.status !== TicketStatus.Archived">
    <Button
      :loading="isArchiveLoading"
      class="w-full"
      variant="warning"
      @click="mutateArchive({ ticketId: chat._id })"
    >
      {{ t('archive_conversion') }}
    </Button>
  </div>

  <div v-else-if="!chat.finished" @click="mutateFinish({ ticketId: chat._id })">
    <SpinnerIcon v-if="isFinishLoading" class="w-6 h-6 my-1" />
    <IconDone2Ticks v-else class="w-6 h-6 my-1" />

    <div class="h-[36px]">{{ t('finish_conversion') }}</div>
  </div>
</template>

<script lang="ts" setup>
import IconDone2Ticks from '@/assets/icon/IconDone2Ticks.vue'
import SpinnerIcon from '@/assets/icon/SpinnerIcon.vue'
import Button from '@/components/Button/Button.vue'
import { archiveTicket, finishTicket } from '@/service/http/api/client'
import type { ITicketDetails } from '@/service/modules/chat/types'
import { TicketStatus } from '@/views/Tickets/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ chat: ITicketDetails }>()

const { mutate: mutateFinish, isLoading: isFinishLoading } = finishTicket()
const { mutate: mutateArchive, isLoading: isArchiveLoading } = archiveTicket()
</script>
