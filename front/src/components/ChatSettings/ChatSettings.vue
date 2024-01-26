<template>
  <div class="h-full overflow-y-auto py-3">
    <div v-if="ticketDetails">
      <div class="px-4">
        <div class="text-xl mb-3">{{ t('details') }}</div>

        <ChatDetailField
          :label="t('project')"
          :value="ticketDetails.project.name ?? '---'"
          class="mb-2 cursor-pointer"
          @click="openChatTopicForm"
        />

        <ChatDetailField
          :label="t('chat.client-topic')"
          class="mb-2 cursor-pointer"
          @click="openChatTopicForm"
        >
          <div v-if="topicTree.length">
            <ChatTopicList v-for="node in topicTree" :key="node._id" :node="node" />
          </div>

          <div v-else>
            <span class="text-sm">{{ t('topic_not_selected') }}</span>
          </div>
        </ChatDetailField>

        <ChatUpdatableField
          v-model="clientDetails.name"
          :client-id="ticketDetails.clientId"
          :label="t('name')"
          class="mb-2"
          field="name"
        />

        <ChatUpdatableField
          v-model="clientDetails.email"
          :client-id="ticketDetails.clientId"
          class="mb-2"
          field="email"
          label="Email"
          type="email"
        />

        <ChatUpdatableField
          v-model="clientDetails.phone"
          :client-id="ticketDetails.clientId"
          :label="t('phone_number')"
          class="mb-2"
          field="phone"
          type="phone"
        />

        <ChatDetailField
          :label="t('conversion_number')"
          :value="ticketDetails._id.slice(-8)"
          class="mb-2"
        />

        <ChatDetailsAutoCloseDate />

        <ChatUpdatableField
          v-model="clientDetails.comment"
          :client-id="ticketDetails.clientId"
          :label="t('notes')"
          class="mb-2"
          field="comment"
          mode="textarea"
        />

        <div v-if="clientCustomAttributeList.length" class="mt-3">
          {{ t('custom_attribute.client_title') }}
        </div>

        <div v-if="clientCustomAttributeList.length">
          <ChatUpdatableAttributeField
            v-for="attribute in clientCustomAttributeList"
            :key="attribute._id"
            v-model="clientAttributeValues[attribute.key]"
            :client-id="ticketDetails.clientId"
            :custom-attribute-id="attribute._id"
            :custom-attribute-type="CustomAttributeType.Client"
            :label="attribute.name"
            :project-id="ticketDetails.projectId"
            class="mb-2"
          />
        </div>

        <div v-if="clientCustomAttributeList.length" class="mt-3">
          {{ t('custom_attribute.ticket_title') }}
        </div>

        <div v-if="clientCustomAttributeList.length">
          <ChatUpdatableAttributeField
            v-for="attribute in ticketCustomAttributeList"
            :key="attribute._id"
            v-model="ticketAttributeValues[attribute.key]"
            :client-id="ticketDetails._id"
            :custom-attribute-id="attribute._id"
            :custom-attribute-type="CustomAttributeType.Ticket"
            :label="attribute.name"
            :project-id="ticketDetails.projectId"
            class="mb-2"
          />
        </div>

        <ChatDetailField :label="t('chat.client-current-status')" class="mb-2">
          <SimpleSelect
            v-model="ticketDetails.status"
            :clearable="false"
            :options="clientStatus"
            disabled
            value-name="value"
            @option:selected="updateStatus"
          />
        </ChatDetailField>

        <ChatDetailField v-if="department" :label="`Bo'linma`" :value="department" class="mb-2" />

        <ChatDetailField :label="t('operator_list')" class="mb-2">
          <div v-if="Array.isArray(operators) && operators.length > 0" class="flex flex-col gap-2">
            <ul v-for="operator in operators" :key="operator._id">
              <li class="text-sm list-disc mx-4">{{ operator.name }}</li>
            </ul>
          </div>

          <div v-else>
            {{ t('reports.notselected_operator') }}
          </div>
        </ChatDetailField>

        <ChatDetailField
          v-if="pageViews && pageViews.length > 0"
          :label="t('user_page_views')"
          class="mb-2"
        >
          <div>
            <div
              v-for="pageView in pageViews"
              :key="pageView._id"
              class="mb-0.5"
              style="overflow-wrap: anywhere"
            >
              <a :href="pageView.pageUrl" class="underline line-clamp-1" target="_blank">
                {{ pageView.pageTitle }}
              </a>
              <p class="text-xs text-gray-400">
                {{ ToShortMonthNameDateTime(pageView.createdAt) }}
              </p>
            </div>

            <div
              v-if="pageViews.length >= limitPageViews"
              class="mt-1 inline-flex gap-2 cursor-pointer border rounded-lg px-2 py-1 items-center select-none"
              @click="readMore = !readMore"
            >
              <IconSeeLess v-if="readMore" />
              <IconSeeMore v-else />

              {{ readMore ? t('see_less') : t('see_more') }}
            </div>
          </div>
        </ChatDetailField>

        <div v-if="integrationData">
          <ChatDetailField
            v-for="([key, value], index) in Object.entries(integrationData)"
            :key="index"
            :label="key"
            :value="value as string"
            class="mb-1"
          />
        </div>

        <ClientDeviceInfo
          v-if="ticketDetails.client.userAgent"
          :user-agent="ticketDetails.client.userAgent"
        />
      </div>

      <div class="grid grid-cols-6 px-4 text-gray-400 mt-8">
        <div
          class="col-span-2 flex items-center justify-center flex-col gap-2 cursor-pointer text-center text-sm hover:text-primary font-semibold"
          @click="showTicketTasksListModal"
        >
          <IconTasks class="w-6 h-6 my-1" />
          <div class="h-[36px]">{{ t('ticket.title') }}</div>
        </div>

        <div
          class="col-span-2 flex items-center justify-center flex-col gap-2 cursor-pointer text-center text-sm hover:text-primary font-semibold"
          @click="isSelectUserChatsOpen = true"
        >
          <IconArchived class="w-6 h-6 my-1" />
          <div class="h-[36px]">{{ t('other_chats') }}</div>
        </div>

        <FinishConversation
          :chat="ticketDetails"
          class="col-span-2 flex items-center justify-center flex-col gap-2 cursor-pointer text-center text-sm text-red-500 font-semibold"
        />
      </div>
    </div>

    <Loader v-else />
  </div>

  <ClientChats v-model:open="isSelectUserChatsOpen" />
