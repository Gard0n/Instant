import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import { useEvent } from '../../hooks/useEvent'
import { useCamera } from './hooks/useCamera'
import { usePhotoCapture } from './hooks/usePhotoCapture'
import { CameraView } from './components/CameraView'
import { CameraPermissionError } from './components/CameraPermissionError'

export function CameraPage() {
  const { id } = useParams<{ id: string }>()
  const { event, loading: eventLoading, error: eventError } = useEvent(id)
  const { videoRef, setVideoNode, status, facingMode, videoReady, flipCamera, retry } = useCamera()
  const [guestName, setGuestName] = useState('')

  const {
    capture,
    retryUpload,
    status: captureStatus,
    error: captureError,
    canRetryUpload,
    reset,
  } = usePhotoCapture({
    eventId: id ?? '',
    filterStyle: event?.filter_style ?? 'natural',
    guestName,
  })

  useEffect(() => {
    if (captureStatus !== 'success') return
    const timeout = setTimeout(reset, 1500)
    return () => clearTimeout(timeout)
  }, [captureStatus, reset])

  if (eventLoading) {
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

  if (status === 'denied' || status === 'unsupported') {
    return <CameraPermissionError status={status} onRetry={retry} />
  }

  if (status !== 'granted') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <CameraView
        videoRef={setVideoNode}
        eventName={event.name}
        filterStyle={event.filter_style}
        facingMode={facingMode}
        videoReady={videoReady}
        captureStatus={captureStatus}
        guestName={guestName}
        onGuestNameChange={setGuestName}
        onFlip={flipCamera}
        onCapture={() => videoRef.current && capture(videoRef.current, facingMode === 'user')}
      />
      {captureError && (
        <div className="fixed inset-x-4 bottom-28 flex flex-col items-center gap-2 rounded-xl bg-instant-danger/90 px-4 py-3 text-center text-sm text-white">
          <span>{captureError}</span>
          {canRetryUpload && (
            <Button variant="secondary" className="bg-white/90 px-4 py-1.5 text-instant-bg" onClick={retryUpload}>
              Réessayer l'envoi
            </Button>
          )}
        </div>
      )}
    </>
  )
}
