<template>
  <div class="relative">
    <div
      class="w-full h-[150px] border-2 border-dashed border-[#ccc] rounded-md cursor-pointer p-5 text-center"
      @click="openFileDialog"
    >
      <p>{{ t('select_files') }}</p>
      <IconUpload class="mx-auto mt-4" />
    </div>
    <input ref="fileInput" class="hidden" multiple type="file" @change="handleFileChange" />
  </div>
</template>
<script lang="ts" setup>
import IconUpload from '@/assets/icon/IconUpload.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['file-selected'])

const fileInput = ref<HTMLInputElement | null>(null)
const { t } = useI18n()
const filesStore = ref<File[]>([])

function openFileDialog() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileChange(event: Event) {
  const selectedFiles = (event.target as HTMLInputElement).files
  if (selectedFiles) {
    for (let i = 0; i < selectedFiles.length; i++) {
      filesStore.value.push(selectedFiles[i])
    }
    emit('file-selected', filesStore.value)
  }
}
</script>
