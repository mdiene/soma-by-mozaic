import { useQuery } from '@tanstack/react-query'
import { db, verifier } from '@/lib/supabase'

/** Organisations visibles par l'utilisateur (sociétés du groupe). */
export function useOrganisations() {
  return useQuery({
    queryKey: ['core', 'organisations'],
    queryFn: async () => verifier(await db.core().from('organisations').select('id, code, nom, parent_id').eq('actif', true).order('nom')),
    staleTime: 10 * 60_000,
  })
}

/** Société opérationnelle par défaut : la SOMA si visible, sinon la première filiale. */
export function useOrganisationParDefaut(): string | undefined {
  const { data } = useOrganisations()
  return (data?.find((o) => o.code === 'SOMA') ?? data?.find((o) => o.parent_id) ?? data?.[0])?.id
}
