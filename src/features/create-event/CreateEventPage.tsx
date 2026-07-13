import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Spinner } from '../../components/Spinner'
import type { FilterStyle } from '../../types/event'
import { useCreateEvent } from './hooks/useCreateEvent'
import { EventLinkResult } from './components/EventLinkResult'

const FILTER_OPTIONS: { value: FilterStyle; label: string }[] = [
  { value: 'natural', label: 'Naturel' },
  { value: 'warm', label: 'Chaleureux' },
  { value: 'bw', label: 'Noir & Blanc' },
]

export function CreateEventPage() {
  const [name, setName] = useState('')
  const [revealAt, setRevealAt] = useState('')
  const [filterStyle, setFilterStyle] = useState<FilterStyle>('warm')
  const { createEvent, loading, error, createdEvent } = useCreateEvent()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !revealAt) return
    createEvent({ name: name.trim(), revealAt, filterStyle })
  }

  if (createdEvent) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-4 py-12">
        <EventLinkResult event={createdEvent} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-semibold">Créer votre appareil photo jetable</h1>
      <p className="mt-1 text-instant-text-muted">
        Un lien unique pour capturer les meilleurs moments de votre mariage.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Nom de l'événement</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mariage de Claire & Antoine"
            className="rounded-xl border border-instant-border bg-instant-surface px-4 py-3 outline-none focus:border-instant-accent"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Date et heure de révélation</span>
          <input
            type="datetime-local"
            required
            value={revealAt}
            onChange={(e) => setRevealAt(e.target.value)}
            className="rounded-xl border border-instant-border bg-instant-surface px-4 py-3 outline-none focus:border-instant-accent"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Style de pellicule</legend>
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setFilterStyle(opt.value)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  filterStyle === opt.value
                    ? 'border-instant-accent bg-instant-accent/10 text-instant-accent'
                    : 'border-instant-border bg-instant-surface text-instant-text-muted'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="text-sm text-instant-danger">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2">
          {loading && <Spinner className="h-4 w-4" />}
          Créer l'événement
        </Button>
      </form>
    </div>
  )
}
