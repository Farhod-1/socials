<template>
  <TicketTasksList />
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import TicketTasksList from '@/views/Tickets/TicketTasksList.vue'

const { t } = useI18n()
</script>
