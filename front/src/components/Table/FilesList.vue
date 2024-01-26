<template>
  <div class="mt-3">
    <div
      v-for="(file, index) in files"
      :key="index"
      class="text-white bg-primary w-full relative px-4 py-1 mb-2 rounded-3xl"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1 text-sm">
          <IconDocument />
          <a
            v-if="isFilePath"
            :href="makeFullPath(file as string)"
            class="underline"
            target="_blank"
          >
            <span class="line-clamp-1">{{ getFileDisplayName(file) }}</span>
          </a>
          <span v-else>{{ getFileDisplayName(file) }}</span>
        </div>
        <IconRemove
          v-if="layoutType == 'form'"
          class="cursor-pointer w-6 h-6 text-red-700"
          @click="deleteFile(index)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { makeFullPath } from '@/helpers'
import IconDocument from '@/assets/icon/IconDocument.vue'
import IconRemove from '@/assets/icon/IconRemove.vue'

interface IFiles {
  files?: string[] | File[] | string
  isFilePath?: boolean
  layoutType?: 'details' | 'form'
}

defineProps<IFiles>()
const emit = defineEmits(['delete-file'])

function deleteFile(index: number) {
  emit('delete-file', index)
}

function getFileDisplayName(file: string | File): string {
  if (typeof file === 'string') {
    return file
  } else {
    return file.name
  }
}
</script>