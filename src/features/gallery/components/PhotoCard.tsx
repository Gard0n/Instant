import { useEffect, useState } from 'react'
import { getSignedPhotoUrl } from '../../../lib/storage/photoStorage'
import type { Photo } from '../../../types/event'

export function PhotoCard({ photo }: { photo: Photo }) {
  const [url, setUrl] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSignedPhotoUrl(photo.storage_path).then((signedUrl) => {
      if (!cancelled) setUrl(signedUrl)
    })
    return () => {
      cancelled = true
    }
  }, [photo.storage_path])

  async function handleDownload() {
    if (!url || downloading) return
    setDownloading(true)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${photo.guest_name ?? 'instant'}-${photo.id.slice(0, 8)}.jpg`
      link.click()
      URL.revokeObjectURL(objectUrl)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-instant-surface">
      {url ? (
        <img
          src={url}
          alt={photo.guest_name ? `Photo de ${photo.guest_name}` : 'Photo du mariage'}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-instant-surface-hover" />
      )}

      <button
        type="button"
        onClick={handleDownload}
        disabled={!url || downloading}
        aria-label="Télécharger la photo"
        className="absolute bottom-2 right-2 rounded-full bg-black/60 p-2 text-white backdrop-blur transition-opacity disabled:opacity-50"
      >
        {downloading ? '…' : '⬇'}
      </button>

      {photo.guest_name && (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
          {photo.guest_name}
        </span>
      )}
    </div>
  )
}
