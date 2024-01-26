<template>
  <div
    class="flex items-center relative gap-2 px-2 w-full h-[70px] flex-row"
    @click.prevent.capture.stop="$emit('click', $event)"
  >
    <div class="relative">
      <div
        :style="{ backgroundImage: `url(${img})` }"
        class="w-9 h-9 rounded-full shrink-0 bg-contain"
      />

      <div
        v-if="isOnline"
        class="absolute w-2.5 h-2.5 bg-green-600 border border-green-700 rounded-full right-0.5 -bottom-0.5"
      ></div>
    </div>

    <div class="flex-grow">
      <div class="line-clamp-1 dark:text-dark-200">{{ name }}</div>
      <div class="text-xs text-gray-700 dark:text-dark-200 line-clamp-1">{{ position }}</div>

      <EmployeeStatusText :status="status" />
    </div>

    <div>
      <IconThreeDots class="w-5 h-5" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconThreeDots from '@/assets/icon/IconThreeDots.vue'
import EmployeeStatusText from '@/components/Employee/EmployeeStatusText.vue'

defineProps({
  img: {
    default: 'person.jpg',
    type: String
  },
  name: {
    default: 'John Doe',
    type: String
  },
  position: {
    default: 'Realsoft FRONT-END',
    type: String
  },
  isOnline: {
    default: false,
    type: Boolean
  },
  status: {
    type: Number,
    required: false
  }
})

defineEmits(['click'])
</script>