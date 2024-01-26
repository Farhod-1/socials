import { useModal, useModalSlot } from 'vue-final-modal'
import FinalModal from '@/components/Modal/FinalModal.vue'
import { i18n } from '@/service/locale'
import ChatTopicsFormModal from '@/components/ChatSettings/ChatTopics/ChatTopicsFormModal.vue'

export interface IChatTopicsFormModalProps {
  projectId: string
  ticketId: string
  topics?: string[]
  topicComment?: string
  onClosed?: (tickets: string[], topicComment: string) => void
}

export default function useChatTopicsFormModal(data: IChatTopicsFormModalProps) {
  const modal = useModal({
    component: FinalModal,
    attrs: {
      title: i18n.global.t('attach_topic'),
      onClose() {
        modal.close()
      }
    },
    slots: {
      default: useModalSlot({
        component: ChatTopicsFormModal,
        attrs: {
          data,
          onClose: () => {
            modal.close()
          }
        }
      })
    }
  })

  return modal
}
