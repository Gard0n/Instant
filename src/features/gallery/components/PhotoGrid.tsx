import type { Photo } from '../../../types/event'
import { PhotoCard } from './PhotoCard'

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-instant-text-muted">
        <div className="text-3xl">📸</div>
        <p>Aucune photo pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  )
}
