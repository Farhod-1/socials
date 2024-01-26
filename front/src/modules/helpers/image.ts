export function resizeBlobImage(blob: Blob, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject('No canvas context')
    }

    img.onload = () => {
      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob: Blob | null) => {
        if (blob) resolve(blob)
        else reject('No blob')
      }, blob.type)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(blob)
  })
}
