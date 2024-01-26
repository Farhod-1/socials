import { DEFAULT_AVATAR, getEmployeePhoto } from '@/helpers'
import { resizeBlobImage } from '@/modules/helpers/image'
import { uploadPhoto } from '@/service/http/api/employees'
import type { MaybeRef, Ref } from 'vue'
import { ref } from 'vue'

export function useProfileImage(
  image: Ref<string> = ref(DEFAULT_AVATAR),
  employeeId: MaybeRef<string>
) {
  const uploadRequest = uploadPhoto(employeeId)

  function newImage(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files ? target.files[0] : null

    if (!file) return

    const sizeOfUploadedImage = file.size / 1024 / 1024

    if (sizeOfUploadedImage > 3) {
      alert("Rasm 3mbdan kamroq bo'lishi kerak!")
    } else {
      resizeBlobImage(file, 512, 512).then((resizedImage) => {
        const reader = new FileReader()
        reader.readAsDataURL(resizedImage)
        reader.onloadend = () => {
          image.value = reader.result as string
        }
      })

      const formData = new FormData()
      formData.append('file', file)

      return uploadRequest.mutateAsync(formData)
    }
  }

  function clearImage() {
    image.value = DEFAULT_AVATAR
  }

  function setImage(newImage: string) {
    image.value = getEmployeePhoto(newImage)
  }

  return { uploadImage: newImage, clearImage, setImage, image }
}
