<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <Toast
        v-for="(toast, index) in toasts"
        v-show="!toast._hiding"
        :key="`${toast}-${index}`"
        :toast="toast"
      />
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import Toast from './Toast.vue'
import type { IToastOptions } from '@/components/Toast/IToastOptions'

export default defineComponent({
  components: { Toast },
  props: {
    toasts: {
      default: () => [],
      type: Array as PropType<IToastOptions[]>
    }
  }
})
</script>

<style lang="scss">
.toast-container {
  top: 12px;
  right: 12px;
  display: block;
  position: fixed;
  width: 300px;
  z-index: 99999;

  div {
    margin: 12px 0;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>