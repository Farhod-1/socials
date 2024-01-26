import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const notificationSound: HTMLAudioElement = new Audio('/sounds/notification_sound.mp3')

export const isMutedStorage = useLocalStorage<string>('call24_operator_is_muted', '0', {
  writeDefaults: false
})

export function toggleMute(): void {
  if (isMutedStorage.value === '0') {
    isMutedStorage.value = '1'
  } else {
    isMutedStorage.value = '0'
  }
}

export const isMuted = computed<boolean>(() => {
  return isMutedStorage.value === '1'
})

export function playNotification(): void {
  if (!isMuted.value) {
    try {
      notificationSound.play()
    } catch (e) {
      // ignore
    }
  }
}
