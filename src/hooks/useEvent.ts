import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Event } from '../types/event'

export function useEvent(eventId: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const { data, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single()

        if (cancelled) return
        if (fetchError || !data) {
          setError('Événement introuvable')
        } else {
          setEvent(data as Event)
        }
      } catch {
        if (!cancelled) setError('Impossible de contacter le serveur')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [eventId])

  return { event, loading, error }
}
