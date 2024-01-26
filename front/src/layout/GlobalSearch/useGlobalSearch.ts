import { useModal, useModalSlot } from 'vue-final-modal'
import FinalModal from '@/components/Modal/FinalModal.vue'
import GlobalSearch from '@/layout/GlobalSearch/GlobalSearch.vue'

export default function useGlobalSearch() {
  const modal = useModal({
    component: FinalModal,
    attrs: {
      hasTitle: false,
      onClose() {
        modal.close()
      }
    },

    slots: {
      default: useModalSlot({
        component: GlobalSearch,

        attrs: {
          onClose() {
            modal.close()
          }
        }
      })
    }
  })

  return modal
}
