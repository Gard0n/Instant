import { useCountdown } from '../../../hooks/useCountdown'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function LockedScreen({ eventName, revealAt }: { eventName: string; revealAt: string }) {
  const countdown = useCountdown(revealAt)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-4xl">🔒</div>
      <h1 className="text-xl font-semibold">{eventName}</h1>
      <p className="text-instant-text-muted">Les photos seront révélées dans</p>

      <div className="flex gap-3">
        {[
          { value: countdown.days, label: 'jours' },
          { value: countdown.hours, label: 'h' },
          { value: countdown.minutes, label: 'min' },
          { value: countdown.seconds, label: 's' },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex min-w-16 flex-col items-center rounded-xl border border-instant-border bg-instant-surface px-3 py-2"
          >
            <span className="text-2xl font-semibold tabular-nums">{pad(unit.value)}</span>
            <span className="text-xs text-instant-text-muted">{unit.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-2 max-w-xs text-xs text-instant-text-muted">
        Revenez sur ce lien après la révélation pour découvrir toutes les photos prises par les
        invités.
      </p>
    </div>
  )
}
