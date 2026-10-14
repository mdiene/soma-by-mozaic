import { useQuery } from '@tanstack/react-query'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { Table, Td, Th } from '@/components/ui/table'
import { date, tonnes } from '@/lib/format'
import { db, verifier } from '@/lib/supabase'

const MOTIFS: Record<string, string> = {
  extraction: 'Extraction',
  criblage: 'Criblage',
  ensachage: 'Ensachage',
  livraison: 'Livraison',
  transfert: 'Transfert',
  ajustement_inventaire: 'Ajustement d’inventaire',
  perte: 'Perte',
}

export default function Stocks() {
  const stocks = useQuery({
    queryKey: ['production', 'stocks'],
    queryFn: async () => verifier(await db.production().from('v_stocks').select('*').order('site_nom').order('produit_code')),
  })
  const mouvements = useQuery({
    queryKey: ['production', 'mouvements'],
    queryFn: async () =>
      verifier(
        await db
          .production()
          .from('stock_mouvements')
          .select('id, date_mouvement, produit_code, quantite_t, motif, note, site_id')
          .order('date_mouvement', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(30),
      ),
  })

  const sitesRef = useQuery({
    queryKey: ['core', 'sites'],
    queryFn: async () => verifier(await db.core().from('sites').select('id, nom')),
    staleTime: 10 * 60_000,
  })
  const sites = new Map((sitesRef.data ?? []).map((s) => [s.id, s.nom]))

  return (
    <>
      <PageHeader titre="Stocks" sousTitre="Grand livre des stocks : extraction → criblage → ensachage → livraison." />
      {stocks.error && <Erreur erreur={stocks.error} />}
      {stocks.isLoading ? (
        <Chargement />
      ) : (stocks.data ?? []).length === 0 ? (
        <Card>
          <Vide titre="Aucun mouvement de stock">
            Les stocks se construisent automatiquement à partir des saisies d’extraction (module Mine) et de criblage.
          </Vide>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stocks.data?.map((s) => (
            <Stat key={`${s.site_id}-${s.produit_code}`} libelle={s.produit_libelle ?? s.produit_code ?? ''} valeur={tonnes(s.stock_t)} contexte={`${s.site_nom} · au ${date(s.dernier_mouvement)}`} />
          ))}
        </div>
      )}

      <Card className="mt-6">
        <CardHeader titre="Derniers mouvements" />
        {mouvements.error && <div className="p-4"><Erreur erreur={mouvements.error} /></div>}
        {mouvements.isLoading ? (
          <Chargement />
        ) : (mouvements.data ?? []).length === 0 ? (
          <Vide titre="Aucun mouvement" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Site</Th>
                <Th>Produit</Th>
                <Th>Motif</Th>
                <Th num>Quantité</Th>
              </tr>
            </thead>
            <tbody>
              {mouvements.data?.map((m) => (
                <tr key={m.id}>
                  <Td>{date(m.date_mouvement)}</Td>
                  <Td>{sites.get(m.site_id) ?? '—'}</Td>
                  <Td>{m.produit_code}</Td>
                  <Td><Badge>{MOTIFS[m.motif] ?? m.motif}</Badge></Td>
                  <Td num className={Number(m.quantite_t) < 0 ? 'text-danger' : 'text-succes'}>{tonnes(m.quantite_t)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
