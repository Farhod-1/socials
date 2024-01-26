<template>
  <div ref="container" class="flex gap-3 items-center" @paste.prevent="onPaste">
    <input
      v-for="n in length"
      :key="n"
      v-model="OtpArray[n - 1]"
      class="border rounded-md w-10 p-2 text-center dark:bg-dark-700 dark:text-gray-100"
      max="9"
      min="0"
      placeholder="0"
      type="number"
      @input="$emit('update:modelValue', OtpArray.join(''))"
      @keydown="(e) => handleKeyDown(e, n - 1)"
      @keyup="(e) => handleKeyUp(e, n - 1)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const propsOTP = defineProps({
  length: {
    type: Number,
    default: 6
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const OtpArray = ref<string[]>([])

watch(
  () => OtpArray.value,
  (value) => {
    emit('update:modelValue', value.join(''))
  },
  { deep: true }
)

const container = ref()

function handleKeyDown(e: KeyboardEvent, i: number) {
  const keyPressed = e.key
  const children = container.value.children

  // Allow tab to focus next input cell
  if (keyPressed === 'Tab') {
    return
  }

  // Allow pasting value from clipboard
  if (keyPressed === 'v' && (e.ctrlKey || e.metaKey)) {
    return
  }

  if (keyPressed === 'Backspace') {
    e.preventDefault()
    e.stopPropagation()
    return
  } else if (keyPressed === 'ArrowLeft') {
    if (i > 0) children[i - 1].focus()
    e.preventDefault()
    e.stopPropagation()
    return
  } else if (keyPressed === 'ArrowRight') {
    if (i < propsOTP.length - 1) children[i + 1].focus()
    e.preventDefault()
    e.stopPropagation()
    return
  } else {
    const match = keyPressed.match(/[0-9]$/)
    if (!match) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
  }
}

function handleKeyUp(e: KeyboardEvent, i: number) {
  const children = container.value.children

  const keyPressed = e.key

  if (keyPressed === 'Backspace') {
    OtpArray.value[i] = ''
    if (i > 0) children[i - 1].focus()
  } else {
    const match = keyPressed.match(/[0-9]$/)

    if (match) {
      OtpArray.value[i] = match[0]

      if (i < propsOTP.length - 1) children[i + 1].focus()
    }
  }

  checkOTP()
}

function onPaste(e: ClipboardEvent) {
  if (!e.clipboardData) return

  const pastedData = (e.clipboardData?.getData('text/plain') ?? '')
    .replaceAll(/[^0-9]/g, '')
    .substring(0, propsOTP.length)

  const children = container.value.children

  for (let i = 0; i < propsOTP.length; i++) {
    if (pastedData.length > i) {
      OtpArray.value[i] = pastedData[i]
    } else {
      OtpArray.value[i] = ''
    }
  }

  checkOTP()
  children[propsOTP.length - 1].focus()
}

function checkOTP() {
  const children = container.value.children
  for (let i = 0; i < propsOTP.length; i++) {
    children[i].classList.toggle('border-red-500', !OtpArray.value[i])
  }
}
</script>
