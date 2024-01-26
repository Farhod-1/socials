<template>
  <PageWrapper :page-title="t('medical_history')" page-class="p-3">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut dicta dignissimos distinctio
    dolore fugit ipsum nulla, quas rerum. Aliquam cumque delectus dicta doloremque eveniet itaque
    labore quibusdam quisquam reiciendis sed!
  </PageWrapper>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import PageWrapper from '@/components/PageWrapper/PageWrapper.vue'

const { t } = useI18n()
</script>
