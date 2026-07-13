import { useCallback, useRef, useState } from 'react'
import { capturePhotoBlob } from '../../../lib/filters/canvasFilters'
import { buildPhotoPath, uploadPhoto } from '../../../lib/storage/photoStorage'
import { supabase } from '../../../lib/supabase'
import type { FilterStyle } from '../../../types/event'

export type CaptureStatus = 'idle' | 'capturing' | 'uploading' | 'success' | 'error'

interface UsePhotoCaptureArgs {
  eventId: string
  filterStyle: FilterStyle
  guestName: string
}

interface PendingPhoto {
  blob: Blob
  photoId: string
  path: string
}

export function usePhotoCapture({ eventId, filterStyle, guestName }: UsePhotoCaptureArgs) {
  const [status, setStatus] = useState<CaptureStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [canRetryUpload, setCanRetryUpload] = useState(false)
  const pendingRef = useRef<PendingPhoto | null>(null)

  const attemptUpload = useCallback(
    async (pending: PendingPhoto) => {
      setStatus('uploading')
      setError(null)

      try {
        await uploadPhoto(pending.path, pending.blob)

        const { error: insertError } = await supabase.from('photos').insert({
          id: pending.photoId,
          event_id: eventId,
          storage_path: pending.path,
          guest_name: guestName.trim() || null,
        })

        if (insertError) {
          throw new Error(insertError.message)
        }

        pendingRef.current = null
        setCanRetryUpload(false)
        setStatus('success')
      } catch (err) {
        // On garde la photo capturée : le bouton "Réessayer" relance l'upload
        // sans repasser par la caméra (utile en cas de coupure réseau).
        setError(err instanceof Error ? err.message : "Échec de l'envoi de la photo")
        setStatus('error')
        setCanRetryUpload(true)
      }
    },
    [eventId, guestName],
  )

  const capture = useCallback(
    async (video: HTMLVideoElement, mirror: boolean) => {
      setStatus('capturing')
      setError(null)

      try {
        const blob = await capturePhotoBlob({ video, filterStyle, mirror })
        const photoId = crypto.randomUUID()
        const path = buildPhotoPath(eventId, photoId)
        const pending: PendingPhoto = { blob, photoId, path }
        pendingRef.current = pending
        await attemptUpload(pending)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Échec de la prise de la photo")
        setStatus('error')
        setCanRetryUpload(false)
      }
    },
    [eventId, filterStyle, attemptUpload],
  )

  const retryUpload = useCallback(() => {
    if (pendingRef.current) {
      attemptUpload(pendingRef.current)
    }
  }, [attemptUpload])

  const reset = useCallback(() => {
    pendingRef.current = null
    setCanRetryUpload(false)
    setStatus('idle')
    setError(null)
  }, [])

  return { capture, retryUpload, status, error, canRetryUpload, reset }
}
