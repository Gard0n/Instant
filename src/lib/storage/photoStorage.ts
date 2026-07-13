import { supabase } from '../supabase'

const BUCKET = 'event-photos'

export function buildPhotoPath(eventId: string, photoId: string): string {
  return `${eventId}/${photoId}.jpg`
}

export async function uploadPhoto(path: string, blob: Blob): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  })

  if (error) {
    throw new Error(`Échec de l'upload de la photo : ${error.message}`)
  }
}

export async function getSignedPhotoUrl(path: string, expiresInSeconds = 3600): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds)

  if (error || !data) {
    throw new Error(`Impossible de générer l'URL de la photo : ${error?.message}`)
  }

  return data.signedUrl
}
