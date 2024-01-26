<template>
  <ChatDetailField :label="t('user_agent')" :value="userAgent" class="mb-1"></ChatDetailField>
  <ChatDetailField v-if="device.client" :label="t('browser')" class="mb-1">
    {{ device.client?.name }}
    <span v-if="device.client.version">(version {{ device.client?.version }})</span>
  </ChatDetailField>

  <ChatDetailField v-if="device.os" :label="t('device')" class="mb-1">
    {{ device.os?.name }}
    <span v-if="device.os.version">(version {{ device.os?.version }})</span>
  </ChatDetailField>
</template>

<script lang="ts" setup>
import DeviceDetector from 'device-detector-js'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ChatDetailField from '@/components/ChatSettings/ChatUpdatableField/ChatDetailField.vue'

const props = defineProps<{
  userAgent: string
}>()
const { t } = useI18n()

const deviceDetector = new DeviceDetector()

const device = computed(() => deviceDetector.parse(props.userAgent))
</script>