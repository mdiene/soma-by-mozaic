import type { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { db, supabase, verifier } from '@/lib/supabase'
import { Contexte, type AuthContexte } from './contexte'
import type { Appartenance } from './types'

async function chargerAppartenances(): Promise<Appartenance[]> {
  const lignes = verifier(
    await db.core().from('memberships').select('role, organisation_id, organisations ( code, nom )'),
  )
  return lignes.map((l) => ({
    organisationId: l.organisation_id,
    organisationCode: l.organisations?.code ?? '',
    organisationNom: l.organisations?.nom ?? '',
    role: l.role,
  }))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [initialise, setInitialise] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setInitialise(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_evenement, nouvelle) => setSession(nouvelle))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id
  const appartenances = useQuery({
    queryKey: ['appartenances', userId],
    queryFn: chargerAppartenances,
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
  })

  const valeur = useMemo<AuthContexte>(() => {
    const liste = appartenances.data ?? []
    const roles = new Set(liste.map((a) => a.role))
    return {
      session,
      initialise,
      appartenances: liste,
      appartenancesChargees: !userId || appartenances.isFetched,
      aRole: (demandes) => {
        if (roles.has('admin')) return true
        if (!demandes) return roles.size > 0
        return demandes.some((r) => roles.has(r))
      },
      deconnexion: async () => {
        await supabase.auth.signOut()
      },
    }
  }, [session, initialise, appartenances.data, appartenances.isFetched, userId])

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
}
