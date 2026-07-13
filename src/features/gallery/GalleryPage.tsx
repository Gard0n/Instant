import { Link, useParams } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { useEvent } from '../../hooks/useEvent'
import { useEventPhotos } from './hooks/useEventPhotos'
import { LockedScreen } from './components/LockedScreen'
import { PhotoGrid } from './components/PhotoGrid'

export function GalleryPage() {
  const { id } = useParams<{ id: string }>()
  const { event, loading: eventLoading, error: eventError } = useEvent(id)
  const { loading: photosLoading, isOwner, isRevealed, photos, error } = useEventPhotos(event)

  if (eventLoading || (event && photosLoading)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (eventError || !event) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-lg font-semibold">Événement introuvable</p>
        <p className="text-sm text-instant-text-muted">Vérifiez le lien fourni par les mariés.</p>
      </div>
    )
  }

  if (!isOwner && !isRevealed) {
    return <LockedScreen eventName={event.name} revealAt={event.reveal_at} />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{event.name}</h1>
          <p className="text-sm text-instant-text-muted">
            {photos.length} photo{photos.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to={`/event/${event.id}`}
          className="rounded-full border border-instant-border px-4 py-2 text-sm hover:bg-instant-surface-hover"
        >
          Prendre une photo
        </Link>
      </header>

      {error && <p className="mb-4 text-sm text-instant-danger">{error}</p>}

      <PhotoGrid photos={photos} />
    </div>
  )
}
