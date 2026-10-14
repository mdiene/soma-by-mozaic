import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { Table, Td, Th } from '@/components/ui/table'
import { date, entier, pct, tauxRealisation, tonnes } from '@/lib/format'
import { useAvancementRegions, useLivraisonsJournalieres, useProjets } from './api'
import { SelecteurProjet } from './SelecteurProjet'
import { usePhase } from './usePhase'

export default function TableauDeBord() {
  const [phase, setPhase] = usePhase()
  const projets = useProjets()
  const regions = useAvancementRegions(phase)
  const journalier = useLivraisonsJournalieres(phase)

  const selection = (projets.data ?? []).filter((p) => !phase || p.project_id === phase)
  const somme = (cle: 'tonnage_livre' | 'tonnage_alloue' | 'nombre_bl' | 'tonnage_mis_a_disposition' | 'nombre_allocations' | 'allocations_soldees') =>
    selection.reduce((s, p) => s + Number(p[cle] ?? 0), 0)
  const livre = somme('tonnage_livre')
  const dispo = somme('tonnage_mis_a_disposition')
  const alloue = somme('tonnage_alloue')

  const regionsAgregees = Object.values(
    (regions.data ?? []).reduce<Record<string, { region: string; cible: number; livre: number; bl: number }>>((acc, r) => {
      const cle = r.region ?? '—'
      const ligne = (acc[cle] ??= { region: cle, cible: 0, livre: 0, bl: 0 })
      ligne.cible += Number(r.tonnage_cible ?? 0)
      ligne.livre += Number(r.tonnage_livre ?? 0)
      ligne.bl += Number(r.nombre_bl ?? 0)
      return acc
    }, {}),
  ).sort((a, b) => b.cible - a.cible)

  const serie = Object.values(
    (journalier.data ?? []).reduce<Record<string, { jour: string; tonnage: number }>>((acc, j) => {
      if (!j.jour) return acc
      const ligne = (acc[j.jour] ??= { jour: j.jour, tonnage: 0 })
      ligne.tonnage += Number(j.tonnage ?? 0)
      return acc
    }, {}),
  ).slice(-60)

  return (
    <>
      <PageHeader
        titre="Livraisons — tableau de bord"
        sousTitre="Avancement des mises à disposition, des allocations et des bons de livraison."
        actions={<SelecteurProjet valeur={phase} onChange={setPhase} />}
      />
      {projets.error && <Erreur erreur={projets.error} />}
      {projets.isLoading ? (
        <Chargement />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat libelle="Tonnage livré" valeur={tonnes(livre)} contexte={`sur ${tonnes(dispo)} mis à disposition`} progression={tauxRealisation(livre, dispo)} accent="vert" />
          <Stat libelle="Tonnage alloué" valeur={tonnes(alloue)} contexte={`${pct(tauxRealisation(alloue, dispo))} de la mise à disposition`} progression={tauxRealisation(alloue, dispo)} accent="or" />
          <Stat libelle="Bons de livraison" valeur={entier(somme('nombre_bl'))} contexte={`${selection.length} phase(s)`} />
          <Stat
            libelle="Allocations soldées"
            valeur={`${entier(somme('allocations_soldees'))} / ${entier(somme('nombre_allocations'))}`}
            progression={tauxRealisation(somme('allocations_soldees'), somme('nombre_allocations'))}
            accent="orange"
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader titre="Tonnage livré par jour" description="60 derniers jours d’activité" />
          <CardBody className="h-72">
            {journalier.isLoading ? (
              <Chargement />
            ) : serie.length === 0 ? (
              <Vide titre="Aucune livraison sur la période" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serie} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e2e5eb" />
                  <XAxis dataKey="jour" tickFormatter={(v: string) => v.slice(5).split('-').reverse().join('/')} tick={{ fontSize: 11, fill: '#5b667a' }} tickLine={false} axisLine={false} minTickGap={16} />
                  <YAxis tick={{ fontSize: 11, fill: '#5b667a' }} tickLine={false} axisLine={false} width={48} />
                  <Tooltip formatter={(v) => tonnes(Number(v))} labelFormatter={(v) => date(String(v))} cursor={{ fill: '#f3f5f9' }} />
                  <Bar dataKey="tonnage" name="Tonnage" fill="#2e8b57" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader titre="Avancement par région" />
          {regions.isLoading ? (
            <Chargement />
          ) : regionsAgregees.length === 0 ? (
            <Vide titre="Aucune allocation" />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Région</Th>
                  <Th num>Cible</Th>
                  <Th num>Livré</Th>
                  <Th num>Taux</Th>
                </tr>
              </thead>
              <tbody>
                {regionsAgregees.map((r) => (
                  <tr key={r.region}>
                    <Td className="font-medium">{r.region}</Td>
                    <Td num>{tonnes(r.cible)}</Td>
                    <Td num>{tonnes(r.livre)}</Td>
                    <Td num>{pct(tauxRealisation(r.livre, r.cible))}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </>
  )
}
