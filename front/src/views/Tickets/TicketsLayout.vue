<template>
  <TicketTasksList />
</template>
<script lang="ts" setup>
import TicketTasksList from '@/views/Tickets/TicketTasksList.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
