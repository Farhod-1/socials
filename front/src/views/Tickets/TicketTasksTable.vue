<template>
  <div class="custom-table">
    <Loader v-if="isLoading" class="my-10" />

    <div v-else-if="data">
      <BaseTable :headers="tableHeaders">
        <template v-if="data.ticketTasks.length === 0">
          <tr>
            <td :colspan="tableHeaders.length" class="p-4 text-center font-medium">
              {{ t('ticket.no_tasks') }}
            </td>
          </tr>
        </template>

        <template v-else>
          <template v-for="(item, index) in data.ticketTasks" :key="index">
            <tr>
              <td class="p-4 text-center font-medium">{{ index + 1 }}</td>
              <td v-if="hasTicket" class="p-4 text-center">
                <div class="client-col flex gap-4 justify-center">
                  <span>
                    {{ item.ticket?.client.name }}
                  </span>
                  <span class="client-phone">
                    {{ item.ticket?.client.phone }}
                  </span>
                </div>
              </td>
              <td class="p-4 text-center">
                <div v-html="truncatedDescription(item.description)"></div>
              </td>
              <td class="p-4 text-center">{{ item.author?.name }}</td>
              <td class="p-4 text-center">
                {{ extractExecutors(item.executors) || '-' }}
              </td>
              <td class="p-4 text-center whitespace-nowrap">
                {{ ToDateFormat(item.createdAt, DateFormats.FullDate) || '-' }}
              </td>
              <td class="p-4 text-center whitespace-nowrap">
                {{ ToDateFormat(item.deadline, DateFormats.FullDate) || '-' }}
              </td>
              <td class="p-4 text-center">
                {{ extractTags(item.tags || []) }}
              </td>
              <td :class="[priorityClass(item.priority), 'font-bold']" class="p-4 text-center">
                <span>{{ priorityName(item.priority) }}</span>
              </td>
              <td :class="[statusClass(item.status), 'font-bold']" class="p-4 text-center">
                <span>{{ statusName(item.status) }}</span>
              </td>
              <td class="p-4 text-center flex items-center">
                <!-- Edit button for each row -->
                <IconEye class="cursor-pointer mx-auto w-4 h-4" @click="showSingleTicket(item)" />
                <IconEditLight class="cursor-pointer mx-auto" @click="showEditTicketForm(item)" />
              </td>
            </tr>
          </template>
        </template>
      </BaseTable>

      <div class="text-center">
        <Pagination
          v-model="currentPage"
          :each-side="4"
          :last-page="Math.ceil(data.meta.totalCount / data.meta.pageLimit)"
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconEditLight from '@/assets/icon/IconEditLight.vue'
import IconEye from '@/assets/icon/IconEye.vue'
import Loader from '@/components/Loader/Loader.vue'
import BaseTable from '@/components/Table/BaseTable.vue'
import Pagination from '@/components/Table/Pagination.vue'
import type { TableHeader } from '@/components/Table/types'
import { DateFormats, ToDateFormat } from '@/modules/helpers/date'
import { getTicketTasks, type GetTicketTasksResponse } from '@/service/http/api/ticketTasks'
import useTicketTasksFormModal from '@/views/Tickets/Modal/useTicketTasksFormModal'
import useTicketTaskShowModal from '@/views/Tickets/Modal/useTicketTaskShowModal'
import { computed, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IExecutor, ITicketTask } from './types'
import { TicketFormType, TicketTaskPriority, TicketTaskStatus } from './types'

interface ITableProps {
  projectId?: string
  ticketId?: string
}

const props = defineProps<ITableProps>()
const { t } = useI18n()

const currentPage = ref(1)
const maxDescriptionLength = 50 // Set the desired maximum length of the description text

const { data, isLoading } = getTicketTasks({
  ticketId: props.ticketId,
  projectId: props.projectId,
  page: currentPage
}) as {
  data: Ref<GetTicketTasksResponse>
  isLoading: Ref<boolean>
}

const hasTicket = computed(() => {
  return data.value?.ticketTasks?.some((item) => item.ticket)
})

const truncatedDescription = (description: string) => {
  if (description?.length > maxDescriptionLength) {
    return description.slice(0, maxDescriptionLength) + '...'
  }
  return description
}

const priorityName = computed(() => (priority?: TicketTaskPriority) => {
  switch (Number(priority)) {
    case TicketTaskPriority.Low:
      return t('ticket.priority_options.low')
    case TicketTaskPriority.Medium:
      return t('ticket.priority_options.medium')
    case TicketTaskPriority.High:
      return t('ticket.priority_options.high')
    case TicketTaskPriority.Critical:
      return t('ticket.priority_options.critical')
    default:
      return t('ticket.priority_options.low')
  }
})

const priorityClass = computed(() => (priority?: TicketTaskPriority) => {
  switch (Number(priority)) {
    case TicketTaskPriority.Low:
      return 'text-blue-500'
    case TicketTaskPriority.Medium:
      return 'text-yellow-500'
    case TicketTaskPriority.High:
      return 'text-red-400'
    case TicketTaskPriority.Critical:
      return 'text-red-800'
    default:
      return ''
  }
})

const statusName = computed(() => (status?: TicketTaskStatus) => {
  switch (Number(status)) {
    case TicketTaskStatus.New:
      return t('ticket.status.new')
    case TicketTaskStatus.OnProgress:
      return t('ticket.status.onprogress')
    case TicketTaskStatus.Done:
      return t('ticket.status.done')
    default:
      return ''
  }
})

const statusClass = computed(() => (status?: TicketTaskStatus) => {
  switch (Number(status)) {
    case TicketTaskStatus.New:
      return 'text-blue-500'
    case TicketTaskStatus.OnProgress:
      return 'text-yellow-500'
    case TicketTaskStatus.Done:
      return 'text-green-500'
    default:
      return ''
  }
})

const tableHeaders = computed<TableHeader[]>(() => {
  return [
    { key: '#', label: '#' },
    hasTicket.value ? { key: 'client', label: t('client') } : null,
    { key: 'task_desc', label: t('ticket.task_desc') },
    { key: 'task_author', label: t('ticket.task_author') },
    { key: 'executors', label: t('executors') },
    { key: 'created_at', label: t('ticket.task_created_at') },
    { key: 'task_deadline', label: t('ticket.task_deadline') },
    { key: 'task_tags', label: t('ticket.task_tags') },
    { key: 'task_priority', label: t('ticket.task_priority') },
    { key: 'status', label: t('status') },
    { key: 'actions', label: t('actions') }
  ].filter((header) => header !== null) as TableHeader[]
})

function extractExecutors(executors: IExecutor[]) {
  return executors.map((executor) => executor.name).join(', ')
}

function extractTags(tags: string[]) {
  if (tags && tags.length > 0) {
    const formattedTags = tags
      .filter((tag) => tag.trim().length > 0) // Filter out empty tags
      .map((tag) => `#${tag.trim()}`) // Trim and prepend "#" to each tag
    return formattedTags.join(', ')
  } else {
    return '-'
  }
}

function showEditTicketForm(ticket: ITicketTask) {
  useTicketTasksFormModal({
    type: TicketFormType.EDIT,
    ticketId: ticket.ticketId,
    projectId: ticket.projectId,
    initialVal: ticket
  }).open()
}

function showSingleTicket(ticket: ITicketTask) {
  useTicketTaskShowModal(ticket).open()
}
</script>
