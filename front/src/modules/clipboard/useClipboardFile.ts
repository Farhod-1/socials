import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

export type OnFileTypeHandler = (file: File) => void

export default function useClipboardFile(
  inputRef: Ref<HTMLTextAreaElement | undefined>,
  onFilePaste: OnFileTypeHandler
) {
  function sendFileFromClipboard(value: ClipboardEvent) {
    const cliboardFiles = value.clipboardData?.files

    if (cliboardFiles?.length) {
      onFilePaste(cliboardFiles[0])
    }
  }

  onMounted(() => {
    inputRef.value?.addEventListener('paste', sendFileFromClipboard)
  })

  onUnmounted(() => inputRef.value?.removeEventListener('paste', sendFileFromClipboard))
}