</template>
<script lang="ts" setup>
import IconArchived from '@/assets/icon/IconArchived.vue'
import IconSeeLess from '@/assets/icon/IconSeeLess.vue'
import IconSeeMore from '@/assets/icon/IconSeeMore.vue'
import IconTasks from '@/assets/icon/IconTasks.vue'
import ChatDetailsAutoCloseDate from '@/components/ChatSettings/ChatDetailsAutoCloseDate.vue'
import ChatTopicList from '@/components/ChatSettings/ChatTopics/ChatTopicList.vue'
import useChatTopicsFormModal from '@/components/ChatSettings/ChatTopics/useChatTopicsFormModal'
import ChatUpdatableField from '@/components/ChatSettings/ChatUpdatableField/ChatClientUpdatableField.vue'
import ChatDetailField from '@/components/ChatSettings/ChatUpdatableField/ChatDetailField.vue'
import ChatUpdatableAttributeField from '@/components/ChatSettings/ChatUpdatableField/ChatUpdatableAttributeField.vue'
import ClientDeviceInfo from '@/components/ChatSettings/ClientDeviceInfo.vue'
import FinishConversation from '@/components/ChatSettings/FinishConversation.vue'
import ClientChats from '@/components/Chatting/ClientChats.vue'
import { useChatDetails } from '@/components/Chatting/helpers'
import Loader from '@/components/Loader/Loader.vue'
import SimpleSelect from '@/components/Select/SimpleSelect.vue'
import { ToastType, useToast } from '@/components/Toast/ToastPlugin'
import type { ITreeNode } from '@/components/TreeList/types'
import { makeTreeForParent } from '@/helpers/tree'
import { ToShortMonthNameDateTime } from '@/modules/helpers/date'
import { updateTicketTopics } from '@/service/http/api/chat'
import { updateTicketDetailsRequest } from '@/service/http/api/client'
import {
  type CustomAttribute,
  CustomAttributeType,
  getCustomAttribute
} from '@/service/http/api/custom-attribute'
import type { IOperator } from '@/service/modules/chat/types'
import useTicketTasksListModal from '@/views/Tickets/Modal/useTicketTasksListModal'
import type { AxiosError } from 'axios'
import { computed, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const toast = useToast()

const ticketDetails = useChatDetails()
const projectId = computed(() => ticketDetails.value.projectId)

const { data: clientAttributesData } = getCustomAttribute(projectId, 'client')
const { data: ticketAttributesData } = getCustomAttribute(projectId, 'ticket')

const clientCustomAttributeList = computed<CustomAttribute[]>(
  () => clientAttributesData.value ?? []
)
const ticketCustomAttributeList = computed<CustomAttribute[]>(
  () => ticketAttributesData.value ?? []
)

const updateDetails = updateTicketDetailsRequest(ticketDetails.value._id)

function showTicketTasksListModal() {
  useTicketTasksListModal({
    ticketId: ticketDetails.value._id,
    projectId: ticketDetails.value.projectId,
    clientName: ticketDetails.value.client.name,
    projectName: ticketDetails.value.project.name
  }).open()
}

interface IClientDetails {
  comment?: string
  name?: string
  email?: string
  phone?: string
}

const clientDetails = ref<IClientDetails>({})

const ticketAttributeValues = ref<Record<string, string | undefined>>({})
const clientAttributeValues = ref<Record<string, string | undefined>>({})

watch(
  ticketDetails,
  () => {
    clientDetails.value = {
      comment: ticketDetails.value?.client?.comment ?? '',
      name: ticketDetails.value?.client?.name ?? '',
      email: ticketDetails.value?.client?.email ?? '',
      phone: ticketDetails.value?.client?.phone ?? ''
    }

    ticketAttributeValues.value = toRaw(ticketDetails.value?.ticketData ?? {})
    clientAttributeValues.value = toRaw(ticketDetails.value?.client?.clientData ?? {})
  },
  {
    immediate: true
  }
)

const readMore = ref(false)
const { t } = useI18n()

async function updateStatus(status: number) {
  updateDetails.mutate({
    status: status
  })
}

const integrationData = computed(() => ticketDetails.value.client.integrationData)
const limitPageViews = 5
const pageViews = computed(
  () =>
    (readMore.value
      ? ticketDetails.value?.pageViews
      : ticketDetails.value?.pageViews?.slice(0, limitPageViews)) ?? []
)

const clientStatus = ref([
  { value: 1, name: t('client-status.has-update') },
  { value: 2, name: t('client-status.viewed') },
  { value: 0, name: t('client-status.archived') }
])

const department = computed(() => ticketDetails.value?.department?.name)

const { mutate: updateMutation } = updateTicketTopics(ticketDetails.value._id)

async function updateTopic(topicIds: string[], topicComment: string) {
  updateMutation(
    {
      topicIds: topicIds,
      topicComment: topicComment
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
          message: `Xatolik yuz berdi: ${message}`,
          timer: 1000
        })
      }
    }
  )
}

function openChatTopicForm() {
  useChatTopicsFormModal({
    projectId: ticketDetails.value.projectId,
    ticketId: ticketDetails.value._id,
    topics: toRaw(ticketDetails.value?.topics ?? []).map((t) => t._id),
    topicComment: ticketDetails.value?.topicComment,
    onClosed: (newSelectedTopics: string[], topicComment: string) => {
      updateTopic(newSelectedTopics, topicComment)
    }
  }).open()
}

const operators = computed<IOperator[]>(() => ticketDetails.value?.operators ?? [])

const topicTree = computed(() => makeTreeForParent<ITreeNode>(ticketDetails.value?.topics ?? []))

const isSelectUserChatsOpen = ref(false)
</script>
