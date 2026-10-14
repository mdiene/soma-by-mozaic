import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { configurationManquante, env } from './env'

/**
 * Client unique. Les clés viennent exclusivement de l'environnement
 * (.env.local en développement, variables de l'hébergeur en production) :
 * aucune clé n'est écrite dans le code.
 */
export const supabase = createClient<Database>(
  configurationManquante ? 'http://localhost:54321' : env.supabaseUrl,
  configurationManquante ? 'cle-manquante' : env.supabaseAnonKey,
  { auth: { persistSession: true, autoRefreshToken: true } },
)

/** Accès typé aux schémas métier. */
export const db = {
  public: () => supabase.schema('public'),
  core: () => supabase.schema('core'),
  livraisons: () => supabase.schema('livraisons'),
  production: () => supabase.schema('production'),
  mine: () => supabase.schema('mine'),
  finance: () => supabase.schema('finance'),
  pilotage: () => supabase.schema('pilotage'),
}

/** Transforme une erreur Supabase en exception (pour TanStack Query). */
export function verifier<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return (res.data ?? []) as T
}
