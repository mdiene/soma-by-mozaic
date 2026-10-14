import { useQuery } from '@tanstack/react-query'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, Td, Th } from '@/components/ui/table'
import { date, entier, pct } from '@/lib/format'
import { db, verifier } from '@/lib/supabase'

export default function Programmes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pilotage', 'programmes'],
    queryFn: async () => verifier(await db.pilotage().from('v_avancement_programmes').select('*').order('code')),
  })
  return (
    <>
      <PageHeader titre="Programmes" sousTitre="Relance de la mine, campagnes de livraison, usine d’engrais, partenariats : avancement, retards et risques." />
      <Card>
        {error && <div className="p-4"><Erreur erreur={error} /></div>}
        {isLoading ? (
          <Chargement />
        ) : (data ?? []).length === 0 ? (
          <Vide titre="Aucun programme">Les programmes, jalons, tâches et risques se saisissent ici une fois le module activé en base.</Vide>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Programme</Th>
                <Th>Statut</Th>
                <Th num>Avancement</Th>
                <Th num>Tâches en retard</Th>
                <Th num>Risques critiques</Th>
                <Th>Prochain jalon</Th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <p className="font-medium">{p.nom}</p>
                    <p className="text-xs text-texte-doux">{p.code} · fin prévue {date(p.date_fin_prevue)}</p>
                  </Td>
                  <Td><Badge>{p.statut}</Badge></Td>
                  <Td num>{pct(p.avancement_moyen_pct)}</Td>
                  <Td num>{Number(p.nb_taches_en_retard) > 0 ? <Badge ton="danger">{entier(p.nb_taches_en_retard)}</Badge> : '0'}</Td>
                  <Td num>{Number(p.nb_risques_critiques) > 0 ? <Badge ton="alerte">{entier(p.nb_risques_critiques)}</Badge> : '0'}</Td>
                  <Td>{date(p.prochain_jalon)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
