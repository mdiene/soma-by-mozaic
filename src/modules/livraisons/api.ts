import { useQuery } from '@tanstack/react-query'
import { db, verifier } from '@/lib/supabase'

export const cles = {
  projets: ['livraisons', 'projets'] as const,
  regions: (projet: string | null) => ['livraisons', 'regions', projet] as const,
  journalier: (projet: string | null) => ['livraisons', 'journalier', projet] as const,
  allocations: (projet: string | null) => ['livraisons', 'allocations', projet] as const,
  bons: (projet: string | null, page: number, recherche: string) => ['livraisons', 'bons', projet, page, recherche] as const,
}

export function useProjets() {
  return useQuery({
    queryKey: cles.projets,
    queryFn: async () =>
      verifier(await db.livraisons().from('v_avancement_projets').select('*').order('numero_phase', { ascending: false })),
  })
}

export function useAvancementRegions(projet: string | null) {
  return useQuery({
    queryKey: cles.regions(projet),
    queryFn: async () => {
      let q = db.livraisons().from('v_avancement_regions').select('*')
      if (projet) q = q.eq('project_id', projet)
      return verifier(await q)
    },
  })
}

export function useLivraisonsJournalieres(projet: string | null) {
  return useQuery({
    queryKey: cles.journalier(projet),
    queryFn: async () => {
      let q = db.livraisons().from('v_livraisons_journalieres').select('*').order('jour', { ascending: true })
      if (projet) q = q.eq('project_id', projet)
      return verifier(await q)
    },
  })
}

export function useAllocations(projet: string | null) {
  return useQuery({
    queryKey: cles.allocations(projet),
    queryFn: async () => {
      let q = db.livraisons().from('v_allocations').select('*').order('region').order('commune').limit(1000)
      if (projet) q = q.eq('project_id', projet)
      return verifier(await q)
    },
  })
}

export const TAILLE_PAGE = 50

export function useBons(projet: string | null, page: number, recherche: string) {
  return useQuery({
    queryKey: cles.bons(projet, page, recherche),
    queryFn: async () => {
      let q = db
        .livraisons()
        .from('v_bons')
        .select('*', { count: 'exact' })
        .order('delivery_date', { ascending: false, nullsFirst: false })
        .order('bl_number', { ascending: false })
        .range(page * TAILLE_PAGE, page * TAILLE_PAGE + TAILLE_PAGE - 1)
      if (projet) q = q.eq('project_id', projet)
      const terme = recherche.trim().replace(/[%,()]/g, '')
      if (terme) q = q.or(`bl_number.ilike.%${terme}%,immatriculation.ilike.%${terme}%,operateur.ilike.%${terme}%,commune.ilike.%${terme}%`)
      const res = await q
      if (res.error) throw new Error(res.error.message)
      return { lignes: res.data, total: res.count ?? 0 }
    },
    placeholderData: (precedent) => precedent,
  })
}
