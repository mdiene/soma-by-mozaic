import type { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import type { Appartenance, RoleApp } from './types'

export interface AuthContexte {
  session: Session | null
  initialise: boolean
  appartenances: Appartenance[]
  appartenancesChargees: boolean
  /** Vrai si l'utilisateur détient l'un des rôles (admin passe toujours). Sans argument : au moins un rôle. */
  aRole: (roles?: readonly RoleApp[]) => boolean
  deconnexion: () => Promise<void>
}

export const Contexte = createContext<AuthContexte | null>(null)

export function useAuth(): AuthContexte {
  const ctx = useContext(Contexte)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>.')
  return ctx
}
