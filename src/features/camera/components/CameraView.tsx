import { getFilterCss } from '../../../lib/filters/canvasFilters'
import type { FilterStyle } from '../../../types/event'
import type { CaptureStatus } from '../hooks/usePhotoCapture'
import type { FacingMode } from '../hooks/useCamera'

interface CameraViewProps {
  videoRef: (node: HTMLVideoElement | null) => void
  eventName: string
  filterStyle: FilterStyle
  facingMode: FacingMode
  videoReady: boolean
  captureStatus: CaptureStatus
  guestName: string
  onGuestNameChange: (value: string) => void
  onFlip: () => void
  onCapture: () => void
}

export function CameraView({
  videoRef,
  eventName,
  filterStyle,
  facingMode,
  videoReady,
  captureStatus,
  guestName,
  onGuestNameChange,
  onFlip,
  onCapture,
}: CameraViewProps) {
  const busy = captureStatus === 'capturing' || captureStatus === 'uploading' || !videoReady
  const showFlash = captureStatus === 'capturing'
  const showSuccess = captureStatus === 'success'

  return (
    <div className="relative flex min-h-dvh flex-col bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: getFilterCss(filterStyle),
          transform: facingMode === 'user' ? 'scaleX(-1)' : undefined,
        }}
      />

      {showFlash && <div className="animate-flash absolute inset-0 bg-white" />}

      <div className="relative flex items-center justify-between px-4 pt-[env(safe-area-inset-top)] pb-3">
        <span className="rounded-full bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur">
          {eventName}
        </span>
        <button
          type="button"
          onClick={onFlip}
          disabled={busy}
          aria-label="Changer de caméra"
          className="rounded-full bg-black/40 p-2.5 text-white backdrop-blur disabled:opacity-50"
        >
          🔄
        </button>
      </div>

      <div className="relative mt-auto flex flex-col items-center gap-4 px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-6">
        {showSuccess ? (
          <p className="rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
            Photo envoyée !
          </p>
        ) : (
          <input
            type="text"
            value={guestName}
            onChange={(e) => onGuestNameChange(e.target.value)}
            placeholder="Votre prénom (optionnel)"
            maxLength={40}
            className="w-full max-w-xs rounded-full border border-white/20 bg-black/40 px-4 py-2 text-center text-sm text-white placeholder:text-white/50 backdrop-blur outline-none focus:border-instant-accent"
          />
        )}

        <button
          type="button"
          onClick={onCapture}
          disabled={busy}
          aria-label="Prendre la photo"
          className="h-[72px] w-[72px] rounded-full border-4 border-white bg-white/20 p-1 backdrop-blur transition-transform active:scale-95 disabled:opacity-60"
        >
          <span className="block h-full w-full rounded-full bg-white" />
        </button>
      </div>
    </div>
  )
}
