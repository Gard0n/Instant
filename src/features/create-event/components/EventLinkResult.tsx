import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '../../../components/Button'
import type { Event } from '../../../types/event'

export function EventLinkResult({ event }: { event: Event }) {
  const [copied, setCopied] = useState(false)

  const guestUrl = `${window.location.origin}${window.location.pathname}#/event/${event.id}`
  const galleryUrl = `${window.location.origin}${window.location.pathname}#/event/${event.id}/gallery`

  async function copyLink() {
    await navigator.clipboard.writeText(guestUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-fade-in flex flex-col items-center gap-6 text-center">
      <div>
        <h2 className="text-xl font-semibold">« {event.name} » est prêt !</h2>
        <p className="mt-1 text-instant-text-muted">
          Partagez ce lien ou ce QR code avec vos invités
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <QRCodeSVG value={guestUrl} size={200} />
      </div>

      <div className="w-full max-w-sm rounded-xl border border-instant-border bg-instant-surface p-3 text-sm break-all text-instant-text-muted">
        {guestUrl}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={copyLink}>{copied ? 'Lien copié !' : 'Copier le lien invité'}</Button>
        <Button variant="secondary" onClick={() => window.location.assign(galleryUrl)}>
          Voir la galerie (organisateur)
        </Button>
      </div>

      <p className="max-w-sm text-xs text-instant-text-muted">
        Gardez cet onglet ou ajoutez la galerie à vos favoris : c'est votre session qui vous
        identifie comme organisateur, il n'y a pas de mot de passe à retenir.
      </p>
    </div>
  )
}
