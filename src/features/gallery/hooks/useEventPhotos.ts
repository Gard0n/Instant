import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Event, Photo } from '../../../types/event'

interface GalleryState {
  loading: boolean
  isOwner: boolean
  isRevealed: boolean
  photos: Photo[]
  error: string | null
}

/**
 * Détermine si l'utilisateur courant peut voir les photos (owner ou reveal_at passé)
 * puis les charge. La vraie protection vient des RLS Supabase (basées sur now() côté
 * serveur) : cette logique côté client ne fait que décider quoi afficher.
 */
export function useEventPhotos(event: Event | null) {
  const [state, setState] = useState<GalleryState>({
    loading: true,
    isOwner: false,
    isRevealed: false,
    photos: [],
    error: null,
  })

  useEffect(() => {
    if (!event) return
    const currentEvent = event

    let cancelled = false

    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const isOwner = sessionData.session?.user?.id === currentEvent.owner_id
        const isRevealed = Date.now() >= new Date(currentEvent.reveal_at).getTime()

        if (!isOwner && !isRevealed) {
          if (!cancelled) {
            setState({ loading: false, isOwner, isRevealed, photos: [], error: null })
          }
          return
        }

        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .eq('event_id', currentEvent.id)
          .order('created_at', { ascending: true })

        if (cancelled) return

        setState({
          loading: false,
          isOwner,
          isRevealed,
          photos: (data as Photo[] | null) ?? [],
          error: error ? 'Impossible de charger les photos' : null,
        })
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error: 'Impossible de contacter le serveur' }))
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [event])

  return state
}
