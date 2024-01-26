import 'viewerjs-adizbek/dist/viewer-adizbek.css'
import Viewer from 'viewerjs-adizbek'
import useRecognitionModal from '@/components/Chatting/TextRecognition/useRecognitionModal'

export interface ViewerOptions {
  onClose?: () => void
}

export default function previewImage(
  images: HTMLImageElement | HTMLElement,
  options: ViewerOptions = {}
): void {
  let viewer: Viewer | undefined = undefined

  function escHandler(e: KeyboardEvent) {
    if (e.key === 'Escape' && viewer !== undefined) {
      viewer.hide()

      e.preventDefault()
      e.stopPropagation()
    }
  }

  viewer = new Viewer(images, {
    filter(image: HTMLImageElement) {
      return image.hasAttribute('data-preview')
    },
    navbar: true,
    toolbar: {
      prev: false,
      next: false,
      play: false,
      zoomIn: true,
      zoomOut: true,
      oneToOne: false,
      reset: true,
      rotateLeft: true,
      rotateRight: true,
      flipHorizontal: true,
      flipVertical: true,
      download: () => {
        const a = document.createElement('a')

        // @ts-ignore
        a.href = viewer.image.src
        // @ts-ignore
        a.download = viewer.image.src
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      },
      recognize: () => {
        if (viewer) {
          viewer.destroy()
          // @ts-ignore
          useRecognitionModal(viewer.image.src).open()
        }
      }
    },
    maxZoomRatio: 5,
    focus: false,
    hide() {
      document.removeEventListener('keydown', escHandler, { capture: true })
      viewer?.destroy()
      options.onClose?.()
      viewer = undefined
    },

    shown() {
      document.addEventListener('keydown', escHandler, { capture: true })
    }
  })

  viewer.view(0)
}
