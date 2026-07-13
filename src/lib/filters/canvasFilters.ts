import type { FilterStyle } from '../../types/event'

const FILTER_CSS: Record<FilterStyle, string> = {
  natural: 'saturate(1.05) contrast(1.02)',
  warm: 'saturate(1.3) sepia(0.25) contrast(1.05) brightness(1.05)',
  bw: 'grayscale(1) contrast(1.15)',
}

export function getFilterCss(style: FilterStyle): string {
  return FILTER_CSS[style]
}

// Bride la résolution uploadée : un mariage se prend en 4G/wifi de salle, pas
// besoin de la pleine résolution native de la caméra pour un rendu "pellicule".
const MAX_DIMENSION = 1600

interface CapturePhotoOptions {
  video: HTMLVideoElement
  filterStyle: FilterStyle
  /** Vrai pour la caméra frontale : la capture est inversée pour matcher l'aperçu miroir */
  mirror: boolean
  quality?: number
}

export async function capturePhotoBlob({
  video,
  filterStyle,
  mirror,
  quality = 0.85,
}: CapturePhotoOptions): Promise<Blob> {
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    throw new Error("La caméra n'est pas encore prête, réessayez dans un instant")
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(video.videoWidth, video.videoHeight))

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(video.videoWidth * scale)
  canvas.height = Math.round(video.videoHeight * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error("Impossible d'initialiser le canvas de capture")
  }

  ctx.filter = getFilterCss(filterStyle)

  if (mirror) {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Échec de la génération de la photo'))
        }
      },
      'image/jpeg',
      quality,
    )
  })
}
