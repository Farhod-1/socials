<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  text: String
})
const hasSavedSuccessfully = ref(false)

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {
    console.error(err)
  }

  document.body.removeChild(textArea)
}

function copyTextToClipboard(text?: string) {
  if (!text) return

  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    successfullySaved()
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      successfullySaved()
    },
    function (err) {
      console.error('Async: Could not copy text: ', err)
    }
  )
}

const successfullySaved = () => {
  hasSavedSuccessfully.value = true
  setTimeout(() => {
    hasSavedSuccessfully.value = false
  }, 700)
}
</script>

<template>
  <div class="wrapper" @click="copyTextToClipboard(text)">
    <Transition name="fade">
      <p v-if="hasSavedSuccessfully" class="message">copied</p>
    </Transition>
    <slot></slot>
  </div>
</template>

<style scoped>
.wrapper {
  cursor: pointer;
  position: relative;
}

.message {
  position: absolute;
  color: #fff;
  border-radius: 5px;
  padding: 10px;
  white-space: nowrap;
  z-index: 10;
  top: 100%;
  left: 30%;
  background: #000;
}
</style>
