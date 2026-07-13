import { Button } from '../../../components/Button'
import type { CameraStatus } from '../hooks/useCamera'

export function CameraPermissionError({
  status,
  onRetry,
}: {
  status: Extract<CameraStatus, 'denied' | 'unsupported'>
  onRetry: () => void
}) {
  const isUnsupported = status === 'unsupported'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-4xl">📷</div>
      <h2 className="text-lg font-semibold">
        {isUnsupported ? "Caméra non disponible" : 'Accès à la caméra refusé'}
      </h2>
      <p className="max-w-xs text-sm text-instant-text-muted">
        {isUnsupported
          ? "Votre navigateur ne permet pas d'accéder à la caméra. Essayez avec Safari ou Chrome à jour."
          : "Pour prendre une photo, autorisez l'accès à la caméra dans les réglages de votre navigateur, puis réessayez."}
      </p>
      {!isUnsupported && <Button onClick={onRetry}>Réessayer</Button>}
    </div>
  )
}
