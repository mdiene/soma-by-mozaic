import { useQuery } from '@tanstack/react-query'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { Table, Td, Th } from '@/components/ui/table'
import { date, entier, fcfa, tonnes } from '@/lib/format'
import { db, verifier } from '@/lib/supabase'

/** Ensachage journalier (table historique public.production). 1 sac = 50 kg. */
export default function Ensachage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['production', 'ensachage'],
    queryFn: async () =>
      verifier(
        await db
          .public()
          .from('production')
          .select('id, production_date, bags_deployed, bags_filled_50kg, tonnage, nombre_elements, equipe_couture, total_amount, notes, project:project_id ( numero_phase )')
          .order('production_date', { ascending: false })
          .limit(500),
      ),
  })

  const lignes = data ?? []
  const sacs = lignes.reduce((s, l) => s + (l.bags_filled_50kg ?? 0), 0)
  const deployes = lignes.reduce((s, l) => s + (l.bags_deployed ?? 0), 0)
  const cout = lignes.reduce((s, l) => s + Number(l.total_amount ?? 0), 0)

  return (
    <>
      <PageHeader titre="Ensachage" sousTitre="Production journalière de sacs de 50 kg et coût de main-d’œuvre." />
      {error && <Erreur erreur={error} />}
      {isLoading ? (
        <Chargement />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Stat libelle="Sacs ensachés" valeur={entier(sacs)} contexte={`≈ ${tonnes(sacs * 0.05)}`} accent="vert" />
            <Stat libelle="Sacs déployés" valeur={entier(deployes)} contexte={deployes > 0 ? `perte ${entier(deployes - sacs)} sacs` : undefined} />
            <Stat libelle="Coût main-d’œuvre" valeur={fcfa(cout)} contexte={sacs > 0 ? `${fcfa(cout / (sacs * 0.05))} / t` : undefined} accent="orange" />
          </div>
          <Card>
            {lignes.length === 0 ? (
              <Vide titre="Aucune journée d’ensachage" />
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Phase</Th>
                    <Th num>Sacs déployés</Th>
                    <Th num>Sacs 50 kg</Th>
                    <Th num>Tonnage</Th>
                    <Th num>Équipe</Th>
                    <Th num>Coût</Th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l) => (
                    <tr key={l.id}>
                      <Td>{date(l.production_date)}</Td>
                      <Td>{l.project?.numero_phase ?? '—'}</Td>
                      <Td num>{entier(l.bags_deployed)}</Td>
                      <Td num>{entier(l.bags_filled_50kg)}</Td>
                      <Td num>{tonnes(l.tonnage ?? l.bags_filled_50kg * 0.05)}</Td>
                      <Td num>{entier(Number(l.nombre_elements ?? 0) + Number(l.equipe_couture ?? 0))}</Td>
                      <Td num>{fcfa(l.total_amount)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </>
  )
}
