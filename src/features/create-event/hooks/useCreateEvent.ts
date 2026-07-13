import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { ensureAnonymousSession } from '../../../lib/auth/ensureAnonymousSession'
import type { Event, FilterStyle } from '../../../types/event'

interface CreateEventInput {
  name: string
  revealAt: string
  filterStyle: FilterStyle
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null)

  async function createEvent(input: CreateEventInput) {
    setLoading(true)
    setError(null)

    try {
      const ownerId = await ensureAnonymousSession()

      const { data, error: insertError } = await supabase
        .from('events')
        .insert({
          name: input.name,
          reveal_at: new Date(input.revealAt).toISOString(),
          filter_style: input.filterStyle,
          owner_id: ownerId,
        })
        .select()
        .single()

      if (insertError || !data) {
        throw new Error(insertError?.message ?? "Échec de la création de l'événement")
      }

      setCreatedEvent(data as Event)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return { createEvent, loading, error, createdEvent }
}
