import { supabase } from '../supabase'

/**
 * Garantit une session Supabase (anonyme si besoin) et renvoie l'user id.
 * Utilisé uniquement côté organisateur (création d'event, prévisualisation avant reveal) :
 * les invités qui prennent une photo n'appellent jamais cette fonction et restent non
 * authentifiés, ce qui les empêche de matcher `owner_id` côté RLS.
 */
export async function ensureAnonymousSession(): Promise<string> {
  const { data } = await supabase.auth.getSession()

  if (data.session?.user) {
    return data.session.user.id
  }

  const { data: signInData, error } = await supabase.auth.signInAnonymously()

  if (error || !signInData.user) {
    throw new Error(error?.message ?? 'Impossible de créer une session anonyme')
  }

  return signInData.user.id
}
