<script lang="ts" setup>
import CardBox from '@/components/CardBox/CardBox.vue'
import IconProfile from '@/assets/icon/IconProfile.vue'

defineProps({
  firstTitle: {
    type: String,
    required: true
  },
  firstSubtitle: {
    type: String,
    required: true
  },
  secondTitle: {
    type: String,
    required: true
  },
  secondSubtitle: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true,
    default: () => IconProfile
  },
  name: {
    type: String,
    required: true
  }
})
</script>
<template>
  <CardBox :icon="icon" :name="name">
    <div class="justify-start">
      <p class="my-1 dark:!text-dark-200">
        <span class="font-semibold">{{ firstTitle }}</span
        >: {{ firstSubtitle }}
      </p>
      <p class="my-1 dark:!text-dark-200 line-clamp-1 font-mono">
        <span class="font-semibold"> {{ secondTitle }} </span>: {{ secondSubtitle }}
      </p>
    </div>
    <slot />
  </CardBox>
</template>
