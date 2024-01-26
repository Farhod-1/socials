<template>
  <div class="w-[80vw]">
    <div v-if="!isLoading" class="max-h-[calc(100vh-100px)]">
      <div class="grid grid-cols-[300px,1fr] mt-2 gap-2">
        <div class="border rounded-md p-2">
          <ChatUpdateProject
            v-model="selectedProject"
            :label="t('project')"
            :ticket-id="props.data.ticketId"
            class="mb-3 mx-2"
          />
          <TreeListView
            v-if="topicTree.length"
            v-model="selectedTopics"
            :tree="topicTree"
            value-mode="parent"
          />
          <div v-else>{{ t('no_data') }}</div>
        </div>
        <div class="border rounded-md p-2">
          <div class="font-semibold">{{ t('knowledge_base.title') }}:</div>
          <div v-if="selectedTopicQuestions.length" class="overflow-y-auto py-2">
            <FaqAccordion
              v-for="el in selectedTopicQuestions"
              :key="el._id"
              :answers="el.answers"
              :question="el.question"
              answer-class="text-xs"
              class="mb-2"
              question-class="text-xs"
            >
            </FaqAccordion>
          </div>
          <div v-else class="flex justify-center mt-4">{{ t('no_data') }}</div>
        </div>
      </div>

      <div v-if="topicTree.length" class="mt-2">
        <VInput
          v-model="topicComment"
          :placeholder="t('topics_comment')"
          name="topicComment"
          textarea
          type="text"
        />
      </div>
    </div>
    <div v-else>
      <SpinnerIcon />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SpinnerIcon from '@/assets/icon/SpinnerIcon.vue'
import ChatUpdateProject from '@/components/ChatSettings/ChatUpdatableField/ChatUpdateProject.vue'
import TreeListView from '@/components/TreeList/TreeListView.vue'
import type { ITreeNode } from '@/components/TreeList/types'
import { makeTreeForParent } from '@/helpers/tree'
import { getProjectTopics } from '@/service/http/api/projects'
import { computed, onBeforeUnmount, type Ref, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IChatTopicsFormModalProps } from './useChatTopicsFormModal'
import FaqAccordion from '@/views/KnowledgeBase/components/FaqAccordion.vue'
import type { KnowledgeBaseTopics, OperatorFaq } from '@/types/operator-faq'

const props = defineProps<{
  data: IChatTopicsFormModalProps
  onClose: (args: string[]) => void
}>()

onBeforeUnmount(() => {
  const isDiff = JSON.stringify(props.data.topics) !== JSON.stringify(selectedTopics.value)
  const isCommentDiff = props.data.topicComment !== topicComment.value
  if (isDiff || isCommentDiff) props.data.onClosed?.(selectedTopics.value, topicComment.value)
})

const { t } = useI18n()

const selectedTopics = ref<string[]>(props.data.topics ?? [])
const topicComment = ref(props.data.topicComment ?? '')
const selectedProject = ref(props.data.projectId)

const {
  data: topicsResponseData,
  isLoading,
  isFetched
} = getProjectTopics(selectedProject) as {
  data: Ref<KnowledgeBaseTopics[]>
  isLoading: Ref<boolean>
  isFetched: Ref<boolean>
}

const projectTopics = ref<ITreeNode[]>([])

watchEffect(() => {
  projectTopics.value = topicsResponseData.value ?? []

  if (isFetched.value) {
    selectedTopics.value = selectedTopics.value.filter((topic) =>
      projectTopics.value.some((projectTopic) => projectTopic._id === topic)
    )
  }
})

const topicTree = computed<ITreeNode[]>(() =>
  makeTreeForParent(
    projectTopics.value,
    'parent',
    '_id',
    undefined,
    (a: ITreeNode, b: ITreeNode) => a.sortOrder - b.sortOrder
  )
)

const selectedTopicQuestions = computed(() => {
  return topicsResponseData.value
    .filter((el) => selectedTopics.value.includes(el._id))
    .map((el) => el.faqs)
    .flat()
}) as Ref<OperatorFaq[]>
</script>
